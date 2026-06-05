#!/usr/bin/env python3
"""Sync missing production stories to local CDN and SQLite DB."""

import json
import os
import re
import sqlite3
import subprocess
import time
from pathlib import Path

CDN_IMAGES_DIR = Path("/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/backend/public/cdn/images")
CDN_AUDIO_DIR = Path("/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/backend/public/cdn/audio")
DB_PATH = Path("/Volumes/DevVault/01_Projects/Freelance/miniread-storefront/database/dev.db")
FULL_STORIES_PATH = Path("/tmp/full_production_stories.json")

CDN_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
CDN_AUDIO_DIR.mkdir(parents=True, exist_ok=True)


def slugify(title):
    """Generate a clean slug from a Vietnamese title."""
    s = title.lower()
    s = s.replace("đ", "d").replace("Đ", "d")
    # Remove (Cải Biên)
    s = re.sub(r'\(cải biên\)', '', s)
    # Remove special chars
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s]+', '-', s.strip())
    s = re.sub(r'-+', '-', s)
    return s.strip('-')


def download_file(url, dest_path):
    """Download a file from URL to destination path."""
    if dest_path.exists() and dest_path.stat().st_size > 0:
        print(f"  EXISTS {dest_path.name}")
        return True
    print(f"  DOWNLOAD {dest_path.name} ...", end=" ", flush=True)
    result = subprocess.run(['curl', '-s', '-L', '-o', str(dest_path), url],
                            capture_output=True, text=True, timeout=60)
    if result.returncode == 0 and dest_path.exists() and dest_path.stat().st_size > 0:
        size_kb = dest_path.stat().st_size / 1024
        print(f"OK ({size_kb:.0f}KB)")
        return True
    else:
        print(f"FAILED ({result.stderr[:100]})")
        return False


def get_clean_slug(prod_slug):
    """Extract clean slug from production slug (remove random suffix)."""
    # Production slugs end with -mpXXXXXX or -moXXXXXX
    clean = re.sub(r'-(?:mp|mo|mq|mr)[a-z0-9]+$', '', prod_slug)
    return clean


def get_category_data(category):
    """Map production category to local DB category and colors."""
    cat_map = {
        'fantasy': {'category': 'Truyện cổ tích', 'color': '#FFF3E0', 'badgeColor': '#FF9800', 'image': '🧚', 'emoji': '🧚'},
        'adventure': {'category': 'Phiêu lưu', 'color': '#E3F2FD', 'badgeColor': '#2196F3', 'image': '🧭', 'emoji': '🧭'},
        'learning': {'category': 'Bài học', 'color': '#FCE4EC', 'badgeColor': '#E91E63', 'image': '📚', 'emoji': '📚'},
        'education': {'category': 'Giáo dục', 'color': '#FEE2E2', 'badgeColor': '#EF4444', 'image': '🏫', 'emoji': '🏫'},
    }
    return cat_map.get(category.lower(), {'category': category, 'color': '#F5F3FF', 'badgeColor': '#8B5CF6', 'image': '📖', 'emoji': '📖'})


