"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface WeightRound {
  questionType: "heavier" | "lighter"; // con nào nặng hơn / nhẹ hơn
  leftItem: { emoji: string; name: string; weight: number };
  rightItem: { emoji: string; name: string; weight: number };
}

const ROUNDS_POOL: WeightRound[] = [
  {
    questionType: "heavier",
    leftItem: { emoji: "🐘", name: "Con Voi", weight: 5000 },
    rightItem: { emoji: "🐜", name: "Con Kiến", weight: 1 }
  },
  {
    questionType: "lighter",
    leftItem: { emoji: "🎈", name: "Quả bóng bay", weight: 2 },
    rightItem: { emoji: "🎳", name: "Quả bóng bowling", weight: 4000 }
  },
  {
    questionType: "heavier",
    leftItem: { emoji: "羽", name: "Lông vũ", weight: 1 },
    rightItem: { emoji: "🧱", name: "Viên gạch", weight: 2000 }
  }
];

export function HeavierLighterGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const leftWeight = currentRoundData.leftItem.weight;
  const rightWeight = currentRoundData.rightItem.weight;

  // Find correct answer item based on question
  const isLeftHeavier = leftWeight > rightWeight;
  const correctAnswer = currentRoundData.questionType === "heavier"
    ? isLeftHeavier ? currentRoundData.leftItem : currentRoundData.rightItem
    : isLeftHeavier ? currentRoundData.rightItem : currentRoundData.leftItem;

  const handleChoiceClick = (name: string) => {
    if (selectedName !== null) return;

    setSelectedName(name);
    const correct = name === correctAnswer.name;
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
          setSelectedName(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedName(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedName(null);
    setIsCorrect(null);
  };

  const promptText = currentRoundData.questionType === "heavier"
    ? "Con vật/đồ vật nào NẶNG HƠN?"
    : "Con vật/đồ vật nào NHẸ HƠN?";

  // Rotation angles for the balance scale beam
  const beamRotation = isLeftHeavier ? "-rotate-12" : "rotate-12";
  const leftPanTranslate = isLeftHeavier ? "translate-y-4" : "-translate-y-4";
  const rightPanTranslate = isLeftHeavier ? "-translate-y-4" : "translate-y-4";

  return (
    <GameWrapper
      title="Nặng hay nhẹ hơn?"
      prompt={promptText}
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Độ cân bằng trọng lượng ⚖️"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md select-none">
        
        {/* Animated Balance Scale Visual */}
        <div className="w-full h-48 bg-slate-50 border-3 border-border-default rounded-radius-xs shadow-shadow-1 relative flex flex-col items-center justify-end pb-4 overflow-hidden select-none">
          
          {/* Pivots & Beam */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            
            {/* Center stand */}
            <div className="w-4 h-24 bg-slate-400 border-2 border-border-default rounded-t-lg z-10" />
            <div className="w-12 h-4 bg-slate-500 border-2 border-border-default rounded-lg absolute bottom-4" />

            {/* Pivot pin */}
            <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-border-default z-20 absolute top-[4.6rem]" />

            {/* Balancing Beam */}
            <div className={cn("w-60 h-2 bg-slate-600 border-2 border-border-default rounded-full absolute top-[5.1rem] transition-transform duration-700", beamRotation)}>
              
              {/* Left Pan */}
              <div className={cn("absolute -left-4 -top-1 w-8 h-12 flex flex-col items-center justify-end transition-transform duration-700", leftPanTranslate)} style={{ transformOrigin: "top center" }}>
                <div className="w-16 h-1 border-t-2 border-slate-500 absolute top-0" />
                {/* String wires */}
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[20px] border-b-slate-400 absolute top-0" />
                {/* Pan plate */}
                <div className="w-16 h-2 bg-slate-500 border-2 border-border-default rounded-full z-10" />
                {/* Item emoji */}
                <span className="text-3xl select-none absolute bottom-2 leading-none">{currentRoundData.leftItem.emoji}</span>
              </div>

              {/* Right Pan */}
              <div className={cn("absolute -right-4 -top-1 w-8 h-12 flex flex-col items-center justify-end transition-transform duration-700", rightPanTranslate)} style={{ transformOrigin: "top center" }}>
                <div className="w-16 h-1 border-t-2 border-slate-500 absolute top-0" />
                {/* String wires */}
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[20px] border-b-slate-400 absolute top-0" />
                {/* Pan plate */}
                <div className="w-16 h-2 bg-slate-500 border-2 border-border-default rounded-full z-10" />
                {/* Item emoji */}
                <span className="text-3xl select-none absolute bottom-2 leading-none">{currentRoundData.rightItem.emoji}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Buttons Choice */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[currentRoundData.leftItem, currentRoundData.rightItem].map((item) => {
            const isChosen = selectedName === item.name;
            const buttonClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base";

            return (
              <button
                key={item.name}
                onClick={() => handleChoiceClick(item.name)}
                disabled={selectedName !== null}
                className={cn(
                  "p-3 border-3 border-border-default rounded-2xl shadow-shadow-1 flex flex-col items-center gap-1 active:translate-y-[2px] transition-all cursor-pointer",
                  buttonClass
                )}
              >
                <span className="text-4xl select-none">{item.emoji}</span>
                <span className="text-sm font-bold font-quicksand">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
