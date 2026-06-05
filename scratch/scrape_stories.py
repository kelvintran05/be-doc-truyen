import os
import re
import sys
import json
import shutil
import time
from bs4 import BeautifulSoup

# Add scripts directory to path to import vbee_tts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../scripts")))
from vbee_tts import text_to_speech_vbee

# Root and public asset directories
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
AUDIO_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/audio")
IMAGE_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/images")
OUTPUT_JSON = os.path.join(ROOT_DIR, "scratch/scraped_stories.json")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Warm pastel Japanese Zen color schemes
PASTEL_COLORS = [
    {"color": "#FAF6EE", "badgeColor": "#8FA781"},  # Cream / Matcha Green
    {"color": "#FFF0F2", "badgeColor": "#FFB7C5"},  # Sakura Pink / Deep Sakura
    {"color": "#F4F8F0", "badgeColor": "#8FA781"},  # Matcha Light / Green
    {"color": "#FAF8F5", "badgeColor": "#4A3F35"},  # Washi / Ink Charcoal
    {"color": "#FAF0E6", "badgeColor": "#CD5C5C"},  # Linen / Indian Red
    {"color": "#FFF8DC", "badgeColor": "#DAA520"},  # Cornsilk / Goldenrod
]

# Manual curation of stories mapping
LOCAL_STORIES = [
    {
        "id": 21,
        "slug": "berta-va-con-gio-loc",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/780/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/822/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/berta_cover_1780270779862.png",
        "emoji": "🍃",
        "moral": "Hãy luôn dũng cảm đối mặt với khó khăn và tự tin vào bản thân mình.",
        "category": "Truyện phiêu lưu, Truyện giáo dục nhân cách",
        "age": "8-12 tuổi",
        "duration": "8 phút"
    },
    {
        "id": 22,
        "slug": "goc-nho-dieu-ky-giua-khu-vuon",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/904/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/908/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/garden_cover_1780270799481.png",
        "emoji": "🌱",
        "moral": "Tình bạn chân thành có thể vượt qua mọi rào cản và định kiến.",
        "category": "Truyện giáo dục nhân cách, Truyện về tình bạn",
        "age": "5-10 tuổi",
        "duration": "6 phút"
    },
    {
        "id": 23,
        "slug": "emma-va-nhung-chiec-tat-bi-lac",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/910/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/914/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/socks_cover_1780270819532.png",
        "emoji": "🧦",
        "moral": "Sự can đảm và lòng quyết tâm sẽ giúp chúng ta vượt qua mọi thử thách.",
        "category": "Truyện phiêu lưu, Truyện cổ tích",
        "age": "5-9 tuổi",
        "duration": "7 phút"
    },
    {
        "id": 24,
        "slug": "tito-va-ngon-nui-biet-noi",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/916/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/920/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/mountain_cover_1780270840433.png",
        "emoji": "🐘",
        "moral": "Mỗi người đều có những thế mạnh riêng, hãy tự tin khám phá khả năng của mình.",
        "category": "Truyện giáo dục nhân cách, Truyện động vật",
        "age": "5-8 tuổi",
        "duration": "6 phút"
    },
    {
        "id": 25,
        "slug": "runi-va-hon-dao-phep-lich-su",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/922/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/926/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/runi_cover_1780270867691.png",
        "emoji": "🦁",
        "moral": "Lời nói lịch sự và hành động tử tế chính là phép màu làm đẹp cuộc sống.",
        "category": "Truyện giáo dục nhân cách, Truyện phiêu lưu",
        "age": "5-8 tuổi",
        "duration": "8 phút"
    },
    {
        "id": 26,
        "slug": "hanh-trinh-den-ngon-nui-hy-vong",
        "vi_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/928/content.md",
        "en_file": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/.system_generated/steps/932/content.md",
        "cover_src": "/Users/trankelvin/.gemini/antigravity-ide/brain/dd108d4d-5bdd-46fd-b3f8-00c005f2d440/hope_cover_1780270889582.png",
        "emoji": "🏔️",
        "moral": "Tình bạn và sự hy vọng sẽ dẫn lối chúng ta vượt qua mọi giông bão.",
        "category": "Truyện giáo dục nhân cách, Truyện về tình bạn",
        "age": "6-10 tuổi",
        "duration": "8 phút"
    }
]

def extract_html_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Strip frontmatter if present
    if "---" in content:
        parts = content.split("---", 1)
        content = parts[1]
    
    return content

