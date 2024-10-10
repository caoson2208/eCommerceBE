"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageProduct = void 0;
const response_1 = require("../utils/response");
const product_model_1 = require("../database/models/product.model");
const status_1 = require("../constants/status");
const mongoose_1 = __importDefault(require("mongoose"));
const validate_1 = require("../utils/validate");
const upload_1 = require("../utils/upload");
const helper_1 = require("../utils/helper");
const config_1 = require("../constants/config");
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const product_1 = require("../constants/product");
const handleImageProduct = (product) => {
    if (product.image !== undefined && product.image !== '') {
        product.image = helper_1.HOST + `/${config_1.ROUTE_IMAGE}/` + product.image;
    }
    if (product.images !== undefined && product.images.length !== 0) {
        product.images = product.images.map((image) => {
            return image !== '' ? helper_1.HOST + `/${config_1.ROUTE_IMAGE}/` + image : '';
        });
    }
    return product;
};
exports.handleImageProduct = handleImageProduct;
const removeImageProduct = (image) => {
    if (image !== undefined && image !== '') {
        fs_1.default.unlink(`${config_1.FOLDER_UPLOAD}/${config_1.FOLDERS.PRODUCT}/${image}`, (err) => {
            if (err)
                console.error(err);
        });
    }
};
const removeManyImageProduct = (images) => {
    if (images !== undefined && images.length > 0) {
        images.forEach((image) => {
            removeImageProduct(image);
        });
    }
};
const addProduct = async (req, res) => {
    const form = req.body;
    const { name, description, category, image, images, price, rating, price_before_discount, quantity, sold, view, } = form;
    const product = {
        name,
        description,
        category,
        image,
        images,
        price,
        rating,
        price_before_discount,
        quantity,
        sold,
        view,
    };
    const productAdd = await new product_model_1.ProductModel(product).save();
    const response = {
        message: 'Tạo sản phẩm thành công',
        data: productAdd.toObject({
            transform: (doc, ret, option) => {
                delete ret.__v;
                return (0, exports.handleImageProduct)(ret);
            },
        }),
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getProducts = async (req, res) => {
    let { page = 1, limit = 30, category, exclude, sort_by, order, rating_filter, price_max, price_min, name, } = req.query;
    page = Number(page);
    limit = Number(limit);
    let condition = {};
    if (category) {
        condition.category = category;
    }
    if (exclude) {
        condition._id = { $ne: exclude };
    }
    if (rating_filter) {
        condition.rating = { $gte: rating_filter };
    }
    if (price_max) {
        condition.price = {
            $lte: price_max,
        };
    }
    if (price_min) {
        condition.price = condition.price
            ? { ...condition.price, $gte: price_min }
            : { $gte: price_min };
    }
    if (!product_1.ORDER.includes(order)) {
        order = product_1.ORDER[0];
    }
    if (!product_1.SORT_BY.includes(sort_by)) {
        sort_by = product_1.SORT_BY[0];
    }
    if (name) {
        condition.name = {
            $regex: name,
            $options: 'i',
        };
    }
    let [products, totalProducts] = await Promise.all([
        product_model_1.ProductModel.find(condition)
            .populate({
            path: 'category',
        })
            .sort({ [sort_by]: order === 'desc' ? -1 : 1 })
            .skip(page * limit - limit)
            .limit(limit)
            .select({ __v: 0, description: 0 })
            .lean(),
        product_model_1.ProductModel.find(condition).countDocuments().lean(),
    ]);
    products = products.map((product) => (0, exports.handleImageProduct)(product));
    const page_size = Math.ceil(totalProducts / limit) || 1;
    const response = {
        message: 'Lấy các sản phẩm thành công',
        data: {
            products,
            pagination: {
                page,
                limit,
                page_size,
            },
        },
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getAllProducts = async (req, res) => {
    let { category } = req.query;
    let condition = {};
    if (category) {
        condition = { category: category };
    }
    let products = await product_model_1.ProductModel.find(condition)
        .populate({ path: 'category' })
        .sort({ createdAt: -1 })
        .select({ __v: 0, description: 0 })
        .lean();
    products = products.map((product) => (0, exports.handleImageProduct)(product));
    const response = {
        message: 'Lấy tất cả sản phẩm thành công',
        data: products,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const getProduct = async (req, res) => {
    let condition = { _id: req.params.product_id };
    const productDB = await product_model_1.ProductModel.findOneAndUpdate(condition, { $inc: { view: 1 } }, { new: true })
        .populate('category')
        .select({ __v: 0 })
        .lean();
    if (productDB) {
        const response = {
            message: 'Lấy sản phẩm thành công',
            data: (0, exports.handleImageProduct)(productDB),
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
};
const updateProduct = async (req, res) => {
    const form = req.body;
    const { name, description, category, image, rating, price, images, price_before_discount, quantity, sold, view, } = form;
    const product = (0, lodash_1.omitBy)({
        name,
        description,
        category,
        image,
        rating,
        price,
        images,
        price_before_discount,
        quantity,
        sold,
        view,
    }, (value) => value === undefined || value === '');
    const productDB = await product_model_1.ProductModel.findByIdAndUpdate(req.params.product_id, product, {
        new: true,
    })
        .select({ __v: 0 })
        .lean();
    if (productDB) {
        const response = {
            message: 'Cập nhật sản phẩm thành công',
            data: (0, exports.handleImageProduct)(productDB),
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
};
const deleteProduct = async (req, res) => {
    const product_id = req.params.product_id;
    const productDB = await product_model_1.ProductModel.findByIdAndDelete(product_id).lean();
    if (productDB) {
        removeImageProduct(productDB.image);
        removeManyImageProduct(productDB.images);
        return (0, response_1.responseSuccess)(res, {
            message: 'Xóa thành công',
            data: undefined,
        });
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
};
const deleteManyProducts = async (req, res) => {
    const list_id = req.body.list_id.map((id) => new mongoose_1.default.Types.ObjectId(id));
    const productDB = await product_model_1.ProductModel.find({
        _id: { $in: list_id },
    }).lean();
    const deletedData = await product_model_1.ProductModel.deleteMany({
        _id: { $in: list_id },
    }).lean();
    productDB.forEach((product) => {
        removeImageProduct(product.image);
        removeManyImageProduct(product.images);
    });
    if (productDB.length > 0) {
        return (0, response_1.responseSuccess)(res, {
            message: `Xóa ${deletedData.deletedCount} sản phẩm thành công`,
            data: { deleted_count: deletedData.deletedCount },
        });
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
};
const searchProduct = async (req, res) => {
    let { searchText } = req.query;
    searchText = decodeURI(searchText);
    let condition = { $text: { $search: `\"${searchText}\"` } };
    if (!(0, validate_1.isAdmin)(req)) {
        condition = Object.assign(condition, { visible: true });
    }
    let products = await product_model_1.ProductModel.find(condition)
        .populate('category')
        .sort({ createdAt: -1 })
        .select({ __v: 0, description: 0 })
        .lean();
    products = products.map((product) => (0, exports.handleImageProduct)(product));
    const response = {
        message: 'Tìm các sản phẩm thành công',
        data: products,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const uploadProductImage = async (req, res) => {
    const path = await (0, upload_1.uploadFile)(req, config_1.FOLDERS.PRODUCT);
    const response = {
        message: 'Upload ảnh thành công',
        data: path,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const uploadManyProductImages = async (req, res) => {
    const paths = await (0, upload_1.uploadManyFile)(req, config_1.FOLDERS.PRODUCT);
    const response = {
        message: 'Upload các ảnh thành công',
        data: paths,
    };
    return (0, response_1.responseSuccess)(res, response);
};
const ProductController = {
    addProduct,
    getAllProducts,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    deleteManyProducts,
    uploadProductImage,
    uploadManyProductImages,
};
exports.default = ProductController;
