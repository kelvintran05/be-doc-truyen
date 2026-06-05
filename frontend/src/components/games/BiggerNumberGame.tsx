"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface BiggerNumberRound {
  num1: number;
  num2: number;
}

const ROUNDS_POOL: BiggerNumberRound[] = [
  { num1: 8, num2: 12 },
  { num1: 25, num2: 17 },
  { num1: 43, num2: 48 },
  { num1: 72, num2: 69 },
  { num1: 99, num2: 102 }
];

export function BiggerNumberGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedNum, setSelectedNum] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;
  const correctAnswer = Math.max(currentRoundData.num1, currentRoundData.num2);

  const handleNumClick = (num: number) => {
    if (selectedNum !== null) return;

    setSelectedNum(num);
    const correct = num === correctAnswer;
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
          setSelectedNum(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedNum(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedNum(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Số nào lớn hơn?"
      prompt="Hãy chạm vào quả bóng có số lớn hơn nhé!"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="So sánh lượng số ⚖️"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <div className="flex gap-6 w-full justify-center">
          {[currentRoundData.num1, currentRoundData.num2].map((num) => {
            const isChosen = selectedNum === num;
            const cardClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-amber-50 text-surface-base border-border-default";

            return (
              <button
                key={num}
                onClick={() => handleNumClick(num)}
                disabled={selectedNum !== null}
                className={cn(
                  "w-36 h-36 border-3 rounded-full shadow-shadow-2 text-4xl font-extrabold font-fredoka flex items-center justify-center active:translate-y-[4px] active:shadow-none hover:-translate-y-1 transition-all cursor-pointer",
                  cardClass
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
