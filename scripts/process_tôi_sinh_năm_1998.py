#!/usr/bin/env python3
"""Process 'Tôi sinh năm 1998' story: generate images, TTS, and update frontend."""
import os
import re
import sys
import json
import math
import hashlib
import subprocess
import time
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

ROOT_DIR = Path(__file__).parent.parent
DOCX_PATH = ROOT_DIR / "backend/public/Truyện/Tôi sinh năm 1998/Tôi sinh năm 1998.docx"
CDN_IMAGES_DIR = ROOT_DIR / "backend/public/cdn/images"
CDN_AUDIO_DIR = ROOT_DIR / "backend/public/cdn/audio"
FRONTEND_STORIES = ROOT_DIR / "frontend/src/lib/stories.ts"
NUM_PAGES = 15

# Color palette
COLOR = "#FEF3C7"
BADGE_COLOR = "#D97706"
EMOJI = "📖"

def parse_docx(file_path):
    import docx
    doc = docx.Document(file_path)
    return [p.text.strip() for p in doc.paragraphs if p.text.strip()]

def slugify(text: str) -> str:
    import unicodedata
    text_normalized = unicodedata.normalize('NFKD', text)
    text_no_accents = ''.join([c for c in text_normalized if not unicodedata.combining(c)])
    text_no_accents = text_no_accents.replace('đ', 'd').replace('Đ', 'D')
    slug = text_no_accents.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    h = hashlib.md5(text.encode('utf-8')).hexdigest()[:8]
    return f"{slug}-{h}"

def extract_keyword(text: str) -> str:
    match = re.search(r'\w', text)
    return match.group(0).upper() if match else "T"

