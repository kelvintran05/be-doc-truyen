"""
Voice Cloning Script for Story 19 using Story 14's voice
Uses GPU Gradio Space (mrfakename/E2-F5-TTS) for voice cloning
"""
import os
import sys
import json
import time
import datetime
import subprocess
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Paths
REF_FULL = PROJECT_ROOT / "backend" / "public" / "cdn" / "audio" / "story_14_full.wav"
REF_12S = PROJECT_ROOT / "scratch" / "story_14_ref_12s.wav"
AUDIO_OUT_DIR = PROJECT_ROOT / "backend" / "public" / "cdn" / "audio"
FRONTEND_STORIES = PROJECT_ROOT / "frontend" / "src" / "lib" / "stories.ts"

# Reference text for the first 12s of story_14_full.wav
REF_TEXT = "Xin chào các bạn nhỏ! Hôm nay, chúng mình sẽ cùng khám phá thế giới của những người bạn nhện bé xíu mà thật đáng yêu nhé!"

def log(msg):
    print(msg, flush=True)

def extract_ref_audio():
    """Extract 12s reference clip from full audio"""
    if REF_12S.exists():
        log(f"-> Reference clip already exists at {REF_12S}")
        return
    
    log(f"-> Extracting 12s reference clip from {REF_FULL}...")
    cmd = [
        "ffmpeg", "-y",
        "-ss", "00:00:00",
        "-i", str(REF_FULL),
        "-t", "12",
        "-c", "copy",
        str(REF_12S)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    log(f"-> Reference clip saved to {REF_12S}")

def convert_to_mp3(wav_path, mp3_path):
    """Convert WAV to MP3"""
    log(f"-> Converting to MP3...")
    cmd = [
        "ffmpeg", "-y",
        "-i", str(wav_path),
        "-codec:a", "libmp3lame",
        "-qscale:a", "2",
        str(mp3_path)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    log(f"-> Conversion complete: {mp3_path}")

def generate_with_gpu_space(text, target_mp3, ref_text):
    """Generate audio using GPU Gradio Space for voice cloning"""
    try:
        from gradio_client import Client, handle_file
        
        log("-> Connecting to GPU Space (mrfakename/E2-F5-TTS)...")
        client = Client("mrfakename/E2-F5-TTS")
        log("-> Connected to GPU Space.")
        
        log("-> Sending voice cloning request...")
        result = client.predict(
            ref_audio=handle_file(str(REF_12S)),
            ref_text=ref_text,
            gen_text=text,
            remove_silence=False,
            api_name="/predict"
        )
        
        wav_path = result
        log(f"-> Received cloned WAV file: {wav_path}")
        
        # Convert to MP3
        convert_to_mp3(wav_path, target_mp3)
        return True
        
    except Exception as e:
        log(f"-> GPU Space Error: {e}")
        return False

def extract_stories(content):
    """Extract STORIES array from stories.ts"""
    import re
    m = re.search(r'export const STORIES: Story\[\] = (\[.*?\])\s*;', content, re.DOTALL)
    if not m:
        raise ValueError("Could not find STORIES array")
    json_str = m.group(1)
    return json.loads(json_str)

def generate_story19_audio():
    """Generate audio for Story 19 using cloned voice from Story 14"""
    
    log("\n" + "="*60)
    log("Voice Cloning for Story 19: 'Cha Rất Yêu Con'")
    log("Using voice from Story 14: 'Sự Thật Thú Vị Về Loài Nhện'")
    log("="*60 + "\n")
    
    # Extract reference audio
    extract_ref_audio()
    
    # Read stories
    log("Reading stories from stories.ts...")
    with open(FRONTEND_STORIES, 'r', encoding='utf-8') as f:
        content = f.read()
    stories = extract_stories(content)
    
    # Find story 19
    story = None
    for s in stories:
        if s.get('id') == 19:
            story = s
            break
    
    if not story:
        log("Error: Story 19 not found!")
        return
    
    log(f"Found story: {story['title']}")
    log(f"Pages: {len(story['pages'])}\n")
    
    # Generate audio for each page
    generated_files = []
    total_duration = 0
    
    for i, page in enumerate(story['pages']):
        page_num = i + 1
        text = page.get('text', '').strip()
        
        if not text:
            log(f"  Page {page_num}: Empty text, skipping")
            continue
        
        # Create output filename
        slug = story['slug']
        output_filename = f"{slug}_page_{page_num}_cloned.mp3"
        output_path = AUDIO_OUT_DIR / output_filename
        
        log(f"\n{'='*50}")
        log(f"Page {page_num}/{len(story['pages'])}")
        log(f"Text: {text[:80]}...")
        log(f"{'='*50}")
        
        # Check if already generated today
        if output_path.exists() and output_path.stat().st_size > 0:
            mtime = datetime.datetime.fromtimestamp(output_path.stat().st_mtime)
            if mtime.date() == datetime.date.today():
                log(f"  -> Already generated today. Skipping...")
                generated_files.append({
                    "page": page_num,
                    "file": output_filename,
                    "path": str(output_path)
                })
                continue
        
        # Generate with GPU Space
        success = generate_with_gpu_space(text, output_path, REF_TEXT)
        
        if success:
            log(f"  -> Generated: {output_filename}")
            generated_files.append({
                "page": page_num,
                "file": output_filename,
                "path": str(output_path)
            })
        else:
            log(f"  -> FAILED to generate audio for page {page_num}")
        
        # Rate limit protection
        log("  -> Waiting 10 seconds before next page...")
        time.sleep(10)
    
    # Summary
    log(f"\n{'='*60}")
    log(f"Generation Complete!")
    log(f"{'='*60}")
    log(f"Story: {story['title']}")
    log(f"Pages generated: {len(generated_files)}/{len(story['pages'])}")
    log(f"Output directory: {AUDIO_OUT_DIR}")
    log(f"{'='*60}\n")
    
    # Save metadata
    metadata = {
        "story_id": 19,
        "story_title": story['title'],
        "voice_source": "cloned_from_story_14",
        "reference_file": str(REF_FULL),
        "pages": generated_files
    }
    
    metadata_path = AUDIO_OUT_DIR / f"{slug}_metadata_cloned.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    log(f"Metadata saved to: {metadata_path}")
    
    return metadata

if __name__ == "__main__":
    generate_story19_audio()
