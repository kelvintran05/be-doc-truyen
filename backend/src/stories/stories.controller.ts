import { Controller, Get, Param, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { StoriesService } from "./stories.service";
import { encryptPayload } from "../common/crypto.helper";
import { rewriteCdnUrls } from "../common/cdn.helper";

@Controller("stories")
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const data = await this.storiesService.findAll();
    const rewritten = data.map((story) => rewriteCdnUrls(story, req));
    return { payload: encryptPayload(rewritten) };
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const storyId = parseInt(id, 10);
    if (isNaN(storyId)) throw new NotFoundException("Invalid story ID");

    const data = await this.storiesService.findOne(storyId);
    if (!data) throw new NotFoundException(`Story with ID ${id} not found`);

    return { payload: encryptPayload(rewriteCdnUrls(data, req)) };
  }
}
