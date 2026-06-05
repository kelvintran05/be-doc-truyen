import os
import re
import sys
import json
import shutil
import docx
import time

# Add scripts directory to path to import vbee_tts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../scripts")))
try:
    from vbee_tts import text_to_speech_vbee
except ImportError:
    print("Warning: Could not import vbee_tts. Ensure scripts/vbee_tts.py exists.")
    def text_to_speech_vbee(text, output_path, voice_code, speed_rate):
        print(f"Mock TTS: {text} -> {output_path}")
        return True

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TRUYEN_DIR = os.path.join(BASE_DIR, "backend/public/Truyện")
CDN_IMAGE_DIR = os.path.join(BASE_DIR, "backend/public/cdn/images")
CDN_AUDIO_DIR = os.path.join(BASE_DIR, "backend/public/cdn/audio")
OUTPUT_JSON = os.path.join(BASE_DIR, "scratch/new_stories.json")

TARGET_FOLDERS = [
    "bảo vệ trái đất",
    "hành tinh",
    "mặt trăng hay ngôi sao",
    "những ngôi sao"
]

def make_slug(text):
    text = text.lower()
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'[đ]', 'd', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'\s+', '-', text).strip('-')
    return text

def parse_docx(filepath):
    doc = docx.Document(filepath)
    lines = []
    for para in doc.paragraphs:
        txt = para.text.strip()
        if txt:
            lines.append(txt)
            
    # Find Quiz section
    story_lines = []
    quiz_lines = []
    in_quiz = False
    
    for line in lines:
        if "❓" in line or "Câu hỏi cho bé" in line or "câu hỏi cho bé" in line.lower():
            in_quiz = True
            continue
        if in_quiz:
            quiz_lines.append(line)
        else:
            story_lines.append(line)
            
    # Parse Quiz
    questions = []
    current_q = None
    
    for ql in quiz_lines:
        # Match question start like "1. Ai là người hắt hơi..."
        q_match = re.match(r'^\d+\.\s*(.+)', ql)
        if q_match:
            if current_q:
                questions.append(current_q)
            current_q = {
                "question": q_match.group(1).strip(),
                "options": [],
                "answer": None
            }
        else:
            # Match option like "A. Nina"
            opt_match = re.match(r'^([A-D])\.\s*(.+)', ql)
            if opt_match and current_q:
                opt_letter = opt_match.group(1)
                opt_text = opt_match.group(2)
                
                # Check for correct answer mark
                is_correct = False
                if "✅" in opt_text or "(đúng)" in opt_text.lower():
                    is_correct = True
                    opt_text = opt_text.replace("✅", "").replace("(đúng)", "").strip()
                elif "✅" in ql:
                    is_correct = True
                    
                full_opt = f"{opt_letter}. {opt_text}"
                current_q["options"].append(full_opt)
                if is_correct:
                    current_q["answer"] = opt_letter
                    
    if current_q:
        questions.append(current_q)
        
    # The first line is usually the Title
    title = story_lines[0]
    story_lines = story_lines[1:]
    
    return title, story_lines, questions

def chunk_list(lst, n_chunks):
    # Split list into n relatively equal chunks
    k, m = divmod(len(lst), n_chunks)
    return [lst[i*k+min(i, m):(i+1)*k+min(i+1, m)] for i in range(n_chunks)]

