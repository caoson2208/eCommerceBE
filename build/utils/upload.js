"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadManyFile = exports.uploadFile = void 0;
const formidable_1 = require("formidable");
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const mv_1 = __importDefault(require("mv"));
const response_1 = require("./response");
const status_1 = require("../constants/status");
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const config_1 = require("../constants/config");
const getExtension = (filename) => /(?:\.([^.]+))?$/.exec(filename)[1];
const upload = (image, folder) => {
    return new Promise((resolve, reject) => {
        const dir = `${config_1.FOLDER_UPLOAD}${folder ? '/' + folder : ''}`;
        if (!fs_1.default.existsSync(dir)) {
            shelljs_1.default.mkdir('-p', dir);
        }
        const tmpPath = image.path;
        const newName = (0, uuid_1.v4)() + '.' + getExtension(image.name);
        const newPath = dir + '/' + newName;
        (0, mv_1.default)(tmpPath, newPath, function (err) {
            if (err)
                return reject(new response_1.ErrorHandler(status_1.STATUS.INTERNAL_SERVER_ERROR, 'Lỗi đổi tên file'));
            resolve(newName);
        });
    });
};
const uploadFile = (req, folder = '') => {
    return new Promise((resolve, reject) => {
        const form = new formidable_1.IncomingForm();
        form.parse(req, function (error, fields, files) {
            if (error) {
                return reject(error);
            }
            try {
                const { image } = files;
                const errorEntity = {};
                if (!image) {
                    errorEntity.image = 'Không tìm thấy image';
                }
                else if (!image.type.includes('image')) {
                    errorEntity.image = 'image không đúng định dạng';
                }
                else if (image.size > 1000000) {
                    errorEntity.image = 'Kích thước image phải <= 1MB';
                }
                if (!(0, lodash_1.isEmpty)(errorEntity)) {
                    return reject(new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, errorEntity));
                }
                upload(image, folder)
                    .then((res) => {
                    resolve(res);
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    });
};
exports.uploadFile = uploadFile;
const uploadManyFile = (req, folder = '') => {
    return new Promise((resolve, reject) => {
        const form = new formidable_1.IncomingForm({ multiples: true });
        form.parse(req, function (error, fields, files) {
            if (error) {
                return reject(error);
            }
            try {
                const { images } = files;
                const errorEntity = {};
                if (!images) {
                    errorEntity.image = 'Không tìm thấy images';
                }
                else if (images.some((image) => !image.type.includes('image'))) {
                    errorEntity.image = 'image không đúng định dạng';
                }
                if (!(0, lodash_1.isEmpty)(errorEntity)) {
                    return reject(new response_1.ErrorHandler(status_1.STATUS.UNPROCESSABLE_ENTITY, errorEntity));
                }
                const chainUpload = images.map((image) => {
                    return upload(image, folder);
                });
                Promise.all(chainUpload)
                    .then((res) => {
                    resolve(res);
                })
                    .catch((err) => {
                    reject(err);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    });
};
exports.uploadManyFile = uploadManyFile;
