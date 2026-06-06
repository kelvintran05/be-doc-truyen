"use client";

import NextLink from "next/link";
import { Trophy, BookOpen, ArrowRight } from "lucide-react";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const ageLabel =
    course.level === "LV1" ? "3-6" :
    course.level === "LV2" ? "5-8" :
    course.level === "LV3" ? "7-10" : "6-9";

  return (
    <div className="bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[28px] overflow-hidden shadow-[0_8px_25px_rgba(74,63,53,0.04)] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(74,63,53,0.08)] transition-all duration-300 flex flex-col justify-between">
      <div className="relative aspect-[16/9] border-b border-[#4A3F35]/12">
        <img src={course.coverImage} className="w-full h-full object-cover" alt={course.title} />
        <div className="absolute top-4 left-4 hanko-seal text-[9px] px-3.5 py-1 rounded-full flex items-center gap-1">
          <Trophy className="h-3.5 w-3.5 text-white fill-white" />
          <span className="text-white text-[9px] font-black uppercase">
            Độ tuổi: {ageLabel}
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
            <button className="px-6 py-2 zen-btn-sakura text-xs cursor-pointer flex items-center gap-1 shadow-[0_2px_8px_rgba(229,91,91,0.1)]">
              Khám Phá <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
