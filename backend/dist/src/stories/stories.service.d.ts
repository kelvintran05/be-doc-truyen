import { PrismaService } from "../prisma.service";
export declare class StoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        pages: any;
        questions: any;
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
    }[]>;
    findOne(id: number): Promise<{
        pages: any;
        questions: any;
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
    }>;
}
