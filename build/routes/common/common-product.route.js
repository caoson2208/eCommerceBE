"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const product_controller_1 = __importDefault(require("../../controllers/product.controller"));
const product_middleware_1 = __importDefault(require("../../middleware/product.middleware"));
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const commonProductRouter = (0, express_1.Router)();
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId, exclude: mongoId product
 * @route products
 * @method get
 */
commonProductRouter.get('', product_middleware_1.default.getProductsRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(product_controller_1.default.getProducts));
commonProductRouter.get('/:product_id', helpers_middleware_1.default.idRule('product_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(product_controller_1.default.getProduct));
commonProductRouter.get('/search', (0, response_1.wrapAsync)(product_controller_1.default.searchProduct));
exports.default = commonProductRouter;
