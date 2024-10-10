"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPurchaseRouter = void 0;
const express_1 = require("express");
const response_1 = require("../../utils/response");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const helpers_middleware_1 = __importDefault(require("../../middleware/helpers.middleware"));
const purchaseMiddleware = __importStar(require("../../middleware/order.middleware"));
const purchaseController = __importStar(require("../../controllers/order.controller"));
exports.userPurchaseRouter = (0, express_1.Router)();
exports.userPurchaseRouter.post('/buy-products', purchaseMiddleware.buyProductsRules(), helpers_middleware_1.default.entityValidator, auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(purchaseController.buyProducts));
exports.userPurchaseRouter.post('/add-to-cart', purchaseMiddleware.addToCartRules(), helpers_middleware_1.default.entityValidator, auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(purchaseController.addToCart));
exports.userPurchaseRouter.put('/update-order', purchaseMiddleware.updatePurchaseRules(), helpers_middleware_1.default.entityValidator, auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(purchaseController.updatePurchase));
exports.userPurchaseRouter.delete('', purchaseMiddleware.deletePurchasesRules(), helpers_middleware_1.default.entityValidator, auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(purchaseController.deletePurchases));
exports.userPurchaseRouter.get('', auth_middleware_1.default.verifyAccessToken, (0, response_1.wrapAsync)(purchaseController.getPurchases));
