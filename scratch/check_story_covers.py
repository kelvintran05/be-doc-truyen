import sqlite3
import json
import os
import hashlib

conn = sqlite3.connect('/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/database/dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, coverImageUrl, pages FROM Story")
rows = cursor.fetchall()

IMAGES_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/backend/public/cdn/images"

def get_md5(filename):
    path = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(path):
        return None
    hash_md5 = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

for row in rows:
    story_id, title, cover_url, pages_str = row
    cover_file = cover_url.split('/')[-1]
    cover_md5 = get_md5(cover_file)
    
    if not cover_md5:
        print(f"Story {story_id}: Cover image file not found locally: {cover_file}")
        continue
        
    try:
        pages = json.loads(pages_str)
    except:
        continue
        
    match_count = 0
    total_pages = len(pages)
    for p in pages:
        p_image = p.get('image')
        if not p_image:
            continue
        p_file = p_image.split('/')[-1]
        p_md5 = get_md5(p_file)
        if p_md5 == cover_md5:
            match_count += 1
            
    if match_count > 0:
        print(f"⚠️ Story {story_id} ({title}): {match_count}/{total_pages} page images are IDENTICAL to the cover image!")
    else:
        print(f"✓ Story {story_id} ({title}): Page images are distinct from cover.")

conn.close()
