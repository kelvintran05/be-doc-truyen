import asyncio
import re
import json
import os
import sys
from edge_tts import Communicate

FRONTEND_STORIES = "frontend/src/lib/stories.ts"
AUDIO_OUTPUT_DIR = "backend/public/cdn/audio"
STORY_IDS = [21, 22, 23, 24]

def map_to_local_cdn_filename(url: str) -> str:
    if not url or not url.startswith("http"):
        return ""
    idx = url.index("stories/")
    path_part = url[idx:]
    filename = path_part.replace("/", "_").replace(":", "_").replace("?", "_").replace("&", "_")
    return filename

def extract_stories(content: str) -> list:
    m = re.search(r'export const STORIES: Story\[\] = (\[.*?\])\s*;', content, re.DOTALL)
    if not m:
        raise ValueError("Could not find STORIES array")
    return json.loads(m.group(1))

async def generate_tts(text: str, output_path: str) -> bool:
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    for attempt in range(5):
        try:
            communicate = Communicate(text, "vi-VN-HoaiMyNeural", rate="+10%", pitch="+0Hz")
            await communicate.save(output_path)
            size = os.path.getsize(output_path)
            if size > 1000:
                print(f"  OK ({size} bytes)")
                return True
            else:
                print(f"  Too small ({size} bytes), retrying...")
        except Exception as e:
            print(f"  Attempt {attempt+1}: {e}")
        await asyncio.sleep(3)
    return False

async def main():
    with open(FRONTEND_STORIES) as f:
        content = f.read()
    stories = extract_stories(content)

    total = 0
    failed = 0

    for story in stories:
        sid = story["id"]
        if sid not in STORY_IDS:
            continue

        for i, page in enumerate(story["pages"]):
            page_num = i + 1
            audio_url = page.get("audioUrl")
            if not audio_url:
                continue

            filename = map_to_local_cdn_filename(audio_url)
            output_path = os.path.join(AUDIO_OUTPUT_DIR, filename)

            if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                continue  # already fine

            text = page["text"]
            print(f"Story {sid} page {page_num}: {text[:50]}...")
            total += 1
            ok = await generate_tts(text, output_path)
            if not ok:
                failed += 1
                print(f"  FAILED")
            await asyncio.sleep(1)

    print(f"\nDone: {total} attempted, {failed} failed")

if __name__ == "__main__":
    asyncio.run(main())
