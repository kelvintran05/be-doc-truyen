"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface ColorItem {
  emoji: string;
  name: string;
  color: "red" | "green" | "yellow" | "blue";
}

const ITEMS_POOL: ColorItem[] = [
  { emoji: "🍎", name: "Quả táo", color: "red" },
  { emoji: "🥦", name: "Súp lơ", color: "green" },
  { emoji: "🍋", name: "Quả chanh", color: "yellow" },
  { emoji: "🐳", name: "Cá voi", color: "blue" },
  { emoji: "🍓", name: "Quả dâu", color: "red" },
  { emoji: "🐸", name: "Con ếch", color: "green" },
  { emoji: "🍌", name: "Quả chuối", color: "yellow" },
  { emoji: "🫐", name: "Quả việt quất", color: "blue" }
];

export function ColorSortGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  // Shuffle or pick from items pool
  const currentItem = ITEMS_POOL[round % ITEMS_POOL.length]!;

  const handleBucketClick = (color: "red" | "green" | "yellow" | "blue") => {
    if (selectedColor !== null) return;

    setSelectedColor(color);
    const correct = color === currentItem.color;
    setIsCorrect(correct);

    if (correct) {
      SoundManager.playCorrect();
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (round + 1 >= 4) {
          SoundManager.playWin();
          setIsGameOver(true);
        } else {
          setRound((prev) => prev + 1);
          setSelectedColor(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedColor(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedColor(null);
    setIsCorrect(null);
  };

  const buckets = [
    { key: "red", label: "Đỏ", colorClass: "bg-red-500 hover:bg-red-600 text-white" },
    { key: "green", label: "Xanh lá", colorClass: "bg-green-500 hover:bg-green-600 text-white" },
    { key: "yellow", label: "Vàng", colorClass: "bg-yellow-400 hover:bg-yellow-500 text-surface-base" },
    { key: "blue", label: "Xanh dương", colorClass: "bg-blue-500 hover:bg-blue-600 text-white" }
  ];

  return (
    <GameWrapper
      title="Phân loại màu sắc"
      prompt={`Đồ vật "${currentItem.name}" có màu gì nào?`}
      round={round}
      totalRounds={4}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Phân biệt màu sắc 🎨"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Main Item Display */}
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border-3 border-border-default rounded-radius-xs w-56 h-56 shadow-shadow-2 relative select-none animate-in zoom-in duration-300">
          <span className="text-8xl select-none">{currentItem.emoji}</span>
          <span className="mt-4 text-lg font-bold font-fredoka">{currentItem.name}</span>
        </div>

        {/* Color bins */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {buckets.map((b) => {
            const isChosen = selectedColor === b.key;
            const borderClass = isChosen
              ? isCorrect
                ? "border-green-600 bg-green-500 text-white scale-95"
                : "border-red-600 bg-red-500 text-white scale-95"
              : "border-border-default";

            return (
              <button
                key={b.key}
                onClick={() => handleBucketClick(b.key as any)}
                disabled={selectedColor !== null}
                className={cn(
                  "h-16 border-3 rounded-2xl shadow-shadow-1 text-lg font-bold font-fredoka flex items-center justify-center gap-2 active:translate-y-[2px] transition-all cursor-pointer",
                  b.colorClass,
                  borderClass
                )}
              >
                <span>
                  {b.key === "red" && "🟥"}
                  {b.key === "green" && "🟩"}
                  {b.key === "yellow" && "🟨"}
                  {b.key === "blue" && "🟦"}
                </span>
                {b.label}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
