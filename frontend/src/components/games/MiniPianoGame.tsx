"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface PianoKey {
  note: string;
  freq: number;
  label: string;
}

const PIANO_KEYS: PianoKey[] = [
  { note: "C4", freq: 261.63, label: "Đồ" },
  { note: "D4", freq: 293.66, label: "Rê" },
  { note: "E4", freq: 329.63, label: "Mi" },
  { note: "F4", freq: 349.23, label: "Pha" },
  { note: "G4", freq: 392.00, label: "Son" },
  { note: "A4", freq: 440.00, label: "La" },
  { note: "B4", freq: 493.88, label: "Si" },
  { note: "C5", freq: 523.25, label: "Đố" }
];

// Song "Kìa con bướm vàng" (Do Re Mi Do, Do Re Mi Do, Mi Fa Sol, Mi Fa Sol)
const SONG_SEQUENCE = ["C4", "D4", "E4", "C4", "C4", "D4", "E4", "C4"];

export function MiniPianoGame() {
  const [mode, setMode] = React.useState<"free" | "song">("free");
  const [songStep, setSongStep] = React.useState(0);
  const [highlightNote, setHighlightNote] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);

  // Trigger next highlight note in Song Mode
  React.useEffect(() => {
    if (mode === "song" && !isGameOver) {
      if (songStep < SONG_SEQUENCE.length) {
        setHighlightNote(SONG_SEQUENCE[songStep]!);
      } else {
        // Song completed!
        setHighlightNote(null);
        setTimeout(() => {
          SoundManager.playWin();
          setIsGameOver(true);
          setScore(8);
        }, 800);
      }
    } else {
      setHighlightNote(null);
    }
  }, [mode, songStep, isGameOver]);

  const handleKeyClick = (key: PianoKey) => {
    SoundManager.playPianoNote(key.freq);

    if (mode === "song" && !isGameOver) {
      const expectedNote = SONG_SEQUENCE[songStep];
      if (key.note === expectedNote) {
        // Correct note
        setSongStep((prev) => prev + 1);
        setScore((prev) => prev + 1);
      } else {
        // Wrong note - show quick error, don't advance
        SoundManager.playWrong();
      }
    }
  };

  const handleRestart = () => {
    setSongStep(0);
    setScore(0);
    setIsGameOver(false);
    setMode("free");
  };

  return (
    <GameWrapper
      title="Đàn Piano Mini"
      prompt={
        mode === "free"
          ? "Bé hãy ấn các phím để tự do sáng tạo âm nhạc nhé! 🎵"
          : "Hãy gõ theo phím sáng màu để chơi bài 'Kìa con bướm vàng'!"
      }
      round={mode === "free" ? 0 : songStep}
      totalRounds={mode === "free" ? 1 : SONG_SEQUENCE.length}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Đàn Piano Ma Thuật 🎵"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-lg select-none">
        {/* Mode Selector */}
        <div className="flex gap-4 select-none">
          <button
            onClick={() => {
              SoundManager.playButtonTap();
              setMode("free");
              setSongStep(0);
              setScore(0);
            }}
            className={cn(
              "px-4 py-2 border-2 border-border-default rounded-radius-sm font-bold text-sm shadow-shadow-1 cursor-pointer transition-all active:translate-y-[2px] active:shadow-none",
              mode === "free" ? "bg-[#7C3AED] text-white" : "bg-white text-surface-base"
            )}
          >
            🎹 Đánh tự do
          </button>
          <button
            onClick={() => {
              SoundManager.playButtonTap();
              setMode("song");
              setSongStep(0);
              setScore(0);
            }}
            className={cn(
              "px-4 py-2 border-2 border-border-default rounded-radius-sm font-bold text-sm shadow-shadow-1 cursor-pointer transition-all active:translate-y-[2px] active:shadow-none",
              mode === "song" ? "bg-[#7C3AED] text-white animate-pulse" : "bg-white text-surface-base"
            )}
          >
            📖 Gõ theo bài hát
          </button>
        </div>

        {/* Piano Keyboard */}
        <div className="w-full flex justify-between bg-slate-900 border-4 border-border-default rounded-2xl p-4 shadow-shadow-2 relative overflow-hidden select-none">
          
          {/* Piano Keys */}
          {PIANO_KEYS.map((key) => {
            const isLit = highlightNote === key.note;
            return (
              <button
                key={key.note}
                onClick={() => handleKeyClick(key)}
                className={cn(
                  "w-[11%] aspect-[1/4] border-2 border-border-default rounded-b-xl flex flex-col justify-end pb-3 items-center text-xs font-bold font-fredoka shadow-inner transition-colors duration-150 cursor-pointer select-none",
                  isLit 
                    ? "bg-yellow-300 translate-y-0.5 shadow-none" 
                    : "bg-white text-slate-800 active:bg-slate-200 active:translate-y-0.5 active:shadow-none"
                )}
                style={{ transformOrigin: "top center" }}
              >
                <span className="text-[10px] select-none opacity-60">{key.note}</span>
                <span className="select-none">{key.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
