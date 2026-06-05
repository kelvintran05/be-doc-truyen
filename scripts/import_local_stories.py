import os
import sys
import json
import shutil
import hashlib
import docx
from striprtf.striprtf import rtf_to_text

# Append project root to path to import vbee_tts
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.vbee_tts import text_to_speech_vbee

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT_DIR, "backend/public/Truyện")
CDN_IMAGES_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/images")
CDN_AUDIO_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/audio")
SCRATCH_DIR = os.path.join(ROOT_DIR, "scratch")

# Color palette definition for story cards
PASTEL_COLORS = [
    {"color": "#FEE2E2", "badgeColor": "#EF4444"},  # Red
    {"color": "#E0F2FE", "badgeColor": "#0284C7"},  # Sky Blue
    {"color": "#ECFDF5", "badgeColor": "#10B981"},  # Emerald
    {"color": "#FEF3C7", "badgeColor": "#D97706"},  # Amber
    {"color": "#F5F3FF", "badgeColor": "#8B5CF6"},  # Purple
    {"color": "#FDF2F8", "badgeColor": "#EC4899"},  # Pink
    {"color": "#FFF1F2", "badgeColor": "#F43F5E"},  # Rose
    {"color": "#F0FDF4", "badgeColor": "#22C55E"},  # Green
    {"color": "#EFF6FF", "badgeColor": "#3B82F6"},  # Blue
]

def clean_title(title: str) -> str:
    """Removes leading Markdown symbols, quotes, and whitespace from title."""
    title = title.strip()
    if title.startswith("#"):
        title = title.lstrip("#").strip()
    title = title.strip('"').strip("'").strip("“").strip("”")
    return title

def slugify(text: str) -> str:
    """Converts Vietnamese string to a clean slug with deterministic hash suffix."""
    import re
    import unicodedata
    
    # Normalize unicode to decompose accents
    text_normalized = unicodedata.normalize('NFKD', text)
    text_no_accents = ''.join([c for c in text_normalized if not unicodedata.combining(c)])
    
    # Handle the letter đ/Đ manually
    text_no_accents = text_no_accents.replace('đ', 'd').replace('Đ', 'D')
    
    # Convert to lowercase and replace non-alphanumeric with hyphen
    slug = text_no_accents.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    
    # Generate deterministic 8-char hash suffix
    h = hashlib.md5(text.encode('utf-8')).hexdigest()[:8]
    return f"{slug}-{h}"

def get_category_and_emoji(title: str):
    """Categorizes the story based on keywords in title."""
    title_lower = title.lower()
    if any(k in title_lower for k in ["học", "học", "dạy", "dạy", "kỹ năng", "kỹ năng", "biết", "biết", "bài học", "bài học"]):
        return "Giáo dục", "🏫"
    elif any(k in title_lower for k in ["phiêu lưu", "phieu luu", "chuyến", "chuyến", "khám phá", "khám phá", "bí ẩn", "bí ẩn"]):
        return "Phiêu lưu", "✈️"
    elif any(k in title_lower for k in ["tình bạn", "tinh ban", "bạn", "bạn"]):
        return "Tình bạn", "🤝"
    elif any(k in title_lower for k in ["bí mật", "bí mật", "sự thật", "sự thật"]):
        return "Khoa học & Tự nhiên", "🔍"
    elif any(k in title_lower for k in ["màu sắc", "màu sắc", "âm thanh", "âm thanh"]):
        return "Nhận biết", "🎨"
    elif any(k in title_lower for k in ["sư tử", "hươu", "gigi", "hà mã", "harry", "bobo", "thỏ", "thỏ", "sên", "vẹt", "khỉ", "kiki", "pingo", "sumo", "tiko", "wally", "rex", "chó"]):
        return "Động vật", "🦁"
    else:
        return "Truyện thiếu nhi", "📖"

def extract_keyword(text: str) -> str:
    """Extracts the first alphanumeric letter from the text to use as keyword."""
    import re
    # Find first word character
    match = re.search(r'\w', text)
    if match:
        char = match.group(0).upper()
        # Clean accents for keyword letter if needed, but keeping original Vietnamese letter is also fine
        # We can normalize it to a clean uppercase letter
        return char
    return "A"

def parse_docx(file_path: str):
    """Reads docx paragraphs and returns list of non-empty strings."""
    doc = docx.Document(file_path)
    return [p.text.strip() for p in doc.paragraphs if p.text.strip()]

def parse_rtf(file_path: str):
    """Reads rtf paragraphs and returns list of non-empty strings."""
    with open(file_path, 'r', encoding='utf-8') as f:
        text = rtf_to_text(f.read())
    return [p.strip() for p in text.split('\n') if p.strip()]

