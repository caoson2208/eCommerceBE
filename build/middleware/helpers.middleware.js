"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const status_1 = require("../constants/status");
const response_1 = require("../utils/response");
const validate_1 = require("../utils/validate");
const idRule = (...id) => {
    return id.map((item) => {
        return (0, express_validator_1.check)(item).isMongoId().withMessage(`${item} không đúng định dạng`);
    });
};
const listIdRule = (list_id) => {
    return (0, express_validator_1.body)(list_id)
        .custom((value) => value.findIndex((item) => !(0, validate_1.isMongoId)(item)))
        .withMessage(`${list_id} không đúng định dạng`);
};
const idValidator = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const error = errors
        .array()
        .reduce((result, item, index) => {
        result[item.param] = item.msg;
        return result;
    }, {});
    return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, error.message));
};
const entityValidator = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const error = errors
        .array({ onlyFirstError: true })
        .reduce((result, item, index) => {
        result[item.param] = item.msg;
        return result;
    }, {});
    return (0, response_1.responseError)(res, new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, error.message));
};
const helpersMiddleware = {
    idRule,
    idValidator,
    entityValidator,
    listIdRule,
};
exports.default = helpersMiddleware;
