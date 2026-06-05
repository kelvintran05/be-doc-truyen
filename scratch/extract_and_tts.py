import os
import re
import sys
import json
import time
import subprocess
import shutil
from pypdf import PdfReader

# Add scripts directory to path to import vbee_tts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../scripts")))
from vbee_tts import text_to_speech_vbee

PDF_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/frontend/public/English for Kids/LV1"
OUTPUT_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/backend/public/cdn/courses/lv1"
OUTPUT_JSON = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/scratch/english_lessons_full.json"
TEMP_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/scratch/temp_pages"

def clean_text(text):
    if not text:
        return ""
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        if "Copyright" in l or "Little Fox" in l or "All rights reserved" in l:
            continue
        if re.match(r"^\d+$", l):
            continue
        if re.match(r"^Level \d+$", l, re.IGNORECASE):
            continue
        cleaned_lines.append(l)
    return " ".join(cleaned_lines).strip()

def process_lessons():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")])
    lessons = []
    
    for filename in files:
        match = re.match(r"^lv\d+-(\d+)_(.+)\.pdf$", filename)
        if not match:
            continue
            
        num_str, title_raw = match.groups()
        lesson_id = 100 + int(num_str)
        title = title_raw.replace("_", " ").strip()
        slug = title.lower().replace(" ", "-").replace("!", "").replace("?", "").replace(",", "").replace("'", "")
        
        pdf_path = os.path.join(PDF_DIR, filename)
        print(f"\n==========================================")
        print(f"PROCESSING LESSON {lesson_id}: {title}")
        print(f"==========================================")
        
        # 1. Read PDF text & find story page indices (detect identical consecutive pairs)
        reader = PdfReader(pdf_path)
        total_pdf_pages = len(reader.pages)
        
        story_page_indices = []
        i = 1 # Start scanning from index 1 (page 2) to total_pdf_pages - 2 (second to last)
        while i < total_pdf_pages - 1:
            text_curr = clean_text(reader.pages[i].extract_text())
            text_next = clean_text(reader.pages[i+1].extract_text())
            
            if text_curr and text_curr == text_next:
                story_page_indices.append(i)
                i += 2 # Skip the duplicate page
            else:
                i += 1
                
        print(f"Detected story page indices: {story_page_indices}")
        
        # 2. Render all pages of this PDF to PNG
        # Create a lesson-specific temp folder to avoid rmtree conflicts with macOS ._ files
        lesson_temp_dir = os.path.join(TEMP_DIR, slug)
        os.makedirs(lesson_temp_dir, exist_ok=True)
        
        print("Rendering PDF pages to PNG...")
        # Resolution 150 DPI is crisp but not too heavy
        subprocess.run([
            "pdftoppm", "-png", "-r", "150", 
            pdf_path, os.path.join(lesson_temp_dir, "page")
        ], check=True)
        
        # 3. Create target directory
        lesson_output_dir = os.path.join(OUTPUT_DIR, slug)
        os.makedirs(lesson_output_dir, exist_ok=True)
        
        # 4. Copy cover page (page-01.png)
        cover_src = os.path.join(lesson_temp_dir, "page-01.png")
        cover_dest = os.path.join(lesson_output_dir, "cover.png")
        if os.path.exists(cover_src):
            shutil.copy(cover_src, cover_dest)
            print("✓ Copied cover.png")
            
        # 5. Process each story page
        pages_data = []
        for seq_idx, page_idx in enumerate(story_page_indices):
            seq_num = seq_idx + 1
            # pdftoppm outputs files like page-03.png for page index 2 (1-indexed page 3)
            src_img_name = f"page-{page_idx + 1:02d}.png"
            src_img_path = os.path.join(lesson_temp_dir, src_img_name)
            dest_img_path = os.path.join(lesson_output_dir, f"page_{seq_num}.png")
            
            # Copy image
            if os.path.exists(src_img_path):
                shutil.copy(src_img_path, dest_img_path)
                print(f"✓ Copied page_{seq_num}.png")
            else:
                print(f"⚠ Warning: Image {src_img_name} not found!")
                
            # Extract text
            page_text = clean_text(reader.pages[page_idx].extract_text())
            print(f"Page {seq_num} text: '{page_text}'")
            
            # Generate Vbee TTS
            dest_audio_path = os.path.join(lesson_output_dir, f"page_{seq_num}.mp3")
            if os.path.exists(dest_audio_path):
                print(f"✓ Audio file already exists: {dest_audio_path} (Skipping TTS call)")
            else:
                print(f"Generating TTS for Page {seq_num}...")
                success = text_to_speech_vbee(
                    text=page_text,
                    output_path=dest_audio_path,
                    voice_code="en-US-EmmaNeural",
                    speed_rate="0.95" # Slower for kids
                )
                if success:
                    print(f"✓ Generated page_{seq_num}.mp3")
                else:
                    print(f"✗ Failed to generate TTS for page_{seq_num}")
                time.sleep(1.5) # Prevent aggressive rate limits
                
            pages_data.append({
                "pageNumber": seq_num,
                "textContent": page_text,
                "image": f"http://localhost:3001/cdn/courses/lv1/{slug}/page_{seq_num}.png",
                "audioUrl": f"http://localhost:3001/cdn/courses/lv1/{slug}/page_{seq_num}.mp3"
            })
            
        lessons.append({
            "id": lesson_id,
            "title": title,
            "slug": slug,
            "category": "English for Kids",
            "age": "3-6 tuổi",
            "duration": "2 phút",
            "rating": 4.9,
            "audio": True,
            "color": "bg-violet-50",
            "badgeColor": "bg-violet-100 text-violet-850",
            "image": "🇬🇧",
            "coverImageUrl": f"http://localhost:3001/cdn/courses/lv1/{slug}/cover.png",
            "description": f"Học tiếng Anh sinh động qua câu chuyện '{title}'. Bé sẽ được làm quen với từ vựng mới và luyện nghe phát âm tiếng Anh chuẩn Mỹ.",
            "moral": "Learn English happily every day!",
            "audioDuration": len(pages_data) * 15, # approximate duration
            "author": "MiniRead English",
            "pages": pages_data
        })
        # Cleanup lesson-specific temp folder
        shutil.rmtree(lesson_temp_dir, ignore_errors=True)
        
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(lessons, f, ensure_ascii=False, indent=2)
        
    # Cleanup temp dir
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    print(f"\n==========================================")
    print(f"ALL DONE! Saved metadata to {OUTPUT_JSON}")
    print(f"==========================================")

if __name__ == "__main__":
    process_lessons()
