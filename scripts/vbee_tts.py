import time
import requests
import os
import subprocess

def generate_edge_tts(text: str, output_path: str, voice_code: str, speed_rate: str) -> bool:
    try:
        # Determine Edge-TTS voice based on Vbee voice_code
        voice = 'vi-VN-HoaiMyNeural' # Default female
        if "female" in voice_code.lower():
            voice = 'vi-VN-HoaiMyNeural'
        elif "male" in voice_code.lower() or "manhdung" in voice_code.lower() or "thanhlong" in voice_code.lower():
            voice = 'vi-VN-NamMinhNeural'
        
        # Ghi đè tốc độ và cao độ để tạo giọng nhí nhảnh/kể chuyện (đã tối ưu tránh lỗi từ MS server)
        rate_str = "+5%"
        pitch_str = "+0Hz"
            
        print(f"-> Falling back to Edge-TTS: Voice={voice}, Rate={rate_str}, Pitch={pitch_str}...")
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        
        cmd = ['edge-tts', '--voice', voice, f'--rate={rate_str}', f'--pitch={pitch_str}', '--text', text, '--write-media', output_path]
        
        # Try up to 3 times with 2 seconds sleep
        for attempt in range(3):
            try:
                subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print(f"-> Edge-TTS succeeded. Saved to: {output_path}")
                return True
            except Exception as e:
                print(f"-> Edge-TTS attempt {attempt + 1} failed: {e}. Retrying in 2 seconds...")
                time.sleep(2)
                
        return False
    except Exception as e:
        print(f"-> Edge-TTS fallback failed: {e}")
        return False

def text_to_speech_vbee(text: str, output_path: str, voice_code: str = "hn_male_manhdung_news_48k-fhg", speed_rate: str = "1.2") -> bool:
    """
    Chuyển đổi văn bản thành giọng nói bằng Microsoft Edge-TTS (mặc định miễn phí).
    (Hàm vẫn giữ tên text_to_speech_vbee để tương thích ngược với các script cũ).
    """
    print("Sử dụng Edge-TTS mặc định (Miễn phí, Không giới hạn)...")
    return generate_edge_tts(text, output_path, voice_code, speed_rate)

# Ví dụ và chạy CLI:
if __name__ == "__main__":
    import argparse
    import json
    
    parser = argparse.ArgumentParser(description="Vbee Text-To-Speech Script")
    parser.add_argument("--text", type=str, help="Văn bản cần lồng tiếng")
    parser.add_argument("--out", type=str, default="public/audio/output.mp3", help="Đường dẫn lưu file mp3 đầu ra")
    parser.add_argument("--story", type=str, help="ID hoặc slug của truyện trong database để lồng tiếng toàn bộ các trang")
    parser.add_argument("--voice", type=str, default="hn_male_manhdung_news_48k-fhg", help="Mã giọng đọc Vbee")
    parser.add_argument("--speed", type=str, default="1.2", help="Tốc độ đọc Vbee (ví dụ: '1.0', '1.2')")
    
    args = parser.parse_args()
    
    if args.story:
        json_path = '/Users/trankelvin/.gemini/antigravity-ide/brain/ca37d8a9-6cbc-4d99-9e62-e9e7de70fbe0/scratch/all_stories_full.json'
        if not os.path.exists(json_path):
            print(f"Không tìm thấy dữ liệu truyện tại: {json_path}")
            exit(1)
            
        with open(json_path, 'r', encoding='utf-8') as f:
            stories = json.load(f)
            
        # Tìm truyện theo ID hoặc Slug
        story = None
        for s in stories:
            if s.get('id') == args.story or s.get('slug') == args.story or str(s.get('id')) == args.story:
                story = s
                break
                
        if not story:
            print(f"Không tìm thấy truyện với ID/slug: {args.story}")
            exit(1)
            
        print(f"Bắt đầu lồng tiếng cho truyện: {story['title']}")
        pages = story.get('pages', [])
        
        # Sắp xếp các trang theo số thứ tự
        sorted_pages = sorted(pages, key=lambda p: p.get('pageNumber', 1))
        
        for p in sorted_pages:
            num = p.get('pageNumber', 1)
            audio_text = p.get('audioText', '').strip()
            if not audio_text:
                audio_text = p.get('textContent', '').strip()
            if not audio_text:
                continue
                
            out_file = f"public/audio/stories/{story['slug']}/page_{num}.mp3"
            print(f"Trang {num}: '{audio_text[:60]}...' -> {out_file}")
            
            success = text_to_speech_vbee(
                text=audio_text,
                output_path=out_file,
                voice_code=args.voice,
                speed_rate=args.speed
            )
            if not success:
                print(f"Lồng tiếng thất bại tại trang {num}")
            time.sleep(1.5) # Nghỉ ngắn để tránh rate limit
            
        print("Hoàn thành lồng tiếng cho toàn bộ truyện!")
        
    elif args.text:
        print(f"Bắt đầu lồng tiếng văn bản: '{args.text}'")
        success = text_to_speech_vbee(
            text=args.text,
            output_path=args.out,
            voice_code=args.voice,
            speed_rate=args.speed
        )
        if success:
            print(f"Đã lưu thành công tại: {args.out}")
        else:
            print("Lồng tiếng thất bại.")
    else:
        # Chạy thử nghiệm mặc định
        print("Không có tham số, đang chạy thử nghiệm mặc định...")
        text_to_speech_vbee(
            text="Chào mừng bé đến với thế giới truyện đọc BéĐọc! Chúc bé có những giờ đọc truyện thật vui vẻ.",
            output_path="public/audio/welcome.mp3",
            voice_code=args.voice,
            speed_rate=args.speed
        )
