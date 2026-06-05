"use client";

import * as React from "react";
import { SoundManager } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX, RotateCcw, ArrowRight } from "lucide-react";
import NextLink from "next/link";

interface Card {
  id: string;
  uniqueId: string;
  emoji: string;
  theme: string;
}

const MEDIA_BASE_URL = "https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images";

const GAME_CONFIG = {
  gameId: "flip-match",
  rounds: [
    { pairs: 2 },
    { pairs: 4 },
    { pairs: 6 }
  ],
  i18n: {
    vi: {
      title: "Lật & Ghép",
      prompt: "Tìm các cặp thẻ giống nhau!",
      themeLabels: {
        animals: "Động vật 🐶",
        fruits: "Trái cây 🍎",
        space: "Vũ trụ 🚀"
      },
      guidelineAudio: `${MEDIA_BASE_URL}/games/flip-match/audio/guideline-vi.mp3`
    },
    en: {
      title: "Flip & Match",
      prompt: "Find the matching card pairs!",
      themeLabels: {
        animals: "Animals 🐶",
        fruits: "Fruits 🍎",
        space: "Space 🚀"
      },
      guidelineAudio: `${MEDIA_BASE_URL}/games/flip-match/audio/guideline-en.mp3`
    }
  }
};

const ITEMS_POOL = {
  animals: ["🐶","🐱","🐰","🦊","🐻","🐼","🦁","🐮","🐷","🐸","🐵","🐔","🐨","🐹","🐙"],
  fruits: ["🍎","🍌","🍇","🍓","🍉","🍍","🥭","🍊","🍋","🥝","🍒","🥥","🍑","🥑"],
  space: ["🚀","🌟","🌙","🪐","🌍","☄️","🛸","☀️","🛰️","👽","🧑‍🚀","🌌","🔭","📡"]
};

