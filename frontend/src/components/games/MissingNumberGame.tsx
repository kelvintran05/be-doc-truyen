"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface SequenceRound {
  sequence: string[]; // e.g. ["1", "2", "?", "4"]
  answer: number;
  options: number[];
}

const SEQUENCE_ROUNDS: SequenceRound[] = [
  { sequence: ["1", "2", "❓", "4", "5"], answer: 3, options: [2, 3, 4, 5] },
  { sequence: ["2", "4", "6", "❓", "10"], answer: 8, options: [7, 8, 9, 10] },
  { sequence: ["5", "10", "❓", "20", "25"], answer: 15, options: [12, 14, 15, 18] },
  { sequence: ["10", "9", "8", "❓", "6"], answer: 7, options: [5, 6, 7, 8] },
  { sequence: ["3", "6", "9", "❓", "15"], answer: 12, options: [11, 12, 13, 14] }
];

export function MissingNumberGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const currentRoundData = SEQUENCE_ROUNDS[round % SEQUENCE_ROUNDS.length]!;

  const handleOptionClick = (option: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(option);
    const correct = option === currentRoundData.answer;
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
          setSelectedOption(null);
          setIsCorrect(null);
        }
      }, 1200);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Số nào bị mất?"
      prompt="Điền số còn thiếu vào ô trống để hoàn thành dãy số nhé!"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Quy luật dãy số 🕵️"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Sequence Bubble Area */}
        <div className="flex items-center justify-center gap-2.5 p-6 bg-purple-50 border-3 border-border-default rounded-radius-xs w-full shadow-shadow-1">
          {currentRoundData.sequence.map((num, idx) => {
            const isQuestion = num === "❓";
            return (
              <div 
                key={idx}
                className={cn(
                  "w-12 h-16 sm:w-16 sm:h-20 border-3 border-border-default rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold font-fredoka shadow-shadow-1 select-none",
                  isQuestion 
                    ? selectedOption !== null
                      ? isCorrect
                        ? "bg-green-400 text-white animate-pulse"
                        : "bg-red-400 text-white animate-shake"
                      : "bg-[#FCD34D] text-surface-base"
                    : "bg-white text-surface-base"
                )}
              >
                {isQuestion && selectedOption !== null ? selectedOption : num}
              </div>
            );
          })}
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((option) => {
            const isChosen = selectedOption === option;
            const optionClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white"
                : "bg-red-400 border-red-600 text-white"
              : "bg-white hover:bg-slate-50 text-surface-base";

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={selectedOption !== null}
                className={cn(
                  "h-16 border-3 border-border-default rounded-2xl shadow-shadow-1 text-2xl font-bold font-fredoka active:translate-y-[2px] transition-all cursor-pointer",
                  optionClass
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
