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
exports.StoriesController = void 0;
const common_1 = require("@nestjs/common");
const stories_service_1 = require("./stories.service");
const crypto_helper_1 = require("../common/crypto.helper");
let StoriesController = class StoriesController {
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    async findAll(req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const data = await this.storiesService.findAll();
        const rewritten = data.map((story) => {
            const jsonStr = JSON.stringify(story);
            const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
            return JSON.parse(replacedStr);
        });
        return {
            payload: (0, crypto_helper_1.encryptPayload)(rewritten),
        };
    }
    async findOne(id, req) {
        const cdnUrl = process.env.CDN_URL || `http://${req.headers.host}/cdn`;
        const storyId = parseInt(id, 10);
        if (isNaN(storyId)) {
            throw new common_1.NotFoundException("Invalid story ID");
        }
        const data = await this.storiesService.findOne(storyId);
        if (!data) {
            throw new common_1.NotFoundException(`Story with ID ${id} not found`);
        }
        const jsonStr = JSON.stringify(data);
        const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
        const rewritten = JSON.parse(replacedStr);
        return {
            payload: (0, crypto_helper_1.encryptPayload)(rewritten),
        };
    }
};
exports.StoriesController = StoriesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "findOne", null);
exports.StoriesController = StoriesController = __decorate([
    (0, common_1.Controller)("stories"),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], StoriesController);
//# sourceMappingURL=stories.controller.js.map