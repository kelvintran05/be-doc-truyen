"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StoryCard } from "@/components/stories/StoryCard";
import { StoryFilters } from "@/components/stories/StoryFilters";
import { cn } from "@/lib/utils";
import { BookOpen, Volume2, VolumeX, Sparkles, ArrowRight, CheckCircle, ChevronUp } from "lucide-react";
import { decryptPayload } from "@/lib/crypto";
import { Story } from "@/lib/stories";
import { useApi } from "@/hooks/useApi";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useHashScroll } from "@/hooks/useHashScroll";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-doc-truyen.onrender.com";

export default function Home() {
  const { data: stories, isLoading } = useApi(
    "home-stories",
    () =>
      fetch(`${API_URL}/stories`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then((data) => decryptPayload<Story[]>(data.payload)),
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeAgeFilter, setActiveAgeFilter] = React.useState<string | null>(
    null,
  );
  const [playingAudioId, setPlayingAudioId] = React.useState<number | null>(
    null,
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const { showScrollTop, scrollToTop } = useScrollTop();

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (playingAudioId !== null) {
      const activeStory = storiesList.find((s) => s.id === playingAudioId);
      if (activeStory) {
        let pagesList = activeStory.pages;
        if (typeof pagesList === "string") {
          try {
            pagesList = JSON.parse(pagesList);
          } catch (e) {
            console.error("Failed to parse pages", e);
            pagesList = [];
          }
        }

        const firstPageAudio = pagesList && pagesList[0]?.audioUrl;
        if (firstPageAudio) {
          audio.src = firstPageAudio;
          audio.play().catch((err) => {
            console.error("Failed to play audio sample:", err);
          });
        } else {
          console.warn("Story has no audio url on page 1");
          audio.pause();
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }

    const handleEnded = () => {
      setPlayingAudioId(null);
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [playingAudioId, stories]);

  useHashScroll([isLoading]);

  const storiesList = stories ?? [];
  const filteredStories = storiesList.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = activeAgeFilter ? story.age === activeAgeFilter : true;
    return matchesSearch && matchesAge;
  });

  const handleAudioToggle = (storyId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedStory = storiesList.find((story) => story.id === storyId);
    if (!selectedStory || !selectedStory.audio) {
      return;
    }

    setPlayingAudioId((currentId) => (currentId === storyId ? null : storyId));
  };

  // Video fade loop state
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = React.useState(0);
  const rafRef = React.useRef<number>(0);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE_DURATION = 0.5;

    const checkTime = () => {
      if (!video.duration || isNaN(video.duration)) {
        rafRef.current = requestAnimationFrame(checkTime);
        return;
      }

      const currentTime = video.currentTime;
      const duration = video.duration;
      const timeLeft = duration - currentTime;

      if (currentTime < FADE_DURATION) {
        // Fade in at start
        setVideoOpacity(currentTime / FADE_DURATION);
      } else if (timeLeft < FADE_DURATION) {
        // Fade out before end
        setVideoOpacity(timeLeft / FADE_DURATION);
      } else {
        setVideoOpacity(1);
      }

      rafRef.current = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    rafRef.current = requestAnimationFrame(checkTime);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      {/* HERO SECTION - Aethera Style with Cinematic Video Loop */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background Video with Fade Loop */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute z-0 object-cover"
          style={{
            top: "300px",
            inset: "auto 0 0 0",
            width: "100%",
            height: "calc(100% - 300px)",
            opacity: videoOpacity,
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient Overlays on Video */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-0" />

        {/* Navbar */}
        <Navbar />

        {/* Hero Content */}
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40"
        >
          {/* Headline with mixed colors */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl font-normal font-serif leading-[1.05] tracking-[-1.5px] text-black animate-fade-rise">
            Khám Phá{" "}
            <span className="text-[#6F6F6F] italic">Thế Giới</span> Truyện
            <br />
            Cổ Tích <span className="text-[#6F6F6F] italic">Cho Bé</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay">
            Hàng trăm câu chuyện cổ tích Việt Nam và quốc tế, được kể bằng
            giọng đọc truyền cảm cùng hình ảnh minh họa sinh động, giúp bé
            phát triển trí tưởng tượng và niềm yêu thích đọc sách.
          </p>

          {/* CTA Button */}
          <button
            onClick={() =>
              document
                .getElementById("stories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-full px-14 py-5 text-base mt-12 bg-black text-white hover:scale-[1.03] transition-transform cursor-pointer animate-fade-rise-delay-2"
          >
            Bắt Đầu Đọc Truyện
          </button>
        </div>
      </section>

      <main className="flex-1 flex flex-col relative z-10">
        {/* STORIES GRID & FILTER SECTION */}
        <section
          id="stories"
          className="w-full py-16 px-space-4 md:px-space-5 max-w-6xl mx-auto flex flex-col gap-8"
        >
          <StoryFilters
            searchQuery={searchQuery}
            activeAgeFilter={activeAgeFilter}
            onSearchChange={setSearchQuery}
            onAgeFilterChange={setActiveAgeFilter}
          />

          {/* Grid Layout */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <CardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isPlaying={playingAudioId === story.id}
                  onAudioToggle={handleAudioToggle}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="Không tìm thấy truyện phù hợp"
              description="Thử đổi từ khóa hoặc bộ lọc độ tuổi khác xem sao nhé!"
              action={{
                label: "Đặt Lại Bộ Lọc",
                onClick: () => {
                  setSearchQuery("");
                  setActiveAgeFilter(null);
                },
              }}
            />
          )}
        </section>

        {/* AUDIOBOOKS FEATURES */}
        <section
          id="audiobooks"
          className="w-full bg-[#8FA781]/5 border-y border-[#4A3F35]/12 py-16 px-space-4 md:px-space-5"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-surface-base">
                🎙️ Trải nghiệm Sách Nói Sinh Động
              </h2>
              <p className="text-sm md:text-base text-text-secondary font-quicksand max-w-xl font-semibold leading-relaxed">
                Không chỉ đọc bằng mắt, các bé còn được chìm đắm trong không gian
                cổ tích với giọng đọc truyền cảm ấm áp cùng hiệu ứng âm thanh chim
                kêu, suối chảy mô tả sinh động.
              </p>

              <ul className="flex flex-col gap-4">
                {[
                  "Giọng đọc tuyển chọn chuẩn vùng miền, ấm áp cuốn hút.",
                  "Hệ thống sound effect độc quyền tạo không khí kỳ ảo.",
                  "Hỗ trợ chế độ tự tắt màn hình tiết kiệm pin.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-[#8FA781] shrink-0 mt-0.5 fill-[#8FA781]/15" />
                    <span className="font-bold text-sm text-surface-base font-quicksand">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <button
                  className={cn(
                    "px-6 py-3 text-slate-800 border rounded-full font-bold text-sm transition-all duration-300 cursor-pointer flex items-center gap-2 select-none",
                    playingAudioId === 8
                      ? "bg-[#E55B5B] border-[#D14949] text-white animate-pulse shadow-[0_4px_14px_rgba(229,91,91,0.25)]"
                      : "zen-btn-matcha shadow-[0_4px_14px_rgba(143,167,129,0.25)]",
                  )}
                  onClick={(e) => handleAudioToggle(8, e)}
                >
                  {playingAudioId === 8 ? "Dừng Nghe Thử ⏹️" : "Nghe Thử Ngay 🎙️"}
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                {
                  title: "Giọng đọc Bắc/Nam",
                  desc: "Tùy chỉnh linh hoạt",
                  bg: "#FFF5F6",
                  icon: "🎙️",
                },
                {
                  title: "Sound Effect",
                  desc: "Âm thanh thực tế sinh động",
                  bg: "#EBF3E8",
                  icon: "🎵",
                },
                {
                  title: "Tự Động Hẹn Giờ",
                  desc: "Tắt nhạc khi bé ngủ",
                  bg: "#FAF6EE",
                  icon: "⏰",
                },
                {
                  title: "An Toàn Cho Bé",
                  desc: "Hoàn toàn không quảng cáo",
                  bg: "#F0F7FF",
                  icon: "🛡️",
                },
              ].map((feature, idx) => (
                <div key={idx} className="p-5 washi-card flex flex-col gap-2">
                  <div
                    className="w-10 h-10 rounded-xl border border-[#4A3F35]/15 flex items-center justify-center text-xl shadow-[0_2px_6px_rgba(74,63,53,0.03)]"
                    style={{ backgroundColor: feature.bg }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-surface-base">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-text-secondary font-quicksand leading-tight font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full border-t border-dashed border-[#4A3F35]/20 bg-[#FCFAF5] py-16 px-space-4 md:px-space-5 font-quicksand relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
            {/* Logo & Description */}
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-2.5">
                {/* Footer Logo Icon */}
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
                    <path
                      d="M8 10C8 10 12 8 20 8C28 8 32 10 32 10V32C32 32 28 30 20 30C12 30 8 32 8 32V10Z"
                      fill="#E55B5B"
                      opacity="0.9"
                    />
                    <path
                      d="M8 10C8 10 12 8 20 8V30C12 30 8 32 8 32V10Z"
                      fill="#D14949"
                    />
                    <path
                      d="M32 10C32 10 28 8 20 8V30C28 30 32 32 32 32V10Z"
                      fill="#FF7A7A"
                    />
                    <path
                      d="M20 8V30"
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <circle cx="14" cy="18" r="2" fill="white" opacity="0.7" />
                    <circle cx="26" cy="18" r="1.5" fill="white" opacity="0.5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold text-surface-base leading-none">
                    Bé<span className="text-[#E55B5B]">Đọc</span>
                  </span>
                  <span className="text-[7px] font-black text-[#8FA781] tracking-widest uppercase font-mono mt-1 leading-none">
                    Đọc truyện cho bé
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                Ứng dụng đọc truyện tranh thiếu nhi lôi cuốn và sách nói giáo dục
                tốt nhất cho trẻ nhỏ từ 3 đến 10 tuổi.
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className="text-xs text-text-tertiary font-bold"
                  suppressHydrationWarning
                >
                  © {new Date().getFullYear()} MiniRead.
                </span>
              </div>
            </div>

            {/* Nav columns */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 font-semibold">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-surface-base font-serif leading-none">
                    Khám phá
                  </span>
                </div>
                <Link
                  href="#stories"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Truyện cho bé
                </Link>
                <Link
                  href="#audiobooks"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Sách nói chọn lọc
                </Link>
                <Link
                  href="/activities"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Khu vui chơi trí tuệ
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-surface-base font-serif leading-none">
                    Hỗ trợ
                  </span>
                </div>
                <Link
                  href="#help"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Trung tâm trợ giúp
                </Link>
                <Link
                  href="#contact"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Liên hệ hỗ trợ
                </Link>
                <Link
                  href="#terms"
                  className="text-xs text-text-secondary hover:text-[#E55B5B] transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </div>

              <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-surface-base font-serif leading-none">
                    Kết nối
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-normal">
                  Email hỗ trợ: <br />
                  <strong className="text-surface-base font-serif">
                    support@miniread.app
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Audio Player */}
      {playingAudioId !== null && (() => {
        const activeStory = storiesList.find(s => s.id === playingAudioId);
        if (!activeStory) return null;
        return (
          <div className="fixed bottom-24 right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
            <div className="glass-card rounded-3xl p-3.5 flex items-center gap-3.5 shadow-2xl border border-white/40 max-w-[280px]">
              {/* Cover image disk */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E55B5B] shadow-lg shrink-0 relative animate-spin-slow">
                {activeStory.coverImageUrl ? (
                  <img src={activeStory.coverImageUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-rose-100 text-lg">{activeStory.image}</div>
                )}
                <div className="absolute inset-0 bg-black/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#FAF6EE] rounded-full border border-[#4A3F35]/20 shadow-inner" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-serif font-black text-slate-800 truncate leading-none">
                  {activeStory.title}
                </h4>
                <span className="text-[9px] font-bold text-[#8FA781] uppercase font-mono mt-1.5 block tracking-wider leading-none">
                  Đang phát 🎙️
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleAudioToggle(activeStory.id, e)}
                  className="p-2 rounded-full bg-[#E55B5B] text-white hover:bg-[#D14949] cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                  title="Dừng nghe"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setPlayingAudioId(null)}
                  className="p-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                  title="Đóng"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 right-8 p-4 rounded-full bg-emerald-500 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] border-2 border-white/40 transition-all duration-300 z-50 hover:bg-emerald-600 hover:-translate-y-1 active:translate-y-0",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Cuộn lên đầu trang"
      >
        <ChevronUp className="w-6 h-6" strokeWidth={3} />
      </button>
    </div>
  );
}
