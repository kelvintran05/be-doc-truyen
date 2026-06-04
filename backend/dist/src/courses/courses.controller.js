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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const courses_service_1 = require("./courses.service");
const crypto_helper_1 = require("../common/crypto.helper");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async findAll(req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const courses = await this.coursesService.findAll();
        const processedCourses = courses.map((course) => {
            let jsonStr = JSON.stringify(course);
            const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
            return JSON.parse(replacedStr);
        });
        return {
            payload: (0, crypto_helper_1.encryptPayload)(processedCourses),
        };
    }
    async findBySlug(slug, req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const data = await this.coursesService.findBySlug(slug);
        if (!data) {
            throw new common_1.NotFoundException(`Course with slug ${slug} not found`);
        }
        const jsonStr = JSON.stringify(data);
        const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
        const rewritten = JSON.parse(replacedStr);
        return {
            success: true,
            data: rewritten,
        };
    }
    async findOne(id, req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const courseId = parseInt(id, 10);
        if (isNaN(courseId)) {
            throw new common_1.NotFoundException("Invalid course ID");
        }
        const data = await this.coursesService.findOne(courseId);
        if (!data) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        const jsonStr = JSON.stringify(data);
        const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
        const rewritten = JSON.parse(replacedStr);
        return {
            payload: (0, crypto_helper_1.encryptPayload)(rewritten),
        };
    }
    async findLesson(id, req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const lessonId = parseInt(id, 10);
        if (isNaN(lessonId)) {
            throw new common_1.NotFoundException("Invalid lesson ID");
        }
        const data = await this.coursesService.findLessonById(lessonId);
        if (!data) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        const jsonStr = JSON.stringify(data);
        const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
        const rewritten = JSON.parse(replacedStr);
        return {
            payload: (0, crypto_helper_1.encryptPayload)(rewritten),
        };
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("slug/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("lessons/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findLesson", null);
exports.CoursesController = CoursesController = __decorate([
    (0, common_1.Controller)("courses"),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map