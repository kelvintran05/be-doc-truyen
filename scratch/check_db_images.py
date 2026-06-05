import sqlite3
import json

conn = sqlite3.connect('/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/database/dev.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, coverImageUrl, pages FROM Story")
rows = cursor.fetchall()

print(f"Total stories in database: {len(rows)}")

for row in rows:
    story_id, title, cover, pages_str = row
    try:
        pages = json.loads(pages_str)
    except Exception as e:
        print(f"Error parsing pages for story {story_id}: {e}")
        continue
        
    images = [p.get('image') for p in pages if p.get('image')]
    unique_images = set(images)
    
    print(f"Story {story_id}: {title}")
    print(f"  Pages count: {len(pages)}")
    print(f"  Images count: {len(images)} (Unique: {len(unique_images)})")
    if len(unique_images) <= 1 and len(pages) > 1:
        print(f"  ⚠️ DUPLICATES DETECTED: {images}")
    elif len(pages) > 0:
        print(f"  Sample page 1 image: {pages[0].get('image')}")
        if len(pages) > 1:
            print(f"  Sample page 2 image: {pages[1].get('image')}")

conn.close()
