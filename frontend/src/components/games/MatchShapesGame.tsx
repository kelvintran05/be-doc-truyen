"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface ShapeMatchingRound {
  shadowName: string;
  shadowEmoji: string; // e.g. "⚫" (Tròn)
  options: { emoji: string; shape: string; name: string }[];
  correctShape: string;
}

const ROUNDS_POOL: ShapeMatchingRound[] = [
  {
    shadowName: "Hình Tròn",
    shadowEmoji: "⚫",
    correctShape: "circle",
    options: [
      { emoji: "⚽", shape: "circle", name: "Quả bóng" },
      { emoji: "📦", shape: "square", name: "Cái hộp" },
      { emoji: "🍕", shape: "triangle", name: "Bánh pizza" },
      { emoji: "✨", shape: "star", name: "Ngôi sao" }
    ]
  },
  {
    shadowName: "Hình Tam Giác",
    shadowEmoji: "📐",
    correctShape: "triangle",
    options: [
      { emoji: "🧱", shape: "rectangle", name: "Viên gạch" },
      { emoji: "🍉", shape: "triangle", name: "Dưa hấu" },
      { emoji: "🪙", shape: "circle", name: "Đồng xu" },
      { emoji: "🎁", shape: "square", name: "Hộp quà" }
    ]
  },
  {
    shadowName: "Hình Ngôi Sao",
    shadowEmoji: "⭐",
    correctShape: "star",
    options: [
      { emoji: "🍩", shape: "circle", name: "Bánh donut" },
      { emoji: "🥪", shape: "triangle", name: "Bánh mì kẹp" },
      { emoji: "⭐", shape: "star", name: "Sao nhỏ" },
      { emoji: "🎲", shape: "square", name: "Xúc xắc" }
    ]
  },
  {
    shadowName: "Hình Vuông",
    shadowEmoji: "⬛",
    correctShape: "square",
    options: [
      { emoji: "🍕", shape: "triangle", name: "Pizza" },
      { emoji: "🪟", shape: "square", name: "Cửa sổ" },
      { emoji: "🏀", shape: "circle", name: "Quả bóng rổ" },
      { emoji: "🎨", shape: "palette", name: "Bảng màu" }
    ]
  }
];

export function MatchShapesGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedShape, setSelectedShape] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleOptionClick = (shape: string) => {
    if (selectedShape !== null) return;

    setSelectedShape(shape);
    const correct = shape === currentRoundData.correctShape;
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
          setSelectedShape(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedShape(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedShape(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Ghép hình bóng"
      prompt={`Vật nào dưới đây khớp với bóng "${currentRoundData.shadowName}"?`}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Nhận biết hình khối 🔷"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Silhouette Center Block */}
        <div className="flex flex-col items-center justify-center p-6 bg-sky-50 border-3 border-border-default rounded-radius-xs w-full shadow-shadow-1 min-h-[160px] relative">
          <span className="text-8xl text-slate-700/40 select-none drop-shadow-sm select-none">
            {currentRoundData.shadowEmoji}
          </span>
          <span className="mt-2 text-sm font-bold bg-[#E0F2FE] border-2 border-border-default px-3 py-0.5 rounded-full">
            {currentRoundData.shadowName}
          </span>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((opt) => {
            const isChosen = selectedShape === opt.shape;
            const optionClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base";

            return (
              <button
                key={opt.emoji}
                onClick={() => handleOptionClick(opt.shape)}
                disabled={selectedShape !== null}
                className={cn(
                  "p-4 border-3 border-border-default rounded-2xl shadow-shadow-1 flex flex-col items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer",
                  optionClass
                )}
              >
                <span className="text-4xl select-none">{opt.emoji}</span>
                <span className="text-sm font-bold font-quicksand">{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
