"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Volume2, ArrowRight, CheckCircle2, Award, RefreshCw, Star, Languages, HelpCircle } from "lucide-react";
import { decryptPayload } from "@/lib/crypto";
import { Lesson } from "@/lib/courses";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Mock vocabulary data for L101 - L102
const VOCAB_DATA: Record<number, Array<{ word: string; ipa: string; definition: string; vietnamese: string; example: string }>> = {
  101: [
    { word: "Body", ipa: "/ˈbɑː.di/", definition: "The physical structure of a person", vietnamese: "Cơ thể", example: "This is my body!" },
    { word: "Legs", ipa: "/leɡz/", definition: "The limbs used for walking and running", vietnamese: "Đôi chân", example: "See my legs? I can run." },
    { word: "Hand", ipa: "/hænd/", definition: "The part of the arm below the wrist", vietnamese: "Bàn tay", example: "See my hand? I can wave." },
    { word: "Think", ipa: "/θɪŋk/", definition: "To use your mind to consider things", vietnamese: "Suy nghĩ", example: "See my head? I can think." },
    { word: "Carry", ipa: "/ˈkær.i/", definition: "To support and move something from one place to another", vietnamese: "Mang, xách", example: "I can carry my bag." }
  ],
  102: [
    { word: "Float", ipa: "/floʊt/", definition: "To stay on top of a liquid without sinking", vietnamese: "Nổi", example: "The toy duck floats." },
    { word: "Sink", ipa: "/sɪŋk/", definition: "To go down below the surface of a liquid", vietnamese: "Chìm", example: "My shoe sinks." },
    { word: "Duck", ipa: "/dʌk/", definition: "A common water bird", vietnamese: "Con vịt", example: "Look at the yellow duck!" },
    { word: "Shoe", ipa: "/ʃuː/", definition: "A covering for the foot", vietnamese: "Chiếc giày", example: "The leather shoe is heavy." }
  ]
};

// Mock quiz data for L101 - L102
const QUIZ_DATA: Record<number, Array<{ question: string; options: string[]; answerIndex: number; hint: string }>> = {
  101: [
    { question: "What can I do with my legs?", options: ["I can think.", "I can run.", "I can wave."], answerIndex: 1, hint: "Check page 1" },
    { question: "What can I do with my head?", options: ["I can think.", "I can kick.", "I can throw."], answerIndex: 0, hint: "Check page 2" },
    { question: "What can I do with my arm?", options: ["I can look up.", "I can run.", "I can throw."], answerIndex: 2, hint: "Check page 2" }
  ],
  102: [
    { question: "What does the toy duck do?", options: ["It sinks.", "It floats.", "It runs."], answerIndex: 1, hint: "Check page 1" },
    { question: "What does the shoe do in water?", options: ["It sinks.", "It floats.", "It flies."], answerIndex: 0, hint: "Check page 1" }
  ]
};

