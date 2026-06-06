export interface StoryPage {
  text: string;
  enText?: string;
  keyword?: string;
  image: string;
  audioUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: { label: "A" | "B" | "C" | "D"; text: string }[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation?: string;
}

export interface Story {
  id: number;
  title: string;
  slug: string;
  category: string;
  age: string;
  duration: string;
  rating: number;
  audio: boolean;
  color: string;
  badgeColor: string;
  image: string;
  coverImageUrl?: string;
  description: string;
  moral: string;
  audioDuration: number;
  author: string;
  pages: StoryPage[];
  questions?: QuizQuestion[];
}
