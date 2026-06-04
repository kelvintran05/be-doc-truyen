import { PrismaService } from "../prisma.service";
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        units: ({
            _count: {
                lessons: number;
            };
        } & {
            id: number;
            title: string;
            description: string;
            courseId: number;
        })[];
    } & {
        level: string;
        id: number;
        title: string;
        slug: string;
        description: string;
        coverImage: string;
    })[]>;
    findBySlug(slug: string): Promise<{
        units: ({
            lessons: ({
                pages: {
                    id: number;
                    pageNumber: number;
                    imageUrl: string;
                    textContent: string;
                    audioUrl: string;
                    lessonId: number;
                }[];
            } & {
                id: number;
                title: string;
                type: string;
                points: number;
                unitId: number;
            })[];
        } & {
            id: number;
            title: string;
            description: string;
            courseId: number;
        })[];
    } & {
        level: string;
        id: number;
        title: string;
        slug: string;
        description: string;
        coverImage: string;
    }>;
    findLessonById(id: number): Promise<{
        pages: {
            id: number;
            pageNumber: number;
            imageUrl: string;
            textContent: string;
            audioUrl: string;
            lessonId: number;
        }[];
    } & {
        id: number;
        title: string;
        type: string;
        points: number;
        unitId: number;
    }>;
}
