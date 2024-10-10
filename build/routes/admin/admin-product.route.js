"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../../utils/response");
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const product_controller_1 = __importDefault(require("../../controllers/product.controller"));
const product_middleware_1 = __importDefault(require("../../middleware/product.middleware"));
const adminProductRouter = (0, express_1.Router)();
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId
 * @route admin/products
 * @method get
 */
adminProductRouter.get('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, product_middleware_1.default.getProductsRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(product_controller_1.default.getProducts));
/**
 * [Get all products ]
 * @queryParam type: string, category:mongoId
 * @route admin/products/all
 * @method get
 */
adminProductRouter.get('/all', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, product_middleware_1.default.getAllProductsRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(product_controller_1.default.getAllProducts));
adminProductRouter.get('/:product_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('product_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(product_controller_1.default.getProduct));
adminProductRouter.post('', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, product_middleware_1.default.addProductRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(product_controller_1.default.addProduct));
adminProductRouter.put('/:product_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('product_id'), helpers_middleware_1.default.idValidator, product_middleware_1.default.updateProductRules(), helpers_middleware_1.default.entityValidator, (0, response_1.wrapAsync)(product_controller_1.default.updateProduct));
adminProductRouter.delete('/delete/:product_id', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.idRule('product_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(product_controller_1.default.deleteProduct));
adminProductRouter.delete('/delete-many', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, helpers_middleware_1.default.listIdRule('list_id'), helpers_middleware_1.default.idValidator, (0, response_1.wrapAsync)(product_controller_1.default.deleteManyProducts));
adminProductRouter.post('/upload-image', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, (0, response_1.wrapAsync)(product_controller_1.default.uploadProductImage));
adminProductRouter.post('/upload-images', auth_middleware_1.default.verifyAccessToken, auth_middleware_1.default.verifyAdmin, (0, response_1.wrapAsync)(product_controller_1.default.uploadManyProductImages));
exports.default = adminProductRouter;