def process_stories(dry_run=False, force=False):
    os.makedirs(CDN_IMAGES_DIR, exist_ok=True)
    os.makedirs(CDN_AUDIO_DIR, exist_ok=True)
    os.makedirs(SCRATCH_DIR, exist_ok=True)
    
    story_dirs = []
    # Find all folders containing a docx or rtf file
    for root, dirs, files in os.walk(SRC_DIR):
        docs = [f for f in files if f.endswith(('.docx', '.rtf')) and not f.startswith('._')]
        if docs:
            # We sort images by mtime
            images = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('._')]
            # Sort images by modification time to align chronologically
            images_sorted = sorted(images, key=lambda img: os.path.getmtime(os.path.join(root, img)))
            
            story_dirs.append({
                'path': root,
                'doc_file': docs[0],
                'images': images_sorted
            })
            
    # Sort folders to ensure deterministic ordering of IDs
    story_dirs = sorted(story_dirs, key=lambda x: x['path'])
    
    print(f"Total stories found: {len(story_dirs)}")
    
    imported_stories = []
    start_id = 27
    
    for idx, story_info in enumerate(story_dirs):
        story_id = start_id + idx
        folder_path = story_info['path']
        doc_name = story_info['doc_file']
        images = story_info['images']
        doc_path = os.path.join(folder_path, doc_name)
        
        # Parse paragraphs
        if doc_name.endswith('.docx'):
            paragraphs = parse_docx(doc_path)
        else:
            paragraphs = parse_rtf(doc_path)
            
        if not paragraphs:
            print(f"Warning: Empty document at {doc_path}")
            continue
            
        # Parse Title
        raw_title = paragraphs[0]
        title = clean_title(raw_title)
        
        # Filter paragraphs up to the Question/Quiz section
        story_paragraphs = []
        moral_candidate = ""
        
        for p in paragraphs[1:]:
            p_lower = p.lower()
            # Stop if we hit questions
            if p.startswith("❓") or "câu hỏi cho bé" in p_lower or "câu hỏi:" in p_lower:
                break
            story_paragraphs.append(p)
            
        if not story_paragraphs:
            print(f"Warning: No story content found for {title}")
            continue
            
        # Setup description & moral
        description = story_paragraphs[0]
        if len(story_paragraphs) > 1:
            description += " " + story_paragraphs[1]
        if len(description) > 200:
            description = description[:197] + "..."
            
        # Set moral to the last paragraph of the story content
        moral = story_paragraphs[-1]
        if len(moral) > 150:
            moral = moral[:147] + "..."
            
        slug = slugify(title)
        category, emoji = get_category_and_emoji(title)
        
        # Pick color deterministically
        color_choice = PASTEL_COLORS[story_id % len(PASTEL_COLORS)]
        
        # We match story paragraphs to pages (P = len(images))
        P = len(images)
        if P == 0:
            print(f"Warning: No images found for {title}")
            continue
            
        N = len(story_paragraphs)
        base_size = N // P
        remainder = N % P
        
        pages_text = []
        p_idx = 0
        for i in range(P):
            size = base_size + (1 if i < remainder else 0)
            page_p = story_paragraphs[p_idx : p_idx + size]
            pages_text.append("\n".join(page_p))
            p_idx += size
            
        # Process pages
        pages = []
        total_word_count = 0
        for page_num, text_content in enumerate(pages_text, 1):
            total_word_count += len(text_content.split())
            
            # Destination filenames
            orig_img = images[page_num - 1]
            ext = os.path.splitext(orig_img)[1].lower()
            new_img_name = f"{slug}_page_{page_num}{ext}"
            new_img_path = os.path.join(CDN_IMAGES_DIR, new_img_name)
            
            new_audio_name = f"{slug}_page_{page_num}.mp3"
            new_audio_path = os.path.join(CDN_AUDIO_DIR, new_audio_name)
            
            # Copy image
            src_img_path = os.path.join(folder_path, orig_img)
            if not dry_run:
                shutil.copy2(src_img_path, new_img_path)
                
            # TTS generation
            if not dry_run:
                if not os.path.exists(new_audio_path) or force:
                    print(f"[{title}] Generating TTS for page {page_num}...")
                    success = text_to_speech_vbee(
                        text=text_content,
                        output_path=new_audio_path,
                        voice_code="hn_female_ngochuyen_full_48k-fhg",
                        speed_rate="1.0"
                    )
                    if not success:
                        print(f"Error: Failed to generate audio for [{title}] Page {page_num}")
                else:
                    # Skip if exists to avoid API billing
                    pass
                    
            keyword = extract_keyword(text_content)
            
            pages.append({
                "pageNumber": page_num,
                "text": text_content,
                "keyword": keyword,
                "image": f"http://localhost:3001/cdn/images/{new_img_name}",
                "audioUrl": f"http://localhost:3001/cdn/audio/{new_audio_name}"
            })
            
        # Cover image (copy the first page's image)
        first_img = images[0]
        ext = os.path.splitext(first_img)[1].lower()
        cover_name = f"{slug}_cover{ext}"
        cover_path = os.path.join(CDN_IMAGES_DIR, cover_name)
        if not dry_run:
            shutil.copy2(os.path.join(folder_path, first_img), cover_path)
            
        # Calculate duration
        # 120 words per minute (approx. 2 words per second)
        audio_duration = max(30, int(total_word_count * 0.5))
        duration_min = max(1, round(audio_duration / 60))
        duration_str = f"{duration_min} phút"
        
        story_data = {
            "id": story_id,
            "title": title,
            "slug": slug,
            "category": category,
            "age": "3-6 tuổi",
            "duration": duration_str,
            "rating": 4.8,
            "audio": True,
            "color": color_choice["color"],
            "badgeColor": color_choice["badgeColor"],
            "image": emoji,
            "coverImageUrl": f"http://localhost:3001/cdn/images/{cover_name}",
            "description": description,
            "moral": moral,
            "audioDuration": audio_duration,
            "author": "BéĐọc",
            "pages": pages
        }
        
        imported_stories.append(story_data)
        print(f"Processed: {title} (ID: {story_id}, Pages: {P}, Slug: {slug})")
        
    # Write to scratch json
    out_json_path = os.path.join(SCRATCH_DIR, "local_imported_stories.json")
    with open(out_json_path, 'w', encoding='utf-8') as f:
        json.dump(imported_stories, f, ensure_ascii=False, indent=2)
        
    print(f"\nSuccessfully wrote {len(imported_stories)} stories to {out_json_path}")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    force = "--force" in sys.argv
    if dry_run:
        print("Running in DRY-RUN mode. No files will be copied or audios generated.")
    process_stories(dry_run=dry_run, force=force)