export default function LessonPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const lessonId = parseInt(id || "", 10);
  const [lesson, setLesson] = React.useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // STORY state
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // VOCABULARY state
  const [vocabIndex, setVocabIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  // GAME state
  const [quizIndex, setQuizIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [showGameResults, setShowGameResults] = React.useState(false);

  React.useEffect(() => {
    if (!lessonId) return;
    fetch(`${API_URL}/courses/lessons/${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        const decrypted = decryptPayload<Lesson>(data.payload);
        setLesson(decrypted);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lesson:", err);
        setIsLoading(false);
      });
  }, [lessonId]);

  // Audio setup
  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      setIsPlayingAudio(false);
    };
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  // Autoplay audio on page change in STORY mode
  React.useEffect(() => {
    if (lesson?.type === "STORY" && lesson.pages && lesson.pages[currentPageIndex]) {
      const page = lesson.pages[currentPageIndex];
      if (page.audioUrl) {
        playAudio(page.audioUrl);
      }
    }
  }, [currentPageIndex, lesson]);

  function playAudio(url: string) {
    if (!audioRef.current) return;
    try {
      setIsPlayingAudio(true);
      audioRef.current.src = url;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
        setIsPlayingAudio(false);
      });
    } catch (e) {
      console.error(e);
      setIsPlayingAudio(false);
    }
  }

  // Vocab navigation
  const nextVocab = () => {
    const vocabs = VOCAB_DATA[lessonId] || VOCAB_DATA[101];
    if (vocabIndex < vocabs.length - 1) {
      setIsFlipped(false);
      setVocabIndex(vocabIndex + 1);
    } else {
      routerBack();
    }
  };

  // Game actions
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    const correctIdx = quizzes[quizIndex].answerIndex;
    setIsAnswered(true);
    if (selectedOption === correctIdx) {
      setScore(score + 1);
    }
  };

  const nextQuiz = () => {
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowGameResults(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowGameResults(false);
  };

  const routerBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]" />
          <p className="text-[#7C3AED] mt-4 font-black text-lg font-quicksand">
            ✨ Đang mở rương bài học...
          </p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4 p-6">
          <p className="text-red-500 text-lg font-black text-center font-quicksand">
            Không thể tải bài học này. Vui lòng quay lại!
          </p>
          <button onClick={routerBack} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 px-6 rounded-2xl border-b-4 border-[#5B21B6] font-bold font-quicksand cursor-pointer shadow-shadow-1">
            Quay Lại
          </button>
        </div>
      </div>
    );
  }

  // RENDER STORY TYPE
  if (lesson.type === "STORY") {
    const pages = lesson.pages || [];
    const activePage = pages[currentPageIndex];
    const progressPercent = ((currentPageIndex + 1) / pages.length) * 100;

    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FAF5FF] to-[#FAF8F5]">
        <Navbar />

        <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col justify-between gap-6">
          {/* Header & Progress Bar */}
          <div className="flex items-center gap-4">
            <button onClick={routerBack} className="bg-white p-3 rounded-full border-2 border-border-default shadow-shadow-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer shrink-0">
              <ArrowLeft className="h-5 w-5 text-text-primary" />
            </button>
            
            {/* Duolingo-style Progress Bar */}
            <div className="flex-1 bg-slate-200 h-4 rounded-full border-2 border-border-default overflow-hidden relative shadow-inner">
              <div 
                className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-sm font-black text-slate-500 font-sans shrink-0">
              {currentPageIndex + 1} / {pages.length}
            </span>
          </div>

          {/* Main Book Area */}
          {activePage && (
            <div className="flex-1 flex items-center justify-center py-2">
              <div className="w-full bg-white border-3 border-border-default rounded-[32px] p-6 shadow-shadow-2 flex flex-col items-center gap-6 relative overflow-hidden">
                {/* Decorative kids graphic overlay */}
                <div className="absolute top-2 right-4 text-2xl animate-bounce pointer-events-none">✨</div>
                
                {/* Image Container with Kid-friendly Picture Frame border */}
                <div className="w-full aspect-[16/9] border-3 border-border-default rounded-[24px] overflow-hidden bg-slate-50 relative shadow-shadow-2">
                  <img
                    src={activePage.imageUrl}
                    className="w-full h-full object-contain"
                    alt={`Page ${activePage.pageNumber}`}
                  />
                </div>

                {/* Speech Bubble style Page Text */}
                <div className="w-full relative mt-4">
                  {/* Speech Bubble Arrow pointing UP to the picture */}
                  <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[#DDD6FE]" />
                  
                  <div className="w-full px-6 py-5 bg-[#F5F3FF] border-2 border-[#DDD6FE] rounded-[24px] min-h-[90px] flex items-center justify-center text-center shadow-shadow-2">
                    <p className="text-slate-800 font-black text-lg md:text-2xl font-quicksand leading-relaxed">
                      {activePage.textContent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="bg-white border-3 border-border-default rounded-[24px] p-4 flex justify-between items-center shadow-shadow-1">
            <button
              disabled={currentPageIndex === 0}
              onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
              className={`py-3 px-6 rounded-2xl border-2 border-border-default font-black text-sm font-quicksand cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform select-none ${currentPageIndex === 0 ? "bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed pointer-events-none" : "bg-white text-slate-700 shadow-shadow-1"}`}
            >
              Quay Lại
            </button>

            {activePage?.audioUrl && (
              <button
                onClick={() => playAudio(activePage.audioUrl)}
                className={`p-4 rounded-full border-3 border-border-default shadow-shadow-1 cursor-pointer transition-all hover:scale-105 active:scale-95 ${isPlayingAudio ? "bg-rose-500 text-white animate-pulse" : "bg-[#7C3AED] text-white"}`}
                title="Nghe phát âm chuẩn Vbee"
              >
                <Volume2 className="h-6 w-6" />
              </button>
            )}

            {currentPageIndex < pages.length - 1 ? (
              <button
                onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 px-6 rounded-2xl border-b-4 border-[#5B21B6] font-black text-sm font-quicksand cursor-pointer shadow-shadow-1 flex items-center gap-1.5 animate-pulse"
              >
                Tiếp Theo <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={routerBack}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-2xl border-b-4 border-emerald-800 font-black text-sm font-quicksand cursor-pointer shadow-shadow-1"
              >
                Hoàn Thành 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RENDER VOCABULARY TYPE
  if (lesson.type === "VOCABULARY") {
    const vocabs = VOCAB_DATA[lessonId] || VOCAB_DATA[101];
    const currentVocab = vocabs[vocabIndex];
    const progressPercent = ((vocabIndex + 1) / vocabs.length) * 100;

    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#ECFDF5] to-[#FAF8F5]">
        <Navbar />

        <div className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col justify-between gap-6">
          {/* Header & Progress Bar */}
          <div className="flex items-center gap-4">
            <button onClick={routerBack} className="bg-white p-3 rounded-full border-2 border-border-default shadow-shadow-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer shrink-0">
              <ArrowLeft className="h-5 w-5 text-text-primary" />
            </button>
            
            <div className="flex-1 bg-slate-200 h-4 rounded-full border-2 border-border-default overflow-hidden relative shadow-inner">
              <div 
                className="bg-[#10B981] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-sm font-black text-slate-500 font-sans shrink-0">
              {vocabIndex + 1} / {vocabs.length}
            </span>
          </div>

          {/* Flashcard Area */}
          <div className="flex-1 flex items-center justify-center py-4">
            <div 
              onClick={() => setIsFlipped(!isFlipped)} 
              className={`w-full h-[360px] rounded-[32px] border-3 border-border-default shadow-shadow-2 cursor-pointer transition-all duration-300 transform preserve-3d relative ${isFlipped ? "rotate-y-180 bg-emerald-50" : "bg-white"}`}
            >
              {!isFlipped ? (
                /* Front Side */
                <div className="absolute inset-0 p-6 flex flex-col justify-between items-center backface-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ECFDF5] border-2 border-border-default rounded-full text-xs font-black text-[#10B981] font-quicksand shadow-shadow-2">
                    <Languages className="h-4 w-4" /> THẺ TỪ VỰNG 🇺🇸
                  </div>

                  <div className="flex flex-col items-center gap-2 my-auto">
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-800 font-serif tracking-wide">
                      {currentVocab.word}
                    </h2>
                    <span className="text-slate-500 font-bold italic font-quicksand text-lg bg-slate-100 px-3 py-1 border border-slate-200 rounded-full mt-2">
                      {currentVocab.ipa}
                    </span>
                    <p className="text-slate-450 text-sm font-bold text-center font-quicksand max-w-xs mt-4 leading-relaxed">
                      "{currentVocab.definition}"
                    </p>
                  </div>

                  <span className="text-slate-400 text-xs font-black uppercase tracking-wider font-quicksand animate-pulse mb-2">
                    👉 Click để lật thẻ xem nghĩa tiếng Việt 🇻🇳
                  </span>
                </div>
              ) : (
                /* Back Side */
                <div className="absolute inset-0 p-6 flex flex-col justify-between items-center backface-hidden rotate-y-180">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border-2 border-border-default rounded-full text-xs font-black text-emerald-800 font-quicksand shadow-shadow-2">
                    🇻🇳 NGHĨA TIẾNG VIỆT
                  </div>

                  <div className="flex flex-col items-center gap-3 my-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-emerald-955 font-serif">
                      {currentVocab.vietnamese}
                    </h2>

                    <div className="bg-white border-3 border-emerald-300 rounded-2xl p-4 w-full mt-4 shadow-shadow-2">
                      <span className="text-slate-450 text-[10px] font-black uppercase tracking-widest font-quicksand block mb-1">
                        Ví dụ / Example:
                      </span>
                      <p className="text-slate-800 font-black text-base font-quicksand leading-normal">
                        {currentVocab.example}
                      </p>
                    </div>
                  </div>

                  <span className="text-emerald-700 text-xs font-black uppercase tracking-wider font-quicksand animate-pulse mb-2">
                    👈 Click để lật lại thẻ từ 🇺🇸
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <button
              onClick={nextVocab}
              className="bg-[#10B981] hover:bg-[#059669] text-white py-4 px-12 rounded-2xl border-b-4 border-[#047857] font-black text-base font-quicksand cursor-pointer shadow-shadow-1 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
            >
              {vocabIndex < vocabs.length - 1 ? "Từ Tiếp Theo" : "Hoàn Thành 🎉"}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER GAME/QUIZ TYPE
  if (lesson.type === "GAME") {
    const quizzes = QUIZ_DATA[lessonId] || QUIZ_DATA[101];
    const currentQuiz = quizzes[quizIndex];
    const progressPercent = ((quizIndex + 1) / quizzes.length) * 100;

    if (showGameResults) {
      return (
        <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FFFDF6] to-[#FAF8F5]">
          <Navbar />
          <div className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-between gap-6">
            <div />
            <div className="flex flex-col items-center">
              {/* Animated Glowing Badge */}
              <div className="w-28 h-28 bg-amber-100 rounded-full border-3 border-border-default flex items-center justify-center shadow-shadow-1 mb-6 relative animate-float">
                <Award className="h-12 w-12 text-[#D97706] fill-[#FBBF24]" />
                <span className="absolute -top-1 -right-1 text-2xl">✨</span>
                <span className="absolute -bottom-2 -left-2 text-2xl">🎉</span>
              </div>
              
              <h2 className="text-4xl font-bold text-slate-850 font-serif text-center tracking-wide leading-tight">
                Tuyệt Vời Bé Ơi! 🏆
              </h2>
              <p className="text-slate-500 font-bold text-center font-quicksand mt-3 px-6">
                Bé đã xuất sắc vượt qua bài trắc nghiệm. Số câu trả lời chính xác là:
              </p>
              
              <h3 className="text-6xl font-bold text-[#D97706] font-serif mt-4 tracking-wider">
                {score} / {quizzes.length}
              </h3>

              <div className="bg-amber-50 border-3 border-border-default px-6 py-4 rounded-[24px] flex items-center gap-3 mt-8 shadow-shadow-2 animate-bounce">
                <Star className="h-6 w-6 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-amber-950 font-bold font-sans text-xl">
                  +{score * 5} Ngôi Sao ⭐
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="bg-white border-3 border-border-default py-4 px-6 rounded-2xl shadow-shadow-1 font-black font-quicksand text-slate-700 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 hover:shadow-shadow-2 transition-all"
              >
                <RefreshCw className="h-4 w-4" /> Chơi Lại
              </button>

              <button
                onClick={routerBack}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-4 px-8 rounded-2xl border-b-4 border-[#5B21B6] font-black font-quicksand shadow-shadow-1 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                Bản Đồ Học 🗺️
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FEF3C7] to-[#FAF8F5]">
        <Navbar />

        <div className="flex-1 max-w-lg w-full mx-auto px-4 py-6 flex flex-col justify-between gap-6">
          {/* Header & Progress Bar */}
          <div className="flex items-center gap-4">
            <button onClick={routerBack} className="bg-white p-3 rounded-full border-2 border-border-default shadow-shadow-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer shrink-0">
              <ArrowLeft className="h-5 w-5 text-text-primary" />
            </button>
            
            <div className="flex-1 bg-slate-200 h-4 rounded-full border-2 border-border-default overflow-hidden relative shadow-inner">
              <div 
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="text-sm font-black text-slate-500 font-sans shrink-0">
              Câu {quizIndex + 1} / {quizzes.length}
            </span>
          </div>

          {/* Quiz Card */}
          <div className="flex-1 flex flex-col gap-6 mt-4">
            <div className="bg-white border-3 border-border-default rounded-[28px] p-6 shadow-shadow-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full pointer-events-none" />
              <div className="flex items-center gap-2 text-[#D97706] mb-3">
                <HelpCircle className="h-5 w-5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider font-quicksand">
                  Thử Thách Trí Tuệ 🧩
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-850 font-serif leading-snug">
                {currentQuiz.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-4">
              {currentQuiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentQuiz.answerIndex === idx;

                let borderClass = "border-border-default border-b-6";
                let bgClass = "bg-white hover:bg-slate-50 hover:-translate-y-[2px]";
                let textClass = "text-slate-700";

                if (isAnswered) {
                  if (isCorrect) {
                    borderClass = "border-emerald-500 border-b-6";
                    bgClass = "bg-emerald-50";
                    textClass = "text-emerald-950";
                  } else if (isSelected) {
                    borderClass = "border-rose-500 border-b-6";
                    bgClass = "bg-rose-50";
                    textClass = "text-rose-950";
                  }
                } else if (isSelected) {
                  borderClass = "border-[#F59E0B] border-b-6";
                  bgClass = "bg-amber-50 -translate-y-[2px]";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={cn(
                      "border-3 rounded-2xl p-4.5 flex items-center shadow-shadow-1 cursor-pointer transition-all duration-100 select-none",
                      isAnswered && "cursor-default pointer-events-none",
                      borderClass,
                      bgClass
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-xl border-2 border-border-default flex items-center justify-center font-sans font-black mr-4 shrink-0 shadow-shadow-1 text-base",
                      isSelected ? "bg-[#F59E0B] text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={cn("text-base font-black font-quicksand flex-1", textClass)}>
                      {option}
                    </span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Check / Next Button */}
          <div className="flex justify-center mt-6">
            {!isAnswered ? (
              <button
                disabled={selectedOption === null}
                onClick={checkAnswer}
                className={cn(
                  "py-4 px-12 rounded-2xl border-b-4 font-black text-base font-quicksand shadow-shadow-1 cursor-pointer transition-all",
                  selectedOption === null 
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed pointer-events-none" 
                    : "bg-[#F59E0B] hover:bg-[#D97706] text-white border-[#B45309] hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                Kiểm Tra Đáp Án
              </button>
            ) : (
              <button
                onClick={nextQuiz}
                className="bg-[#10B981] hover:bg-[#059669] text-white py-4 px-12 rounded-2xl border-b-4 border-[#047857] font-black text-base font-quicksand shadow-shadow-1 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                Tiếp Tục <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
