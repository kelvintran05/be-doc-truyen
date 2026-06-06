"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, Gamepad2, Languages, Lock, Play, Star, Sparkles, Trophy } from "lucide-react";
import { decryptPayload } from "@/lib/crypto";
import { Course } from "@/lib/courses";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useApi(
    slug ? `course-${slug}` : null,
    () =>
      fetch(`${API_URL}/courses/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then((data) => decryptPayload<Course>(data.payload)),
    { enabled: !!slug },
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]" />
          <p className="text-[#7C3AED] mt-4 font-black text-lg font-quicksand">
            ✨ Đang mở bản đồ phiêu lưu tiếng Anh...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAF8F5]">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4 p-6">
          <p className="text-red-500 text-lg font-black text-center font-quicksand">
            Không tìm thấy thông tin khóa học hoặc đã xảy ra lỗi.
          </p>
          <NextLink href="/courses">
            <Button variant="primary" className="bg-[#7C3AED] hover:bg-[#6D28D9]">Quay Lại</Button>
          </NextLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FAF6EE]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <NextLink href="/courses">
            <button className="bg-white p-3 rounded-full border border-[#4A3F35]/15 shadow-[0_2px_8px_rgba(74,63,53,0.04)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>
          </NextLink>
          <div className="flex-1">
            <h1 className="font-serif text-3xl font-bold text-surface-base" style={{ wordBreak: "break-word" }}>
              {course.title}
            </h1>
            <p className="text-sm text-text-secondary font-quicksand font-semibold">
              Bản đồ hành trình phiêu lưu tiếng Anh của bé
            </p>
          </div>
        </div>

        {/* Banner Details */}
        <div className="bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[28px] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-[0_10px_30px_rgba(74,63,53,0.04)]">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#4A3F35]/15 shrink-0 shadow-[0_2px_8px_rgba(74,63,53,0.03)]">
            <img
              src={course.coverImage}
              className="w-full h-full object-cover"
              alt={course.title}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#E55B5B] uppercase tracking-widest font-mono">
              Bản đồ phiêu lưu 🗺️
            </div>
            <h2 className="text-xl font-bold text-slate-850 font-serif mt-1">
              Chinh phục {course.units?.length || 4} Chủ Đề Học Tập
            </h2>
            <p className="text-xs font-semibold text-slate-500 font-quicksand mt-1 leading-relaxed">
              Vượt qua các thử thách bài đọc và quiz trắc nghiệm để nhận sao thưởng tích lũy huy hiệu vinh quang nhé bé yêu!
            </p>
          </div>
        </div>

        {/* Units Roadmap */}
        <div className="flex flex-col gap-10">
          {course.units?.map((unit, unitIdx) => (
            <div key={unit.id} className="flex flex-col">
              {/* Unit Card Header */}
              <div className="bg-gradient-to-br from-[#FFFDF8] to-[#FFF9E8] border border-[#4A3F35]/12 rounded-[28px] p-6 mb-6 shadow-[0_6px_20px_rgba(74,63,53,0.03)] relative overflow-hidden">
                <div className="absolute -top-3 -right-3 bg-[#FCD34D]/15 p-8 rounded-full" />
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-amber-800 text-xs font-black uppercase tracking-wider font-mono">
                    Chủ đề {unitIdx + 1}
                  </span>
                  <span className="bg-[#8FA781] text-white border border-[#4A3F35]/15 text-[9px] font-black font-mono px-2.5 py-0.5 rounded-lg shadow-[0_2px_6px_rgba(143,167,129,0.05)]">
                    MỞ KHÓA 🔓
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 font-serif mb-1 leading-tight">
                  {unit.title}
                </h3>
                <p className="text-amber-900 text-xs font-semibold leading-normal font-quicksand">
                  {unit.description}
                </p>
              </div>

              {/* Lessons Road */}
              <div className="relative flex flex-col gap-8 py-4">
                {/* Winding road path line */}
                <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 md:w-2 border-l-4 md:border-l-6 border-dashed border-[#4A3F35]/15 md:-translate-x-1/2 pointer-events-none" />

                {unit.lessons.map((lesson, lessonIdx) => {
                  const isEven = lessonIdx % 2 === 0;
                  
                  let IconComponent = BookOpen;
                  let iconColor = "#E55B5B";
                  let bgClass = "bg-[#FFF5F6] text-[#E55B5B] border-[#FFB7C5]/30";
                  let label = "Bài Đọc • Read Along 📚";
                  let cardBg = "bg-gradient-to-br from-white to-[#FFF5F6]";
                  let accentColor = "#E55B5B";

                  if (lesson.type === "VOCABULARY") {
                    IconComponent = Languages;
                    iconColor = "#8FA781";
                    bgClass = "bg-[#EBF3E8] text-[#8FA781] border-[#8FA781]/30";
                    label = "Từ Vựng • Vocab Card 🎴";
                    cardBg = "bg-gradient-to-br from-white to-[#EBF3E8]";
                    accentColor = "#8FA781";
                  } else if (lesson.type === "GAME") {
                    IconComponent = Gamepad2;
                    iconColor = "#F59E0B";
                    bgClass = "bg-[#FFFDF0] text-[#D97706] border-[#FCD34D]/30";
                    label = "Trò Chơi • Fun Quiz 🎮";
                    cardBg = "bg-gradient-to-br from-white to-[#FFFDF0]";
                    accentColor = "#F59E0B";
                  }
                  
                  return (
                    <div
                      key={lesson.id}
                      className={cn(
                        "relative flex items-center w-full",
                        isEven ? "md:justify-start" : "md:justify-end"
                      )}
                    >
                      {/* Timeline Bullet Node */}
                      <div
                        className={cn(
                          "absolute left-[10px] md:left-1/2 w-6 h-6 rounded-full border border-[#4A3F35]/15 flex items-center justify-center z-10 md:-translate-x-1/2 transition-all duration-300 hover:scale-110 shadow-[0_2px_8px_rgba(74,63,53,0.05)]",
                          lesson.type === "STORY" ? "bg-[#E55B5B]" : lesson.type === "VOCABULARY" ? "bg-[#8FA781]" : "bg-[#F59E0B]"
                        )}
                      >
                        <Star className="h-2.5 w-2.5 text-white fill-white" />
                      </div>

                      {/* Card Content container */}
                      <div className={cn("w-full md:w-[46%] pl-10 md:pl-0", isEven ? "md:pr-6" : "md:pl-6")}>
                        <NextLink href={`/courses/lesson/${lesson.id}`}>
                          <div className={cn(
                            "border border-[#4A3F35]/12 rounded-[24px] p-5 flex items-center justify-between shadow-[0_6px_20px_rgba(74,63,53,0.03)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(74,63,53,0.06)] transition-all duration-300 cursor-pointer group",
                            cardBg
                          )}>
                            <div className="flex items-center flex-1 min-w-0 mr-4">
                              <div className={cn("w-14 h-14 rounded-2xl border border-[#4A3F35]/15 items-center justify-center flex shrink-0 shadow-[0_2px_8px_rgba(74,63,53,0.03)] group-hover:rotate-3 transition-transform", bgClass)}>
                                <IconComponent className="h-7 w-7" />
                              </div>
                              <div className="ml-4 min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-wider font-mono block mb-0.5" style={{ color: accentColor }}>
                                  {label}
                                </span>
                                <h4 className="text-base md:text-lg font-bold text-slate-800 font-serif mt-0.5 leading-tight truncate">
                                  {lesson.title}
                                </h4>
                                <p className="text-xs font-semibold text-slate-450 font-quicksand mt-1">
                                  Nhận ngay <span className="font-bold text-amber-500">+{lesson.points} Sao ⭐</span> khi vượt qua!
                                </p>
                              </div>
                            </div>

                            <div 
                              className="p-3 rounded-2xl bg-white border border-[#4A3F35]/15 shadow-[0_2px_8px_rgba(74,63,53,0.03)] hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0"
                              style={{ color: accentColor }}
                            >
                              <Play className="h-4 w-4 fill-current text-current" />
                            </div>
                          </div>
                        </NextLink>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
