"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_user_route_1 = __importDefault(require("./common-user.route"));
const common_auth_route_1 = __importDefault(require("./common-auth.route"));
const common_product_route_1 = __importDefault(require("./common-product.route"));
const common_category_route_1 = __importDefault(require("./common-category.route"));
const commonRoutes = {
    prefix: '/',
    routes: [
        {
            path: '',
            route: common_user_route_1.default,
        },
        {
            path: '',
            route: common_auth_route_1.default,
        },
        {
            path: 'products',
            route: common_product_route_1.default,
        },
        {
            path: 'categories',
            route: common_category_route_1.default,
        },
    ],
};
exports.default = commonRoutes;
