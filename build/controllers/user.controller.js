"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypt_1 = require("../utils/crypt");
const response_1 = require("../utils/response");
const user_model_1 = require("../database/models/user.model");
const status_1 = require("../constants/status");
const lodash_1 = require("lodash");
const upload_1 = require("../utils/upload");
const config_1 = require("../constants/config");
const addUser = async (req, res) => {
    const form = req.body;
    const { email, password, address, date_of_birth, name, phone, roles, avatar, } = form;
    const userInDB = await user_model_1.UserModel.findOne({ email: email }).exec();
    if (!userInDB) {
        const hashedPassword = (0, crypt_1.hashValue)(password);
        const user = {
            email,
            password: hashedPassword,
            roles,
            address,
            date_of_birth,
            name,
            phone,
            avatar,
        };
        Object.keys(user).forEach((key) => user[key] === undefined &&
            delete user[key]);
        const userAdd = await new user_model_1.UserModel(user).save();
        const response = {
            message: 'Tạo người dùng thành công',
            data: userAdd.toObject({
                transform: (doc, ret, option) => {
                    delete ret.password;
                    delete ret.__v;
                    return ret;
                },
            }),
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    throw new response_1.ErrorHandler(422, 'Email đã tồn tại');
};
const getUsers = async (req, res) => {
    const usersDB = await user_model_1.UserModel.find({})
        .select({ password: 0, __v: 0 })
        .lean();
    const response = {
        message: 'Lấy người dùng thành công',
        data: usersDB,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getDetailMySelf = async (req, res) => {
    const userDB = await user_model_1.UserModel.findById(req.jwtDecoded.id)
        .select({ password: 0, __v: 0 })
        .lean();
    if (userDB) {
        const response = {
            message: 'Lấy người dùng thành công',
            data: userDB,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, 'Không tìm thấy người dùng');
    }
};
const getUser = async (req, res) => {
    const userDB = await user_model_1.UserModel.findById(req.params.user_id)
        .select({ password: 0, __v: 0 })
        .lean();
    if (userDB) {
        const response = {
            message: 'Lấy người dùng thành công',
            data: userDB,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy người dùng');
    }
};
const updateUser = async (req, res) => {
    const form = req.body;
    const { password, address, date_of_birth, name, phone, roles, avatar } = form;
    const user = (0, lodash_1.omitBy)({
        password,
        address,
        date_of_birth,
        name,
        phone,
        roles,
        avatar,
    }, (value) => value === undefined || value === '');
    const userDB = await user_model_1.UserModel.findByIdAndUpdate(req.params.user_id, user, {
        new: true,
    })
        .select({ password: 0, __v: 0 })
        .lean();
    if (userDB) {
        const response = {
            message: 'Cập nhật người dùng thành công',
            data: userDB,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy người dùng');
    }
};
const uploadAvatar = async (req, res) => {
    const path = await (0, upload_1.uploadFile)(req, config_1.FOLDERS.AVATAR);
    const response = {
        message: 'Upload ảnh đại diện thành công',
        data: path,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const updateMe = async (req, res) => {
    const form = req.body;
    const { email, password, new_password, address, date_of_birth, name, phone, avatar, } = form;
    const user = (0, lodash_1.omitBy)({
        email,
        password,
        address,
        date_of_birth,
        name,
        phone,
        avatar,
    }, (value) => value === undefined || value === '');
    const userDB = await user_model_1.UserModel.findById(req.jwtDecoded.id).lean();
    if (user.password) {
        const hash_password = (0, crypt_1.hashValue)(password);
        if (hash_password === userDB.password) {
            Object.assign(user, { password: (0, crypt_1.hashValue)(new_password) });
        }
        else {
            throw new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, 'Password không đúng');
        }
    }
    const updatedUserDB = await user_model_1.UserModel.findByIdAndUpdate(req.jwtDecoded.id, user, { new: true })
        .select({ password: 0, __v: 0 })
        .lean();
    const response = {
        message: 'Cập nhật thông tin thành công',
        data: updatedUserDB,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const deleteUser = async (req, res) => {
    const user_id = req.params.user_id;
    const userDB = await user_model_1.UserModel.findByIdAndDelete(user_id).lean();
    if (userDB) {
        return (0, response_1.responseSuccess)(res, {
            message: 'Xóa thành công',
            data: undefined,
        });
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy người dùng');
    }
};
const userController = {
    addUser,
    getUsers,
    getDetailMySelf,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    uploadAvatar,
};
exports.default = userController;
