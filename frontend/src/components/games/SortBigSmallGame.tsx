"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface SizeItem {
  emoji: string;
  name: string;
  size: "big" | "small";
}

const ITEMS_POOL: SizeItem[] = [
  { emoji: "🐜", name: "Con kiến nhỏ", size: "small" },
  { emoji: "🐘", name: "Con voi to", size: "big" },
  { emoji: "🐭", name: "Con chuột nhỏ", size: "small" },
  { emoji: "🐳", name: "Con cá voi to", size: "big" },
  { emoji: "🍒", name: "Quả sơ ri nhỏ", size: "small" },
  { emoji: "🍉", name: "Quả dưa hấu to", size: "big" }
];

export function SortBigSmallGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentItem = ITEMS_POOL[round % ITEMS_POOL.length]!;

  const handleBoxClick = (size: "big" | "small") => {
    if (selectedSize !== null) return;

    setSelectedSize(size);
    const correct = size === currentItem.size;
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
          setSelectedSize(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedSize(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedSize(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Phân biệt to nhỏ"
      prompt={`Con vật/đồ vật "${currentItem.name}" này thuộc nhóm TO hay NHỎ?`}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Nhận biết kích thước 🧩"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Item Card */}
        <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 border-3 border-border-default rounded-radius-xs w-56 h-56 shadow-shadow-2 relative select-none animate-in zoom-in duration-300">
          <span 
            className={cn("select-none transition-all", 
              currentItem.size === "big" ? "text-8xl scale-110" : "text-4xl scale-90"
            )}
          >
            {currentItem.emoji}
          </span>
          <span className="mt-4 text-lg font-bold font-fredoka">{currentItem.name}</span>
        </div>

        {/* Box sorting choices */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[
            { key: "small", label: "Nhỏ bé 📦", color: "bg-sky-50 text-sky-800 hover:bg-sky-100" },
            { key: "big", label: "To lớn 📦", color: "bg-amber-50 text-amber-800 hover:bg-amber-100" }
          ].map((box) => {
            const isChosen = selectedSize === box.key;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : box.color;

            return (
              <button
                key={box.key}
                onClick={() => handleBoxClick(box.key as any)}
                disabled={selectedSize !== null}
                className={cn(
                  "h-16 border-3 border-border-default rounded-2xl shadow-shadow-1 text-lg font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  btnClass
                )}
              >
                {box.label}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
