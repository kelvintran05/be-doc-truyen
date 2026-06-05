"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface RoundData {
  emoji: string;
  count: number;
  options: number[];
}

const ROUNDS_POOL: RoundData[] = [
  { emoji: "🍎", count: 3, options: [2, 3, 4, 5] },
  { emoji: "🐶", count: 5, options: [3, 4, 5, 6] },
  { emoji: "🚀", count: 2, options: [1, 2, 3, 4] },
  { emoji: "🍦", count: 6, options: [4, 5, 6, 7] },
  { emoji: "🐸", count: 4, options: [3, 4, 5, 6] }
];

export function NumberMatchGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  
  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleOptionClick = (option: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === currentRoundData.count;
    setIsCorrect(correct);

    if (correct) {
      SoundManager.playCorrect();
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (round + 1 >= 3) {
          SoundManager.playWin();
          setIsGameOver(true);
        } else {
          setRound((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Ghép số"
      prompt="Đếm hình và chọn số tương ứng nhé!"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Đếm số ngộ nghĩnh 🔢"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Emoji Display Area */}
        <div className="flex flex-wrap items-center justify-center gap-4 p-8 min-h-[140px] bg-amber-50 border-3 border-border-default rounded-radius-xs w-full shadow-shadow-1">
          {Array.from({ length: currentRoundData.count }).map((_, idx) => (
            <span 
              key={idx} 
              className="text-5xl md:text-6xl animate-bounce select-none"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {currentRoundData.emoji}
            </span>
          ))}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((option) => {
            const isChosen = selectedOption === option;
            const optionClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base";

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                className={cn(
                  "h-16 border-3 border-border-default rounded-2xl shadow-shadow-1 text-2xl font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  optionClass
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
