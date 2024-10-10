"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const commonAuthRouter = (0, express_1.Router)();
commonAuthRouter.post('/login', auth_middleware_1.default.loginRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(auth_controller_1.default.loginController));
commonAuthRouter.post('/logout', auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(auth_controller_1.default.logoutController));
commonAuthRouter.post('/register', auth_middleware_1.default.registerRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(auth_controller_1.default.registerController));
commonAuthRouter.post('/refresh-access-token', auth_middleware_1.default.verifyRefreshToken, (0, response_1.wrapAsync)(auth_controller_1.default.refreshTokenController));
exports.default = commonAuthRouter;
