"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUserRouter = void 0;
const express_1 = require("express");
const response_1 = require("../../utils/response");
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const user_middleware_1 = __importDefault(require("../../middleware/user.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
exports.userUserRouter = (0, express_1.Router)();
exports.userUserRouter.put('', user_middleware_1.default.updateMeRules(), helpers_middleware_1.default.entityValidator, auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(user_controller_1.default.updateMe));
exports.userUserRouter.post('/upload-avatar', auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(user_controller_1.default.uploadAvatar));
exports.userUserRouter.get('', auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(user_controller_1.default.getDetailMySelf));
