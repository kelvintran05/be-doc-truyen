"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface LetterRound {
  emoji: string;
  itemName: string;
  correctLetter: string;
  options: string[];
}

const ROUNDS_POOL: LetterRound[] = [
  { emoji: "🐱", itemName: "Con Mèo", correctLetter: "M", options: ["M", "K", "C", "D"] },
  { emoji: "🍎", itemName: "Quả Táo", correctLetter: "T", options: ["T", "G", "H", "L"] },
  { emoji: "🐠", itemName: "Con Cá", correctLetter: "C", options: ["C", "B", "N", "V"] },
  { emoji: "🍌", itemName: "Quả Chuối", correctLetter: "C", options: ["C", "T", "P", "S"] }
];

export function FirstLetterGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedLetter, setSelectedLetter] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleLetterClick = (letter: string) => {
    if (selectedLetter !== null) return;

    setSelectedLetter(letter);
    const correct = letter === currentRoundData.correctLetter;
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
          setSelectedLetter(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedLetter(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedLetter(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Chữ cái đầu tiên"
      prompt={`Chữ cái đầu tiên của từ "${currentRoundData.itemName}" là chữ gì nào?`}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Học chữ cái tiếng Việt 🔤"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md select-none">
        
        {/* Main visual display */}
        <div className="flex flex-col items-center justify-center p-8 bg-orange-50 border-3 border-border-default rounded-radius-xs w-56 h-56 shadow-shadow-2 relative select-none animate-in zoom-in duration-300">
          <span className="text-8xl select-none animate-bounce">{currentRoundData.emoji}</span>
          <span className="mt-4 text-lg font-bold font-fredoka text-text-secondary">{currentRoundData.itemName}</span>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((letter) => {
            const isChosen = selectedLetter === letter;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base border-border-default";

            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={selectedLetter !== null}
                className={cn(
                  "h-16 border-3 rounded-2xl shadow-shadow-1 text-3xl font-extrabold font-fredoka flex items-center justify-center active:translate-y-[2px] transition-all cursor-pointer",
                  btnClass
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
