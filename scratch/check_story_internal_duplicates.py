import sqlite3
import json
import os
import hashlib
from collections import defaultdict

conn = sqlite3.connect('/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/database/dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, pages FROM Story")
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
    story_id, title, pages_str = row
    try:
        pages = json.loads(pages_str)
    except:
        continue
        
    page_md5s = []
    page_files = []
    for idx, p in enumerate(pages):
        p_image = p.get('image')
        if not p_image:
            continue
        p_file = p_image.split('/')[-1]
        p_md5 = get_md5(p_file)
        if p_md5:
            page_md5s.append(p_md5)
            page_files.append((idx + 1, p_file, p_md5))
            
    # Check for duplicates in page_md5s
    seen_md5s = {}
    duplicates = []
    for p_num, p_file, p_md5 in page_files:
        if p_md5 in seen_md5s:
            duplicates.append((p_num, p_file, seen_md5s[p_md5]))
        else:
            seen_md5s[p_md5] = p_num
            
    if duplicates:
        print(f"⚠️ Story {story_id} ({title}) has duplicate MD5 images internally!")
        for p_num, p_file, original_p in duplicates:
            print(f"  Page {p_num} image ({p_file}) is identical to Page {original_p}")
    else:
        print(f"✓ Story {story_id} ({title}) has no internal duplicate images.")

conn.close()
