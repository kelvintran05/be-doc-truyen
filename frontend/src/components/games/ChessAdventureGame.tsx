"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface ChessPuzzle {
  pieceName: string;
  pieceSymbol: string;
  question: string;
  grid: { symbol: string; active: boolean }[][];
  options: { label: string; isCorrect: boolean }[];
}

const PUZZLES: ChessPuzzle[] = [
  {
    pieceName: "Quân Xe (Rook)",
    pieceSymbol: "♜",
    question: "Quân Xe ♜ đi thẳng. Đâu là đường đi của Xe để ăn Ngôi Sao ⭐?",
    grid: [
      [{ symbol: "", active: false }, { symbol: "⭐", active: true }, { symbol: "", active: false }],
      [{ symbol: "", active: false }, { symbol: "♜", active: false }, { symbol: "", active: false }],
      [{ symbol: "", active: false }, { symbol: "", active: false }, { symbol: "", active: false }]
    ],
    options: [
      { label: "Đi thẳng lên trên ⬆️", isCorrect: true },
      { label: "Đi chéo sang phải ↗️", isCorrect: false }
    ]
  },
  {
    pieceName: "Quân Tượng (Bishop)",
    pieceSymbol: "♝",
    question: "Quân Tượng ♝ đi chéo. Đâu là đường đi của Tượng để ăn Ngôi Sao ⭐?",
    grid: [
      [{ symbol: "", active: false }, { symbol: "", active: false }, { symbol: "⭐", active: true }],
      [{ symbol: "", active: false }, { symbol: "♝", active: false }, { symbol: "", active: false }],
      [{ symbol: "", active: false }, { symbol: "", active: false }, { symbol: "", active: false }]
    ],
    options: [
      { label: "Đi thẳng sang phải ➡️", isCorrect: false },
      { label: "Đi chéo lên trên ↗️", isCorrect: true }
    ]
  },
  {
    pieceName: "Quân Mã (Knight)",
    pieceSymbol: "♞",
    question: "Quân Mã ♞ di chuyển theo hình chữ L. Quân Mã đi hướng nào để ăn Ngôi Sao ⭐?",
    grid: [
      [{ symbol: "⭐", active: true }, { symbol: "", active: false }, { symbol: "", active: false }],
      [{ symbol: "", active: false }, { symbol: "", active: false }, { symbol: "", active: false }],
      [{ symbol: "", active: false }, { symbol: "♞", active: false }, { symbol: "", active: false }]
    ],
    options: [
      { label: "Đi thẳng 2 ô rồi rẽ ngang (Hình chữ L) 🐴", isCorrect: true },
      { label: "Đi chéo thẳng một mạch ↗️", isCorrect: false }
    ]
  }
];

export function ChessAdventureGame() {
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
      title="Phiêu lưu Cờ vua"
      prompt={currentPuzzle.question}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge={`${currentPuzzle.pieceName} ♟️`}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md select-none">
        
        {/* Chessboard 3x3 */}
        <div className="grid grid-cols-3 border-4 border-slate-700 bg-amber-100 rounded-xl overflow-hidden shadow-shadow-2 w-48 h-48 select-none">
          {currentPuzzle.grid.map((row, rIdx) => 
            row.map((cell, cIdx) => {
              const isDark = (rIdx + cIdx) % 2 === 1;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={cn(
                    "flex items-center justify-center text-4xl select-none font-bold",
                    isDark ? "bg-[#B45309]/10" : "bg-white"
                  )}
                >
                  <span className={cn(cell.symbol === "⭐" && "animate-pulse")}>
                    {cell.symbol}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full">
          {currentPuzzle.options.map((opt) => {
            const isChosen = selectedLabel === opt.label;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base border-border-default";

            return (
              <button
                key={opt.label}
                onClick={() => handleOptionClick(opt)}
                disabled={selectedLabel !== null}
                className={cn(
                  "h-14 border-3 border-border-default rounded-2xl shadow-shadow-1 text-sm font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
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