def main():
    with open(FULL_STORIES_PATH, 'r', encoding='utf-8') as f:
        all_stories = json.load(f)

    # Only process the 4 missing stories
    missing_slugs = [
        "lo-lem-cai-bien-mpq58rer",
        "chang-be-chan-cuu-mpr7qxb8",
        "bach-tuyet-va-bay-chu-lun-cai-bien-mpp6km50",
        "jack-va-cay-au-than-mprszkyr"
    ]

    target_stories = [s for s in all_stories if s['slug'] in missing_slugs]

    if not target_stories:
        # Fallback: load from missing_stories.json
        if Path("/tmp/missing_stories.json").exists():
            with open("/tmp/missing_stories.json", 'r', encoding='utf-8') as f:
                target_stories = json.load(f)

    print(f"Found {len(target_stories)} stories to sync\n")

    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()

    # Get existing slugs
    existing_slugs = set(r[0] for r in cursor.execute('SELECT slug FROM Story').fetchall())

    for story in target_stories:
        title = story['title']
        prod_slug = story['slug']
        # Use production slug base (without random suffix) for proper Vietnamese slug
        clean_slug = get_clean_slug(prod_slug)

        # Skip if already in DB
        if clean_slug in existing_slugs:
            print(f"SKIP {title} (already exists as slug '{clean_slug}')")
            continue

        print(f"\n{'='*60}")
        print(f"Processing: {title}")
        print(f"  Prod slug: {prod_slug}")
        print(f"  Clean slug: {clean_slug}")

        pages = story.get('pages', [])
        if not pages:
            print(f"  ERROR: No pages data!")
            continue

        # Download cover image (page 1 = cover image)
        cover_url = story['coverImageUrl']
        cover_ext = os.path.splitext(cover_url.split('?')[0])[1] or '.webp'
        cover_filename = f"{clean_slug}_cover{cover_ext}"
        cover_path = CDN_IMAGES_DIR / cover_filename
        download_file(cover_url, cover_path)

        # Download all page images and audio
        local_pages = []
        all_ok = True

        for page in pages:
            pn = page['pageNumber']
            img_url = page['imageUrl']
            aud_url = page.get('audioUrl', '')

            img_ext = os.path.splitext(img_url.split('?')[0])[1] or '.webp'
            aud_ext = os.path.splitext(aud_url.split('?')[0])[1] or '.wav'

            img_filename = f"{clean_slug}_page_{pn}{img_ext}"
            aud_filename = f"{clean_slug}_page_{pn}{aud_ext}"

            img_path = CDN_IMAGES_DIR / img_filename
            aud_path = CDN_AUDIO_DIR / aud_filename

            ok_img = download_file(img_url, img_path)
            ok_aud = download_file(aud_url, aud_path) if aud_url else True

            if not (ok_img and ok_aud):
                all_ok = False
                print(f"  FAILED to download page {pn} files")

            local_pages.append({
                "pageNumber": pn,
                "text": page.get('textContent', ''),
                "image": f"http://localhost:3001/cdn/images/{img_filename}",
                "audioUrl": f"http://localhost:3001/cdn/audio/{aud_filename}" if aud_url else ""
            })

        if not all_ok:
            print(f"  WARNING: Some downloads failed, continuing anyway...")

        # Prepare metadata
        cat_data = get_category_data(story.get('category', ''))
        num_pages = len(pages)
        total_audio_sec = num_pages * 30  # avg 30s per page
        duration_min = max(3, round(num_pages * 0.8))

        db_data = {
            'title': title,
            'slug': clean_slug,
            'category': cat_data['category'],
            'age': f"{story.get('ageFrom', 3)}-{story.get('ageTo', 8)} tuổi",
            'duration': f"{duration_min} phút",
            'rating': 4.8,
            'audio': 1,
            'color': cat_data['color'],
            'badgeColor': cat_data['badgeColor'],
            'image': cat_data['image'],
            'coverImageUrl': f"http://localhost:3001/cdn/images/{cover_filename}",
            'description': story.get('description', ''),
            'moral': '',
            'audioDuration': total_audio_sec,
            'author': 'BéĐọc',
            'pages': json.dumps(local_pages, ensure_ascii=False),
            'questions': None
        }

        # Insert into DB
        try:
            cursor.execute('''
                INSERT INTO Story (title, slug, category, age, duration, rating, audio, color, badgeColor,
                                   image, coverImageUrl, description, moral, audioDuration, author, pages, questions)
                VALUES (:title, :slug, :category, :age, :duration, :rating, :audio, :color, :badgeColor,
                        :image, :coverImageUrl, :description, :moral, :audioDuration, :author, :pages, :questions)
            ''', db_data)
            conn.commit()
            print(f"  ✅ INSERTED into DB with slug '{clean_slug}'")
            existing_slugs.add(clean_slug)
        except sqlite3.IntegrityError as e:
            print(f"  ❌ DB Error: {e}")
            conn.rollback()

        # Rate limit to avoid hammering Supabase
        time.sleep(0.5)

    conn.close()
    print(f"\n{'='*60}")
    print("Sync complete!")


if __name__ == '__main__':
    main()
