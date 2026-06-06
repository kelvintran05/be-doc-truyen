"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { AGE_FILTERS } from "@/lib/constants";

interface StoryFiltersProps {
  searchQuery: string;
  activeAgeFilter: string | null;
  onSearchChange: (value: string) => void;
  onAgeFilterChange: (age: string | null) => void;
}

export function StoryFilters({
  searchQuery,
  activeAgeFilter,
  onSearchChange,
  onAgeFilterChange,
}: StoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#4A3F35]/12 pb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-surface-base flex items-center gap-2 justify-center md:justify-start">
          📚 Truyện Hay Cho Bé
        </h2>
        <p className="text-xs md:text-sm text-text-secondary font-quicksand mt-1 font-semibold">
          Lọc truyện theo độ tuổi và từ khóa để tìm bài đọc phù hợp cho con yêu
        </p>
      </div>

      <div className="w-full max-w-xs relative">
        <Input
          type="text"
          placeholder="Tìm tên truyện, thể loại..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10 cute-input text-xs"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E55B5B]" />
      </div>

      <div className="flex flex-wrap gap-2 p-1.5 bg-[#FAF6EE] border border-[#4A3F35]/15 rounded-3xl w-fit mx-auto md:mx-0 shadow-[inset_0_2px_4px_rgba(74,63,53,0.03)]">
        <button
          onClick={() => onAgeFilterChange(null)}
          className={cn(
            "px-5 py-2 text-xs font-bold rounded-2xl transition-all duration-300 cursor-pointer select-none",
            !activeAgeFilter
              ? "bg-[#FFB7C5] text-[#383029] shadow-[0_4px_12px_rgba(229,91,91,0.22)] scale-102 font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-[#FAF8F5]/80",
          )}
        >
          🌸 Tất Cả Độ Tuổi
        </button>
        {AGE_FILTERS.map((age) => (
          <button
            key={age}
            onClick={() => onAgeFilterChange(age)}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-2xl transition-all duration-300 cursor-pointer select-none",
              activeAgeFilter === age
                ? "bg-[#8FA781] text-[#383029] shadow-[0_4px_12px_rgba(143,167,129,0.25)] scale-102 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-[#FAF8F5]/80",
            )}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
}
