"""
Supertonic TTS Generator for BéĐọc Stories
Generates high-quality on-device TTS audio for story pages.
Usage:
    python scripts/supertonic_tts.py --story-id 14 --voice F1
    python scripts/supertonic_tts.py --story-id 14 --voice F1,F2,M1
    python scripts/supertonic_tts.py --text "Xin chào bé!" --voice F1 --out output.wav
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

FRONTEND_STORIES = PROJECT_ROOT / "frontend" / "src" / "lib" / "stories.ts"
AUDIO_OUTPUT_DIR = PROJECT_ROOT / "backend" / "public" / "cdn" / "audio"

# Best voices for children's storytelling (Vietnamese)
RECOMMENDED_VOICES = {
    "F1": {"name": "Female 1", "desc": "Gentle, warm - best for storytelling"},
    "F2": {"name": "Female 2", "desc": "Clear, friendly - good for narration"},
    "F3": {"name": "Female 3", "desc": "Bright, expressive - engaging for kids"},
    "M1": {"name": "Male 1", "desc": "Deep, calm - good for story narrator"},
    "M2": {"name": "Male 2", "desc": "Clear, natural - versatile"},
}

def extract_stories(content: str) -> list:
    """Extract STORIES array from stories.ts"""
    m = re.search(r'export const STORIES: Story\[\] = (\[.*?\])\s*;', content, re.DOTALL)
    if not m:
        raise ValueError("Could not find STORIES array")
    json_str = m.group(1)
    return json.loads(json_str)

def generate_audio_for_story(story_id: int, voice_name: str, speed: float = 0.95, steps: int = 10):
    """Generate audio for all pages of a story using Supertonic TTS"""
    from supertonic import TTS
    
    print(f"\n{'='*60}")
    print(f"Supertonic TTS Generator for BéĐọc")
    print(f"{'='*60}")
    print(f"Story ID: {story_id}")
    print(f"Voice: {voice_name} ({RECOMMENDED_VOICES.get(voice_name, {}).get('name', 'Unknown')})")
    print(f"Speed: {speed}")
    print(f"Quality Steps: {steps}")
    print(f"{'='*60}\n")
    
    # Initialize TTS
    print("Initializing Supertonic TTS engine...")
    tts = TTS(auto_download=True)
    style = tts.get_voice_style(voice_name=voice_name)
    print("TTS engine ready.\n")
    
    # Read stories
    print(f"Reading stories from {FRONTEND_STORIES}...")
    with open(FRONTEND_STORIES, 'r', encoding='utf-8') as f:
        content = f.read()
    stories = extract_stories(content)
    
    # Find target story
    story = None
    for s in stories:
        if s.get('id') == story_id:
            story = s
            break
    
    if not story:
        print(f"Error: Story with ID {story_id} not found!")
        return None
    
    print(f"Found story: {story['title']}")
    print(f"Pages: {len(story['pages'])}")
    print()
    
    # Generate audio for each page
    generated_files = []
    total_duration = 0
    
    for i, page in enumerate(story['pages']):
        page_num = i + 1
        text = page.get('text', '').strip()
        
        if not text:
            print(f"  Page {page_num}: Empty text, skipping")
            continue
        
        # Create output filename
        slug = story['slug']
        output_filename = f"{slug}_page_{page_num}_{voice_name.lower()}.wav"
        output_path = AUDIO_OUTPUT_DIR / output_filename
        
        print(f"  Page {page_num}/{len(story['pages'])}:")
        print(f"    Text: {text[:60]}...")
        print(f"    Generating audio...")
        
        try:
            wav, duration = tts.synthesize(
                text=text,
                voice_style=style,
                lang="vi",
                total_steps=steps,
                speed=speed,
            )
            
            # Save audio
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            tts.save_audio(wav, str(output_path))
            
            duration_float = float(duration)
            total_duration += duration_float
            
            print(f"    ✓ Saved: {output_filename} ({duration_float:.2f}s)")
            generated_files.append({
                "page": page_num,
                "file": output_filename,
                "duration": duration_float,
                "path": str(output_path)
            })
            
        except Exception as e:
            print(f"    ✗ Failed: {e}")
            continue
        
        time.sleep(0.5)  # Small delay between pages
    
    # Summary
    print(f"\n{'='*60}")
    print(f"Generation Complete!")
    print(f"{'='*60}")
    print(f"Story: {story['title']}")
    print(f"Voice: {voice_name}")
    print(f"Pages generated: {len(generated_files)}/{len(story['pages'])}")
    print(f"Total duration: {total_duration:.2f}s")
    print(f"Output directory: {AUDIO_OUTPUT_DIR}")
    print(f"{'='*60}\n")
    
    # Save metadata
    metadata = {
        "story_id": story_id,
        "story_title": story['title'],
        "voice": voice_name,
        "speed": speed,
        "total_duration": total_duration,
        "pages": generated_files
    }
    
    metadata_path = AUDIO_OUTPUT_DIR / f"{slug}_metadata_{voice_name.lower()}.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"Metadata saved to: {metadata_path}")
    
    return metadata

def generate_audio_for_text(text: str, voice_name: str, output_path: str, speed: float = 0.95, steps: int = 10):
    """Generate audio for a single text string"""
    from supertonic import TTS
    
    print(f"\nSupertonic TTS - Single Text Generation")
    print(f"Voice: {voice_name}")
    print(f"Text: {text[:100]}...")
    
    tts = TTS(auto_download=True)
    style = tts.get_voice_style(voice_name=voice_name)
    
    wav, duration = tts.synthesize(
        text=text,
        voice_style=style,
        lang="vi",
        total_steps=steps,
        speed=speed,
    )
    
    tts.save_audio(wav, output_path)
    print(f"✓ Saved to: {output_path} ({float(duration):.2f}s)")
    
    return output_path, float(duration)

def list_voices():
    """List recommended voices for children's storytelling"""
    print("\nRecommended Voices for Children's Storytelling:")
    print("=" * 50)
    for code, info in RECOMMENDED_VOICES.items():
        print(f"  {code}: {info['name']} - {info['desc']}")
    print("=" * 50)
    print("\nAll available voices: M1-M5 (male), F1-F5 (female)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Supertonic TTS Generator for BéĐọc Stories")
    parser.add_argument("--story-id", type=int, help="Story ID to generate audio for")
    parser.add_argument("--voice", type=str, default="F1", help="Voice name (F1-F5, M1-M5)")
    parser.add_argument("--speed", type=float, default=0.95, help="Speech speed (0.7-2.0)")
    parser.add_argument("--steps", type=int, default=10, help="Quality steps (5-12)")
    parser.add_argument("--text", type=str, help="Single text to generate (instead of story)")
    parser.add_argument("--out", type=str, help="Output path for single text generation")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    
    args = parser.parse_args()
    
    if args.list_voices:
        list_voices()
    elif args.text:
        if not args.out:
            args.out = str(PROJECT_ROOT / "output.wav")
        generate_audio_for_text(args.text, args.voice, args.out, args.speed, args.steps)
    elif args.story_id:
        generate_audio_for_story(args.story_id, args.voice, args.speed, args.steps)
    else:
        parser.print_help()
