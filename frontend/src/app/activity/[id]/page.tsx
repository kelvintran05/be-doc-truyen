"use client";

import * as React from "react";
import { use } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { ArrowLeft, Gamepad } from "lucide-react";
import { cn } from "@/lib/utils";

// Import all games
import { FlipMatchGame } from "@/components/games/FlipMatchGame";
import { NumberMatchGame } from "@/components/games/NumberMatchGame";
import { MissingNumberGame } from "@/components/games/MissingNumberGame";
import { MatchShapesGame } from "@/components/games/MatchShapesGame";
import { WhatChangedGame } from "@/components/games/WhatChangedGame";
import { BiggerNumberGame } from "@/components/games/BiggerNumberGame";
import { ColorSortGame } from "@/components/games/ColorSortGame";
import { SameOrDifferentGame } from "@/components/games/SameOrDifferentGame";
import { ConnectDotsGame } from "@/components/games/ConnectDotsGame";
import { SortBigSmallGame } from "@/components/games/SortBigSmallGame";
import { SortAnimalsGame } from "@/components/games/SortAnimalsGame";
import { WhatComesNextGame } from "@/components/games/WhatComesNextGame";
import { HeavierLighterGame } from "@/components/games/HeavierLighterGame";
import { FirstLetterGame } from "@/components/games/FirstLetterGame";
import { MiniPianoGame } from "@/components/games/MiniPianoGame";
import { AnimalSoundGame } from "@/components/games/AnimalSoundGame";
import { SpotMistakeGame } from "@/components/games/SpotMistakeGame";
import { ChessAdventureGame } from "@/components/games/ChessAdventureGame";
import { LogicPathGame } from "@/components/games/LogicPathGame";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default function DynamicActivityPage({ params }: ActivityPageProps) {
  const { id } = use(params);

  // Map each game id to its component
  const getGameComponent = () => {
    switch (id) {
      case "flip-match":
        return <FlipMatchGame />;
      case "number-match":
        return <NumberMatchGame />;
      case "missing-number":
        return <MissingNumberGame />;
      case "match-shapes":
        return <MatchShapesGame />;
      case "what-changed":
        return <WhatChangedGame />;
      case "bigger-number":
        return <BiggerNumberGame />;
      case "color-sort":
        return <ColorSortGame />;
      case "same-or-different":
        return <SameOrDifferentGame />;
      case "connect-dots":
        return <ConnectDotsGame />;
      case "sort-big-small":
        return <SortBigSmallGame />;
      case "sort-animals":
        return <SortAnimalsGame />;
      case "what-comes-next":
        return <WhatComesNextGame />;
      case "heavier-lighter":
        return <HeavierLighterGame />;
      case "first-letter":
        return <FirstLetterGame />;
      case "mini-piano":
        return <MiniPianoGame />;
      case "animal-sound":
        return <AnimalSoundGame />;
      case "spot-mistake":
        return <SpotMistakeGame />;
      case "chess-adventure":
        return <ChessAdventureGame />;
      case "logic-path":
        return <LogicPathGame />;
      default:
        return null;
    }
  };

  const gameComponent = getGameComponent();

  if (gameComponent) {
    // Choose theme colors based on game category for nice Neobrutalist layouts
    let themeBg = "bg-[#F0FDFA]"; // teal
    let themeText = "text-[#0D9488]";
    
    if (id === "mini-piano" || id === "animal-sound") {
      themeBg = "bg-[#FDF2F8]"; // pink
      themeText = "text-[#DB2777]";
    } else if (id === "number-match" || id === "missing-number" || id === "bigger-number") {
      themeBg = "bg-[#FFFBEB]"; // amber
      themeText = "text-[#D97706]";
    } else if (id === "match-shapes" || id === "color-sort" || id === "same-or-different") {
      themeBg = "bg-[#F0F9FF]"; // sky
      themeText = "text-[#0284C7]";
    } else if (id === "connect-dots") {
      themeBg = "bg-[#FEF2F2]"; // red
      themeText = "text-[#DC2626]";
    } else if (id === "sort-big-small" || id === "sort-animals" || id === "what-comes-next" || id === "heavier-lighter" || id === "spot-mistake" || id === "logic-path") {
      themeBg = "bg-[#F0FDF4]"; // green
      themeText = "text-[#16A34A]";
    }

    return (
      <div className={cn("flex flex-col min-h-screen", themeBg)}>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white border-3 border-border-default rounded-radius-xs p-4 md:p-8 shadow-shadow-2 relative overflow-hidden my-6">
            <div className="absolute top-2 right-2 w-8 h-8 bg-black/5 rounded-full border border-black/10 pointer-events-none select-none" />
            
            {/* Back button */}
            <div className="mb-4">
              <NextLink href="/activities" className={cn("inline-flex items-center gap-1 font-bold text-sm hover:underline", themeText)}>
                <ArrowLeft className="h-4 w-4" /> Quay lại khu vui chơi
              </NextLink>
            </div>
            
            {gameComponent}
          </div>
        </main>
      </div>
    );
  }

  // Fallback / Coming Soon page for other activities
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-strong">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto gap-6">
        <span className="text-8xl select-none animate-bounce">🚧</span>
        <h1 className="font-serif text-2xl font-bold">Học Viện Đang Xây Dựng</h1>
        <p className="font-quicksand text-text-secondary text-base font-semibold">
          Trò chơi bạn tìm kiếm hiện đang được các kỹ sư BéĐọc xây dựng và thử nghiệm. Vui lòng quay lại sau nhé bé yêu!
        </p>
        <NextLink href="/activities">
          <Button variant="primary" className="px-6 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] gap-1 shadow-shadow-2 text-white">
            <Gamepad className="h-5 w-5" /> Trở Về Khu Vui Chơi
          </Button>
        </NextLink>
      </main>
    </div>
  );
}

