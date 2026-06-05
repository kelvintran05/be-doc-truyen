"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface AnimalItem {
  emoji: string;
  name: string;
  habitat: "sea" | "land" | "sky";
}

const ITEMS_POOL: AnimalItem[] = [
  { emoji: "🐬", name: "Cá heo", habitat: "sea" },
  { emoji: "🦁", name: "Sư tử", habitat: "land" },
  { emoji: "🦅", name: "Đại bàng", habitat: "sky" },
  { emoji: "🐙", name: "Con bạch tuộc", habitat: "sea" },
  { emoji: "🐘", name: "Con voi", habitat: "land" },
  { emoji: "🦉", name: "Con cú mèo", habitat: "sky" }
];

export function SortAnimalsGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedHabitat, setSelectedHabitat] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentItem = ITEMS_POOL[round % ITEMS_POOL.length]!;

  const handleHabitatClick = (habitat: "sea" | "land" | "sky") => {
    if (selectedHabitat !== null) return;

    setSelectedHabitat(habitat);
    const correct = habitat === currentItem.habitat;
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
          setSelectedHabitat(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedHabitat(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedHabitat(null);
    setIsCorrect(null);
  };

  const habitats = [
    { key: "sea", label: "Dưới nước 🌊", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    { key: "land", label: "Trên mặt đất 🌲", color: "bg-green-50 text-green-700 hover:bg-green-100" },
    { key: "sky", label: "Bầu trời ☁️", color: "bg-sky-50 text-sky-700 hover:bg-sky-100" }
  ];

  return (
    <GameWrapper
      title="Phân loại động vật"
      prompt={`Con vật "${currentItem.name}" sống ở môi trường nào nào?`}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Môi trường sống 🐾"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        {/* Animal Display Card */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#DCFCE7] border-3 border-border-default rounded-radius-xs w-56 h-56 shadow-shadow-2 relative select-none animate-in zoom-in duration-300">
          <span className="text-8xl select-none animate-bounce">{currentItem.emoji}</span>
          <span className="mt-4 text-lg font-bold font-fredoka">{currentItem.name}</span>
        </div>

        {/* Habitat Bins */}
        <div className="flex flex-col gap-3 w-full">
          {habitats.map((hab) => {
            const isChosen = selectedHabitat === hab.key;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : hab.color;

            return (
              <button
                key={hab.key}
                onClick={() => handleHabitatClick(hab.key as any)}
                disabled={selectedHabitat !== null}
                className={cn(
                  "h-14 border-3 border-border-default rounded-2xl shadow-shadow-1 text-base font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  btnClass
                )}
              >
                {hab.label}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
