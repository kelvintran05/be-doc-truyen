import os
import re
import json
from pypdf import PdfReader

PDF_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/frontend/public/English for Kids/LV1"
OUTPUT_JSON = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/scratch/english_lessons.json"

def clean_text(text):
    if not text:
        return ""
    # Remove copyright info and page numbers at the bottom
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        # Skip copyright/publisher lines
        if "Copyright" in l or "Little Fox" in l or "All rights reserved" in l:
            continue
        # Skip standalone numbers (page numbers) at the end
        if re.match(r"^\d+$", l):
            continue
        # Skip Level lines
        if re.match(r"^Level \d+$", l, re.IGNORECASE):
            continue
        cleaned_lines.append(l)
    return " ".join(cleaned_lines).strip()

def process_pdfs():
    lessons = []
    
    files = sorted([f for f in os.listdir(PDF_DIR) if f.endswith(".pdf")])
    print(f"Found {len(files)} PDF files.")
    
    for filename in files:
        # Match pattern: lv01-001_Title.pdf
        match = re.match(r"^lv\d+-(\d+)_(.+)\.pdf$", filename)
        if not match:
            print(f"Skipping file with non-standard name: {filename}")
            continue
            
        num_str, title_raw = match.groups()
        lesson_id = 100 + int(num_str) # IDs like 101, 102, 103...
        title = title_raw.replace("_", " ").strip()
        slug = title.lower().replace(" ", "-").replace("!", "").replace("?", "").replace(",", "").replace("'", "")
        
        pdf_path = os.path.join(PDF_DIR, filename)
        reader = PdfReader(pdf_path)
        
        print(f"Processing ID {lesson_id}: {title} ({len(reader.pages)} pages)")
        
        pages_data = []
        
        # We know pages are:
        # P1: Cover
        # P3: Story Page 1 (Spread 1-2)
        # P5: Story Page 2 (Spread 3-4)
        # P7: Story Page 3 (Spread 5-6)
        # P9: Story Page 4 (Spread 7-8)
        
        story_page_indices = [2, 4, 6, 8] # 0-indexed page 3, 5, 7, 9
        
        for idx, page_idx in enumerate(story_page_indices):
            if page_idx < len(reader.pages):
                raw_text = reader.pages[page_idx].extract_text()
                text = clean_text(raw_text)
                
                pages_data.append({
                    "pageNumber": idx + 1,
                    "textContent": text,
                    "image": f"http://localhost:3001/cdn/courses/lv1/{slug}/page_{idx + 1}.webp",
                    "audioUrl": f"http://localhost:3001/cdn/audio/courses/lv1/{slug}/page_{idx + 1}.mp3"
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
            "badgeColor": "bg-violet-100 text-violet-800",
            "image": "🇬🇧",
            "coverImageUrl": f"http://localhost:3001/cdn/courses/lv1/{slug}/cover.webp",
            "description": f"Học tiếng Anh sinh động qua câu chuyện '{title}'. Bé sẽ được làm quen với từ vựng mới và luyện nghe phát âm tiếng Anh chuẩn Mỹ.",
            "moral": "Learn English happily every day!",
            "audioDuration": 120,
            "author": "MiniRead English",
            "pages": pages_data
        })
        
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(lessons, f, ensure_ascii=False, indent=2)
        
    print(f"Extraction complete! Saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    process_pdfs()
