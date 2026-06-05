"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";

interface SoundRound {
  animalType: "dog" | "cat" | "bird" | "cow";
  options: { emoji: string; name: string; type: string }[];
}

const ROUNDS_POOL: SoundRound[] = [
  {
    animalType: "bird",
    options: [
      { emoji: "🐦", name: "Con Chim", type: "bird" },
      { emoji: "🐱", name: "Con Mèo", type: "cat" },
      { emoji: "🐶", name: "Con Chó", type: "dog" },
      { emoji: "🐮", name: "Con Bò", type: "cow" }
    ]
  },
  {
    animalType: "dog",
    options: [
      { emoji: "🐮", name: "Con Bò", type: "cow" },
      { emoji: "🐶", name: "Con Chó", type: "dog" },
      { emoji: "🐦", name: "Con Chim", type: "bird" },
      { emoji: "🐱", name: "Con Mèo", type: "cat" }
    ]
  },
  {
    animalType: "cat",
    options: [
      { emoji: "🐱", name: "Con Mèo", type: "cat" },
      { emoji: "🐶", name: "Con Chó", type: "dog" },
      { emoji: "🐮", name: "Con Bò", type: "cow" },
      { emoji: "🐦", name: "Con Chim", type: "bird" }
    ]
  },
  {
    animalType: "cow",
    options: [
      { emoji: "🐶", name: "Con Chó", type: "dog" },
      { emoji: "🐦", name: "Con Chim", type: "bird" },
      { emoji: "🐮", name: "Con Bò", type: "cow" },
      { emoji: "🐱", name: "Con Mèo", type: "cat" }
    ]
  }
];

export function AnimalSoundGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [selectedAnimal, setSelectedAnimal] = React.useState<string | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isPlayingSound, setIsPlayingSound] = React.useState(false);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  const playCurrentSound = React.useCallback(() => {
    setIsPlayingSound(true);
    SoundManager.playAnimalCall(currentRoundData.animalType);
    setTimeout(() => {
      setIsPlayingSound(false);
    }, 1000);
  }, [currentRoundData]);

  // Autoplay sound on round start
  React.useEffect(() => {
    if (!isGameOver) {
      const timer = setTimeout(() => {
        playCurrentSound();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [round, isGameOver, playCurrentSound]);

  const handleAnimalClick = (type: string) => {
    if (selectedAnimal !== null) return;

    setSelectedAnimal(type);
    const correct = type === currentRoundData.animalType;
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
          setSelectedAnimal(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setSelectedAnimal(null);
        setIsCorrect(null);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setSelectedAnimal(null);
    setIsCorrect(null);
  };

  return (
    <GameWrapper
      title="Tiếng của con gì?"
      prompt="Lắng nghe âm thanh và đoán xem đó là tiếng kêu của con vật nào nhé!"
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Đoán âm thanh động vật 🐶"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md select-none">
        
        {/* Play Sound Button */}
        <button
          onClick={playCurrentSound}
          disabled={isPlayingSound}
          className={cn(
            "w-44 h-44 rounded-full border-4 border-border-default shadow-shadow-2 flex flex-col items-center justify-center gap-3 bg-pink-100 hover:bg-pink-200 active:translate-y-[4px] active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer",
            isPlayingSound && "bg-yellow-200 animate-pulse border-yellow-500"
          )}
        >
          <Volume2 className="h-16 w-16 text-[#7C3AED]" />
          <span className="text-sm font-bold font-fredoka text-slate-800">
            {isPlayingSound ? "Đang kêu..." : "Nghe tiếng kêu"}
          </span>
        </button>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentRoundData.options.map((opt) => {
            const isChosen = selectedAnimal === opt.type;
            const btnClass = isChosen
              ? isCorrect
                ? "bg-green-400 border-green-600 text-white animate-pulse"
                : "bg-red-400 border-red-600 text-white animate-shake"
              : "bg-white hover:bg-slate-50 text-surface-base border-border-default";

            return (
              <button
                key={opt.type}
                onClick={() => handleAnimalClick(opt.type)}
                disabled={selectedAnimal !== null}
                className={cn(
                  "p-4 border-3 rounded-2xl shadow-shadow-1 flex flex-col items-center gap-2 active:translate-y-[2px] transition-all cursor-pointer",
                  btnClass
                )}
              >
                <span className="text-5xl select-none">{opt.emoji}</span>
                <span className="text-sm font-bold font-quicksand">{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
