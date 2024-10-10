"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_user_route_1 = __importDefault(require("./admin-user.route"));
const admin_auth_route_1 = __importDefault(require("./admin-auth.route"));
const admin_category_route_1 = __importDefault(require("./admin-category.route"));
const admin_product_route_1 = __importDefault(require("./admin-product.route"));
const adminRoutes = {
    prefix: '/admin/',
    routes: [
        {
            path: 'users',
            route: admin_user_route_1.default,
        },
        {
            path: 'products',
            route: admin_product_route_1.default,
        },
        {
            path: 'categories',
            route: admin_category_route_1.default,
        },
        {
            path: '',
            route: admin_auth_route_1.default,
        },
    ],
};
exports.default = adminRoutes;
