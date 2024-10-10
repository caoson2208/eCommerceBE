"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("./utils/response");
const config_1 = require("./constants/config");
const database_1 = require("./database/database");
const helper_1 = require("./utils/helper");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const chalk_1 = __importDefault(require("chalk"));
const helmet_1 = __importDefault(require("helmet"));
const index_route_1 = __importDefault(require("./routes/common/index.route"));
const index_route_2 = __importDefault(require("./routes/common/index.route"));
const index_route_3 = __importDefault(require("./routes/user/index.route"));
require('dotenv').config();
const app = (0, express_1.default)();
(0, database_1.connectMongoDB)();
const routes = [{ ...index_route_2.default }, { ...index_route_3.default }, { ...index_route_1.default }];
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const dirNameWithEnv = helper_1.isProduction ? path_1.default.dirname(__dirname) : __dirname;
const handlerImage = Object.values(config_1.FOLDERS).reduce((result, current) => {
    return [
        ...result,
        express_1.default.static(path_1.default.join(dirNameWithEnv, `/${config_1.FOLDER_UPLOAD}/${current}`)),
    ];
}, [express_1.default.static(path_1.default.join(dirNameWithEnv, `/${config_1.FOLDER_UPLOAD}`))]);
app.use(`/${config_1.ROUTE_IMAGE}`, ...handlerImage);
routes.forEach((item) => item.routes.forEach((route) => app.use(item.prefix + route.path, route.route)));
app.use(function (err, req, res, next) {
    (0, response_1.responseError)(res, err);
});
app.listen(process.env.PORT, function () {
    console.log(chalk_1.default.greenBright(`API listening on port ${process.env.PORT}!`));
});
