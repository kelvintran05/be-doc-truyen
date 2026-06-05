import os
import sys
import json
import time
import datetime
import subprocess
from gradio_client import Client, handle_file

# Paths
ROOT_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront"
REF_FULL = os.path.join(ROOT_DIR, "backend/public/story_14_full.wav")
REF_12S = os.path.join(ROOT_DIR, "scratch/story_14_ref_12s.wav")
PAGES_JSON = os.path.join(ROOT_DIR, "scratch/story_51_pages.json")
AUDIO_OUT_DIR = os.path.join(ROOT_DIR, "backend/public/cdn/audio")

# Gradio Clients (loaded lazily)
client_gpu = None

def log(msg):
    print(msg, flush=True)

def get_gpu_client():
    global client_gpu
    if client_gpu is None:
        log("Connecting to GPU Client ('mrfakename/E2-F5-TTS')...")
        client_gpu = Client("mrfakename/E2-F5-TTS")
        log("Connected to GPU Client.")
    return client_gpu

def extract_ref_audio():
    if os.path.exists(REF_12S):
        log(f"-> Reference clip already exists at {REF_12S}")
        return
    log(f"-> Extracting 12s reference clip from {REF_FULL}...")
    cmd = [
        "ffmpeg", "-y",
        "-ss", "00:00:00",
        "-i", REF_FULL,
        "-t", "12",
        "-c", "copy",
        REF_12S
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    log(f"-> Reference clip saved to {REF_12S}")

def convert_to_mp3(wav_path, mp3_path):
    log(f"-> Converting {wav_path} to MP3 at {mp3_path}...")
    cmd = [
        "ffmpeg", "-y",
        "-i", wav_path,
        "-codec:a", "libmp3lame",
        "-qscale:a", "2",
        mp3_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    log("-> Conversion complete.")

def generate_vbee(text, target_mp3):
    log(f"-> Generating default voice using Edge-TTS (Vbee)...")
    # Using Vietnamese male voice to match Story 14 male speaker
    voice = "vi-VN-NamMinhNeural"
    rate = "+10%"
    pitch = "+0Hz"
    
    # We write directly to the target mp3 file
    cmd = [
        "edge-tts",
        "--voice", voice,
        f"--rate={rate}",
        f"--pitch={pitch}",
        "--text", text,
        "--write-media", target_mp3
    ]
    
    try:
        res = subprocess.run(cmd, check=True, capture_output=True, text=True)
        log(f"-> Default voice generation complete. Saved to: {target_mp3}")
        return True
    except subprocess.CalledProcessError as e:
        log(f"-> Edge-TTS default voice generation failed: {e}")
        log(f"-> stdout: {e.stdout}")
        log(f"-> stderr: {e.stderr}")
        return False

def generate_gpu_fallback(text, target_mp3, ref_text):
    log(f"-> Falling back to GPU Space for voice cloning...")
    try:
        gpu_client = get_gpu_client()
        log("GPU Space - Sending request...")
        result = gpu_client.predict(
            ref_audio=handle_file(REF_12S),
            ref_text=ref_text,
            gen_text=text,
            remove_silence=False,
            api_name="/predict"
        )
        wav_path = result
        log(f"GPU Space - Received cloned WAV file: {wav_path}")
        convert_to_mp3(wav_path, target_mp3)
        return True
    except Exception as e:
        log(f"GPU Space - Error: {e}")
        return False

def clone_story_voice():
    extract_ref_audio()
    
    if not os.path.exists(PAGES_JSON):
        log(f"Error: {PAGES_JSON} not found. Run the Node export script first.")
        sys.exit(1)
        
    with open(PAGES_JSON, "r", encoding="utf-8") as f:
        pages = json.load(f)
        
    log(f"Loaded {len(pages)} pages to generate.")
    
    # Exact transcript for first 12s of story_14_full.wav
    ref_text = "Xin chào các bạn nhỏ! Hôm nay, chúng mình sẽ cùng khám phá thế giới của những người bạn nhện bé xíu mà thật đáng yêu nhé!"
    
    os.makedirs(AUDIO_OUT_DIR, exist_ok=True)
    
    for page in pages:
        num = page["pageNumber"]
        text = page["text"].replace("\n", " ").strip()
        
        target_mp3 = os.path.join(AUDIO_OUT_DIR, f"luna-va-nhung-ngoi-sao-nhap-nhay_page_{num}.mp3")
        
        # Check if the file already exists and was modified TODAY (to skip only today's runs)
        if os.path.exists(target_mp3) and os.path.getsize(target_mp3) > 0:
            mtime = os.path.getmtime(target_mp3)
            mtime_date = datetime.datetime.fromtimestamp(mtime).date()
            today_date = datetime.date.today()
            if mtime_date == today_date:
                log(f"\n-> Page {num} already generated today. Skipping...")
                continue
            
        log(f"\n==========================================")
        log(f"PROCESSING PAGE {num}/{len(pages)}")
        log(f"Text: '{text}'")
        log(f"==========================================")
        
        # 1. Try Vbee (Edge-TTS) as default
        success = generate_vbee(text, target_mp3)
        
        # 2. Fallback to GPU Space if default failed
        if not success:
            success = generate_gpu_fallback(text, target_mp3, ref_text)
            
        if not success:
            log(f"CRITICAL ERROR: Failed to clone voice or generate fallback for Page {num}.")
            sys.exit(1)
            
        # Success sleep to preserve quota
        log("Page processed successfully. Waiting 10 seconds...")
        time.sleep(10)
        
    log("\n==========================================")
    log("ALL PAGES PROCESSED SUCCESSFULLY!")
    log("==========================================")

if __name__ == "__main__":
    clone_story_voice()
