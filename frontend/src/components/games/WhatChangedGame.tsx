"use client";

import * as React from "react";
import { GameWrapper } from "./GameWrapper";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface ChangedRound {
  initial: string[];
  changedIndex: number;
  changedTo: string;
}

const ROUNDS_POOL: ChangedRound[] = [
  { initial: ["🍎", "🍌", "🍉", "🍒"], changedIndex: 1, changedTo: "🍊" }, // Banana -> Orange
  { initial: ["🐶", "🐱", "🐰", "🐼"], changedIndex: 3, changedTo: "🐯" }, // Panda -> Tiger
  { initial: ["🚀", "🪐", "👽", "🛸"], changedIndex: 2, changedTo: "🧑‍🚀" }, // Alien -> Astronaut
  { initial: ["🚗", "🚲", "✈️", "🚢"], changedIndex: 0, changedTo: "🚂" }  // Car -> Train
];

export function WhatChangedGame() {
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  
  // Game states: 'memorize' (first look), 'hiding' (transition), 'guess' (spot the change), 'result' (feedback)
  const [gameState, setGameState] = React.useState<"memorize" | "hiding" | "guess" | "result">("memorize");
  const [selectedCardIdx, setSelectedCardIdx] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [countdown, setCountdown] = React.useState(3);

  const currentRoundData = ROUNDS_POOL[round % ROUNDS_POOL.length]!;

  // Countdown timer for Memorize phase
  React.useEffect(() => {
    if (gameState !== "memorize") return;
    
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Transition to Hiding state
          setGameState("hiding");
          setTimeout(() => {
            setGameState("guess");
          }, 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round, gameState]);

  const handleCardClick = (idx: number) => {
    if (gameState !== "guess") return;

    setSelectedCardIdx(idx);
    const correct = idx === currentRoundData.changedIndex;
    setIsCorrect(correct);
    setGameState("result");

    if (correct) {
      SoundManager.playCorrect();
      setScore((prev) => prev + 1);
      setTimeout(() => {
        if (round + 1 >= 3) {
          SoundManager.playWin();
          setIsGameOver(true);
        } else {
          setRound((prev) => prev + 1);
          setGameState("memorize");
          setSelectedCardIdx(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      SoundManager.playWrong();
      setTimeout(() => {
        setGameState("guess");
        setSelectedCardIdx(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    setGameState("memorize");
    setSelectedCardIdx(null);
    setIsCorrect(null);
  };

  // Build the list of cards displayed in Guess phase
  const displayCards = currentRoundData.initial.map((emoji, idx) => {
    if (idx === currentRoundData.changedIndex) {
      return currentRoundData.changedTo;
    }
    return emoji;
  });

  return (
    <GameWrapper
      title="Cái gì thay đổi?"
      prompt={
        gameState === "memorize"
          ? `Ghi nhớ các hình vẽ này thật kỹ nhé! (${countdown}s)`
          : gameState === "hiding"
            ? "Đang thay đổi các thẻ hình..."
            : "Có một hình đã thay đổi! Chạm vào hình đó đi nào!"
      }
      round={round}
      totalRounds={3}
      score={score}
      isGameOver={isGameOver}
      onRestart={handleRestart}
      infoBadge="Luyện tinh mắt 👀"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <div className="grid grid-cols-2 gap-4 w-full select-none">
          {gameState === "memorize" &&
            currentRoundData.initial.map((emoji, idx) => (
              <div
                key={idx}
                className="aspect-square border-3 border-border-default bg-white rounded-3xl flex items-center justify-center text-5xl shadow-shadow-1 animate-pulse select-none"
              >
                {emoji}
              </div>
            ))}

          {gameState === "hiding" &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square border-3 border-border-default bg-purple-500 rounded-3xl flex items-center justify-center text-5xl text-white shadow-shadow-1 select-none animate-spin"
              >
                ❓
              </div>
            ))}

          {(gameState === "guess" || gameState === "result") &&
            displayCards.map((emoji, idx) => {
              const isChosen = selectedCardIdx === idx;
              const cardClass = isChosen
                ? isCorrect
                  ? "bg-green-400 border-green-600 text-white"
                  : "bg-red-400 border-red-600 text-white animate-shake"
                : "bg-white hover:bg-slate-50 border-border-default text-surface-base";

              return (
                <div
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={cn(
                    "aspect-square border-3 rounded-3xl flex items-center justify-center text-5xl shadow-shadow-1 cursor-pointer transition-all active:translate-y-[2px]",
                    cardClass
                  )}
                >
                  {emoji}
                </div>
              );
            })}
        </div>
      </div>
    </GameWrapper>
  );
}
