"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_route_1 = require("./order.route");
const user_user_route_1 = require("./user-user.route");
const userRoutes = {
    prefix: '/',
    routes: [
        {
            path: 'user',
            route: user_user_route_1.userUserRouter,
        },
        {
            path: 'purchases',
            route: order_route_1.userPurchaseRouter,
        },
    ],
};
exports.default = userRoutes;
