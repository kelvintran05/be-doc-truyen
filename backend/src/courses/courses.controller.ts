import { Controller, Get, Param, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { CoursesService } from "./courses.service";
import { encryptPayload } from "../common/crypto.helper";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const courses = await this.coursesService.findAll();

    const processedCourses = courses.map((course) => {
      let jsonStr = JSON.stringify(course);
      const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
      return JSON.parse(replacedStr);
    });

    return {
      payload: encryptPayload(processedCourses),
    };
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string, @Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const data = await this.coursesService.findBySlug(slug);

    if (!data) {
      throw new NotFoundException(`Course with slug ${slug} not found`);
    }

    const jsonStr = JSON.stringify(data);
    const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
    const rewritten = JSON.parse(replacedStr);

    return {
      success: true,
      data: rewritten,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      throw new NotFoundException("Invalid course ID");
    }

    const data = await this.coursesService.findOne(courseId);
    if (!data) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const jsonStr = JSON.stringify(data);
    const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
    const rewritten = JSON.parse(replacedStr);

    return {
      payload: encryptPayload(rewritten),
    };
  }

  @Get("lessons/:id")
  async findLesson(@Param("id") id: string, @Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId)) {
      throw new NotFoundException("Invalid lesson ID");
    }
    const data = await this.coursesService.findLessonById(lessonId);
    if (!data) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    const jsonStr = JSON.stringify(data);
    const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
    const rewritten = JSON.parse(replacedStr);

    return {
      payload: encryptPayload(rewritten),
    };
  }
}