export function FlipMatchGame() {
  const [lang] = React.useState<"vi" | "en">("vi");
  const totalRoundsCount = GAME_CONFIG.rounds.length;

  // Game States
  const [round, setRound] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [cards, setCards] = React.useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = React.useState<string[]>([]);
  const [matchedCards, setMatchedCards] = React.useState<string[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<keyof typeof ITEMS_POOL>("animals");

  // Audio Guideline States
  const guidelineAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isGuidelinePlaying, setIsGuidelinePlaying] = React.useState(false);

  // Initialize round config
  const initializeRound = React.useCallback((roundIndex: number) => {
    const roundConfig = GAME_CONFIG.rounds[Math.min(roundIndex, totalRoundsCount - 1)];
    if (!roundConfig) return;

    const themes: Array<keyof typeof ITEMS_POOL> = ["animals", "fruits", "space"];
    const selectedTheme = themes[roundIndex % themes.length] || "animals";
    setCurrentTheme(selectedTheme);

    // Shuffle and pick unique emojis
    const themePool = [...ITEMS_POOL[selectedTheme]];
    const shuffledPool = themePool.sort(() => Math.random() - 0.5);
    const chosenEmojis = shuffledPool.slice(0, roundConfig.pairs);

    // Create double cards
    const newCards: Card[] = [];
    chosenEmojis.forEach((emoji, index) => {
      const cardId = `${selectedTheme}-${index}`;
      newCards.push({
        id: cardId,
        uniqueId: `${cardId}-a`,
        emoji,
        theme: selectedTheme
      });
      newCards.push({
        id: cardId,
        uniqueId: `${cardId}-b`,
        emoji,
        theme: selectedTheme
      });
    });

    // Shuffle card deck
    setCards(newCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setIsProcessing(false);
  }, [totalRoundsCount]);

  // Audio Guideline Setup
  React.useEffect(() => {
    const audioUrl = GAME_CONFIG.i18n[lang].guidelineAudio;
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    guidelineAudioRef.current = audio;

    const onPlay = () => setIsGuidelinePlaying(true);
    const onEnded = () => setIsGuidelinePlaying(false);
    const onPause = () => setIsGuidelinePlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);

    // Try auto-play
    audio.play().catch(() => {
      // Browsers usually block autoplay, ignore error safely
    });

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      guidelineAudioRef.current = null;
    };
  }, [lang]);

  // Handle Initial round setup
  const initRef = React.useRef(false);
  React.useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      initializeRound(round);
    }
  }, [round, initializeRound]);

  const toggleGuideline = () => {
    if (!guidelineAudioRef.current) return;
    SoundManager.playButtonTap();

    if (isGuidelinePlaying) {
      guidelineAudioRef.current.pause();
      guidelineAudioRef.current.currentTime = 0;
    } else {
      guidelineAudioRef.current.currentTime = 0;
      guidelineAudioRef.current.play().catch((err) => {
        console.warn("Guideline playback failed:", err);
      });
    }
  };

  const handleRoundSuccess = () => {
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      setRound((prevRound) => {
        const nextRound = prevRound + 1;
        if (nextRound >= totalRoundsCount) {
          setTimeout(() => {
            SoundManager.playWin();
            setIsGameOver(true);
          }, 600);
        } else {
          initializeRound(nextRound);
        }
        return nextRound;
      });
      return newScore;
    });
  };

  const handleCardClick = (card: Card) => {
    if (isProcessing || matchedCards.includes(card.id) || flippedCards.includes(card.uniqueId)) return;

    // Pause guideline audio if playing
    if (guidelineAudioRef.current && isGuidelinePlaying) {
      guidelineAudioRef.current.pause();
      setIsGuidelinePlaying(false);
    }

    SoundManager.playButtonTap();

    const newFlipped = [...flippedCards, card.uniqueId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.uniqueId === firstId);
      const secondCard = cards.find((c) => c.uniqueId === secondId);

      if (firstCard && secondCard && firstCard.id === secondCard.id) {
        // Correct Match!
        setTimeout(() => {
          setMatchedCards((prev) => {
            const nextMatched = [...prev, firstCard.id];
            SoundManager.playCorrect();

            if (nextMatched.length === cards.length / 2) {
              setTimeout(() => {
                handleRoundSuccess();
              }, 800);
            }
            return nextMatched;
          });
          setFlippedCards([]);
          setIsProcessing(false);
        }, 300);
      } else {
        // Wrong Match!
        setTimeout(() => {
          SoundManager.playWrong();
          setFlippedCards([]);
          setIsProcessing(false);
        }, 850);
      }
    }
  };

  const handleRestart = () => {
    SoundManager.playButtonTap();
    setRound(0);
    setScore(0);
    setIsGameOver(false);
    initializeRound(0);
  };

  // Render Game Over Screen
  if (isGameOver) {
    const starCount = Math.round((score / totalRoundsCount) * 5);
    const i18nText = {
      vi: {
        title: "Tuyệt vời!",
        sub: "Bé đã tìm thấy tất cả các cặp thẻ!",
        replay: "Chơi lại",
        hub: "Hoạt động khác"
      },
      en: {
        title: "Great Job!",
        sub: "All card pairs matched!",
        replay: "Play Again",
        hub: "More Activities"
      }
    }[lang];

    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 text-center select-none animate-in fade-in duration-300">
        <span className="text-7xl animate-bounce">🎉</span>
        <h2 className="font-fredoka text-4xl font-bold text-surface-base">{i18nText.title}</h2>
        
        {/* Rating stars */}
        <div className="flex gap-1 text-4xl text-yellow-400 select-none">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx}>{idx < starCount ? "⭐" : "☆"}</span>
          ))}
        </div>
        
        <p className="font-quicksand text-lg font-bold text-text-secondary">{i18nText.sub}</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
          <button 
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#FCD34D] border-3 border-border-default shadow-shadow-1 text-surface-base text-lg font-bold active:translate-y-[3px] active:shadow-none hover:-translate-y-0.5 hover:shadow-shadow-2 transition-all cursor-pointer"
          >
            <RotateCcw className="h-5 w-5" /> {i18nText.replay}
          </button>
          
          <NextLink href="/activities" className="w-full">
            <button 
              className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#E0F2FE] border-3 border-border-default shadow-shadow-1 text-surface-base text-lg font-bold active:translate-y-[3px] active:shadow-none hover:-translate-y-0.5 hover:shadow-shadow-2 transition-all cursor-pointer"
            >
              🧠 {i18nText.hub}
            </button>
          </NextLink>
        </div>
      </div>
    );
  }

  const promptText = GAME_CONFIG.i18n[lang].prompt;
  const themeLabel = GAME_CONFIG.i18n[lang].themeLabels[currentTheme] || currentTheme;
  const isCompactGrid = cards.length <= 4;
  const gridLayoutClass = isCompactGrid 
    ? "grid-cols-2 max-w-[220px] sm:max-w-[280px]" 
    : "grid-cols-4 max-w-[340px] sm:max-w-[480px] md:max-w-[600px]";

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full">
      {/* CSS flip animation styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header Info */}
      <div className="flex w-full max-w-sm items-center justify-between px-2">
        <div className="flex gap-1.5 select-none">
          {Array.from({ length: totalRoundsCount }).map((_, rIdx) => (
            <div 
              key={rIdx}
              className={cn(
                "h-3.5 w-10 rounded-full border-2 border-border-default shadow-inner transition-colors",
                rIdx < round ? "bg-[#FCD34D]" : "bg-white"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-lg font-bold text-surface-base">
          <span>⭐</span>
          <span className="font-fredoka">{score}</span>
        </div>
      </div>

      {/* Guide prompt row */}
      <div className="text-center">
        <div className="flex items-center gap-2.5 justify-center">
          <p className="text-lg md:text-xl font-bold font-fredoka text-surface-base">{promptText}</p>
          {GAME_CONFIG.i18n[lang].guidelineAudio && (
            <button
              onClick={toggleGuideline}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 border-border-default bg-white shadow-shadow-1 text-surface-base hover:bg-surface-strong transition-all active:translate-y-[2px] active:shadow-none cursor-pointer",
                isGuidelinePlaying && "bg-[#FCD34D] animate-pulse"
              )}
              aria-label="Play instructions"
            >
              {isGuidelinePlaying ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
          )}
        </div>
        <span className="inline-block text-xs font-bold bg-[#FCD34D]/20 text-surface-base px-3 py-0.5 border-2 border-border-default rounded-full mt-2 shadow-shadow-1">
          {themeLabel}
        </span>
      </div>

      {/* Cards Grid */}
      <div className={cn("grid gap-3 md:gap-4 w-full justify-center items-center py-2", gridLayoutClass)}>
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.uniqueId);
          const isMatched = matchedCards.includes(card.id);

          return (
            <div 
              key={card.uniqueId}
              onClick={() => handleCardClick(card)}
              className="w-full aspect-[3/4] cursor-pointer perspective-1000 relative rounded-2xl active:translate-y-[2px] transition-transform select-none"
            >
              <div className={cn("w-full h-full relative transition-transform duration-500 transform-style-3d", (isFlipped || isMatched) && "rotate-y-180")}>
                {/* Back card (unflipped) */}
                <div className="absolute inset-0 backface-hidden rounded-2xl border-3 border-border-default bg-white shadow-shadow-1 flex items-center justify-center text-3xl select-none">
                  ⭐
                </div>
                {/* Front card (flipped/matched) */}
                <div 
                  className={cn(
                    "absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-3 border-border-default shadow-shadow-1 flex items-center justify-center text-4xl sm:text-5xl select-none",
                    isMatched ? "bg-green-50 border-green-500 text-opacity-80" : "bg-slate-50"
                  )}
                >
                  {card.emoji}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
