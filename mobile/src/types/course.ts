export interface LessonPage {
  id: number;
  pageNumber: number;
  imageUrl: string;
  textContent: string;
  audioUrl: string;
  lessonId: number;
}

export interface Lesson {
  id: number;
  title: string;
  type: "STORY" | "VOCABULARY" | "GAME";
  points: number;
  unitId: number;
  pages?: LessonPage[];
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  courseId: number;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  level: string;
  units?: Unit[];
}
