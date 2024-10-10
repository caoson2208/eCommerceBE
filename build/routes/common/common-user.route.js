"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
const user_middleware_1 = __importDefault(require("../../middleware/user.middleware"));
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const commonUserRouter = (0, express_1.Router)();
commonUserRouter.get('/me', auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(user_controller_1.default.getDetailMySelf));
commonUserRouter.put('/me', auth_middleware_1.default.verifyAccessToken, user_middleware_1.default.updateUserRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(user_controller_1.default.updateMe));
exports.default = commonUserRouter;
