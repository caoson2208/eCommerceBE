"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const user_middleware_1 = __importDefault(require("../../middleware/user.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const adminUserRouter = (0, express_1.Router)();
adminUserRouter.get('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, user_controller_1.default.getUsers);
adminUserRouter.post('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, user_middleware_1.default.addUserRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(user_controller_1.default.addUser));
adminUserRouter.put('/:user_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('user_id'), helpers_middleware_1.default.idValidator, user_middleware_1.default.updateUserRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(user_controller_1.default.updateUser));
adminUserRouter.get('/:user_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('user_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(user_controller_1.default.deleteUser));
adminUserRouter.delete('/delete/:user_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('user_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(user_controller_1.default.deleteUser));
exports.default = adminUserRouter;