def parse_local_story(story_info):
    slug = story_info["slug"]
    story_id = story_info["id"]
    print(f"\n--- PROCESSING: {slug} (ID: {story_id}) ---")
    
    vi_html = extract_html_from_file(story_info["vi_file"])
    en_html = extract_html_from_file(story_info["en_file"])
    
    soup_vi = BeautifulSoup(vi_html, 'html.parser')
    soup_en = BeautifulSoup(en_html, 'html.parser')
    
    # Extract basic metadata
    title_vi = soup_vi.find('h1', class_='cuento-title').text.strip() if soup_vi.find('h1', class_='cuento-title') else "Truyện Bé Đọc"
    description = soup_vi.find('p', class_='cuento-resumen-text').text.strip() if soup_vi.find('p', class_='cuento-resumen-text') else f"Một câu chuyện thú vị mang tên '{title_vi}'."
    
    # Extract paragraphs (align vi & en)
    detail_vi = soup_vi.find('div', class_='cuento-detalle')
    detail_en = soup_en.find('div', class_='cuento-detalle')
    
    if not detail_vi or not detail_en:
        print("Story content container '.cuento-detalle' not found!")
        return None
        
    p_vi_list = [p.text.strip() for p in detail_vi.find_all('p') if p.text.strip()]
    p_en_list = [p.text.strip() for p in detail_en.find_all('p') if p.text.strip()]
    
    # Align lists to match paragraph by paragraph
    if len(p_vi_list) != len(p_en_list):
        print(f"Mismatch in paragraph counts: VI={len(p_vi_list)}, EN={len(p_en_list)}")
        min_len = min(len(p_vi_list), len(p_en_list))
        p_vi_list = p_vi_list[:min_len]
        p_en_list = p_en_list[:min_len]
        
    if not p_vi_list:
        print("No story paragraphs found!")
        return None
        
    # Copy generated Cover Image to public folder
    cover_filename = f"{slug}_cover.png"
    cover_dest_path = os.path.join(IMAGE_DIR, cover_filename)
    
    src_cover = story_info["cover_src"]
    if os.path.exists(src_cover):
        shutil.copy(src_cover, cover_dest_path)
        print(f"✓ Copied cover image to {cover_dest_path}")
    else:
        print(f"✗ Source cover image not found at {src_cover}!")
        
    # Pick a style color
    style_index = (story_id - 21) % len(PASTEL_COLORS)
    style = PASTEL_COLORS[style_index]
    
    # Process pages and generate Vbee voiceovers
    pages = []
    for idx, (vi_p, en_p) in enumerate(zip(p_vi_list, p_en_list)):
        page_num = idx + 1
        print(f"Processing Page {page_num}/{len(p_vi_list)}...")
        
        # Audio generation
        audio_filename = f"{slug}_page_{page_num}.mp3"
        audio_dest_path = os.path.join(AUDIO_DIR, audio_filename)
        
        if os.path.exists(audio_dest_path):
            print(f"✓ Audio file already exists: {audio_filename}")
        else:
            print(f"Generating Vbee TTS for page {page_num}...")
            # Using bemai children voice
            success = text_to_speech_vbee(
                text=vi_p,
                output_path=audio_dest_path,
                voice_code="hn_female_bemai_news_48k-fhg",
                speed_rate="1.15"
            )
            if not success:
                print("Warning: Vbee TTS failed. Retrying with Mạnh Dũng male voice...")
                success = text_to_speech_vbee(
                    text=vi_p,
                    output_path=audio_dest_path,
                    voice_code="hn_male_manhdung_news_48k-fhg",
                    speed_rate="1.2"
                )
            if success:
                print(f"✓ Generated voice: {audio_filename}")
            else:
                print(f"✗ Failed to generate voice for page {page_num}")
            
            # Short sleep to prevent aggressive API hitting
            time.sleep(1.5)
            
        pages.append({
            "text": vi_p,
            "enText": en_p,
            "image": f"http://localhost:3001/cdn/images/{cover_filename}",
            "audioUrl": f"http://localhost:3001/cdn/audio/{audio_filename}"
        })
        
    story = {
        "id": story_id,
        "title": title_vi,
        "slug": slug,
        "category": story_info["category"],
        "age": story_info["age"],
        "duration": story_info["duration"],
        "rating": 4.8,
        "audio": True,
        "color": style["color"],
        "badgeColor": style["badgeColor"],
        "image": story_info["emoji"],
        "coverImageUrl": f"http://localhost:3001/cdn/images/{cover_filename}",
        "description": description,
        "moral": story_info["moral"],
        "audioDuration": len(pages) * 15, # approximate duration
        "author": "Runruneando",
        "pages": pages
    }
    return story

def main():
    scraped_stories = []
    
    # Process each configured local story
    for story_info in LOCAL_STORIES:
        story = parse_local_story(story_info)
        if story:
            scraped_stories.append(story)
            
            # Save progress after each story
            with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
                json.dump(scraped_stories, f, ensure_ascii=False, indent=2)
                
            print(f"Progress saved to {OUTPUT_JSON}.")
            
    print(f"\n==========================================")
    print(f"FINISHED! Scraped & synthesized {len(scraped_stories)} stories locally.")
    print(f"==========================================")

if __name__ == "__main__":
    main()
