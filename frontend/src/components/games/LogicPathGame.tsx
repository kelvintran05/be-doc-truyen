"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface PathPuzzle {
  charEmoji: string;
  targetEmoji: string;
  promptText: string;
  grid: string[][]; // 3x3 layout
  options: { label: string; isCorrect: boolean }[];
}

const PUZZLES: PathPuzzle[] = [
  {
    charEmoji: "🐱",
    targetEmoji: "🐟",
    promptText: "Hãy giúp mèo con 🐱 bò sang phải để ăn cá vàng 🐟 nhé!",
    grid: [
      ["🐱", "", "🐟"],
      ["", "🪨", ""],
      ["", "", ""]
    ],
    options: [
      { label: "Đi sang bên Phải ➡️", isCorrect: true },
      { label: "Đi xuống bên Dưới ⬇️", isCorrect: false }
    ]
  },
  {
    charEmoji: "🐵",
    targetEmoji: "🍌",
    promptText: "Hãy giúp khỉ con 🐵 trèo lên phía trên để hái chuối 🍌 nhé!",
    grid: [
      ["", "🍌", ""],
      ["", "🐵", ""],
      ["", "", ""]
    ],
    options: [
      { label: "Đi sang bên Trái ⬅️", isCorrect: false },
      { label: "Trèo lên Trên ⬆️", isCorrect: true }
    ]
  },
  {
    charEmoji: "🐢",
    targetEmoji: "🌊",
    promptText: "Hãy giúp rùa con 🐢 bò xuống dưới để bơi ra biển 🌊 nhé!",
    grid: [
      ["", "", ""],
      ["", "🐢", ""],
      ["", "🌊", ""]
    ],
    options: [
      { label: "Bò xuống Dưới ⬇️", isCorrect: true },
      { label: "Bò sang bên Phải ➡️", isCorrect: false }
    ]
  }
];

export function LogicPathGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentPuzzle = PUZZLES[round % PUZZLES.length]!;

  const handleOptionClick = (option: { label: string; isCorrect: boolean }) => {
    if (selectedLabel !== null) return;

    setSelectedLabel(option.label);
    setIsCorrect(option.isCorrect);

    if (option.isCorrect) {
      SoundManager.playCorrect();
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (round + 1 >= 3) {
          SoundManager.playWin();
          setIsGameOver(true);
        } else {
          setRound((prev) => prev + 1);
          setSelectedLabel(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedLabel(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedLabel(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Đường đi logic"
      prompt={currentPuzzle.promptText}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Định vị phương hướng 🧩"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md select-none">
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-3 gap-2 p-4 border-3 border-border-default bg-[#DCFCE7]/30 rounded-2xl w-48 h-48 select-none shadow-shadow-1">
          {currentPuzzle.grid.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={cn(
                  "border-2 border-border-default bg-white rounded-lg flex items-center justify-center text-3xl select-none font-bold shadow-sm",
                  cell === "🪨" && "bg-slate-200"
                )}
              >
                <span>{cell}</span>
              </div>
            ))
          )}
        </div>

        {/* Buttons Choice */}
        <div className="flex flex-col gap-3 w-full">
          {currentPuzzle.options.map((opt) => {
            const isChosen = selectedLabel === opt.label;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white animate-pulse"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base border-border-default";

            return (
              <button
                key={opt.label}
                onClick={() => handleOptionClick(opt)}
                disabled={selectedLabel !== null}
                className={cn(
                  "h-14 border-3 border-border-default rounded-2xl shadow-shadow-1 text-base font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  btnClass
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
