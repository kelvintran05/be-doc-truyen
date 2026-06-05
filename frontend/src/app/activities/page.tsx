"use client";

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import NextLink from "next/link";
import { 
  Compass, 
  Sparkles, 
  Brain, 
  ChevronRight, 
  Star,
  Gamepad,
  Home,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  titleVi: string;
  category: "math" | "shapes" | "memory" | "logic" | "creative" | "language" | "music";
  ageMin: number;
  ageMax: number;
  icon: string;
  bgColor: string;
  description: string;
  descriptionVi: string;
  isActive: boolean;
}

const ACTIVITIES: Activity[] = [
  {
    id: "flip-match",
    title: "Flip & Match",
    titleVi: "Lật & Ghép",
    category: "memory",
    ageMin: 4,
    ageMax: 6,
    icon: "🧠",
    bgColor: "bg-[#E0E7FF]", // indigo
    description: "Flip and match pairs of animals, fruits, and space items!",
    descriptionVi: "Trò chơi lật thẻ và tìm các cặp hình giống nhau giúp bé luyện trí nhớ!",
    isActive: true,
  },
  {
    id: "number-match",
    title: "Match the Number",
    titleVi: "Ghép số",
    category: "math",
    ageMin: 3,
    ageMax: 5,
    icon: "🔢",
    bgColor: "bg-[#FEF3C7]", // amber
    description: "Count the pictures and choose the matching number!",
    descriptionVi: "Đếm số hình vẽ ngộ nghĩnh và chọn chữ số tương ứng thật chính xác!",
    isActive: true,
  },
  {
    id: "missing-number",
    title: "What's Missing?",
    titleVi: "Số nào bị mất?",
    category: "math",
    ageMin: 4,
    ageMax: 6,
    icon: "🕵️",
    bgColor: "bg-[#FEF3C7]", // amber
    description: "Study the number pattern and fill in the missing spot!",
    descriptionVi: "Quan sát dãy số theo quy luật và điền vào ô trống số còn thiếu nhé!",
    isActive: true,
  },
  {
    id: "match-shapes",
    title: "Match the Shape",
    titleVi: "Ghép hình bóng",
    category: "shapes",
    ageMin: 3,
    ageMax: 4,
    icon: "🔷",
    bgColor: "bg-[#E0F2FE]", // sky blue
    description: "Drag the shapes to their matching shadow holes!",
    descriptionVi: "Nhận biết các hình học cơ bản và kéo thả vào đúng bóng của chúng!",
    isActive: true,
  },
  {
    id: "what-changed",
    title: "What Changed?",
    titleVi: "Cái gì thay đổi?",
    category: "memory",
    ageMin: 4,
    ageMax: 6,
    icon: "👀",
    bgColor: "bg-[#F3E8FF]", // purple
    description: "Memorize the scene, then spot the sneaky change!",
    descriptionVi: "Quan sát kỹ bức tranh, ghi nhớ vị trí và tìm ra điểm vừa thay đổi!",
    isActive: true,
  },
  {
    id: "bigger-number",
    title: "Which is Bigger?",
    titleVi: "Số nào lớn hơn?",
    category: "math",
    ageMin: 4,
    ageMax: 5,
    icon: "⚖️",
    bgColor: "bg-[#FEF3C7]", // amber
    description: "Compare two numbers and tap the bigger one!",
    descriptionVi: "Luyện so sánh lượng và số, chạm nhanh vào số có giá trị lớn hơn!",
    isActive: true,
  },
  {
    id: "color-sort",
    title: "Sort by Color",
    titleVi: "Phân loại màu sắc",
    category: "shapes",
    ageMin: 3,
    ageMax: 4,
    icon: "🎨",
    bgColor: "bg-[#E0F2FE]", // sky blue
    description: "Drag the colored objects into their matching bins!",
    descriptionVi: "Phân biệt màu sắc bằng cách kéo các đồ vật vào đúng giỏ màu tương ứng!",
    isActive: true,
  },
  {
    id: "same-or-different",
    title: "Same or Different?",
    titleVi: "Giống hay khác?",
    category: "shapes",
    ageMin: 3,
    ageMax: 4,
    icon: "🧐",
    bgColor: "bg-[#E0F2FE]", // sky blue
    description: "Look closely and decide if the two pictures match!",
    descriptionVi: "Nhìn thật kỹ hai bức tranh và so sánh xem chúng giống nhau hay khác nhau!",
    isActive: true,
  },
  {
    id: "connect-dots",
    title: "Connect the Dots",
    titleVi: "Nối chấm sáng tạo",
    category: "creative",
    ageMin: 4,
    ageMax: 6,
    icon: "✏️",
    bgColor: "bg-[#FEE2E2]", // red
    description: "Tap the dots in number order to reveal a secret drawing!",
    descriptionVi: "Nối các chấm tròn theo thứ tự tăng dần của số để hiện ra bức vẽ bí mật!",
    isActive: true,
  },
  {
    id: "sort-big-small",
    title: "Big & Small Sort",
    titleVi: "Phân biệt to nhỏ",
    category: "logic",
    ageMin: 3,
    ageMax: 4,
    icon: "🧩",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Drag objects to the big or small bin!",
    descriptionVi: "Giúp bé làm quen với khái niệm kích thước bằng cách xếp đồ vật to/nhỏ!",
    isActive: true,
  },
  {
    id: "sort-animals",
    title: "Animal Habitat Sort",
    titleVi: "Phân loại động vật",
    category: "logic",
    ageMin: 4,
    ageMax: 5,
    icon: "🐾",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Sort each animal into the sea, land, or sky habitat!",
    descriptionVi: "Đưa các con vật đáng yêu về đúng ngôi nhà của chúng: biển, rừng hay bầu trời!",
    isActive: true,
  },
  {
    id: "what-comes-next",
    title: "What Comes Next?",
    titleVi: "Diễn biến tiếp theo",
    category: "logic",
    ageMin: 4,
    ageMax: 6,
    icon: "📖",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Look at the story and choose the next scene!",
    descriptionVi: "Quan sát chuỗi sự kiện câu chuyện và dự đoán cảnh phim tiếp theo!",
    isActive: true,
  },
  {
    id: "heavier-lighter",
    title: "Heavier or Lighter?",
    titleVi: "Nặng hay nhẹ hơn?",
    category: "logic",
    ageMin: 4,
    ageMax: 5,
    icon: "⚖️",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Watch the scale and choose the heavier or lighter side!",
    descriptionVi: "Nhìn đĩa cân thăng bằng và chọn vật nặng hơn hoặc nhẹ hơn theo yêu cầu!",
    isActive: true,
  },
  {
    id: "first-letter",
    title: "First Letter",
    titleVi: "Chữ cái đầu tiên",
    category: "language",
    ageMin: 4,
    ageMax: 6,
    icon: "🔤",
    bgColor: "bg-[#FFEDD5]", // orange
    description: "Pick the correct first letter for each picture!",
    descriptionVi: "Tập nhận biết bảng chữ cái bằng cách tìm chữ cái bắt đầu của hình vẽ!",
    isActive: true,
  },
  {
    id: "mini-piano",
    title: "Mini Piano",
    titleVi: "Đàn Piano Mini",
    category: "music",
    ageMin: 3,
    ageMax: 6,
    icon: "🎵",
    bgColor: "bg-[#FCE7F3]", // pink
    description: "Play music freely or play nursery rhymes!",
    descriptionVi: "Đánh đàn tự do hoặc gõ theo các bài hát đồng dao quen thuộc cho trẻ!",
    isActive: true,
  },
  {
    id: "animal-sound",
    title: "Whose Sound?",
    titleVi: "Tiếng của con gì?",
    category: "music",
    ageMin: 3,
    ageMax: 4,
    icon: "🐶",
    bgColor: "bg-[#FCE7F3]", // pink
    description: "Listen to an animal sound and choose who made it!",
    descriptionVi: "Lắng nghe âm thanh động vật và chọn đúng hình con vật phát ra tiếng kêu!",
    isActive: true,
  },
  {
    id: "spot-mistake",
    title: "Spot the Mistake",
    titleVi: "Tìm điểm bất hợp lý",
    category: "logic",
    ageMin: 5,
    ageMax: 8,
    icon: "🔍",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Explore funny scenes and tap the silly thing that does not belong!",
    descriptionVi: "Khám phá các bức tranh ngộ nghĩnh và chỉ ra điểm vô lý cực kỳ vui nhộn!",
    isActive: true,
  },
  {
    id: "chess-adventure",
    title: "Chess Adventure",
    titleVi: "Phiêu lưu Cờ vua",
    category: "logic",
    ageMin: 5,
    ageMax: 8,
    icon: "♟️",
    bgColor: "bg-[#F1F5F9]", // slate
    description: "Meet every chess piece, hear how it moves, and solve mini challenges!",
    descriptionVi: "Làm quen các quân cờ, nghe cách di chuyển và giải đố thử thách thông minh!",
    isActive: true,
  },
  {
    id: "logic-path",
    title: "Logic Path",
    titleVi: "Đường đi logic",
    category: "logic",
    ageMin: 5,
    ageMax: 8,
    icon: "🧩",
    bgColor: "bg-[#DCFCE7]", // green
    description: "Guide characters by building path arrows to reach their targets!",
    descriptionVi: "Sắp xếp các mũi tên dẫn đường giúp các bạn nhỏ vượt chướng ngại vật về đích!",
    isActive: true,
  }
];

