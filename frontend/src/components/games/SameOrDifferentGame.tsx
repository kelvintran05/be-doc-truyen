"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface SameDifferentRound {
  leftEmojis: string[];
  rightEmojis: string[];
  isSame: boolean;
}

const ROUNDS_POOL: SameDifferentRound[] = [
  { leftEmojis: ["🐶", "🐱"], rightEmojis: ["🐶", "🐱"], isSame: true },
  { leftEmojis: ["🍎", "🍌", "🍇"], rightEmojis: ["🍎", "🍊", "🍇"], isSame: false },
  { leftEmojis: ["🚀", "🪐"], rightEmojis: ["🚀", "🪐"], isSame: true },
  { leftEmojis: ["🚗", "🚌", "🚕"], rightEmojis: ["🚗", "🚌", "🚜"], isSame: false }
];

export function SameOrDifferentGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedChoice, setSelectedChoice] = React.useState<boolean | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleChoiceClick = (choice: boolean) => {
    if (selectedChoice !== null) return;

    setSelectedChoice(choice);
    const correct = choice === currentRoundData.isSame;
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
          setSelectedChoice(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedChoice(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedChoice(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Giống hay khác?"
      prompt="Hãy nhìn kỹ hai nhóm hình dưới đây xem chúng Giống hay Khác nhau?"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Luyện khả năng quan sát 🧐"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Comparison Panels */}
        <div className="grid grid-cols-2 gap-6 w-full select-none">
          {/* Left panel */}
          <div className="flex items-center justify-center gap-3 p-6 bg-amber-50 border-3 border-border-default rounded-radius-xs shadow-shadow-1 min-h-[120px]">
            {currentRoundData.leftEmojis.map((emoji, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl select-none">{emoji}</span>
            ))}
          </div>

          {/* Right panel */}
          <div className="flex items-center justify-center gap-3 p-6 bg-sky-50 border-3 border-border-default rounded-radius-xs shadow-shadow-1 min-h-[120px]">
            {currentRoundData.rightEmojis.map((emoji, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl select-none">{emoji}</span>
            ))}
          </div>
        </div>

        {/* Buttons Choice */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[
            { label: "Giống nhau 🟢", choice: true, color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700" },
            { label: "Khác nhau 🔴", choice: false, color: "bg-rose-50 hover:bg-rose-100 text-rose-700" }
          ].map((item) => {
            const isChosen = selectedChoice === item.choice;
            const buttonClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : item.color;

            return (
              <button
                key={item.label}
                onClick={() => handleChoiceClick(item.choice)}
                disabled={selectedChoice !== null}
                className={cn(
                  "h-16 border-3 border-border-default rounded-2xl shadow-shadow-1 text-lg font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  buttonClass
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