def create_placeholder_image(text_preview, page_num, output_path, total_pages):
    """Create a simple colored placeholder image with text."""
    from PIL import Image, ImageDraw, ImageFont
    width, height = 1024, 768
    
    # Gradient from warm orange to brown
    color1 = (255, 200, 150)
    color2 = (200, 150, 100)
    shift = page_num * 8
    color1 = (min(255, color1[0] + shift), min(255, color1[1]), max(0, color1[2] - shift))
    color2 = (max(0, color2[0] - shift), max(0, color2[1] - shift), max(0, color2[2] - shift))
    
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Draw page number
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font_large = ImageFont.load_default()
        font_small = font_large
    
    # Draw text preview (first line)
    first_line = text_preview[:80]
    if len(text_preview) > 80:
        first_line += "..."
    
    bbox = draw.textbbox((0, 0), first_line, font=font_small)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, height // 2 - 50), first_line, fill=(255, 255, 255), font=font_small)
    
    page_text = f"Trang {page_num}/{total_pages}"
    bbox = draw.textbbox((0, 0), page_text, font=font_small)
    tw = bbox[2] - bbox[0]
    draw.text(((width - tw) // 2, height - 80), page_text, fill=(255, 255, 255), font=font_small)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "WEBP", quality=85)
    print(f"  ✓ Image: {os.path.basename(output_path)}")

def generate_tts(text, output_path):
    """Generate TTS audio using edge-tts."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cmd = [
        'edge-tts',
        '--voice', 'vi-VN-HoaiMyNeural',
        '--rate=+10%',
        '--pitch=+0Hz',
        '--text', text,
        '--write-media', str(output_path),
    ]
    for attempt in range(3):
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  ✓ Audio: {os.path.basename(output_path)}")
            return True
        except Exception as e:
            print(f"  ✗ Attempt {attempt+1} failed: {e}")
            if attempt < 2:
                time.sleep(2)
    return False

def main():
    print("=" * 60)
    print("XỬ LÝ TRUYỆN: Tôi sinh năm 1998")
    print("=" * 60)
    
    # 1. Parse docx
    print("\n📄 Đọc file docx...")
    paragraphs = parse_docx(DOCX_PATH)
    print(f"   {len(paragraphs)} đoạn văn")
    
    # Title is first paragraph
    title = paragraphs[0].rstrip('.')
    print(f"   Tiêu đề: {title}")
    
    # Story content starts from second paragraph
    content_paragraphs = paragraphs[1:]
    
    # Build description from first paragraphs
    description = " ".join(content_paragraphs[:3])
    if len(description) > 200:
        description = description[:197] + "..."
    
    # Moral from last paragraph
    moral = content_paragraphs[-1]
    if len(moral) > 150:
        moral = moral[:147] + "..."
    
    slug = slugify(title)
    print(f"   Slug: {slug}")
    
    # 2. Split content into pages
    print(f"\n📑 Chia thành {NUM_PAGES} trang...")
    N = len(content_paragraphs)
    base_size = N // NUM_PAGES
    remainder = N % NUM_PAGES
    
    pages_text = []
    p_idx = 0
    for i in range(NUM_PAGES):
        size = base_size + (1 if i < remainder else 0)
        chunk = content_paragraphs[p_idx : p_idx + size]
        pages_text.append("\n\n".join(chunk))
        p_idx += size
    
    total_words = sum(len(p.split()) for p in pages_text)
    print(f"   Tổng số từ: {total_words}")
    for i, pt in enumerate(pages_text):
        print(f"   Trang {i+1}: {len(pt.split())} từ")
    
    # 3. Generate placeholder images
    print(f"\n🖼️  Tạo ảnh nền...")
    for i, pt in enumerate(pages_text):
        page_num = i + 1
        img_name = f"{slug}_page_{page_num}.webp"
        img_path = CDN_IMAGES_DIR / img_name
        create_placeholder_image(pt[:100], page_num, str(img_path), NUM_PAGES)
    
    # Cover image (same as first page)
    cover_name = f"{slug}_cover.webp"
    cover_path = CDN_IMAGES_DIR / cover_name
    if not cover_path.exists():
        import shutil
        shutil.copy2(str(CDN_IMAGES_DIR / f"{slug}_page_1.webp"), str(cover_path))
        print(f"  ✓ Cover: {cover_name}")
    
    # 4. Generate TTS audio
    print(f"\n🎤 Tạo giọng đọc (TTS)...")
    pages = []
    for i, pt in enumerate(pages_text):
        page_num = i + 1
        audio_name = f"{slug}_page_{page_num}.mp3"
        audio_path = CDN_AUDIO_DIR / audio_name
        
        if audio_path.exists():
            print(f"  ⏭ Audio page {page_num} exists, skipping")
        elif '--skip-tts' in sys.argv:
            print(f"  ⏭ Audio page {page_num} (--skip-tts mode)")
        else:
            success = generate_tts(pt, audio_path)
            if not success:
                print(f"  ✗ Failed to generate TTS for page {page_num}")
            time.sleep(0.5)
        
        keyword = extract_keyword(pt)
        audio_url = f"http://localhost:3001/cdn/audio/{audio_name}" if (audio_path.exists() or '--skip-tts' in sys.argv) else ""
        pages.append({
            "text": pt,
            "image": f"http://localhost:3001/cdn/images/{slug}_page_{page_num}.webp",
            "audioUrl": audio_url,
            "keyword": keyword
        })
    
    # 5. Calculate duration
    audio_duration = max(30, int(total_words * 0.5))
    duration_min = max(1, round(audio_duration / 60))
    duration_str = f"{duration_min} phút"
    
    # 6. Build story data
    print(f"\n📝 Xây dựng dữ liệu truyện...")
    story_data = {
        "id": 48,
        "title": title,
        "slug": slug,
        "category": "Hồi ký",
        "age": "8-15 tuổi",
        "duration": duration_str,
        "rating": 4.8,
        "audio": True,
        "color": COLOR,
        "badgeColor": BADGE_COLOR,
        "image": EMOJI,
        "coverImageUrl": f"http://localhost:3001/cdn/images/{cover_name}",
        "description": description,
        "moral": moral,
        "audioDuration": audio_duration,
        "author": "BéĐọc",
        "pages": pages
    }
    
    # 7. Update frontend/src/lib/stories.ts
    print(f"\n📝 Cập nhật frontend/src/lib/stories.ts...")
    with open(FRONTEND_STORIES, 'r') as f:
        content = f.read()
    
    # Find the last story end and insert before the closing bracket
    # Find the position of the last story object
    last_story_pattern = r'\}\s*\]\s*;'
    match = list(re.finditer(last_story_pattern, content))[-1]
    insert_pos = match.start()
    
    # Convert story to JSON string (without id and pages first, then add pages)
    story_json = json.dumps(story_data, ensure_ascii=False, indent=2)
    # Fix the formatting - remove quotes from id
    story_json = story_json.replace('"id": 48', '"id": 48')
    
    # Insert the story
    new_content = content[:insert_pos] + "  },\n" + story_json[1:-1] + "\n  " + content[insert_pos:]
    
    with open(FRONTEND_STORIES, 'w') as f:
        f.write(new_content)
    print(f"  ✓ Đã thêm truyện vào stories.ts")
    
    # 8. Save to scratch JSON for DB seeding
    scratch_json = ROOT_DIR / "scratch" / "toi_sinh_nam_1998.json"
    with open(scratch_json, 'w', encoding='utf-8') as f:
        json.dump([story_data], f, ensure_ascii=False, indent=2)
    print(f"  ✓ Đã lưu JSON: {scratch_json}")
    
    print(f"\n{'='*60}")
    print(f"✅ HOÀN THÀNH!")
    print(f"📖 {title} (ID: 48)")
    print(f"📄 {NUM_PAGES} trang, {total_words} từ, ~{duration_str}")
    print(f"{'='*60}")
    print(f"\n👉 Chạy lệnh sau để seed database:")
    print(f"   cd backend && npx prisma db push")
    print(f"   cd backend && npx ts-node --project ../database/tsconfig.json ../database/seed_local_imported.ts")
    print(f"\n👉 Hoặc thêm thủ công:")
    print(f"   Cập nhật file: scratch/local_imported_stories.json với dữ liệu từ {scratch_json}")
    print(f"   Rồi chạy seed_local_imported.ts")

if __name__ == "__main__":
    main()
