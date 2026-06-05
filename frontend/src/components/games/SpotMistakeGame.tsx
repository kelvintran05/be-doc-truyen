"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface MistakeItem {
  emoji: string;
  isMistake: boolean;
  name: string;
}

interface MistakeRound {
  sceneTitle: string;
  promptText: string;
  items: MistakeItem[];
  bgColor: string;
}

const ROUNDS_POOL: MistakeRound[] = [
  {
    sceneTitle: "Cây táo trong vườn 🌳",
    promptText: "Hình nào xuất hiện bất hợp lý trên cây táo?",
    bgColor: "bg-emerald-50",
    items: [
      { emoji: "🍎", isMistake: false, name: "Quả táo" },
      { emoji: "🍃", isMistake: false, name: "Chiếc lá" },
      { emoji: "🐠", isMistake: true, name: "Cá bơi trên cây" },
      { emoji: "🍎", isMistake: false, name: "Quả táo" }
    ]
  },
  {
    sceneTitle: "Dưới lòng đại dương 🌊",
    promptText: "Hình nào không thể bơi hay rực cháy dưới nước?",
    bgColor: "bg-blue-50",
    items: [
      { emoji: "🐙", isMistake: false, name: "Bạch tuộc" },
      { emoji: "🔥", isMistake: true, name: "Ngọn lửa dưới nước" },
      { emoji: "🐬", isMistake: false, name: "Cá heo" },
      { emoji: "🦀", isMistake: false, name: "Con cua" }
    ]
  },
  {
    sceneTitle: "Bầu trời xanh trong ☁️",
    promptText: "Con vật nào dưới đây không thể tự bay trên trời?",
    bgColor: "bg-sky-50",
    items: [
      { emoji: "🐦", isMistake: false, name: "Con chim" },
      { emoji: "🐷", isMistake: true, name: "Lợn con biết bay" },
      { emoji: "🦅", isMistake: false, name: "Đại bàng" },
      { emoji: "✈️", isMistake: false, name: "Máy bay" }
    ]
  }
];

export function SpotMistakeGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleItemClick = (item: MistakeItem) => {
    if (selectedEmoji !== null) return;

    setSelectedEmoji(item.emoji);
    const correct = item.isMistake;
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
          setSelectedEmoji(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedEmoji(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedEmoji(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Tìm điểm bất hợp lý"
      prompt={currentRoundData.promptText}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Tinh mắt & logic 🔍"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md select-none">
        
        {/* Scene Box */}
        <div className="text-center font-bold text-base text-text-secondary select-none">
          Cảnh: {currentRoundData.sceneTitle}
        </div>

        <div className={cn("grid grid-cols-2 gap-6 p-8 border-3 border-border-default rounded-radius-xs w-full shadow-shadow-2 select-none animate-in zoom-in duration-300", currentRoundData.bgColor)}>
          {currentRoundData.items.map((item, idx) => {
            const isChosen = selectedEmoji === item.emoji;
            const borderClass = isChosen
              ? isCorrect
                ? "border-green-600 bg-green-200 scale-95"
                : "border-red-600 bg-red-200 scale-95"
              : "border-border-default hover:bg-white/80 bg-white";

            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                disabled={selectedEmoji !== null}
                className={cn(
                  "aspect-square border-3 rounded-3xl flex items-center justify-center text-6xl shadow-shadow-1 cursor-pointer transition-all active:translate-y-[2px] active:shadow-none select-none",
                  borderClass
                )}
              >
                <span className="select-none">{item.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
