"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const addCategoryRules = () => {
    return [
        (0, express_validator_1.body)('name')
            .exists({ checkFalsy: true })
            .withMessage('Tên không được để trống')
            .isLength({ max: 160 })
            .withMessage('Tên phải ít hơn 160 kí tự'),
    ];
};
const updateCategoryRules = () => {
    return addCategoryRules();
};
const getCategoryRules = () => {
    return [
        (0, express_validator_1.query)('exclude')
            .if((value) => value)
            .isMongoId()
            .withMessage('exclude không đúng định dạng'),
    ];
};
const categoryMiddleware = {
    addCategoryRules,
    updateCategoryRules,
    getCategoryRules,
};
exports.default = categoryMiddleware;
