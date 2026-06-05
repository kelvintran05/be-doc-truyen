let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Fail silently when audio context is blocked by browser autoplay policy
  }
}

export const SoundManager = {
  playAppleLand(index: number) {
    const tones = [261, 294, 330, 349, 392, 440, 494, 523, 587, 659];
    const freq = tones[index % tones.length] ?? 440;
    playTone(freq, 0.25, "sine", 0.25);
  },
  
  playCorrect() {
    playTone(523, 0.15, "sine", 0.3);
    setTimeout(() => playTone(659, 0.15, "sine", 0.3), 120);
    setTimeout(() => playTone(784, 0.3, "sine", 0.3), 240);
  },
  
  playWrong() {
    playTone(180, 0.3, "square", 0.15);
  },
  
  playWin() {
    const tones = [523, 659, 784, 1047];
    tones.forEach((tone, index) => {
      setTimeout(() => playTone(tone, 0.25, "sine", 0.3), index * 130);
    });
  },
  
  playButtonTap() {
    playTone(440, 0.08, "sine", 0.2);
  },

  playPianoNote(freq: number) {
    playTone(freq, 0.6, "triangle", 0.25);
  },

  playAnimalCall(type: "dog" | "cat" | "bird" | "cow") {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      if (type === "bird") {
        // High pitched chirps
        [0, 0.12, 0.24].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(2000, now + delay);
          osc.frequency.exponentialRampToValueAtTime(3200, now + delay + 0.08);
          gain.gain.setValueAtTime(0.15, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
          osc.start(now + delay);
          osc.stop(now + delay + 0.08);
        });
      } else if (type === "dog") {
        // Woof woof - two short barks
        [0, 0.25].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(140, now + delay);
          osc.frequency.linearRampToValueAtTime(80, now + delay + 0.12);
          gain.gain.setValueAtTime(0.3, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
          osc.start(now + delay);
          osc.stop(now + delay + 0.12);
        });
      } else if (type === "cat") {
        // Meow - sliding frequency
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
        osc.frequency.linearRampToValueAtTime(800, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === "cow") {
        // Low pitch moo
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth"; // rough texture
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.linearRampToValueAtTime(95, now + 0.2);
        osc.frequency.linearRampToValueAtTime(75, now + 0.8);
        gain.gain.setValueAtTime(0.12, now);
        // Lowpass filter for moo
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(250, now);
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      // Ignore
    }
  }
};

