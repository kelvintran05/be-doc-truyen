import os
import re
import json
import ssl
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

ssl._create_default_https_context = ssl._create_unverified_context

# Paths
ROOT_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront"
STORIES_TS_PATH = os.path.join(ROOT_DIR, "frontend/src/lib/stories.ts")
CDN_IMAGES_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/images")
CDN_AUDIO_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/audio")

def parse_stories():
    print(f"Reading stories file: {STORIES_TS_PATH}")
    with open(STORIES_TS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Locate the array start
    array_start = content.find("export const STORIES: Story[] =")
    if array_start == -1:
        array_start = content.find("export const STORIES")
        
    equal_idx = content.find("=", array_start)
    if equal_idx == -1:
        raise Exception("Could not find '=' in STORIES definition")
        
    start_index = content.find("[", equal_idx)
    if start_index == -1:
        raise Exception("Could not find start of STORIES array")
    
    # Simple brackets matching or find the last semicolon
    # Since the file ends with the array definition and a semicolon, we can strip the trailing part
    json_str = content[start_index:]
    # Remove trailing semicolon and newlines
    json_str = json_str.strip()
    if json_str.endswith(";"):
        json_str = json_str[:-1]
    
    try:
        stories = json.loads(json_str)
        return stories
    except Exception as e:
        print("Standard JSON parsing failed, attempting cleaning...")
        # Try to clean trailing commas if any, or other minor JS artifacts
        # We can clean comments or other things, but stories.ts should be standard JSON representation
        raise e

def get_unique_filename(url):
    if not url:
        return None
    # Find "stories/" in the URL to preserve unique path structure
    idx = url.find("stories/")
    if idx != -1:
        path_part = url[idx:]
        safe_name = path_part.replace("/", "_").replace(":", "_").replace("?", "_").replace("&", "_")
        return safe_name
    # Fallback to basename
    parsed = urllib.parse.urlparse(url)
    return os.path.basename(parsed.path)

def download_file(url, dest_folder):
    if not url or not url.startswith("http"):
        return None
    
    # Do not download locally hosted assets
    if "localhost:3001" in url:
        return None
    
    filename = get_unique_filename(url)
    if not filename:
        return None
    
    dest_path = os.path.join(dest_folder, filename)
    
    # Check if already downloaded
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return filename
    
    try:
        # Use a user agent to prevent 403 forbidden blocks
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"✓ Downloaded: {filename}")
        return filename
    except Exception as e:
        print(f"✗ Failed to download {url}: {e}")
        return None

def main():
    stories = parse_stories()
    print(f"Parsed {len(stories)} stories.")
    
    # Create directories
    os.makedirs(CDN_IMAGES_DIR, exist_ok=True)
    os.makedirs(CDN_AUDIO_DIR, exist_ok=True)
    
    urls_to_download = [] # List of tuples: (url, folder)
    
    for s in stories:
        if s.get("coverImageUrl"):
            urls_to_download.append((s["coverImageUrl"], CDN_IMAGES_DIR))
        
        for p in s.get("pages", []):
            if p.get("image"):
                urls_to_download.append((p["image"], CDN_IMAGES_DIR))
            if p.get("audioUrl"):
                urls_to_download.append((p["audioUrl"], CDN_AUDIO_DIR))
                
    # Deduplicate URLs
    unique_urls = list(set(urls_to_download))
    print(f"Found {len(unique_urls)} unique assets to download.")
    
    print("Starting downloads with ThreadPoolExecutor...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(download_file, url, folder) for url, folder in unique_urls]
        for f in futures:
            f.result()
            
    print("Download process completed.")

if __name__ == "__main__":
    main()
