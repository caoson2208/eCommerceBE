"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
const status_1 = require("../constants/status");
const category_model_1 = require("../database/models/category.model");
const addCategory = async (req, res) => {
    const name = req.body.name;
    const categoryAdd = await new category_model_1.CategoryModel({ name }).save();
    const response = {
        message: 'Tạo Category thành công',
        data: categoryAdd.toObject({
            transform: (doc, ret, option) => {
                delete ret.__v;
                return ret;
            },
        }),
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getCategories = async (req, res) => {
    const { exclude } = req.query;
    let condition = exclude ? { _id: { $ne: exclude } } : {};
    const categories = await category_model_1.CategoryModel.find(condition)
        .select({ __v: 0 })
        .lean();
    const response = {
        message: 'Lấy categories thành công',
        data: categories,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getCategory = async (req, res) => {
    const categoryDB = await category_model_1.CategoryModel.findById(req.params.category_id)
        .select({ __v: 0 })
        .lean();
    if (categoryDB) {
        const response = {
            message: 'Lấy category thành công',
            data: categoryDB,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy Category');
    }
};
const updateCategory = async (req, res) => {
    const { name } = req.body;
    const categoryDB = await category_model_1.CategoryModel.findByIdAndUpdate(req.params.category_id, { name }, { new: true })
        .select({ __v: 0 })
        .lean();
    if (categoryDB) {
        const response = {
            message: 'Cập nhật category thành công',
            data: categoryDB,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy Category');
    }
};
const deleteCategory = async (req, res) => {
    const category_id = req.params.category_id;
    const categoryDB = await category_model_1.CategoryModel.findByIdAndDelete(category_id).lean();
    if (categoryDB) {
        return (0, response_1.responseSuccess)(res, { message: 'Xóa thành công', data: categoryDB });
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.BAD_REQUEST, 'Không tìm thấy Category');
    }
};
const categoryController = {
    addCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
exports.default = categoryController;
