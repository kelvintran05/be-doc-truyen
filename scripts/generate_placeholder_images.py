#!/usr/bin/env python3
"""
Generate placeholder images for stories using Pillow.
Creates colorful gradient images with story titles as text.
"""
import os
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = Path(__file__).parent.parent
CDN_IMAGES_DIR = ROOT_DIR / "backend" / "public" / "cdn" / "images"

# Color palettes for each story
STORY_THEMES = {
    "ba-chu-heo-con": {
        "title": "Ba Chú Heo Con",
        "colors": [(255, 183, 77), (255, 138, 101)],  # Orange gradient
        "emoji": "🐷"
    },
    "lo-lem": {
        "title": "Lọ Lem",
        "colors": [(186, 104, 200), (171, 71, 188)],  # Purple gradient
        "emoji": "👑"
    },
    "runi-va-hon-dao-phep-lich-su": {
        "title": "Runi và Hòn Đảo\nPhép Lịch Sự",
        "colors": [(77, 182, 172), (38, 166, 154)],  # Teal gradient
        "emoji": "🦉"
    },
    "emma-va-nhung-chiec-tat-bi-lac": {
        "title": "Emma và Những\nChiếc Tất Bị Lạc",
        "colors": [(239, 83, 80), (229, 57, 53)],  # Red gradient
        "emoji": "🧦"
    }
}


def create_gradient(width, height, color1, color2, angle=45):
    """Create a gradient image."""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        for x in range(width):
            # Calculate gradient position
            if angle == 45:
                ratio = (x + y) / (width + height)
            elif angle == 90:
                ratio = y / height
            else:
                ratio = x / width
            
            r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
            g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
            b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
            
            img.putpixel((x, y), (r, g, b))
    
    return img


def create_gradient_fast(width, height, color1, color2):
    """Create gradient faster using line drawing."""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img


def draw_centered_text(draw, text, y_offset, width, height, font_size=48):
    """Draw centered text with shadow."""
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2 + y_offset
    
    # Draw shadow
    draw.text((x + 2, y + 2), text, fill=(0, 0, 0, 128), font=font)
    # Draw text
    draw.text((x, y), text, fill=(255, 255, 255), font=font)


def create_story_image(story_id, page_num, title, output_path):
    """Create a placeholder image for a story page."""
    width, height = 1024, 768
    
    theme = STORY_THEMES.get(story_id, {
        "title": title,
        "colors": [(100, 100, 100), (50, 50, 50)],
        "emoji": "📖"
    })
    
    # Create gradient background
    color1, color2 = theme["colors"]
    # Vary colors slightly per page
    shift = page_num * 15
    color1 = (min(255, color1[0] + shift), min(255, color1[1] + shift), min(255, color1[2] + shift))
    color2 = (max(0, color2[0] - shift), max(0, color2[1] - shift), max(0, color2[2] - shift))
    
    img = create_gradient_fast(width, height, color1, color2)
    draw = ImageDraw.Draw(img)
    
    # Add decorative circles
    for i in range(5):
        x = (width * (i + 1)) // 6
        y = height // 3
        radius = 50 + i * 10
        alpha = 50 - i * 8
        circle_color = (255, 255, 255, alpha)
        draw.ellipse([x - radius, y - radius, x + radius, y + radius], 
                     fill=(255, 255, 255), outline=None)
    
    # Draw title
    draw_centered_text(draw, theme["title"], -50, width, height, font_size=42)
    
    # Draw page number
    page_text = f"Trang {page_num}"
    try:
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font_small = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), page_text, font=font_small)
    text_width = bbox[2] - bbox[0]
    draw.text(((width - text_width) // 2, height - 80), page_text, 
              fill=(255, 255, 255), font=font_small)
    
    # Save
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "WEBP", quality=85)
    print(f"  ✓ Created: {os.path.basename(output_path)}")


def main():
    print("=" * 60)
    print("🖼️  Generating Placeholder Images")
    print("=" * 60)
    
    # Define stories and their pages
    stories = {
        "ba-chu-heo-con": {
            "title": "Ba Chú Heo Con",
            "pages": 4
        },
        "lo-lem": {
            "title": "Lọ Lem",
            "pages": 4
        },
        "runi-va-hon-dao-phep-lich-su": {
            "title": "Runi và Hòn Đảo Phép Lịch Sự",
            "pages": 5
        },
        "emma-va-nhung-chiec-tat-bi-lac": {
            "title": "Emma và Những Chiếc Tất Bị Lạc",
            "pages": 5
        }
    }
    
    total = sum(s["pages"] for s in stories.values())
    count = 0
    
    for story_id, story in stories.items():
        print(f"\n📖 {story['title']}:")
        for page_num in range(1, story["pages"] + 1):
            filename = f"{story_id}_page_{page_num}.webp"
            output_path = str(CDN_IMAGES_DIR / filename)
            
            if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                print(f"  ⏭️  Skipping {filename} (exists)")
            else:
                create_story_image(story_id, page_num, story["title"], output_path)
            
            count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Generated {count} placeholder images!")
    print(f"📁 Output: {CDN_IMAGES_DIR}")


if __name__ == "__main__":
    main()
