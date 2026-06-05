export interface StoryPage {
  text: string;
  image: string;
  bg: string;
  textColor: string;
  audioUrl?: string;
  vbeeId?: string;
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
  coverImageUrl: string;
  description: string;
  moral: string;
  audioDuration: number;
  author: string;
  pages: StoryPage[]; // Parsed from backend JSON string
}
