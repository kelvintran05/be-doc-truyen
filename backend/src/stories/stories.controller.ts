import { Controller, Get, Param, NotFoundException, Req } from "@nestjs/common";
import { Request } from "express";
import { StoriesService } from "./stories.service";
import { encryptPayload } from "../common/crypto.helper";

@Controller("stories")
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const data = await this.storiesService.findAll();
    
    // Dynamically replace localhost with the request host header so mobile clients get correct local IP URLs
    const rewritten = data.map((story) => {
      const jsonStr = JSON.stringify(story);
      const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
      return JSON.parse(replacedStr);
    });

    return {
      payload: encryptPayload(rewritten),
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
    const storyId = parseInt(id, 10);
    if (isNaN(storyId)) {
      throw new NotFoundException("Invalid story ID");
    }
    const data = await this.storiesService.findOne(storyId);
    if (!data) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    const jsonStr = JSON.stringify(data);
    const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
    const rewritten = JSON.parse(replacedStr);

    return {
      payload: encryptPayload(rewritten),
    };
  }
}
