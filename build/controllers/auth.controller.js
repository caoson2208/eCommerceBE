"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
const crypt_1 = require("../utils/crypt");
const config_1 = require("../constants/config");
const jwt_1 = require("../utils/jwt");
const role_enum_1 = require("../constants/role.enum");
const user_model_1 = require("../database/models/user.model");
const access_token_model_1 = require("../database/models/access-token.model");
const refresh_token_model_1 = require("../database/models/refresh-token.model");
const lodash_1 = require("lodash");
const status_1 = require("../constants/status");
const getExpire = (req) => {
    let expireAccessTokenConfig = Number(req.headers['expire-access-token']);
    expireAccessTokenConfig = Number.isInteger(expireAccessTokenConfig)
        ? expireAccessTokenConfig
        : config_1.config.EXPIRE_ACCESS_TOKEN;
    let expireRefreshTokenConfig = Number(req.headers['expire-refresh-token']);
    expireRefreshTokenConfig = Number.isInteger(expireRefreshTokenConfig)
        ? expireRefreshTokenConfig
        : config_1.config.EXPIRE_REFRESH_TOKEN;
    return {
        expireAccessTokenConfig,
        expireRefreshTokenConfig,
    };
};
const registerController = async (req, res) => {
    const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
    const body = req.body;
    const { email, password } = body;
    const userInDB = await user_model_1.UserModel.findOne({ email: email }).exec();
    if (!userInDB) {
        const hashedPassword = (0, crypt_1.hashValue)(password);
        const user = {
            email,
            password: hashedPassword,
        };
        const userAdd = await (await new user_model_1.UserModel(user).save()).toObject();
        const payloadJWT = {
            email,
            id: userAdd._id.toString(),
            roles: [role_enum_1.ROLE.USER],
            created_at: new Date().toISOString(),
        };
        const access_token = await (0, jwt_1.signToken)(payloadJWT, config_1.config.SECRET_KEY, expireAccessTokenConfig);
        const refresh_token = await (0, jwt_1.signToken)(payloadJWT, config_1.config.SECRET_KEY, expireRefreshTokenConfig);
        await new access_token_model_1.AccessTokenModel({
            user_id: userAdd._id,
            token: access_token,
        }).save();
        await new refresh_token_model_1.RefreshTokenModel({
            user_id: userAdd._id,
            token: refresh_token,
        }).save();
        const response = {
            message: 'Đăng ký thành công',
            data: {
                access_token: 'Bearer ' + access_token,
                expires: config_1.config.EXPIRE_ACCESS_TOKEN,
                refresh_token,
                expires_refresh_token: expireRefreshTokenConfig,
                user: (0, lodash_1.omit)(userAdd, ['password']),
            },
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    throw new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, 'Email đã tồn tại');
};
const loginController = async (req, res) => {
    const { expireAccessTokenConfig, expireRefreshTokenConfig } = getExpire(req);
    const body = req.body;
    const { email, password } = body;
    const userInDB = await user_model_1.UserModel.findOne({ email: email }).lean();
    if (!userInDB) {
        throw new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, 'Email hoặc password không đúng');
    }
    else {
        const match = (0, crypt_1.compareValue)(password, userInDB.password);
        if (!match) {
            throw new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, 'Email hoặc password không đúng');
        }
        let payloadJWT = {
            id: userInDB._id,
            email: userInDB.email,
            roles: userInDB.roles,
            created_at: new Date().toISOString(),
        };
        const access_token = await (0, jwt_1.signToken)(payloadJWT, config_1.config.SECRET_KEY, expireAccessTokenConfig);
        const refresh_token = await (0, jwt_1.signToken)(payloadJWT, config_1.config.SECRET_KEY, expireRefreshTokenConfig);
        await new access_token_model_1.AccessTokenModel({
            user_id: userInDB._id,
            token: access_token,
        }).save();
        await new refresh_token_model_1.RefreshTokenModel({
            user_id: userInDB._id,
            token: refresh_token,
        }).save();
        const response = {
            message: 'Đăng nhập thành công',
            data: {
                access_token: 'Bearer ' + access_token,
                expires: expireAccessTokenConfig,
                refresh_token,
                expires_refresh_token: expireRefreshTokenConfig,
                user: (0, lodash_1.omit)(userInDB, ['password']),
            },
        };
        return (0, response_1.responseSuccess)(res, response);
    }
};
const refreshTokenController = async (req, res) => {
    const { expireAccessTokenConfig } = getExpire(req);
    const userDB = await user_model_1.UserModel.findById(req.jwtDecoded.id).lean();
    if (userDB) {
        const payload = {
            id: userDB._id,
            email: userDB.email,
            roles: userDB.roles,
            created_at: new Date().toISOString(),
        };
        const access_token = await (0, jwt_1.signToken)(payload, config_1.config.SECRET_KEY, expireAccessTokenConfig);
        await new access_token_model_1.AccessTokenModel({
            user_id: req.jwtDecoded.id,
            token: access_token,
        }).save();
        const response = {
            message: 'Refresh Token thành công',
            data: { access_token: 'Bearer ' + access_token },
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    throw new response_1.ErrorHandler(401, 'Refresh Token không tồn tại');
};
const logoutController = async (req, res) => {
    var _a;
    const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    await access_token_model_1.AccessTokenModel.findOneAndDelete({
        token: access_token,
    }).exec();
    return (0, response_1.responseSuccess)(res, { message: 'Đăng xuất thành công', data: {} });
};
const authController = {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
};
exports.default = authController;
