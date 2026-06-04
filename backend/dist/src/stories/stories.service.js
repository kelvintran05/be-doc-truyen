"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let StoriesService = class StoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story)
            return null;
        return {
            ...story,
            pages: JSON.parse(story.pages),
            questions: story.questions ? JSON.parse(story.questions) : undefined,
        };
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map