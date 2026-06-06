export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-doc-truyen.onrender.com";

export const CACHE_TTL = 5 * 60 * 1000;

export const ROUTES = {
  HOME: "/",
  STORY: (id: number) => `/story/${id}`,
  COURSES: "/courses",
  COURSE: (slug: string) => `/courses/${slug}`,
  LESSON: (id: number) => `/courses/lesson/${id}`,
  ACTIVITIES: "/activities",
  ACTIVITY: (id: number) => `/activity/${id}`,
} as const;

export const TRANSLATION_API = "https://api.mymemory.translated.net/get";

export const AGE_FILTERS = ["3-5 tuổi", "4-7 tuổi", "6-8 tuổi", "7-10 tuổi"];

export const VOICES = [
  { id: "F1", name: "Chị Thư", desc: "Giọng nữ ấm áp, nhẹ nhàng" },
  { id: "F2", name: "Chị Mai", desc: "Giọng nữ trong trẻo, vui tươi" },
  { id: "M1", name: "Anh Nam", desc: "Giọng nam trầm ấm, kể chuyện" },
] as const;

export const READ_MODES = ["page", "full"] as const;

export const FONT_SIZES = ["sm", "md", "lg"] as const;

export const LANGUAGES = ["vi", "en", "bilingual"] as const;

export const PLAYBACK_SPEEDS = [1.0, 1.25, 1.5] as const;

export const SLEEP_TIMERS = [null, 5, 15] as const;
