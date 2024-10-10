"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const category_controller_1 = __importDefault(require("../../controllers/category.controller"));
const cateogry_middleware_1 = __importDefault(require("../../middleware/cateogry.middleware"));
const adminCategoryRouter = (0, express_1.Router)();
adminCategoryRouter.get('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, cateogry_middleware_1.default.getCategoryRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(category_controller_1.default.getCategories));
adminCategoryRouter.get('/:category_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('category_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(category_controller_1.default.getCategory));
adminCategoryRouter.post('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, cateogry_middleware_1.default.addCategoryRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(category_controller_1.default.addCategory));
adminCategoryRouter.put('/:category_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('category_id'), helpers_middleware_1.default.idValidator, cateogry_middleware_1.default.updateCategoryRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(category_controller_1.default.updateCategory));
adminCategoryRouter.delete('/delete/:category_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('category_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(category_controller_1.default.deleteCategory));
exports.default = adminCategoryRouter;