export default function ActivitiesPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const filteredActivities = activeCategory === "all" 
    ? ACTIVITIES 
    : ACTIVITIES.filter(act => act.category === activeCategory);

  const categories = [
    { id: "all", label: "Tất cả trò chơi", icon: "🎮" },
    { id: "memory", label: "Rèn luyện trí nhớ", icon: "🧠" },
    { id: "math", label: "Tư duy toán học", icon: "🔢" },
    { id: "shapes", label: "Màu sắc & Hình khối", icon: "🎨" },
    { id: "logic", label: "Logic & Khám phá", icon: "🧩" },
    { id: "creative", label: "Sáng tạo & Âm nhạc", icon: "🎵" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface-strong pb-16">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-space-4 md:px-space-5 gap-8 mt-6">
        {/* BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="font-quicksand font-bold text-sm text-text-secondary flex items-center gap-2 select-none">
          <NextLink href="/" className="hover:text-[#7C3AED] flex items-center gap-1 transition-colors">
            <Home className="h-4 w-4" /> Trang chủ
          </NextLink>
          <span>/</span>
          <span className="text-[#7C3AED]">Khu vui chơi trí tuệ</span>
        </nav>

        {/* HERO HEADER */}
        <section className="w-full bg-[#7C3AED] border-3 border-border-default rounded-radius-xs p-6 md:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-shadow-2 text-white">
          <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full border border-white/20 pointer-events-none select-none animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-radius-sm border-2 border-dashed border-white/10 rotate-12 pointer-events-none select-none" />

          <div className="flex-1 flex flex-col gap-3 justify-center text-center md:text-left">
            <div className="inline-flex self-center md:self-start items-center gap-1.5 px-3 py-1 bg-white/20 border border-white/30 rounded-radius-sm text-xs font-bold font-sans tracking-wide">
              <Sparkles className="h-3.5 w-3.5 fill-current text-yellow-300" /> KHU VUI CHƠI TRÍ TUỆ
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Trò Chơi Giáo Dục Cho Trẻ
            </h1>
            <p className="font-quicksand text-base font-medium max-w-xl text-white/90 leading-relaxed">
              Tuyển tập các trò chơi tương tác nhẹ nhàng giúp trẻ phát triển trí nhớ, rèn luyện tư duy logic, toán học và kỹ năng quan sát nhạy bén.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center pr-6 text-7xl select-none animate-bounce">
            🎈
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="flex flex-wrap gap-3 justify-center md:justify-start select-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 border-2 border-border-default rounded-radius-sm font-sans font-bold text-sm shadow-shadow-1 cursor-pointer transition-all duration-instant flex items-center gap-1.5",
                activeCategory === cat.id
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9] -translate-y-0.5"
                  : "bg-white text-surface-base hover:bg-surface-strong"
              )}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </section>

        {/* GAMES GRID */}
        <section className="w-full flex flex-col gap-6">
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-white border-2 border-border-default rounded-radius-xs p-5 shadow-shadow-2 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#334155] transition-all duration-instant relative overflow-hidden group"
                >
                  <div>
                    {/* Game Visual Block */}
                    <div
                      className={cn(
                        "aspect-[16/10] border-2 border-border-default rounded-2xl flex items-center justify-center text-7xl mb-4 relative shadow-shadow-1 overflow-hidden transition-transform",
                        act.bgColor
                      )}
                    >
                      <span className="group-hover:scale-110 transition-transform select-none">{act.icon}</span>
                      
                      {/* Active indicator */}
                      {act.isActive ? (
                        <span className="absolute top-3 right-3 bg-green-500 border-2 border-border-default text-white px-2 py-0.5 rounded-full shadow-shadow-1 text-[10px] font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="h-3 w-3" /> HOẠT ĐỘNG
                        </span>
                      ) : (
                        <span className="absolute top-3 right-3 bg-[#94A3B8] border-2 border-border-default text-white px-2.5 py-0.5 rounded-full shadow-shadow-1 text-[10px] font-bold">
                          SẮP RA MẮT
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center gap-2 mb-2 select-none">
                      <span
                        className="px-2.5 py-0.5 rounded-radius-sm border-2 border-border-default text-[10px] font-bold uppercase tracking-wider bg-white shadow-shadow-1"
                      >
                        {act.category === "math" && "🔢 Toán học"}
                        {act.category === "shapes" && "🎨 Hình khối"}
                        {act.category === "memory" && "🧠 Trí nhớ"}
                        {act.category === "logic" && "🧩 Logic"}
                        {act.category === "creative" && "✏️ Sáng tạo"}
                        {act.category === "language" && "🔤 Ngôn ngữ"}
                        {act.category === "music" && "🎵 Âm nhạc"}
                      </span>
                      <span className="text-[10px] font-bold bg-surface-strong border-2 border-border-default px-2 py-0.5 rounded-radius-sm text-text-secondary">
                        👶 {act.ageMin}-{act.ageMax} tuổi
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-surface-base mb-2 group-hover:text-[#7C3AED] transition-colors">
                      {act.titleVi}
                    </h3>
                    <p className="text-sm text-text-secondary font-quicksand leading-relaxed line-clamp-3 mb-6">
                      {act.descriptionVi}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-dashed border-gray-200 select-none">
                    {act.isActive ? (
                      <NextLink href={`/activity/${act.id}`}>
                        <Button 
                          variant="primary" 
                          className="w-full text-sm font-bold bg-[#7C3AED] hover:bg-[#6D28D9] gap-1 shadow-shadow-1"
                        >
                          Chơi ngay <ChevronRight className="h-4 w-4" />
                        </Button>
                      </NextLink>
                    ) : (
                      <Button 
                        variant="secondary" 
                        disabled 
                        className="w-full text-sm font-bold opacity-60 border-2 border-dashed border-gray-300 shadow-none hover:translate-x-0 hover:translate-y-0 cursor-not-allowed"
                      >
                        Học viện đang xây dựng...
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-border-default rounded-radius-xs p-12 text-center bg-surface-strong flex flex-col items-center gap-3 select-none">
              <span className="text-5xl">🕵️‍♂️</span>
              <h3 className="font-serif text-lg font-bold">Không tìm thấy trò chơi nào</h3>
              <p className="text-sm text-text-secondary font-quicksand">
                Không tìm thấy trò chơi nào phù hợp trong danh mục này. Hãy thử chọn danh mục khác nhé!
              </p>
              <Button variant="secondary" onClick={() => setActiveCategory("all")}>
                Hiển thị tất cả
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
