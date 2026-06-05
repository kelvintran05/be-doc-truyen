"use client";

import * as React from "react";
import { useParams } from "next/navigation";
// Removed unused import
import { decryptPayload } from "@/lib/crypto";
import { Story } from "@/lib/stories";
import { Navbar } from "@/components/ui/Navbar";
import { Link } from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Star,
  Clock,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  Gauge,
  Timer,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  BookOpenCheck,
  RotateCw,
  Home,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoryDetailPage() {
  const { id } = useParams();
  const storyId = parseInt(id as string, 10);

  const [story, setStory] = React.useState<Story | null>(null);
  const [relatedStories, setRelatedStories] = React.useState<Story[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Reader states
  const [readMode, setReadMode] = React.useState<"page" | "full">("page");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [flipDirection, setFlipDirection] = React.useState<"next" | "prev" | "none">("none");
  const [fontSize, setFontSize] = React.useState<"sm" | "md" | "lg">("md");
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [quizAnswers, setQuizAnswers] = React.useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showQuizResults, setShowQuizResults] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState<"vi" | "en" | "bilingual">("vi");
  const [translatedPages, setTranslatedPages] = React.useState<Record<number, string>>({});
  const [isTranslating, setIsTranslating] = React.useState(false);

  // Audio player states
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0);
  const [sleepTimer, setSleepTimer] = React.useState<number | null>(null); // in minutes
  const [timerRemaining, setTimerRemaining] = React.useState<number | null>(null); // in seconds
  const [floatingNotes, setFloatingNotes] = React.useState<{ id: number; char: string; left: number; bottom: number }[]>([]);

  // Floating Sakura Petals state (initialized empty to prevent hydration mismatch)
  const [sakuraPetals, setSakuraPetals] = React.useState<{ id: number; left: number; duration: number; delay: number; size: number; rotation: number }[]>([]);

  React.useEffect(() => {
    setSakuraPetals(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: Math.random() * 8 + 8, // 8s to 16s
        delay: Math.random() * -12, // starts immediately
        size: Math.random() * 12 + 10, // 10px to 22px
        rotation: Math.random() * 360,
      }))
    );
  }, []);

  // Fetch story details
  React.useEffect(() => {
    setIsLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-doc-truyen.onrender.com";

    fetch(`${API_URL}/stories/${storyId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch story");
        return res.json();
      })
      .then((data) => {
        const decrypted = decryptPayload<Story>(data.payload);
        setStory(decrypted);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load story detail:", err);
        setIsLoading(false);
      });

    // Fetch all stories for recommendations list
    fetch(`${API_URL}/stories`)
      .then((res) => res.json())
      .then((data) => {
        const decrypted = decryptPayload<Story[]>(data.payload);
        setRelatedStories(decrypted.filter((s) => s.id !== storyId).slice(0, 3));
      })
      .catch((err) => console.error("Failed to load related stories:", err));
  }, [storyId]);

  // Reset states when story changes
  React.useEffect(() => {
    setFlipDirection("none");
                  setCurrentPageIndex(0);
    setIsCompleted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackSpeed(1.0);
    setSleepTimer(null);
    setTimerRemaining(null);
    setCurrentLanguage("vi");
    setTranslatedPages({});
    setIsTranslating(false);
  }, [storyId]);

  // Auto-scroll to quiz when story is completed
  React.useEffect(() => {
    if (isCompleted && story?.questions && story.questions.length > 0) {
      setTimeout(() => {
        document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isCompleted, story]);

  // Reset time when page changes
  React.useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentPageIndex]);

  // Handle native audio playback and speed
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentPageIndex]);

  // Handle bilingual translation on demand for the current page index
  React.useEffect(() => {
    if (!story || !story.pages) return;
    if (currentLanguage === "vi") return;
    if (translatedPages[currentPageIndex]) return;

    // Use pre-translated English text if available
    const preTranslated = story.pages[currentPageIndex]?.enText;
    if (preTranslated) {
      setTranslatedPages((prev) => ({
        ...prev,
        [currentPageIndex]: preTranslated,
      }));
      return;
    }

    const viText = story.pages[currentPageIndex]?.text;
    if (!viText) return;

    setIsTranslating(true);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(viText)}&langpair=vi|en`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Translation failed");
        return res.json();
      })
      .then((data) => {
        const translation = data.responseData?.translatedText || viText;
        setTranslatedPages((prev) => ({
          ...prev,
          [currentPageIndex]: translation,
        }));
        setIsTranslating(false);
      })
      .catch((err) => {
        console.error("Translation failed:", err);
        setIsTranslating(false);
      });
  }, [currentPageIndex, currentLanguage, story, translatedPages]);

  // Sequentially translate all other pages in the background
  React.useEffect(() => {
    if (!story || !story.pages) return;
    if (currentLanguage === "vi") return;

    const untranslatedIndexes = story.pages
      .map((_, idx) => idx)
      .filter((idx) => !translatedPages[idx]);

    if (untranslatedIndexes.length === 0) return;

    const targetIdx = untranslatedIndexes[0];

    // Check if the page has pre-translated enText
    const preTranslated = story.pages[targetIdx]?.enText;
    if (preTranslated) {
      setTranslatedPages((prev) => ({
        ...prev,
        [targetIdx]: preTranslated,
      }));
      return;
    }

    const viText = story.pages[targetIdx]?.text;
    if (!viText) return;

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(viText)}&langpair=vi|en`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const translation = data.responseData?.translatedText || viText;
        setTranslatedPages((prev) => ({
          ...prev,
          [targetIdx]: translation,
        }));
      })
      .catch((err) => console.error("Background translation failed:", err));
  }, [currentLanguage, story, translatedPages]);

  // Playback control effect (Standard Vietnamese Vbee player vs dynamic English browser TTS)
  React.useEffect(() => {
    if (currentLanguage === "en") {
      // Pause native audio player in English mode
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (isPlaying) {
        const textToSpeak = translatedPages[currentPageIndex];
        if (textToSpeak) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = "en-US";

          const voices = window.speechSynthesis.getVoices();
          const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Siri") || v.name.includes("Samantha"))) || voices.find(v => v.lang.startsWith("en"));
          if (enVoice) utterance.voice = enVoice;

          utterance.rate = playbackSpeed;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);

          window.speechSynthesis.speak(utterance);
        } else {
          // If translation is not ready, do not stop the player, wait for translation to load
          const hasOriginalText = !!story?.pages[currentPageIndex]?.text;
          if (!hasOriginalText) {
            setIsPlaying(false);
          }
        }
      } else {
        window.speechSynthesis.cancel();
      }
    } else {
      // Vietnamese or Bilingual playback (uses native high-quality Vbee voice track)
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.play().catch((err) => {
            console.error("Playback error:", err);
            setIsPlaying(false);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [isPlaying, currentPageIndex, currentLanguage, translatedPages, playbackSpeed]);

  // Set duration and simulate progress bar in English SpeechSynthesis mode
  React.useEffect(() => {
    if (currentLanguage !== "en" || !isPlaying || !story || !story.pages) return;

    const textToSpeak = translatedPages[currentPageIndex];
    if (!textToSpeak) return;

    // Estimate duration: ~150 words per minute (2.5 words per second)
    const words = textToSpeak.split(/\s+/).filter(Boolean).length;
    const estDuration = Math.max(3, Math.ceil(words / (2.5 * playbackSpeed)));
    setDuration(estDuration);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + 1;
        if (nextTime >= estDuration) {
          clearInterval(interval);
          handleAudioEnded();
          return estDuration;
        }
        return nextTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentPageIndex, currentLanguage, translatedPages, playbackSpeed, story]);

  // Sync timer and duration from audioRef periodically when playing in Vietnamese/Bilingual modes
  React.useEffect(() => {
    if (currentLanguage === "en") return;
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime || 0);
        const d = audioRef.current.duration;
        if (d && !isNaN(d) && isFinite(d)) {
          setDuration(d);
        }
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentLanguage, currentPageIndex]);

  // Sleep timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && timerRemaining !== null) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            setIsPlaying(false);
            setSleepTimer(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timerRemaining]);

  // Floating music notes effect
  React.useEffect(() => {
    if (!isPlaying) {
      setFloatingNotes([]);
      return;
    }
    const notes = ["♫", "♪", "🎵", "🎶"];
    const interval = setInterval(() => {
      const newNote = {
        id: Date.now() + Math.random(),
        char: notes[Math.floor(Math.random() * notes.length)],
        left: Math.random() * 60 + 20, // percentage position
        bottom: 20,
      };
      setFloatingNotes((prev) => [...prev.slice(-8), newNote]);
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
      const d = audioRef.current.duration;
      if (d && !isNaN(d) && isFinite(d) && duration === 0) {
        setDuration(d);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (d && !isNaN(d) && isFinite(d)) {
        setDuration(d);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (story && currentPageIndex < story.pages.length - 1) {
      setFlipDirection("next");
      setCurrentPageIndex((prev) => prev + 1);
      setTimeout(() => {
        setIsPlaying(true);
      }, 300);
    } else {
      setIsCompleted(true);
    }
  };

  // Formatter for time display
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#fffbf0]">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto gap-6">
          <div className="w-16 h-16 border-4 border-t-transparent border-[#E55B5B] rounded-full animate-spin" />
          <h2 className="font-serif text-2xl font-bold text-surface-base">Đang tải câu chuyện...</h2>
        </main>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-surface-strong">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto gap-6">
          <span className="text-8xl">🕵️‍♂️</span>
          <h1 className="font-serif text-2xl font-bold">Không Tìm Thấy Truyện</h1>
          <p className="font-quicksand text-text-secondary text-base font-semibold">
            Có vẻ câu chuyện bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đi nơi khác. Hãy quay về trang chủ để khám phá thêm nhé!
          </p>
          <NextLink href="/">
            <button className="px-6 py-2 border-2 border-border-default rounded-full bg-[#FFB7C5] text-slate-800 font-bold font-sans shadow-shadow-2 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-shadow-1 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer">
              Quay Về Trang Chủ
            </button>
          </NextLink>
        </main>
      </div>
    );
  }


  // Page handlers
  const handleNextPage = () => {
    if (currentPageIndex < story.pages.length - 1) {
      setFlipDirection("next");
      setCurrentPageIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setFlipDirection("prev");
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const handleSleepTimerSelect = (mins: number | null) => {
    if (mins === null) {
      setSleepTimer(null);
      setTimerRemaining(null);
    } else {
      setSleepTimer(mins);
      setTimerRemaining(mins * 60);
    }
  };

  const renderTextWithDropCap = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/[-—–_]/g, "").trim();
    if (!cleanText) return null;
    const firstChar = cleanText.charAt(0);
    const restText = cleanText.slice(1);
    return (
      <p className="relative select-text leading-relaxed text-justify hyphens-auto">
        <span
          className="float-left text-[4rem] leading-[0.85] mr-3 mt-2 mb-1 font-serif font-black"
          style={{ 
            color: story?.badgeColor || "#E55B5B",
            textShadow: "2px 2px 0px rgba(0,0,0,0.05), -1px -1px 0px rgba(255,255,255,0.8)"
          }}
        >
          {firstChar}
        </span>
        <span>{restText}</span>
      </p>
    );
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-screen pb-8 transition-all duration-500 relative overflow-x-hidden"
      style={{
        background: `radial-gradient(circle at top, ${story.color}33 0%, #FAF6EE 60%, #F5EFE2 100%)`
      }}
    >
      {/* Dynamic Keyframes & CSS Custom Styling Block */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(-90px) scale(1.3) rotate(15deg);
            opacity: 0;
          }
        }
        @keyframes eqBarPulse {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pageFlipNext {
          0% { transform: perspective(2500px) rotateY(90deg); opacity: 0; box-shadow: inset -30px 0 60px rgba(0,0,0,0.3); }
          30% { opacity: 1; }
          100% { transform: perspective(2500px) rotateY(0deg); opacity: 1; box-shadow: inset 0 0 0 rgba(0,0,0,0); }
        }
        @keyframes pageFlipPrev {
          0% { transform: perspective(2500px) rotateY(-90deg); opacity: 0; box-shadow: inset 30px 0 60px rgba(0,0,0,0.3); }
          30% { opacity: 1; }
          100% { transform: perspective(2500px) rotateY(0deg); opacity: 1; box-shadow: inset 0 0 0 rgba(0,0,0,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        .animate-float-up {
          animation: floatUp 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-eq-bar {
          animation: eqBarPulse 0.7s ease-in-out infinite;
        }
        .animate-page-fade {
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-page-flip-next {
          transform-origin: right center;
          animation: pageFlipNext 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-style: preserve-3d;
        }
        .animate-page-flip-prev {
          transform-origin: left center;
          animation: pageFlipPrev 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-style: preserve-3d;
        }
        .animate-page-slide {
          animation: slideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .pulse-glow-button {
          animation: pulseGlow 2s infinite;
        }
        .parchment-lines-sm {
          background: linear-gradient(180deg, transparent 20px, rgba(180, 160, 140, 0.08) 20px, rgba(180, 160, 140, 0.08) 20.5px, transparent 20.5px);
          background-size: 100% 2.5rem;
          line-height: 2.5rem;
          background-position: 0 0;
        }
        .parchment-lines-md {
          background: linear-gradient(180deg, transparent 25px, rgba(180, 160, 140, 0.08) 25px, rgba(180, 160, 140, 0.08) 25.5px, transparent 25.5px);
          background-size: 100% 3rem;
          line-height: 3rem;
          background-position: 0 0;
        }
        .parchment-lines-lg {
          background: linear-gradient(180deg, transparent 32px, rgba(180, 160, 140, 0.08) 32px, rgba(180, 160, 140, 0.08) 32.5px, transparent 32.5px);
          background-size: 100% 3.5rem;
          line-height: 3.5rem;
          background-position: 0 0;
        }
      `}</style>

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

      {/* IMMERSIVE HEADER BAR (Floating Pill Design) */}
      <header className="w-[95%] max-w-5xl mx-auto h-16 px-4 md:px-6 mt-4 flex items-center justify-between border border-[#4A3F35]/12 bg-white/90 backdrop-blur-md rounded-2xl select-none shadow-[0_4px_20px_rgba(74,63,53,0.04)] sticky top-4 z-30 transition-all duration-300">
        {/* Left: Home/Back button */}
        <NextLink
          href="/"
          className="flex items-center gap-1.5 zen-btn-white px-4 py-2 text-xs text-slate-700 cursor-pointer shadow-[0_2px_8px_rgba(74,63,53,0.05)]"
        >
          <Home className="h-4 w-4 text-[#E55B5B] fill-[#E55B5B]/10" /> Trang chủ
        </NextLink>

        {/* Middle: Title info */}
        <div className="flex flex-col items-center text-center max-w-[45%]">
          <h1 className="font-serif text-xs md:text-sm font-bold text-slate-800 tracking-tight leading-tight line-clamp-1">
            {story.title}
          </h1>
          <span className="text-[9px] font-bold font-quicksand text-slate-500 hidden sm:flex items-center gap-1.5 mt-0.5">
            <span>Tác giả: <strong className="text-[#E55B5B]">{story.author}</strong></span>
            <span>•</span>
            <span>Độ tuổi: <strong className="text-[#10B981]">{story.age}</strong></span>
          </span>
        </div>

        {/* Right: Mode & Config selectors */}
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="hidden md:flex items-center bg-white border border-[#4A3F35]/15 rounded-xl p-0.5 shadow-[0_2px_8px_rgba(74,63,53,0.03)]">
            <button
              onClick={() => setReadMode("page")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer",
                readMode === "page"
                  ? "bg-[#FFB7C5] text-slate-800 font-bold"
                  : "text-text-secondary hover:text-slate-800"
              )}
            >
              📖 Đọc trang
            </button>
            <button
              onClick={() => setReadMode("full")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer",
                readMode === "full"
                  ? "bg-[#FFB7C5] text-slate-800 font-bold"
                  : "text-text-secondary hover:text-slate-800"
              )}
            >
              📄 Đọc hết
            </button>
          </div>

          {/* Languages */}
          <div className="flex items-center bg-white border border-[#4A3F35]/15 rounded-xl p-0.5 shadow-[0_2px_8px_rgba(74,63,53,0.03)]">
            {(["vi", "en", "bilingual"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer capitalize",
                  currentLanguage === lang
                    ? "bg-[#8FA781] text-slate-800"
                    : "text-text-secondary hover:bg-slate-50"
                )}
              >
                {lang === "vi" && "🇻🇳 vi"}
                {lang === "en" && "🇬🇧 en"}
                {lang === "bilingual" && "🌍 song ngữ"}
              </button>
            ))}
          </div>

          {/* Font zoom */}
          <div className="flex items-center bg-white border border-[#4A3F35]/15 rounded-xl p-0.5 shadow-[0_2px_8px_rgba(74,63,53,0.03)]">
            {(["sm", "md", "lg"] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer text-[9px]",
                  fontSize === sz
                    ? "bg-[#FCD34D] text-slate-800"
                    : "text-text-secondary hover:bg-slate-50"
                )}
              >
                A{sz === "sm" && "-"}
                {sz === "lg" && "+"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 md:px-6 gap-6 mt-6 justify-center z-10">

        {readMode === "page" ? (
          /* PREMIUM 3D OPEN BOOK LAYOUT */
          <div className="w-full flex-1 flex flex-col justify-center">

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-b from-[#FEFDFB] to-[#F9F7F4] border border-[#9E8B75]/15 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(74,63,53,0.2),0_10px_25px_-5px_rgba(74,63,53,0.1),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-4px_0_rgba(245,240,230,1),inset_0_-5px_0_rgba(150,140,120,0.2)] overflow-hidden lg:h-[680px] relative items-stretch ring-1 ring-white/50">

              {/* Subtle Corners - Japanese Minimalist Style */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#B4A090]/25 rounded-tl pointer-events-none z-20" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#B4A090]/25 rounded-tr pointer-events-none z-20" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#B4A090]/25 rounded-bl pointer-events-none z-20" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#B4A090]/25 rounded-br pointer-events-none z-20" />

              {/* Realistic 3D Central Book Spine (Only on Desktop) */}
              <div className="hidden lg:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 z-20 pointer-events-none flex-col items-center overflow-hidden mix-blend-multiply">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-[#8B7C6E]/20 to-transparent relative flex justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
                  <div className="w-px h-full bg-gradient-to-b from-transparent via-[#4A3F35]/30 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.15)]" />
                  <div className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-[6px] border-l-2 border-r-2 border-dashed border-[#6B5E4F]/15" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.3)] via-transparent to-[rgba(255,255,255,0.3)]" />
                </div>
              </div>

              {/* Decorative Bookmark Ribbon Hanging from the Top Spine */}
              <div
                className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 w-5 h-28 z-20 shadow-md rounded-b-md transition-all duration-300 items-end justify-center pb-2 pointer-events-none"
                style={{ backgroundColor: story.badgeColor }}
              >
                <div className="text-[8px] font-black text-white/80 select-none">★</div>
              </div>

              {/* LEFT PAGE: STORY ILLUSTRATION */}
              <div
                className={cn(
                  "flex flex-col justify-center items-center p-6 lg:pb-12 lg:pr-12 border-b-2 lg:border-b-0 lg:border-r-0 relative select-none lg:h-full lg:min-h-0 z-20 perspective-[2000px]",
                  flipDirection === "next" ? "animate-page-flip-next" : "animate-page-fade"
                )}
                style={{ backgroundColor: `${story.color}12` }}
                key={`img-${currentPageIndex}`}
              >
                {/* Visual frame for the illustration */}
                <div
                  className="w-full h-auto border border-[#4A3F35]/15 rounded-[24px] overflow-hidden shadow-[0_6px_20px_rgba(74,63,53,0.03)] flex items-center justify-center relative transition-transform duration-300 hover:scale-[1.01]"
                  style={{ borderColor: `${story.badgeColor}40` }}
                >
                  {story.pages[currentPageIndex].image.startsWith("http") ? (
                    <img
                      src={story.pages[currentPageIndex].image}
                      alt={`Trang ${currentPageIndex + 1}`}
                      className="w-full h-auto object-contain block"
                    />
                  ) : (
                    <span className="text-8xl animate-bounce">{story.pages[currentPageIndex].image}</span>
                  )}
                </div>

                {/* Page Curve Overlay (Right Edge shadow simulating 3D curve into spine) */}
                <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-black/10 via-black/5 to-transparent pointer-events-none z-10 mix-blend-multiply" />

                {/* Page Corner Label */}
                <span className="absolute bottom-5 left-8 text-[8px] font-black text-slate-350 font-sans uppercase tracking-widest opacity-60">
                  Page {currentPageIndex * 2 + 1}
                </span>
              </div>

              {/* RIGHT PAGE: TEXT READER & CONTROLS */}
              <div 
                className={cn(
                  "flex flex-col justify-between p-6 lg:pb-12 lg:pl-12 bg-gradient-to-b from-[#FEFDFB] to-[#F9F7F4] relative lg:h-full lg:min-h-0 z-20 perspective-[2000px]",
                  flipDirection === "prev" ? "animate-page-flip-prev" : "animate-page-fade"
                )}
                key={`text-container-${currentPageIndex}`}
              >

                {/* Page Curve Overlay (Left Edge shadow simulating 3D curve out of spine) */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none z-10 mix-blend-multiply" />

                {/* Top decorative elements */}
                <div className="flex items-center justify-between select-none relative z-10">
                  {story.pages[currentPageIndex].keyword ? (
                    <span className="font-sans text-[9px] font-black uppercase text-[#5C7050] bg-[#EBF3E8] border border-dashed border-[#8FA781]/60 px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(143,167,129,0.05)]">
                      Từ khóa: {story.pages[currentPageIndex].keyword}
                    </span>
                  ) : (
                    <div />
                  )}
                  <span className="text-[9px] font-black text-slate-400 font-sans uppercase tracking-wider">
                    TRANG {currentPageIndex + 1} / {story.pages.length}
                  </span>
                </div>

                {/* Parchment Notebook Style Lined Text Area - Japanese Minimal */}
                <div
                  key={`text-${currentPageIndex}`}
                  className="flex-1 flex flex-col justify-start min-h-0 my-4 overflow-y-auto px-8 md:px-10 animate-page-slide"
                >
                  <div
                    className={cn(
                      "font-quicksand font-medium text-slate-700 py-2 flex-1 flex flex-col justify-center",
                      fontSize === "sm" && "text-[15px] parchment-lines-sm",
                      fontSize === "md" && "text-[18px] parchment-lines-md",
                      fontSize === "lg" && "text-[22px] parchment-lines-lg"
                    )}
                  >
                    {currentLanguage === "vi" && (
                      <div className="text-left leading-relaxed">{renderTextWithDropCap(story.pages[currentPageIndex].text)}</div>
                    )}
                    {currentLanguage === "en" && (
                      <div className="text-left leading-relaxed">
                        {isTranslating && !translatedPages[currentPageIndex] ? (
                          <span className="text-text-tertiary text-xs flex items-center gap-2">
                            <span className="animate-spin text-sm">⏳</span> Translating...
                          </span>
                        ) : (
                          renderTextWithDropCap(translatedPages[currentPageIndex] || "")
                        )}
                      </div>
                    )}
                    {currentLanguage === "bilingual" && (
                      <div className="flex flex-col gap-4">
                        <div className="text-left leading-relaxed">{renderTextWithDropCap(story.pages[currentPageIndex].text)}</div>
                        <div className="w-24 h-px bg-gradient-to-r from-[#E55B5B]/30 to-transparent" />
                        <div className="text-[#E55B5B] italic font-medium text-left leading-relaxed">
                          {isTranslating && !translatedPages[currentPageIndex] ? (
                            <span className="text-text-tertiary text-xs flex items-center justify-center gap-2">
                              <span className="animate-spin text-sm">⏳</span> Translating...
                            </span>
                          ) : (
                            <p>{translatedPages[currentPageIndex]}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upgraded Premium Magic Audio Controller Deck - Japanese Minimal */}
                <div className="bg-gradient-to-br from-[#FEFDFB] via-[#FAF8F6] to-[#F5F3F0] border border-[#B4A090]/12 rounded-[20px] p-4 flex flex-col gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] relative">

                  {/* Floating Music Particles Container */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]">
                    {floatingNotes.map((note) => (
                      <span
                        key={note.id}
                        className="absolute text-lg pointer-events-none select-none text-violet-500/80 font-sans z-30 animate-float-up"
                        style={{
                          left: `${note.left}%`,
                          bottom: `${note.bottom}px`,
                          color: story.badgeColor
                        }}
                      >
                        {note.char}
                      </span>
                    ))}
                  </div>

                  {/* Row 1: Play button, status, and dynamic equalizer bars */}
                  <div className="flex items-center justify-between gap-3 w-full relative z-10 select-none">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                          "w-12 h-12 rounded-full border border-[#4A3F35]/15 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(229,91,91,0.25)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 relative",
                          isPlaying ? "bg-rose-500 hover:bg-rose-600" : "bg-[#FFB7C5]"
                        )}
                        style={{
                          backgroundColor: isPlaying ? "" : story.badgeColor,
                        }}
                      >
                        {isPlaying ? <Pause className="h-5 w-5 fill-current animate-pulse" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                      </button>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-1">Giọng kể BéĐọc</span>
                        <span className="text-xs font-bold text-slate-700 font-sans truncate block leading-none">
                          {isPlaying ? "🔊 Đang đọc truyện" : "🔇 Tạm dừng đọc truyện"}
                        </span>
                      </div>
                    </div>

                    {/* Equalizer Visualizer */}
                    <div className="flex items-end gap-1 h-6 pr-1">
                      {[...Array(6)].map((_, i) => {
                        const animDur = ["0.6s", "0.8s", "0.7s", "0.5s", "0.9s", "0.6s"][i % 6];
                        const animDelay = ["0s", "0.15s", "0.3s", "0.2s", "0.4s", "0.1s"][i % 6];
                        return (
                          <div
                            key={i}
                            className={cn(
                              "w-1 rounded-full transition-all duration-300",
                              isPlaying ? "animate-eq-bar" : "h-[20%]"
                            )}
                            style={{
                              height: isPlaying ? undefined : "20%",
                              animationDuration: isPlaying ? animDur : undefined,
                              animationDelay: isPlaying ? animDelay : undefined,
                              backgroundColor: story.badgeColor
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 2: Progress bar with shimmer stripe animation */}
                  <div className="w-full flex items-center gap-2 relative z-10">
                    <span className="text-[10px] font-black text-slate-500 font-quicksand w-8 text-right select-none">{formatTime(currentTime)}</span>
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        const seekTime = percentage * duration;
                        setCurrentTime(seekTime);
                        if (audioRef.current) {
                          audioRef.current.currentTime = seekTime;
                        }
                      }}
                      className="flex-1 h-4 bg-white border border-[#4A3F35]/15 rounded-full overflow-hidden cursor-pointer relative shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)] group"
                    >
                      <div className="absolute inset-0 bg-[#E55B5B]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div
                        className="h-full border-r border-[#4A3F35]/20 transition-all duration-300 relative"
                        style={{
                          width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                          backgroundColor: story.badgeColor,
                        }}
                      >
                        {/* Shimmer Overlay */}
                        <div
                          className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[size:14px_14px]"
                          style={{
                            animation: "shimmer 1.5s linear infinite"
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 font-quicksand w-8 select-none">{formatTime(duration)}</span>
                  </div>

                  {/* Row 3: Speed & Sleep Timer Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-dashed border-slate-200/60 mt-0.5 select-none relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Tốc độ:</span>
                      <div className="flex items-center bg-white border border-[#4A3F35]/15 rounded-xl p-0.5 shadow-[0_2px_6px_rgba(74,63,53,0.03)]">
                        {[1.0, 1.25, 1.5].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => setPlaybackSpeed(speed)}
                            className={cn(
                              "px-2 py-0.5 rounded-lg text-[8px] font-black cursor-pointer transition-all",
                              playbackSpeed === speed ? "bg-[#FCD34D] text-slate-800" : "text-slate-500 hover:text-slate-700"
                            )}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Hẹn giờ:</span>
                      <div className="flex items-center bg-white border border-[#4A3F35]/15 rounded-xl p-0.5 shadow-[0_2px_6px_rgba(74,63,53,0.03)]">
                        {[null, 5, 15].map((mins) => (
                          <button
                            key={mins ?? "off"}
                            onClick={() => handleSleepTimerSelect(mins)}
                            className={cn(
                              "px-2 py-0.5 rounded-lg text-[8px] font-black cursor-pointer transition-all",
                              sleepTimer === mins ? "bg-[#8FA781] text-slate-800 font-bold" : "text-slate-500 hover:text-slate-700"
                            )}
                            style={{ backgroundColor: sleepTimer === mins ? story.badgeColor : "" }}
                          >
                            {mins ? `${mins}m` : "Tắt"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#E2DCD0] mt-3 select-none relative z-10">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="px-4 py-2 border border-[#4A3F35]/15 rounded-2xl bg-white hover:bg-[#FAF8F5] disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_12px_rgba(74,63,53,0.04)] font-black text-xs font-quicksand cursor-pointer transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Trước
                  </button>

                  <button
                    onClick={handleNextPage}
                    className={cn(
                      "px-5 py-2 border border-[#4A3F35]/15 rounded-2xl hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_12px_rgba(229,91,91,0.25)] font-black text-xs font-quicksand cursor-pointer transition-all flex items-center gap-1 text-white",
                      currentPageIndex === story.pages.length - 1 ? "bg-emerald-500 border-b-4 border-emerald-700" : ""
                    )}
                    style={{
                      backgroundColor: currentPageIndex === story.pages.length - 1 ? "" : story.badgeColor,
                    }}
                  >
                    {currentPageIndex === story.pages.length - 1 ? (
                      <>Xong <Sparkles className="h-4 w-4 fill-current text-[#FCD34D] animate-spin" /></>
                    ) : (
                      <>Tiếp <ChevronRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>

                {/* Page Corner Label */}
                <span className="absolute bottom-5 right-8 text-[8px] font-black text-slate-350 font-sans uppercase tracking-widest opacity-60">
                  Page {currentPageIndex * 2 + 2}
                </span>

              </div>

            </div>

            {/* Ruled progress line below open book */}
            <div className="w-full h-3 bg-white border border-[#4A3F35]/15 rounded-full overflow-hidden mt-4 shadow-[0_2px_8px_rgba(74,63,53,0.03)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentPageIndex + 1) / story.pages.length) * 100}%`, backgroundColor: story.badgeColor }}
              />
            </div>

          </div>
        ) : (
          /* FULL SCROLL VIEW */
          <div className="flex flex-col gap-6 select-text max-w-4xl mx-auto w-full relative z-10">
            {story.pages.map((page, idx) => (
              <div
                key={idx}
                className="w-full grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-b from-[#FEFDFB] to-[#F9F7F4] border border-[#9E8B75]/8 rounded-[28px] shadow-[0_8px_28px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)] overflow-hidden items-stretch"
              >
                {/* Left Page (Illustration) */}
                <div
                  className="lg:col-span-5 flex items-center justify-center p-6 border-b-2 lg:border-b-0 lg:border-r-0 select-none"
                  style={{ backgroundColor: `${story.color}12` }}
                >
                  <div
                    className="w-full aspect-[16/10] border border-[#4A3F35]/12 rounded-3xl flex items-center justify-center bg-gradient-to-br from-[#FFFBF7] to-[#FCF9F5] shadow-[0_6px_16px_rgba(74,63,53,0.05),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden"
                  >
                    {page.image.startsWith("http") ? (
                      <img src={page.image} alt={`Trang ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{page.image}</span>
                    )}
                  </div>
                </div>

                {/* Right Page (Content) */}
                <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-b from-[#FFFBF7] to-[#FCF9F5]">
                  <div className="flex items-center justify-between w-full mb-3 select-none">
                    <span className="font-serif text-sm font-bold text-[#E55B5B]">Trang {idx + 1}</span>
                    {page.keyword && (
                      <span className="font-sans text-[9px] font-black uppercase text-slate-700 bg-white border border-[#4A3F35]/15 px-2.5 py-0.5 rounded-lg shadow-[0_2px_6px_rgba(74,63,53,0.03)]">
                        Từ khóa: {page.keyword}
                      </span>
                    )}
                  </div>

                  <div
                    className={cn(
                      "font-quicksand font-bold leading-relaxed text-slate-800 flex-1 flex flex-col justify-center py-2",
                      fontSize === "sm" && "text-sm",
                      fontSize === "md" && "text-base md:text-lg",
                      fontSize === "lg" && "text-lg md:text-xl"
                    )}
                  >
                    {currentLanguage === "vi" && <p>{page.text}</p>}
                    {currentLanguage === "en" && (
                      <p>
                        {translatedPages[idx] || (
                          <span className="text-text-tertiary text-xs flex items-center gap-1">
                            <span className="animate-spin text-xs">⏳</span> Translating...
                          </span>
                        )}
                      </p>
                    )}
                    {currentLanguage === "bilingual" && (
                      <div className="flex flex-col gap-2">
                        <p>{page.text}</p>
                        <div className="w-12 h-0.5 border-t border-dashed border-[#E55B5B]/20" />
                        <p className="text-[#E55B5B] italic font-medium">
                          {translatedPages[idx] || (
                            <span className="text-text-tertiary text-xs flex items-center gap-1">
                              <span className="animate-spin text-xs">⏳</span> Translating...
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6 text-center select-none">
              <button
                onClick={() => setIsCompleted(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-10 rounded-full border border-emerald-600/30 font-black text-sm font-quicksand shadow-[0_6px_20px_rgba(16,185,129,0.3)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                Hoàn Thành Bài Đọc 🎉
              </button>
            </div>
          </div>
        )}

        {/* Supplementary moral & summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 relative z-10 select-none">
          {/* MORAL LESSON */}
          <div className="bg-[#FEF3C7] border border-amber-900/10 rounded-[32px] p-5 shadow-[0_8px_30px_rgba(245,158,11,0.03)] relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_36px_rgba(245,158,11,0.06)]">
            <div className="absolute top-4 right-4 text-4xl animate-float pointer-events-none select-none">💡</div>
            <h3 className="font-serif text-base font-bold text-amber-950 mb-1">
              Bài Học Ý Nghĩa Của Truyện
            </h3>
            <p className="font-quicksand text-sm text-slate-800 font-bold leading-relaxed pr-8">
              "{story.moral}"
            </p>
          </div>

          {/* DESCRIPTION DETAILS */}
          <div className="bg-white border border-[#4A3F35]/12 rounded-[32px] p-5 shadow-[0_8px_30px_rgba(74,63,53,0.03)] flex flex-col gap-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_36px_rgba(74,63,53,0.06)]">
            <h3 className="font-serif text-base font-bold text-slate-800">
              Tóm tắt cốt truyện 📝
            </h3>
            <p className="font-quicksand text-xs text-text-secondary leading-relaxed font-semibold">
              {story.description}
            </p>
          </div>
        </div>


        {/* QUIZ SECTION - Shows after story completion if questions exist */}
        {isCompleted && story.questions && story.questions.length > 0 && !showQuizResults && (
          <section id="quiz-section" className="w-full flex flex-col gap-6 mt-8 border-t border-[#4A3F35]/12 pt-8 relative z-10 max-w-4xl mx-auto">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                ❓ Bài Kiểm Tra Hiểu Bài
              </h2>
              <p className="font-quicksand text-xs text-text-secondary mt-0.5 font-semibold">
                Hãy trả lời các câu hỏi dưới đây để kiểm tra xem bé đã hiểu câu chuyện chưa nhé!
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {story.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="bg-white border border-[#4A3F35]/12 rounded-[28px] p-6 shadow-[0_8px_24px_rgba(74,63,53,0.04)] flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-full text-white font-black text-sm flex-shrink-0"
                      style={{ backgroundColor: story.badgeColor }}
                    >
                      {qIdx + 1}
                    </span>
                    <h3 className="font-serif text-base font-bold text-slate-800 pt-0.5">
                      {q.question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
                    {q.options.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: option.label }))}
                        className={cn(
                          "px-4 py-3 rounded-2xl border-2 font-bold text-sm text-left transition-all cursor-pointer",
                          quizAnswers[qIdx] === option.label
                            ? "border-[#4A3F35] bg-slate-100 text-slate-800"
                            : "border-[#4A3F35]/15 bg-white text-slate-700 hover:border-[#4A3F35]/40"
                        )}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 font-black text-xs"
                            style={{
                              borderColor: quizAnswers[qIdx] === option.label ? story.badgeColor : "rgba(74, 63, 53, 0.2)",
                              backgroundColor: quizAnswers[qIdx] === option.label ? story.badgeColor : "transparent",
                              color: quizAnswers[qIdx] === option.label ? "white" : "inherit"
                            }}
                          >
                            {option.label}
                          </span>
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center pt-4">
              <button
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(quizAnswers).length < story.questions.length}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full border border-emerald-600/30 font-black text-sm font-quicksand shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                📊 Xem Kết Quả
              </button>
            </div>
          </section>
        )}

        {/* QUIZ RESULTS SECTION */}
        {isCompleted && story.questions && showQuizResults && (
          <section className="w-full flex flex-col gap-6 mt-8 border-t border-[#4A3F35]/12 pt-8 relative z-10 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">
                📋 Kết Quả Bài Kiểm Tra
              </h2>
              {(() => {
                const correctCount = story.questions.filter((q, idx) => quizAnswers[idx] === q.correctAnswer).length;
                const totalCount = story.questions.length;
                const percentage = Math.round((correctCount / totalCount) * 100);

                return (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-5xl font-black" style={{ color: percentage >= 70 ? "#10B981" : percentage >= 50 ? "#F59E0B" : "#E55B5B" }}>
                      {correctCount}/{totalCount}
                    </div>
                    <p className="font-quicksand text-lg font-bold" style={{ color: percentage >= 70 ? "#10B981" : percentage >= 50 ? "#F59E0B" : "#E55B5B" }}>
                      {percentage >= 80 ? "🌟 Xuất sắc!" : percentage >= 70 ? "✨ Rất tốt!" : percentage >= 50 ? "👍 Khá tốt!" : "💪 Cần cố gắng hơn!"}
                    </p>
                  </div>
                );
              })()}
            </div>

            <div className="flex flex-col gap-6">
              {story.questions.map((q, qIdx) => {
                const isCorrect = quizAnswers[qIdx] === q.correctAnswer;
                return (
                  <div
                    key={qIdx}
                    className={cn(
                      "border-2 rounded-[24px] p-5 transition-all",
                      isCorrect
                        ? "bg-emerald-50 border-emerald-300"
                        : "bg-red-50 border-red-300"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className={cn(
                        "text-2xl",
                        isCorrect ? "text-emerald-500" : "text-red-500"
                      )}>
                        {isCorrect ? "✅" : "❌"}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-serif text-base font-bold text-slate-800 mb-1">
                          Câu {qIdx + 1}: {q.question}
                        </h3>
                        <p className={cn(
                          "font-quicksand text-sm font-semibold",
                          isCorrect ? "text-emerald-700" : "text-slate-700"
                        )}>
                          Bé chọn: <strong>{quizAnswers[qIdx]}</strong> - {q.options.find(o => o.label === quizAnswers[qIdx])?.text}
                        </p>
                        {!isCorrect && (
                          <p className="font-quicksand text-sm font-semibold text-emerald-700 mt-2">
                            Đáp án đúng: <strong>{q.correctAnswer}</strong> - {q.options.find(o => o.label === q.correctAnswer)?.text}
                          </p>
                        )}
                        {q.explanation && (
                          <p className="font-quicksand text-xs text-slate-600 mt-2 italic border-t border-dashed border-slate-300 pt-2 mt-3">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setFlipDirection("none");
                  setCurrentPageIndex(0);
                  setShowQuizResults(false);
                  setQuizAnswers({});
                }}
                className="px-6 py-3 border-2 border-[#4A3F35]/15 rounded-full bg-white text-slate-800 font-bold font-quicksand shadow-[0_4px_12px_rgba(74,63,53,0.06)] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
              >
                📖 Đọc lại từ đầu
              </button>
              <NextLink href={`/#story-${story.id}`}>
                <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full border border-emerald-600/30 font-bold font-quicksand shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer">
                  📚 Đọc truyện khác
                </button>
              </NextLink>
            </div>
          </section>
        )}

        {/* RELATED STORIES */}
        <section className="w-full flex flex-col gap-6 mt-8 border-t border-[#4A3F35]/12 pt-8 relative z-10">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
              📖 Đề Xuất Cho Bé
            </h2>
            <p className="font-quicksand text-xs text-text-secondary mt-0.5 font-semibold">
              Khám phá thêm các câu chuyện tranh cổ tích ly kỳ khác nhé
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedStories.map((related) => (
              <NextLink
                href={`/story/${related.id}`}
                key={related.id}
                className="washi-card p-5 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div
                    className="aspect-[16/9] border border-[#4A3F35]/15 rounded-2xl flex items-center justify-center text-6xl mb-4 relative shadow-[0_4px_12px_rgba(74,63,53,0.03)] transition-transform duration-300 group-hover:rotate-1 overflow-hidden"
                    style={{ backgroundColor: related.color }}
                  >
                    {related.coverImageUrl ? (
                      <img src={related.coverImageUrl} className="w-full h-full object-cover" alt={related.title} />
                    ) : (
                      <span className="group-hover:scale-110 transition-transform">{related.image}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full border border-dashed border-[#4A3F35]/25 text-[9px] font-black uppercase"
                      style={{ backgroundColor: `${related.badgeColor}15`, color: related.badgeColor }}
                    >
                      {related.category}
                    </span>
                    <span className="text-[9px] font-black bg-[#fffbf0] border border-[#4A3F35]/15 px-2.5 py-0.5 rounded-full text-text-secondary shadow-[0_1px_4px_rgba(74,63,53,0.02)]">
                      👶 {related.age}
                    </span>
                  </div>

                  <h3 className="font-serif text-sm font-bold text-slate-800 mb-2 group-hover:text-[#E55B5B] transition-colors line-clamp-1">
                    {related.title}
                  </h3>
                  <p className="text-[11px] text-text-secondary font-quicksand line-clamp-2 mb-4 leading-normal font-semibold">
                    {related.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 select-none">
                  <span className="text-[10px] text-text-tertiary font-bold">⏱️ {related.duration}</span>
                  <span className="inline-flex items-center gap-0.5 font-black text-xs text-[#E55B5B] group-hover:translate-x-1 transition-transform">
                    Đọc ngay <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </NextLink>
            ))}
          </div>
        </section>

      </main>

      {/* MAGICAL COMPLETED SUCCESS OVERLAY MODAL - Only show if no quiz */}
      {isCompleted && (!story.questions || story.questions.length === 0) && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 select-none">
          <div className="bg-[#FFFDFC] border border-[#4A3F35]/15 rounded-[40px] p-8 max-w-md w-full text-center shadow-[0_20px_60px_rgba(74,63,53,0.12)] flex flex-col items-center gap-6 relative animate-in zoom-in-95 duration-200">
            {/* Sparkly particles inside modal */}
            <div className="absolute top-4 left-6 text-2xl animate-bounce">✨</div>
            <div className="absolute top-12 right-8 text-xl animate-pulse">🎉</div>
            <div className="absolute bottom-16 left-10 text-2xl animate-float">🌟</div>

            <span className="text-8xl animate-bounce drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]">🏆</span>

            <div className="flex flex-col gap-2">
              <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-tight">
                Bé Thật Giỏi!
              </h2>
              <p className="font-quicksand text-sm text-text-secondary font-semibold">
                Bé đã hoàn thành câu chuyện: <br />
                <strong className="text-[#E55B5B] font-bold text-base block mt-1">"{story.title}"</strong>
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-600/20 rounded-2xl p-4 w-full relative overflow-hidden">
              {/* Confetti decorations */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_20%,transparent_20%)] bg-[size:10px_10px]" />
              <span className="text-xs font-sans font-bold text-[#10B981] uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1 relative z-10">
                <CheckCircle className="h-4 w-4 fill-current" /> Đã ghi nhận thành tích
              </span>
              <p className="text-xs font-bold font-sans text-slate-700 relative z-10 flex items-center justify-center gap-1.5">
                Bé được thưởng <span className="text-[#F59E0B] text-sm">★ +10</span> điểm thông thái! 🌟
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
              <NextLink href={`/#story-${story.id}`} className="flex-1">
                <Button variant="primary" className="w-full text-xs font-black zen-btn-sakura py-3.5 shadow-[0_4px_12px_rgba(229,91,91,0.2)] hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  Đọc truyện khác
                </Button>
              </NextLink>
              <button
                className="flex-1 text-xs font-black zen-btn-white py-3.5 shadow-[0_4px_12px_rgba(74,63,53,0.06)] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                onClick={() => {
                  setIsCompleted(false);
                  setFlipDirection("none");
                  setCurrentPageIndex(0);
                }}
              >
                Đọc lại từ đầu
              </button>
            </div>
          </div>
        </div>
      )}

      {story.pages[currentPageIndex]?.audioUrl && (
        <audio
          ref={audioRef}
          src={story.pages[currentPageIndex].audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
      )}
    </div>
  );
}

