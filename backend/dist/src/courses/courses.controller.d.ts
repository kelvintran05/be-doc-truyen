import { Request } from "express";
import { CoursesService } from "./courses.service";
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(req: Request): Promise<{
        payload: string;
    }>;
    findBySlug(slug: string, req: Request): Promise<{
        success: boolean;
        data: any;
    }>;
    findOne(id: string, req: Request): Promise<{
        payload: string;
    }>;
    findLesson(id: string, req: Request): Promise<{
        payload: string;
    }>;
}
