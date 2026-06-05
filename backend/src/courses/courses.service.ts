import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        units: {
          include: {
            _count: {
              select: { lessons: true }
            }
          }
        }
      }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                pages: {
                  orderBy: {
                    pageNumber: "asc"
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                pages: {
                  orderBy: {
                    pageNumber: "asc"
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findLessonById(id: number) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        pages: {
          orderBy: {
            pageNumber: "asc"
          }
        }
      }
    });
  }
}
