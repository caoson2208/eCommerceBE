"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addUserRules = () => {
    return [
        (0, express_validator_1.body)('email')
            .isEmail()
            .withMessage('Email không đúng định dạng')
            .isLength({ min: 6, max: 160 })
            .withMessage('Email phải từ 6-160 kí tự'),
        (0, express_validator_1.body)('name')
            .exists({ checkFalsy: true })
            .withMessage('Tên không được để trống')
            .isLength({ max: 160 })
            .withMessage('Tên phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu phải từ 6-160 kí tự'),
        (0, express_validator_1.body)('date_of_birth')
            .if((value) => value !== undefined)
            .isISO8601()
            .withMessage('Ngày sinh không đúng định dạng'),
        (0, express_validator_1.body)('address')
            .if((value) => value !== undefined)
            .isLength({ max: 160 })
            .withMessage('Địa chỉ phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('phone')
            .if((value) => value !== undefined)
            .isLength({ max: 20 })
            .withMessage('SDT không được lớn hơn 20 kí tự'),
        (0, express_validator_1.body)('roles')
            .exists({ checkFalsy: true })
            .withMessage('Phân quyền không được để trống')
            .custom((value) => {
            if (!Array.isArray(value)) {
                return false;
            }
            if (value.some((item) => typeof item !== 'string')) {
                return false;
            }
            return true;
        })
            .withMessage('Role không đúng định dạng'),
        (0, express_validator_1.body)('avatar')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('avatar phải là string url')
            .isLength({ max: 1000 })
            .withMessage('URL avatar không được lớn hơn 1000 ký tự'),
    ];
};
const updateUserRules = () => {
    return [
        (0, express_validator_1.body)('name')
            .if((value) => value !== undefined)
            .exists({ checkFalsy: true })
            .withMessage('Tên không được để trống')
            .isLength({ max: 160 })
            .withMessage('Tên phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('date_of_birth')
            .if((value) => value !== undefined)
            .isISO8601()
            .withMessage('Ngày sinh không đúng định dạng'),
        (0, express_validator_1.body)('address')
            .if((value) => value !== undefined)
            .isLength({ max: 160 })
            .withMessage('Địa chỉ phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('phone')
            .if((value) => value !== undefined)
            .isLength({ max: 20 })
            .withMessage('SDT phải ít hơn 20 kí tự'),
        (0, express_validator_1.body)('roles')
            .if((value) => value !== undefined)
            .custom((value) => {
            if (!Array.isArray(value)) {
                return false;
            }
            if (value.some((item) => typeof item !== 'string')) {
                return false;
            }
            return true;
        })
            .withMessage('Role không đúng định dạng'),
        (0, express_validator_1.body)('avatar')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('avatar phải là string url')
            .isLength({ max: 1000 })
            .withMessage('URL avatar không được lớn hơn 1000 ký tự'),
        (0, express_validator_1.body)('password')
            .if((value) => value !== undefined)
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu phải từ 6-160 kí tự'),
        (0, express_validator_1.body)('new_password')
            .if((value) => value !== undefined)
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu mới phải từ 6-160 kí tự'),
    ];
};
const updateMeRules = () => {
    return [
        (0, express_validator_1.body)('name')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('Tên phải ở định dạng string')
            .isLength({ max: 160 })
            .withMessage('Tên phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('date_of_birth')
            .if((value) => value !== undefined)
            .isISO8601()
            .withMessage('Ngày sinh không đúng định dạng'),
        (0, express_validator_1.body)('address')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('Địa chỉ phải ở định dạng string')
            .isLength({ max: 160 })
            .withMessage('Địa chỉ phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('phone')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('SDT phải ở định dạng string')
            .isLength({ max: 20 })
            .withMessage('SDT phải ít hơn 20 kí tự'),
        (0, express_validator_1.body)('avatar')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('avatar phải là string url')
            .isLength({ max: 1000 })
            .withMessage('URL avatar không được lớn hơn 1000 ký tự'),
        (0, express_validator_1.body)('password')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('Mật khẩu phải ở định dạng string')
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu phải từ 6-160 kí tự'),
        (0, express_validator_1.body)('new_password')
            .if((value) => value !== undefined)
            .isString()
            .withMessage('Mật khẩu mới phải ở định dạng string')
            .isLength({ min: 6, max: 160 })
            .withMessage('Mật khẩu mới phải từ 6-160 kí tự'),
    ];
};
const userMiddleware = { addUserRules, updateUserRules, updateMeRules };
exports.default = userMiddleware;
