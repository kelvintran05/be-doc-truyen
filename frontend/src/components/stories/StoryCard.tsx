"use client";

import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Story } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface StoryCardProps {
  story: Story;
  isPlaying: boolean;
  onAudioToggle: (storyId: number, e: React.MouseEvent) => void;
}

export function StoryCard({ story, isPlaying, onAudioToggle }: StoryCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    card.style.boxShadow = `0 20px 40px rgba(74, 63, 53, 0.12)`;
    card.style.zIndex = "10";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.boxShadow = "";
    card.style.zIndex = "";
  };

  return (
    <div
      id={`story-${story.id}`}
      className="relative washi-card p-5 flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-300 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#FFB7C5]/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-[#8FA781]/10 blur-2xl pointer-events-none" />

      <div>
        <div
          className="aspect-[16/9] border border-[#4A3F35]/12 rounded-2xl flex items-center justify-center text-7xl mb-4 relative shadow-[0_4px_12px_rgba(74,63,53,0.03)] overflow-hidden"
          style={{ backgroundColor: story.color }}
        >
          {isPlaying && (
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 z-20 border border-white/20 shadow-lg">
              <span className="text-[9px] text-white font-bold mr-1">Đang đọc</span>
              <div className="w-[3px] bg-[#FFB7C5] rounded-full animate-wave-bar-1" style={{ height: "14px" }} />
              <div className="w-[3px] bg-[#FFB7C5] rounded-full animate-wave-bar-2" style={{ height: "10px" }} />
              <div className="w-[3px] bg-[#FFB7C5] rounded-full animate-wave-bar-3" style={{ height: "16px" }} />
              <div className="w-[3px] bg-[#FFB7C5] rounded-full animate-wave-bar-4" style={{ height: "8px" }} />
            </div>
          )}

          {story.coverImageUrl ? (
            <img src={story.coverImageUrl} className="w-full h-full object-cover" alt={story.title} />
          ) : (
            story.image
          )}

          {story.audio && (
            <button
              onClick={(e) => onAudioToggle(story.id, e)}
              className={cn(
                "absolute bottom-3 right-3 p-2 rounded-full border border-[#4A3F35]/15 shadow-[0_4px_10px_rgba(74,63,53,0.08)] cursor-pointer transition-all hover:scale-105",
                isPlaying
                  ? "bg-[#E55B5B] text-white animate-pulse"
                  : "bg-white text-surface-base hover:bg-[#FAF8F5]",
              )}
              title={isPlaying ? "Dừng nghe giọng đọc" : "Nghe sách nói"}
            >
              {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-text-secondary" />}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center gap-2 mb-2">
          <Badge variant="default" className="border-dashed border-[#4A3F35]/25" style={{ backgroundColor: `${story.badgeColor}15`, color: story.badgeColor }}>
            {story.category}
          </Badge>
          <Badge className="backdrop-blur-sm shadow-[0_2px_6px_rgba(74,63,53,0.03)]">
            👶 {story.age}
          </Badge>
        </div>

        <h3 className="font-serif text-sm md:text-base font-bold text-surface-base mb-2 hover:text-[#E55B5B] transition-colors line-clamp-1">
          {story.title}
        </h3>
        <p className="text-xs text-text-secondary font-quicksand line-clamp-3 mb-4 leading-relaxed font-semibold">
          {story.description}
        </p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#4A3F35]/15">
        <span className="text-[10px] text-text-tertiary font-bold">
          ⏱️ {story.duration} đọc
        </span>
        <a
          href={`/story/${story.id}`}
          className="inline-flex items-center gap-0.5 font-black text-xs text-[#E55B5B] hover:underline outline-none"
        >
          Đọc ngay <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
