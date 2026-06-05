import re
import json

def parse_stories():
    with open('/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/frontend/src/lib/stories.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Locate array start
    idx = content.find("export const STORIES: Story[] =")
    equal_idx = content.find("=", idx)
    start_idx = content.find("[", equal_idx)
    
    # Find matching closing bracket
    bracket_count = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_idx = i + 1
                break
                
    json_str = content[start_idx:end_idx].strip()
    
    # Simple cleanups for parsing Javascript object literal as JSON
    # Remove trailing commas before closing braces/brackets
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
    
    # If there are any comments, strip them
    json_str = re.sub(r'//.*', '', json_str)
    
    try:
        return json.loads(json_str)
    except Exception as e:
        print("Regex fallback parsing due to:", e)
        # Try a regex-based parser for stories
        stories = []
        # Find matches for individual story objects
        # Because JSON parsing might fail on some syntax differences
        story_blocks = re.findall(r'\{\s*"id":\s*(\d+).*?"pages":\s*\[(.*?)\]\s*\}', content, re.DOTALL)
        for s_id, pages_content in story_blocks:
            page_images = re.findall(r'"image":\s*"([^"]+)"', pages_content)
            title_match = re.search(r'"title":\s*"([^"]+)"', content[content.find(f'"id": {s_id}'):])
            title = title_match.group(1) if title_match else f"ID {s_id}"
            stories.append({"id": int(s_id), "title": title, "pages": [{"image": img} for img in page_images]})
        return stories

stories = parse_stories()
print(f"Total parsed stories: {len(stories)}")

for s in stories:
    title = s.get('title', 'Unknown')
    s_id = s.get('id')
    pages = s.get('pages', [])
    images = [p.get('image') for p in pages if p.get('image')]
    unique_images = set(images)
    
    if len(unique_images) <= 1 and len(pages) > 1:
        print(f"⚠️ Story ID {s_id} ({title}) has duplicate images across pages! Count: {len(pages)}, Unique: {len(unique_images)}")
        print(f"   Images list: {images}")
    else:
        print(f"✓ Story ID {s_id} ({title}) has unique images. Count: {len(pages)}, Unique: {len(unique_images)}")