def process_stories():
    os.makedirs(CDN_IMAGE_DIR, exist_ok=True)
    os.makedirs(CDN_AUDIO_DIR, exist_ok=True)
    
    results = []
    
    # Check what dirs actually exist matching target (ignoring unicode differences by normalizing)
    import unicodedata
    target_normalized = [unicodedata.normalize('NFC', t) for t in TARGET_FOLDERS]
    all_dirs = [d for d in os.listdir(TRUYEN_DIR) if os.path.isdir(os.path.join(TRUYEN_DIR, d))]
    
    for d in all_dirs:
        norm_d = unicodedata.normalize('NFC', d)
        if norm_d not in target_normalized:
            continue
            
        print(f"\n==========================================")
        print(f"PROCESSING FOLDER: {d}")
        print(f"==========================================")
        
        dir_path = os.path.join(TRUYEN_DIR, d)
        files = os.listdir(dir_path)
        
        # Find docx
        docx_file = next((f for f in files if not f.startswith('._') and f.endswith('.docx')), None)
        if not docx_file:
            print(f"No .docx found in {d}")
            continue
            
        # Find images
        img_files = sorted([f for f in files if not f.startswith('._') and f.lower().endswith(('.png', '.jpeg', '.jpg'))])
        num_images = len(img_files)
        
        if num_images == 0:
            print(f"No images found in {d}")
            continue
            
        print(f"Found {num_images} images and 1 docx: {docx_file}")
        
        # Extract docx
        title, story_lines, quiz = parse_docx(os.path.join(dir_path, docx_file))
        slug = make_slug(title)
        print(f"Title: {title} | Slug: {slug}")
        print(f"Parsed {len(quiz)} questions.")
        
        # Chunk text
        chunks = chunk_list(story_lines, num_images)
        
        pages_data = []
        for i, (chunk, img_file) in enumerate(zip(chunks, img_files)):
            page_num = i + 1
            page_text = "\n".join(chunk)
            print(f"\n--- Page {page_num} ---")
            print(f"Text: {page_text[:50]}...")
            
            # Copy image
            ext = os.path.splitext(img_file)[1]
            dest_img_name = f"{slug}_page_{page_num}{ext}"
            dest_img_path = os.path.join(CDN_IMAGE_DIR, dest_img_name)
            src_img_path = os.path.join(dir_path, img_file)
            shutil.copy(src_img_path, dest_img_path)
            img_url = f"http://localhost:3001/cdn/images/{dest_img_name}"
            
            # TTS Audio
            dest_audio_name = f"{slug}_page_{page_num}.mp3"
            dest_audio_path = os.path.join(CDN_AUDIO_DIR, dest_audio_name)
            audio_url = f"http://localhost:3001/cdn/audio/{dest_audio_name}"
            
            if os.path.exists(dest_audio_path):
                print(f"✓ Audio already exists: {dest_audio_name}")
            else:
                success = text_to_speech_vbee(
                    text=page_text,
                    output_path=dest_audio_path,
                    voice_code="hn_female_xuanquynh_news_48k-fhg", # Nữ chuẩn Hà Nội
                    speed_rate="1.1" # Tốc độ hơi chậm một chút cho bé dễ nghe
                )
                if success:
                    print(f"✓ Generated {dest_audio_name}")
                else:
                    print(f"✗ Failed TTS for {dest_audio_name}")
                time.sleep(1.5)
                
            pages_data.append({
                "pageNumber": page_num,
                "text": page_text,
                "image": img_url,
                "audioUrl": audio_url,
                "keyword": page_text[0].upper() if page_text else ""
            })
            
        story_obj = {
            "title": title,
            "slug": slug,
            "category": "Khám Phá",
            "age": "3-6 tuổi",
            "duration": f"{len(pages_data)} phút",
            "rating": 5.0,
            "audio": True,
            "color": "bg-green-50",
            "badgeColor": "bg-green-100 text-green-850",
            "image": "🌍",
            "description": f"Câu chuyện thú vị về {title}, giúp bé khám phá thế giới xung quanh một cách sinh động.",
            "moral": quiz[-1]["options"][1].replace("B. ", "").replace("C. ", "").replace("A. ", "") if quiz and len(quiz) > 0 and len(quiz[-1]["options"]) > 1 else "Bé học được điều bổ ích từ câu chuyện.",
            "author": "BéĐọc Khám Phá",
            "coverImageUrl": pages_data[0]["image"] if pages_data else "",
            "pages": pages_data,
            "questions": quiz
        }
        results.append(story_obj)
        
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"\nAll done! Saved {len(results)} stories to {OUTPUT_JSON}")

if __name__ == "__main__":
    process_stories()
