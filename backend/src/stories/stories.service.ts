import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const stories = await this.prisma.story.findMany({
      orderBy: { id: "asc" },
    });
    return stories.map((s) => ({
      ...s,
      pages: JSON.parse(s.pages),
      questions: s.questions ? JSON.parse(s.questions) : undefined,
    }));
  }

  async findOne(id: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });
    if (!story) return null;
    return {
      ...story,
      pages: JSON.parse(story.pages),
      questions: story.questions ? JSON.parse(story.questions) : undefined,
    };
  }
}
