"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const status_1 = require("../constants/status");
const response_1 = require("./response");
const signToken = (payload, secret_key, token_life) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, secret_key, { expiresIn: token_life }, (error, token) => {
            if (error) {
                return reject(error);
            }
            resolve(token);
        });
    });
};
exports.signToken = signToken;
const verifyToken = (token, secret_key) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret_key, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    reject(new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, "Token hết hạn"));
                }
                else {
                    reject(new response_1.ErrorHandler(status_1.STATUS.UNAUTHORIZED, "Token không đúng"));
                }
            }
            resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
