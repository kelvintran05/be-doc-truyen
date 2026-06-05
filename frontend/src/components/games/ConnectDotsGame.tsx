"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface Dot {
  num: number;
  x: number; // percentage
  y: number; // percentage
}

interface ShapeData {
  name: string;
  dots: Dot[];
  revealEmoji: string;
  color: string;
}

const SHAPES: ShapeData[] = [
  {
    name: "Ngôi sao",
    revealEmoji: "⭐",
    color: "stroke-yellow-400 fill-yellow-100",
    dots: [
      { num: 1, x: 50, y: 15 },
      { num: 2, x: 80, y: 80 },
      { num: 3, x: 15, y: 40 },
      { num: 4, x: 85, y: 40 },
      { num: 5, x: 20, y: 80 }
    ]
  },
  {
    name: "Quả táo",
    revealEmoji: "🍎",
    color: "stroke-red-500 fill-red-100",
    dots: [
      { num: 1, x: 50, y: 20 },
      { num: 2, x: 80, y: 30 },
      { num: 3, x: 80, y: 70 },
      { num: 4, x: 50, y: 85 },
      { num: 5, x: 20, y: 70 },
      { num: 6, x: 20, y: 30 }
    ]
  },
  {
    name: "Con thuyền",
    revealEmoji: "⛵",
    color: "stroke-blue-500 fill-blue-100",
    dots: [
      { num: 1, x: 50, y: 10 },
      { num: 2, x: 50, y: 60 },
      { num: 3, x: 85, y: 60 },
      { num: 4, x: 75, y: 85 },
      { num: 5, x: 25, y: 85 },
      { num: 6, x: 15, y: 60 }
    ]
  }
];

export function ConnectDotsGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [currentConnection, setCurrentConnection] = React.useState<number[]>([]);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const currentShape = SHAPES[round % SHAPES.length]!;

  const handleDotClick = (num: number) => {
    if (isCompleted) return;

    const nextExpectedNum = currentConnection.length + 1;
    if (num === nextExpectedNum) {
      SoundManager.playButtonTap();
      const newConnection = [...currentConnection, num];
      setCurrentConnection(newConnection);

      // Check if shape is fully connected
      if (newConnection.length === currentShape.dots.length) {
        SoundManager.playCorrect();
        setIsCompleted(true);
        setScore((prev) => prev + 1);

        setTimeout(() => {
          if (round + 1 >= 3) {
            SoundManager.playWin();
            setIsGameOver(true);
          } else {
            setRound((prev) => prev + 1);
            setCurrentConnection([]);
            setIsCompleted(false);
          }
        }, 2200);
      }
    } else {
      SoundManager.playWrong();
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setCurrentConnection([]);
    setIsCompleted(false);
  };

  // Convert points index to coordinates string for polyline
  const polylinePoints = currentConnection
    .map((num) => {
      const dot = currentShape.dots.find((d) => d.num === num);
      return dot ? `${dot.x}%,${dot.y}%` : "";
    })
    .join(" ");

  // If completed, draw a closed shape line
  const finalClosedPoints = isCompleted
    ? `${polylinePoints} ${currentShape.dots[0]!.x}%,${currentShape.dots[0]!.y}%`
    : polylinePoints;

  return (
    <GameWrapper
      title="Nối chấm sáng tạo"
      prompt={`Chạm vào các chấm từ 1 đến ${currentShape.dots.length} để vẽ hình nhé!`}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Nối chấm sáng tạo ✏️"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Draw Board */}
        <div className="relative w-full aspect-square border-3 border-border-default bg-amber-50/40 rounded-radius-xs shadow-shadow-1 select-none overflow-hidden">
          
          {/* SVG Overlay for drawing lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {currentConnection.length > 1 && (
              <polyline
                points={finalClosedPoints}
                className={cn("stroke-4 fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300", 
                  isCompleted ? currentShape.color : "stroke-[#7C3AED]"
                )}
                style={{ vectorEffect: "non-scaling-stroke" }}
              />
            )}
          </svg>

          {/* Reveal Emoji when completed */}
          {isCompleted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500 pointer-events-none select-none">
              <span className="text-8xl select-none animate-bounce">{currentShape.revealEmoji}</span>
              <span className="mt-2 text-xl font-bold font-fredoka text-[#7C3AED] bg-white border-2 border-border-default px-3 py-1 rounded-full shadow-shadow-1">
                Bé vẽ được: {currentShape.name}!
              </span>
            </div>
          )}

          {/* Dots */}
          {!isCompleted && currentShape.dots.map((dot) => {
            const isConnected = currentConnection.includes(dot.num);
            const isNext = currentConnection.length + 1 === dot.num;

            return (
              <button
                key={dot.num}
                onClick={() => handleDotClick(dot.num)}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                className={cn(
                  "absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-border-default flex items-center justify-center font-bold text-sm transition-all select-none cursor-pointer",
                  isConnected 
                    ? "bg-[#7C3AED] text-white shadow-none" 
                    : isNext 
                      ? "bg-yellow-300 scale-110 shadow-shadow-1 animate-pulse" 
                      : "bg-white text-surface-base shadow-shadow-1"
                )}
              >
                {dot.num}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
