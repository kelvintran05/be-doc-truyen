import { Controller, Get, Param, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { CoursesService } from "./courses.service";
import { encryptPayload } from "../common/crypto.helper";
import { rewriteCdnUrls } from "../common/cdn.helper";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const courses = await this.coursesService.findAll();
    const processed = courses.map((c) => rewriteCdnUrls(c, req));
    return { payload: encryptPayload(processed) };
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string, @Req() req: Request) {
    const data = await this.coursesService.findBySlug(slug);
    if (!data) throw new NotFoundException(`Course with slug ${slug} not found`);
    return { success: true, data: rewriteCdnUrls(data, req) };
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) throw new NotFoundException("Invalid course ID");

    const data = await this.coursesService.findOne(courseId);
    if (!data) throw new NotFoundException(`Course with ID ${id} not found`);

    return { payload: encryptPayload(rewriteCdnUrls(data, req)) };
  }

  @Get("lessons/:id")
  async findLesson(@Param("id") id: string, @Req() req: Request) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId)) throw new NotFoundException("Invalid lesson ID");

    const data = await this.coursesService.findLessonById(lessonId);
    if (!data) throw new NotFoundException(`Lesson with ID ${id} not found`);

    return { payload: encryptPayload(rewriteCdnUrls(data, req)) };
  }
}
