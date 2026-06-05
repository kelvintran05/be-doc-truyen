import os
import sys
import traceback
import subprocess
from gradio_client import Client, handle_file

# Paths
ROOT_DIR = "/Volumes/DevVault/01_Projects/Freelance/miniread-storefront"
REF_FULL = os.path.join(ROOT_DIR, "backend/public/story_14_full.wav")
REF_12S = os.path.join(ROOT_DIR, "scratch/story_14_ref_12s.wav")
TEST_OUT = os.path.join(ROOT_DIR, "scratch/test_cloned_output.wav")

def log(msg):
    print(msg, flush=True)

def test_clone():
    try:
        log("Connecting to Gradio Client for 'duongtungls/F5-TTS-Vietnamese'...")
        client = Client("duongtungls/F5-TTS-Vietnamese")
        log("Connected successfully.")
        
        test_text = "Một đêm hè yên tĩnh, cô bé thỏ Luna nằm trên bãi cỏ và ngắm bầu trời."
        
        log(f"Calling API with gen_text: '{test_text}'")
        
        result = client.predict(
            ref_audio_orig=handle_file(REF_12S),
            gen_text=test_text,
            speed=1.0,
            api_name="/predict"
        )
        
        log(f"API result returned: {result}")
        audio_path = result[0]
        log(f"API returned audio path: {audio_path}")
        
        import shutil
        shutil.copy(audio_path, TEST_OUT)
        log(f"Successfully copied cloned audio to {TEST_OUT}")
    except Exception as e:
        log(f"Error occurred during cloning: {e}")
        traceback.print_exc(file=sys.stdout)
        sys.stdout.flush()

if __name__ == "__main__":
    test_clone()
