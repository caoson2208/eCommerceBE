"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const getProductsRules = () => {
    return [
        (0, express_validator_1.query)('page')
            .if((value) => value !== undefined)
            .isInt()
            .withMessage('page không đúng định dạng'),
        (0, express_validator_1.query)('limit')
            .if((value) => value !== undefined)
            .isInt()
            .withMessage('limit không đúng định dạng'),
        (0, express_validator_1.query)('category')
            .if((value) => value !== undefined)
            .isMongoId()
            .withMessage('category không đúng định dạng'),
        (0, express_validator_1.query)('exclude')
            .if((value) => value !== undefined)
            .isMongoId()
            .withMessage('exclude không đúng định dạng'),
    ];
};
const getAllProductsRules = () => {
    return [
        (0, express_validator_1.query)('category')
            .if((value) => value !== undefined)
            .isMongoId()
            .withMessage('category không đúng định dạng'),
    ];
};
const getPagesRules = () => {
    return [
        (0, express_validator_1.query)('limit').isInt().withMessage('limit không đúng định dạng'),
        (0, express_validator_1.query)('category')
            .if((value) => value !== undefined)
            .isMongoId()
            .withMessage('category không đúng định dạng'),
    ];
};
const addProductRules = () => {
    return [
        (0, express_validator_1.body)('name')
            .exists({ checkFalsy: true })
            .withMessage('Tiêu đề không được để trống')
            .isLength({ max: 160 })
            .withMessage('Tiêu đề  phải ít hơn 160 kí tự'),
        (0, express_validator_1.body)('image')
            .exists({ checkFalsy: true })
            .withMessage('image không được để trống')
            .isLength({ max: 1000 })
            .withMessage('image  phải ít hơn 1000 kí tự'),
        (0, express_validator_1.body)('images')
            .if((value) => value !== undefined)
            .isArray()
            .withMessage('images phải dạng string[]'),
        (0, express_validator_1.body)('category')
            .exists({ checkFalsy: true })
            .withMessage('category không được để trống')
            .isMongoId()
            .withMessage(`category phải là id`),
        (0, express_validator_1.body)('price')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('price phải ở định dạng number'),
        (0, express_validator_1.body)('price_before_discount')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('price_before_discount phải ở định dạng number'),
        (0, express_validator_1.body)('quantity')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('quantity phải ở định dạng number'),
        (0, express_validator_1.body)('view')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('view phải ở định dạng number'),
        (0, express_validator_1.body)('sold')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('sold phải ở định dạng number'),
        (0, express_validator_1.body)('rating')
            .if((value) => value !== undefined)
            .isNumeric()
            .withMessage('rating phải ở định dạng number'),
    ];
};
const updateProductRules = () => {
    return addProductRules();
};
const ProductMiddleware = {
    addProductRules,
    updateProductRules,
    getProductsRules,
    getPagesRules,
    getAllProductsRules,
};
exports.default = ProductMiddleware;
