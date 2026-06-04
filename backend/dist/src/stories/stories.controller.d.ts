import { Request } from "express";
import { StoriesService } from "./stories.service";
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
    findAll(req: Request): Promise<{
        payload: string;
    }>;
    findOne(id: string, req: Request): Promise<{
        payload: string;
    }>;
}
