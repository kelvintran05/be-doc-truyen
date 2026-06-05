"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface SequenceRound {
  promptText: string;
  steps: string[];
  options: { emoji: string; name: string; isCorrect: boolean }[];
}

const ROUNDS_POOL: SequenceRound[] = [
  {
    promptText: "Vòng đời của bông hoa:",
    steps: ["🌱 (Hạt mầm)", "🌿 (Cây con)", "❓"],
    options: [
      { emoji: "🌸", name: "Nở hoa", isCorrect: true },
      { emoji: "🍂", name: "Lá rụng", isCorrect: false },
      { emoji: "🍎", name: "Quả táo", isCorrect: false },
      { emoji: "🪵", name: "Khúc gỗ", isCorrect: false }
    ]
  },
  {
    promptText: "Gà con lớn lên:",
    steps: ["🥚 (Trứng)", "🐣 (Nở)", "❓"],
    options: [
      { emoji: "🐔", name: "Gà mái", isCorrect: true },
      { emoji: "🦆", name: "Con vịt", isCorrect: false },
      { emoji: "🦅", name: "Đại bàng", isCorrect: false },
      { emoji: "🕊️", name: "Bồ câu", isCorrect: false }
    ]
  },
  {
    promptText: "Làm bánh mì kẹp:",
    steps: ["🍞 (Bánh mì)", "🧀 (Thêm phô mai)", "❓"],
    options: [
      { emoji: "🥪", name: "Bánh kẹp hoàn thành", isCorrect: true },
      { emoji: "🥣", name: "Bát súp", isCorrect: false },
      { emoji: "🍕", name: "Bánh pizza", isCorrect: false },
      { emoji: "🍩", name: "Bánh donut", isCorrect: false }
    ]
  }
];

export function WhatComesNextGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedEmoji, setSelectedEmoji] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const handleOptionClick = (option: { emoji: string; isCorrect: boolean }) => {
    if (selectedEmoji !== null) return;

    setSelectedEmoji(option.emoji);
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
      title="Diễn biến tiếp theo"
      prompt="Quan sát quy luật sự kiện và chọn hình ảnh tiếp theo nhé!"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Tư duy logic 📖"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Prompt Header */}
        <p className="text-base font-bold text-text-secondary select-none">
          {currentRoundData.promptText}
        </p>

        {/* Steps Flow */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-4 bg-emerald-50/50 border-3 border-border-default rounded-radius-xs w-full shadow-shadow-1">
          {currentRoundData.steps.map((step, idx) => {
            const isQuestion = step === "❓";
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-xl sm:text-2xl text-slate-400 font-bold select-none">➡️</span>}
                <div 
                  className={cn(
                    "px-3 py-4 sm:px-4 sm:py-6 border-3 border-border-default rounded-2xl flex flex-col items-center justify-center text-center font-bold font-quicksand text-xs sm:text-sm shadow-shadow-1 min-w-[70px] sm:min-w-[90px] select-none",
                    isQuestion
                      ? selectedEmoji !== null
                        ? isCorrect
                          ? "bg-green-400 text-white animate-pulse"
                          : "bg-red-400 text-white"
                        : "bg-[#FCD34D] text-surface-base"
                      : "bg-white text-surface-base"
                  )}
                >
                  {isQuestion && selectedEmoji !== null ? (
                    <span className="text-3xl select-none">{selectedEmoji}</span>
                  ) : isQuestion ? (
                    <span className="text-3xl select-none">❓</span>
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((opt) => {
            const isChosen = selectedEmoji === opt.emoji;
            const optionClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base";

            return (
              <button
                key={opt.emoji}
                onClick={() => handleOptionClick(opt)}
                disabled={selectedEmoji !== null}
                className={cn(
                  "p-3 border-3 border-border-default rounded-2xl shadow-shadow-1 flex flex-col items-center gap-1 active:translate-y-[2px] transition-all cursor-pointer",
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
