"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../constants/config");
const jwt_1 = require("../utils/jwt");
const role_enum_1 = require("../constants/role.enum");
const response_1 = require("../utils/response");
const status_1 = require("../constants/status");
const access_token_model_1 = require("../database/models/access-token.model");
const refresh_token_model_1 = require("../database/models/refresh-token.model");
const express_validator_1 = require("express-validator");
const user_model_1 = require("../database/models/user.model");
const verifyAccessToken = async (req, res, next) => {
    var _a;
    const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (access_token) {
        try {
            const decoded = (await (0, jwt_1.verifyToken)(access_token, config_1.config.SECRET_KEY));
            req.jwtDecoded = decoded;
            const accessTokenDB = await access_token_model_1.AccessTokenModel.findOne({
                token: access_token,
            }).exec();
            if (accessTokenDB) {
                return next();
            }
            return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, 'Không tồn tại token'));
        }
        catch (error) {
            return (0, response_1.responseError)(res, error);
        }
    }
    return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, 'Token không được gửi'));
};
const verifyRefreshToken = async (req, res, next) => {
    const refresh_token = req.body.refresh_token;
    if (refresh_token) {
        try {
            const decoded = (await (0, jwt_1.verifyToken)(refresh_token, config_1.config.SECRET_KEY));
            req.jwtDecoded = decoded;
            const refreshTokenDB = await refresh_token_model_1.RefreshTokenModel.findOne({
                token: refresh_token,
            }).exec();
            if (refreshTokenDB) {
                return next();
            }
            return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, 'Không tồn tại token'));
        }
        catch (error) {
            return (0, response_1.responseError)(res, error);
        }
    }
    return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, 'Token không được gửi'));
};
const verifyAdmin = async (req, res, next) => {
    const userDB = await user_model_1.UserModel.findById(req.jwtDecoded.id).lean();
    if (userDB && userDB.roles && userDB.roles.includes(role_enum_1.ROLE.ADMIN)) {
        return next();
    }
    return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.FORBIDDEN, 'Không có quyền truy cập'));
};
const registerRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('Email không đúng định dạng')
            .isLength({ min: 5, max: 160 })
            .withMessage('Email phải từ 5-160 kí tự'),
        (0, express_validator_1.body)('password')
            .exists({ checkFalsy: true })
            .withMessage('Mật khẩu không được để trống')
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu phải từ 6-160 kí tự'),
    ];
};
const loginRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('Email không đúng định dạng')
            .isLength({ min: 5, max: 160 })
            .withMessage('Email phải từ 5-160 kí tự'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu phải từ 6-160 kí tự'),
    ];
};
const authMiddleware = {
    verifyAccessToken,
    verifyAdmin,
    registerRules,
    loginRules,
    verifyRefreshToken,
};
exports.default = authMiddleware;
