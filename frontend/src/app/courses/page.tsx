"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, Trophy, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { decryptPayload } from "@/lib/crypto";
import { Course } from "@/lib/courses";
import { useApi } from "@/hooks/useApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CoursesPage() {
  const { data: courses, isLoading } = useApi(
    "courses",
    () =>
      fetch(`${API_URL}/courses`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then((data) => decryptPayload<Course[]>(data.payload)),
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FAF6EE]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Navigation & Header */}
        <div className="flex items-center gap-4">
          <NextLink href="/">
            <button className="bg-white p-3 rounded-full border border-[#4A3F35]/15 shadow-[0_2px_8px_rgba(74,63,53,0.04)] hover:-translate-y-0.5 transition-all cursor-pointer">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>
          </NextLink>
          <div>
            <h1 className="font-serif text-3xl font-bold text-surface-base">
              Khóa Học Tiếng Anh Cho Bé 🇬🇧
            </h1>
            <p className="text-sm text-text-secondary font-quicksand font-semibold">
              Học tiếng Anh chuẩn bản xứ qua các bài đọc sinh động và hoạt động vui chơi tương tác
            </p>
          </div>
        </div>

        {/* Intro Banner */}
        <div className="bg-pastel-surface border border-[#4A3F35]/12 rounded-[32px] p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(74,63,53,0.03)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 text-[#E55B5B] fill-[#FFB7C5]/30" />
            <span className="text-[#E55B5B] text-xs font-black uppercase tracking-widest font-mono">
              Hành trình học tập nhiệm màu 🌸
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 font-serif mb-3 leading-tight">
            Nơi Tiếng Anh trở thành một cuộc phiêu lưu lý thú!
          </h2>
          <p className="text-text-secondary font-medium leading-relaxed font-quicksand max-w-2xl text-xs md:text-sm font-semibold">
            Ứng dụng sử dụng giọng lồng tiếng Mỹ tự nhiên từ Vbee, kết hợp giữa đọc sách nói tranh truyện, học từ vựng trực quan và chơi trò chơi tích sao giúp bé tiếp thu ngôn ngữ tự nhiên và say mê nhất.
          </p>
        </div>

        {/* Course Catalog */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
            Danh Sách Khóa Học Mở Rộng 🌟
          </h3>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-[#4A3F35]/12 rounded-[28px] p-6 shadow-[0_10px_30px_rgba(74,63,53,0.03)] animate-pulse min-h-[300px]" />
              ))}
            </div>
          ) : (courses ?? []).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(courses ?? []).map((course) => (
                <div
                  key={course.id}
                  className="bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[28px] overflow-hidden shadow-[0_8px_25px_rgba(74,63,53,0.04)] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(74,63,53,0.08)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] border-b border-[#4A3F35]/12">
                    <img
                      src={course.coverImage}
                      className="w-full h-full object-cover"
                      alt={course.title}
                    />
                    <div className="absolute top-4 left-4 hanko-seal text-[9px] px-3.5 py-1 rounded-full flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5 text-white fill-white" />
                      <span className="text-white text-[9px] font-black uppercase">
                        Độ tuổi: {
                          course.level === "LV1" ? "3-6" :
                          course.level === "LV2" ? "5-8" :
                          course.level === "LV3" ? "7-10" : "6-9"
                        }
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <span className="text-[#E55B5B] text-xs font-black uppercase tracking-wider font-mono">
                        Trình độ: {course.level}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-slate-800 mt-1 mb-2 leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed font-quicksand">
                        {course.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-[#4A3F35]/12">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#8FA781]" />
                        <span className="text-slate-500 text-xs font-black font-quicksand">
                          {course.units?.length || 4} Chủ đề phiêu lưu
                        </span>
                      </div>

                      <NextLink href={`/courses/${course.slug}`}>
                        <button
                          className="px-6 py-2 zen-btn-sakura text-xs cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(229,91,91,0.1)]"
                        >
                          Khám Phá <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </NextLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#4A3F35]/20 rounded-[28px] p-12 text-center bg-[#FAF6EE]/50 backdrop-blur-sm flex flex-col items-center gap-3">
              <span className="text-5xl">🔍</span>
              <h4 className="font-serif text-lg font-bold">Chưa có khóa học nào</h4>
              <p className="text-sm text-text-secondary font-quicksand font-semibold">
                Vui lòng cấu hình seed dữ liệu để bắt đầu trải nghiệm!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
