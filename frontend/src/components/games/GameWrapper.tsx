"use client";

import * as React from "react";
import { SoundManager } from "@/lib/sound";
import { Volume2, VolumeX, RotateCcw, Home } from "lucide-react";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

interface GameWrapperProps {
  title: string;
  prompt: string;
  round: number;
  totalRounds: number;
  score: number;
  isGameOver: boolean;
  onRestart: () => void;
  children: React.ReactNode;
  infoBadge?: string;
  onPlayInstruction?: () => void;
  isInstructionPlaying?: boolean;
}

export function GameWrapper({
  title,
  prompt,
  round,
  totalRounds,
  score,
  isGameOver,
  onRestart,
  children,
  infoBadge,
  onPlayInstruction,
  isInstructionPlaying = false
}: GameWrapperProps) {
  
  if (isGameOver) {
    const starCount = Math.min(5, Math.max(1, Math.round((score / totalRounds) * 5)));
    
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 text-center select-none animate-in fade-in duration-300">
        <span className="text-7xl animate-bounce">🎉</span>
        <h2 className="font-fredoka text-4xl font-bold text-surface-base">Tuyệt vời!</h2>
        
        {/* Rating stars */}
        <div className="flex gap-1 text-4xl text-yellow-400 select-none">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx}>{idx < starCount ? "⭐" : "☆"}</span>
          ))}
        </div>
        
        <p className="font-quicksand text-lg font-bold text-text-secondary">
          Bé đã hoàn thành xuất sắc trò chơi **{title}**!
        </p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
          <button 
            onClick={() => {
              SoundManager.playButtonTap();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#FCD34D] border-3 border-border-default shadow-shadow-1 text-surface-base text-lg font-bold active:translate-y-[3px] active:shadow-none hover:-translate-y-0.5 hover:shadow-shadow-2 transition-all cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" /> Chơi lại
          </button>
          
          <NextLink href="/activities" className="w-full">
            <button 
              className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#E0F2FE] border-3 border-border-default shadow-shadow-1 text-surface-base text-lg font-bold active:translate-y-[3px] active:shadow-none hover:-translate-y-0.5 hover:shadow-shadow-2 transition-all cursor-pointer"
            >
              🧠 Hoạt động khác
            </button>
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full">
      {/* Header Info */}
      <div className="flex w-full max-w-sm items-center justify-between px-2">
        <div className="flex gap-1.5 select-none">
          {Array.from({ length: totalRounds }).map((_, rIdx) => (
            <div 
              key={rIdx}
              className={cn(
                "h-3.5 w-10 rounded-full border-2 border-border-default shadow-inner transition-colors",
                rIdx < round ? "bg-[#FCD34D]" : "bg-white"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-lg font-bold text-surface-base">
          <span>⭐</span>
          <span className="font-fredoka">{score}</span>
        </div>
      </div>

      {/* Guide prompt row */}
      <div className="text-center">
        <div className="flex items-center gap-2.5 justify-center">
          <p className="text-lg md:text-xl font-bold font-fredoka text-surface-base">{prompt}</p>
          {onPlayInstruction && (
            <button
              onClick={() => {
                SoundManager.playButtonTap();
                onPlayInstruction();
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 border-border-default bg-white shadow-shadow-1 text-surface-base hover:bg-surface-strong transition-all active:translate-y-[2px] active:shadow-none cursor-pointer",
                isInstructionPlaying && "bg-[#FCD34D] animate-pulse"
              )}
              aria-label="Play instructions"
            >
              {isInstructionPlaying ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
          )}
        </div>
        {infoBadge && (
          <span className="inline-block text-xs font-bold bg-[#FCD34D]/20 text-surface-base px-3 py-0.5 border-2 border-border-default rounded-full mt-2 shadow-shadow-1">
            {infoBadge}
          </span>
        )}
      </div>

      {/* Play Area */}
      <div className="w-full flex justify-center py-2">
        {children}
      </div>
    </div>
  );
}
