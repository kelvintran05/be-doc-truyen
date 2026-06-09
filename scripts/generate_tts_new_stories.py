import re
import json
import os
import subprocess
import time

FRONTEND_STORIES = "frontend/src/lib/stories.ts"
AUDIO_OUTPUT_DIR = "backend/public/cdn/audio"

STORY_IDS = [21, 22, 23, 24]

def extract_stories(content: str) -> list:
    # Find the STORIES array
    m = re.search(r'export const STORIES: Story\[\] = (\[.*?\])\s*;', content, re.DOTALL)
    if not m:
        raise ValueError("Could not find STORIES array")
    json_str = m.group(1)
    return json.loads(json_str)

def map_to_local_cdn_filename(url: str) -> str:
    if not url or not url.startswith("http"):
        return ""
    idx = url.index("stories/")
    path_part = url[idx:]
    filename = path_part.replace("/", "_").replace(":", "_").replace("?", "_").replace("&", "_")
    return filename

def main():
    with open(FRONTEND_STORIES) as f:
        content = f.read()
    stories = extract_stories(content)
    
    for story in stories:
        sid = story["id"]
        if sid not in STORY_IDS:
            continue
        title = story["title"]
        print(f"\nProcessing story: {title} (ID: {sid})")
        
        for i, page in enumerate(story["pages"]):
            page_num = i + 1
            audio_url = page.get("audioUrl")
            if not audio_url:
                print(f"  Page {page_num}: No audioUrl, skipping")
                continue
            
            text = page["text"]
            if not text:
                print(f"  Page {page_num}: Empty text, skipping")
                continue
            
            filename = map_to_local_cdn_filename(audio_url)
            output_path = os.path.join(AUDIO_OUTPUT_DIR, filename)
            
            print(f"  Page {page_num}: Generating audio ({len(text)} chars)...")
            
            voice = "vi-VN-HoaiMyNeural"
            rate = "+10%"
            pitch = "+0Hz"
            
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            
            cmd = [
                "edge-tts",
                "--voice", voice,
                f"--rate={rate}",
                f"--pitch={pitch}",
                "--text", text,
                "--write-media", output_path,
            ]
            
            for attempt in range(3):
                try:
                    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    print(f"    Saved to: {output_path}")
                    break
                except Exception as e:
                    print(f"    Attempt {attempt+1} failed: {e}")
                    if attempt < 2:
                        time.sleep(2)
            else:
                print(f"    FAILED after 3 attempts")
            
            time.sleep(1)  # rate limit

if __name__ == "__main__":
    main()
