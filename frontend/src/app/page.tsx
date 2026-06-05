"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import {
  Search,
  BookOpen,
  Volume2,
  VolumeX,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ChevronUp,
} from "lucide-react";
import { decryptPayload } from "@/lib/crypto";
import { Story } from "@/lib/stories";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [stories, setStories] = React.useState<Story[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeAgeFilter, setActiveAgeFilter] = React.useState<string | null>(
    null,
  );
  const [playingAudioId, setPlayingAudioId] = React.useState<number | null>(
    null,
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Floating Sakura Petals state (initialized empty to prevent hydration mismatch)
  const [sakuraPetals, setSakuraPetals] = React.useState<
    {
      id: number;
      left: number;
      duration: number;
      delay: number;
      size: number;
      rotation: number;
    }[]
  >([]);

  React.useEffect(() => {
    setSakuraPetals(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: Math.random() * 8 + 8, // 8s to 16s
        delay: Math.random() * -12, // starts immediately
        size: Math.random() * 12 + 10, // 10px to 22px
        rotation: Math.random() * 360,
      })),
    );
  }, []);

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (playingAudioId !== null) {
      const activeStory = stories.find((s) => s.id === playingAudioId);
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

  React.useEffect(() => {
    fetch(`${API_URL}/stories`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        const decrypted = decryptPayload<Story[]>(data.payload);
        setStories(decrypted);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load stories:", err);
        setIsLoading(false);
      });
  }, []);

  // Xử lý scroll về đúng truyện vừa đọc khi quay lại từ trang khác
  React.useEffect(() => {
    if (!isLoading && typeof window !== "undefined" && window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash.substring(1);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [isLoading]);

  // Hiện nút scroll-to-top khi cuộn xuống
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = activeAgeFilter ? story.age === activeAgeFilter : true;
    return matchesSearch && matchesAge;
  });

  const handleAudioToggle = (storyId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedStory = stories.find((story) => story.id === storyId);
    if (!selectedStory || !selectedStory.audio) {
      return;
    }

    setPlayingAudioId((currentId) => (currentId === storyId ? null : storyId));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
      <Navbar />

      {/* Floating Sakura Petals Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {sakuraPetals.map((petal) => (
          <span
            key={petal.id}
            className="absolute text-rose-300/40 pointer-events-none select-none animate-sakura-fall z-0"
            style={{
              left: `${petal.left}%`,
              animationDuration: `${petal.duration}s`,
              animationDelay: `${petal.delay}s`,
              fontSize: `${petal.size}px`,
              transform: `rotate(${petal.rotation}deg)`,
            }}
          >
            🌸
          </span>
        ))}
      </div>

      <main className="flex-1 flex flex-col relative z-10">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 md:py-28 px-space-4 md:px-space-5 bg-pastel-surface border-b border-[#4A3F35]/12 overflow-hidden">
          {/* Decorative glowing elements and background elements */}
          <div className="absolute top-8 left-8 w-24 h-24 rounded-full bg-[#FFB7C5]/12 blur-2xl animate-float pointer-events-none hidden md:block" />
          <div className="absolute top-24 right-16 w-32 h-32 rounded-full bg-[#8FA781]/12 blur-2xl animate-float-slow pointer-events-none hidden md:block" />
          <div className="absolute bottom-14 left-16 w-28 h-28 rounded-full bg-[#FFB7C5]/12 blur-2xl animate-float pointer-events-none hidden md:block" />
          {/* Soft big sun glow behind the book fan */}
          <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] rounded-full bg-[#E55B5B]/3 blur-[120px] pointer-events-none select-none" />

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB7C5]/15 border border-[#4A3F35]/15 font-black text-sm text-[#E55B5B] shadow-[0_2px_8px_rgba(229,91,91,0.08)]">
                <Sparkles className="h-4 w-4 fill-current" />
                Kho Truyện Đọc Tranh Cho Bé Của Nhật 🌸
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold text-[#8FA781] tracking-widest uppercase mb-2 text-center lg:text-left">
                  おはなしえほん 🌸 BÉ ĐỌC JAPANESE STORYBOOK
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight text-surface-base leading-[1.2] text-center lg:text-left">
                  Đọc truyện tranh sinh động <br />
                  <span className="text-[#E55B5B] underline decoration-[#FFB7C5] decoration-wavy decoration-3 underline-offset-4">
                    Cùng con mỗi ngày
                  </span>
                </h1>
              </div>

              <p className="text-sm md:text-base text-text-secondary font-medium font-quicksand max-w-xl leading-relaxed font-semibold">
                Giúp bé phát triển ngôn ngữ, tư duy sáng tạo thông qua hàng trăm
                câu chuyện tranh cổ tích sinh động và sách nói có giọng đọc
                truyền cảm xúc đậm chất Ghibli.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
                <button
                  className="w-full sm:w-auto px-8 py-3.5 zen-btn-sakura text-sm cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(229,91,91,0.2)] hover:scale-102 active:scale-98"
                  onClick={() =>
                    document
                      .getElementById("stories")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Đọc Truyện Miễn Phí <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="w-full sm:w-auto px-8 py-3.5 zen-btn-white text-sm cursor-pointer text-slate-700 shadow-[0_4px_14px_rgba(74,63,53,0.04)] hover:scale-102 active:scale-98"
                  onClick={() =>
                    document
                      .getElementById("audiobooks")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Tìm Hiểu Sách Nói
                </button>
              </div>
            </div>

            {/* LARGE HERO SHOWCASE BANNER - Stacked 3D Storybooks Fan */}
            <div className="flex-1 w-full flex justify-center lg:justify-end relative mt-10 lg:mt-0 select-none">
              <div className="relative w-full max-w-[500px] h-[360px] md:h-[420px] flex items-center justify-center">
                {/* Decorative Sun Glow behind the books */}
                <div className="absolute w-[280px] h-[280px] rounded-full bg-[#E55B5B]/6 blur-3xl pointer-events-none" />

                {/* Book 1 (Left Fan) */}
                <div className="absolute left-[5%] bottom-[10%] z-10 hidden sm:block animate-float-left-book">
                  <div className="w-[190px] md:w-[220px] bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[24px] p-3 shadow-[0_10px_25px_rgba(74,63,53,0.06)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(74,63,53,0.1)] transition-all duration-500 cursor-pointer">
                    <div className="aspect-[16/9] w-full bg-slate-50 border border-[#4A3F35]/12 rounded-[18px] overflow-hidden mb-3">
                      <img
                        src={`${API_URL}/cdn/images/story1_cover.png`}
                        className="w-full h-full object-cover"
                        alt="Truyện cổ tích"
                      />
                    </div>
                    <span className="px-2 py-0.5 rounded-full border border-dashed border-[#4A3F35]/25 text-[8px] font-black bg-[#EBF3E8] text-[#5C7050] uppercase leading-none">
                      Dân Gian
                    </span>
                    <h4 className="font-serif text-[11px] font-bold text-slate-800 mt-2 truncate">
                      Trí Khôn Của Ta Đây
                    </h4>
                    <p className="text-[9px] text-text-tertiary mt-1 font-mono">
                      BÉĐỌC CLASSIC
                    </p>
                  </div>
                </div>

                {/* Book 2 (Right Fan) */}
                <div className="absolute right-[5%] bottom-[10%] z-10 hidden sm:block animate-float-right-book">
                  <div className="w-[190px] md:w-[220px] bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[24px] p-3 shadow-[0_10px_25px_rgba(74,63,53,0.06)] hover:scale-105 hover:shadow-[0_15px_30px_rgba(74,63,53,0.1)] transition-all duration-500 cursor-pointer">
                    <div className="aspect-[16/9] w-full bg-slate-50 border border-[#4A3F35]/12 rounded-[18px] overflow-hidden mb-3">
                      <img
                        src="https://qcvgbhxfszxthfygjedh.supabase.co/storage/v1/object/public/story-builder-images/stories/f0d34fdd-3a71-457c-8f80-147a50eed2f8/images/page-1.webp"
                        className="w-full h-full object-cover"
                        alt="Thỏ và Rùa"
                      />
                    </div>
                    <span className="px-2 py-0.5 rounded-full border border-dashed border-[#4A3F35]/25 text-[8px] font-black bg-[#FFF5F6] text-[#E55B5B] uppercase leading-none">
                      Ngụ Ngôn
                    </span>
                    <h4 className="font-serif text-[11px] font-bold text-slate-800 mt-2 truncate">
                      Chú Thỏ Thông Minh
                    </h4>
                    <p className="text-[9px] text-text-tertiary mt-1 font-mono">
                      BÉĐỌC ADVENTURE
                    </p>
                  </div>
                </div>

                {/* Book 3 (Center Main Featured Book) */}
                <div className="absolute bottom-[5%] z-25 animate-float-center-book">
                  <div className="w-[240px] md:w-[270px] bg-[#FFFDFC] border border-[#4A3F35]/15 rounded-[32px] p-4.5 shadow-[0_20px_50px_rgba(74,63,53,0.12)] hover:scale-[1.04] hover:-translate-y-2 transition-all duration-500 group">
                    <div className="aspect-[16/9] w-full bg-[#FCFAF5] border border-[#4A3F35]/15 rounded-[24px] flex items-center justify-center shadow-[0_4px_12px_rgba(74,63,53,0.04)] relative overflow-hidden mb-4">
                      <img
                        src={`${API_URL}/cdn/images/story8_cover.png`}
                        className="w-full h-full object-cover"
                        alt="Sự Tích Hồ Gươm"
                      />
                      <div className="absolute top-2.5 right-2.5 hanko-seal text-[8px] px-2.5 py-0.5 font-sans uppercase tracking-wider">
                        HOT 🌸
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-1.5">
                      <span className="px-2 py-0.5 rounded-full border border-dashed border-[#4A3F35]/25 text-[8px] font-black bg-[#EBF3E8] text-[#5C7050] uppercase leading-none">
                        Cổ Tích Việt Nam
                      </span>
                      <div className="flex items-center gap-0.5 text-[9px] font-black text-yellow-600 bg-white border border-[#4A3F35]/15 px-2 py-0.5 rounded-full">
                        ★ 4.8
                      </div>
                    </div>

                    <h3 className="font-serif text-sm md:text-base font-bold text-surface-base mb-1">
                      Sự Tích Hồ Gươm
                    </h3>
                    <p className="text-[10px] text-text-secondary font-quicksand mb-4 leading-relaxed font-semibold line-clamp-2">
                      Truyền thuyết Rùa Vàng đòi gươm thần giúp vua Lê Lợi dẹp
                      loạn...
                    </p>
                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-[#4A3F35]/10">
                      <span className="text-[9px] font-bold text-text-tertiary">
                        ⏱️ 10 phút đọc
                      </span>
                      <NextLink href="/story/8">
                        <button className="px-4 py-1.5 zen-btn-sakura text-[10px] cursor-pointer shadow-[0_2px_8px_rgba(229,91,91,0.15)]">
                          Đọc Ngay
                        </button>
                      </NextLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      {/* STORIES GRID & FILTER SECTION */}
      <section
        id="stories"
        className="w-full py-16 px-space-4 md:px-space-5 max-w-6xl mx-auto flex flex-col gap-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#4A3F35]/12 pb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-surface-base flex items-center gap-2 justify-center md:justify-start">
              📚 Truyện Hay Cho Bé
            </h2>
            <p className="text-xs md:text-sm text-text-secondary font-quicksand mt-1 font-semibold">
              Lọc truyện theo độ tuổi và từ khóa để tìm bài đọc phù hợp cho con
              yêu
            </p>
          </div>

          {/* Search Input (Allowed 1 per page constraint) */}
          <div className="w-full max-w-xs relative">
            <Input
              type="text"
              placeholder="Tìm tên truyện, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 cute-input text-xs"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E55B5B]" />
          </div>
        </div>

        {/* Age Filters */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <button
            onClick={() => setActiveAgeFilter(null)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer shadow-[0_4px_10px_rgba(74,63,53,0.04)]",
              !activeAgeFilter ? "zen-btn-sakura" : "zen-btn-white",
            )}
          >
            Tất Cả Độ Tuổi
          </button>
          {["3-5 tuổi", "4-7 tuổi", "6-8 tuổi", "7-10 tuổi"].map((age) => (
            <button
              key={age}
              onClick={() => setActiveAgeFilter(age)}
              className={cn(
                "px-4 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer shadow-[0_4px_10px_rgba(74,63,53,0.04)]",
                activeAgeFilter === age ? "zen-btn-matcha" : "zen-btn-white",
              )}
            >
              {age}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-[#4A3F35]/12 rounded-[28px] p-5 shadow-[0_10px_30px_-5px_rgba(74,63,53,0.03)] animate-pulse flex flex-col justify-between min-h-[300px]"
              >
                <div>
                  <div className="aspect-[16/9] bg-slate-200 border border-[#4A3F35]/10 rounded-2xl mb-4" />
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                id={`story-${story.id}`}
                className="relative washi-card p-5 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#FFB7C5]/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-[#8FA781]/10 blur-2xl pointer-events-none" />

                <div>
                  {/* Story Preview Icon Frame */}
                  <div
                    className="aspect-[16/9] border border-[#4A3F35]/12 rounded-2xl flex items-center justify-center text-7xl mb-4 relative shadow-[0_4px_12px_rgba(74,63,53,0.03)] overflow-hidden"
                    style={{ backgroundColor: story.color }}
                  >
                    {story.coverImageUrl ? (
                      <img
                        src={story.coverImageUrl}
                        className="w-full h-full object-cover"
                        alt={story.title}
                      />
                    ) : (
                      story.image
                    )}

                    {/* Audio Icon Player overlay */}
                    {story.audio && (
                      <button
                        onClick={(e) => handleAudioToggle(story.id, e)}
                        className={cn(
                          "absolute bottom-3 right-3 p-2 rounded-full border border-[#4A3F35]/15 shadow-[0_4px_10px_rgba(74,63,53,0.08)] cursor-pointer transition-all hover:scale-105",
                          playingAudioId === story.id
                            ? "bg-[#E55B5B] text-white animate-pulse"
                            : "bg-white text-surface-base hover:bg-[#FAF8F5]",
                        )}
                        title={
                          playingAudioId === story.id
                            ? "Dừng nghe giọng đọc"
                            : "Nghe sách nói"
                        }
                        aria-label={
                          playingAudioId === story.id
                            ? "Dừng nghe"
                            : "Nghe sách nói"
                        }
                      >
                        {playingAudioId === story.id ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-text-secondary" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full border border-dashed border-[#4A3F35]/25 text-[9px] font-black uppercase"
                      style={{
                        backgroundColor: `${story.badgeColor}15`,
                        color: story.badgeColor,
                      }}
                    >
                      {story.category}
                    </span>
                    <span className="text-[9px] font-black bg-white/90 border border-[#4A3F35]/12 px-2.5 py-0.5 rounded-full text-text-secondary backdrop-blur-sm shadow-[0_2px_6px_rgba(74,63,53,0.03)]">
                      👶 {story.age}
                    </span>
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
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#4A3F35]/25 rounded-[28px] p-12 text-center bg-[#FAF6EE]/50 backdrop-blur-sm flex flex-col items-center gap-3">
            <span className="text-5xl">🔍</span>
            <h3 className="font-serif text-lg font-bold">
              Không tìm thấy truyện phù hợp
            </h3>
            <p className="text-sm text-text-secondary font-quicksand">
              Thử đổi từ khóa hoặc bộ lọc độ tuổi khác xem sao nhé!
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setActiveAgeFilter(null);
              }}
            >
              Đặt Lại Bộ Lọc
            </Button>
          </div>
        )}
      </section>

      {/* AUDIOBOOKS FEATURES - Matcha style */}
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
              <div className="relative w-8 h-8 rounded-full bg-[#E55B5B] border border-[#D14949] flex items-center justify-center shadow-[0_2px_6px_rgba(229,91,91,0.2)]">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M2 12 L12 2 L22 12 L12 22 Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-surface-base flex items-center gap-1 leading-none">
                  BéĐọc{" "}
                  <span className="text-[10px] text-[#E55B5B] font-bold">
                    ベードック
                  </span>
                </span>
                <span className="text-[7px] font-black text-[#8FA781] tracking-widest uppercase font-mono mt-0.5 leading-none">
                  おはなしえほん
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
                © {new Date().getFullYear()} BéĐọc.
              </span>
              <div
                className="w-7 h-7 rounded-full border border-dashed border-[#E55B5B] flex items-center justify-center text-[#E55B5B] text-[6px] font-black leading-none text-center select-none -rotate-12 cursor-default"
                title="Dấu triện BéĐọc"
              >
                BÉ
                <br />
                ĐỌC
              </div>
            </div>
          </div>

          {/* Nav columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 font-semibold">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="font-bold text-xs text-surface-base font-serif leading-none">
                  Khám phá
                </span>
                <span className="text-[8px] text-[#8FA781] font-bold font-mono tracking-wider mt-0.5">
                  はっけん
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
                <span className="text-[8px] text-[#8FA781] font-bold font-mono tracking-wider mt-0.5">
                  たすけ
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
                <span className="text-[8px] text-[#8FA781] font-bold font-mono tracking-wider mt-0.5">
                  つながり
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-normal">
                Email hỗ trợ: <br />
                <strong className="text-surface-base font-serif">
                  support@beread.vn
                </strong>
              </p>
            </div>
          </div>

          {/* Traditional Art Stamp Mount Fuji Silhouette */}
          <div className="hidden lg:flex items-end justify-end select-none pointer-events-none opacity-40">
            <svg
              className="w-32 h-20 text-[#4A3F35]"
              viewBox="0 0 100 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                d="M10,45 L40,15 L50,15 L80,45"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M35,20 L40,25 L45,22 L50,26 L55,20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="50"
                cy="18"
                r="8"
                fill="#E55B5B"
                opacity="0.45"
                stroke="none"
              />
              <path d="M5,35 L25,35" strokeDasharray="2,2" />
              <path d="M70,30 L95,30" strokeDasharray="2,2" />
            </svg>
          </div>
        </div>
      </footer>

      {/* Nút Cuộn Lên Đầu Trang */}
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
