"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchases = exports.getPurchases = exports.buyProducts = exports.updatePurchase = exports.addToCart = void 0;
const order_1 = require("../constants/order");
const status_1 = require("../constants/status");
const product_model_1 = require("../database/models/product.model");
const order_model_1 = require("../database/models/order.model");
const response_1 = require("../utils/response");
const product_controller_1 = require("./product.controller");
const lodash_1 = require("lodash");
const addToCart = async (req, res) => {
    const { product_id, buy_count } = req.body;
    const product = await product_model_1.ProductModel.findById(product_id).lean();
    if (product) {
        if (buy_count > product.quantity) {
            throw new response_1.ErrorHandler(status_1.STATUS.NOT_ACCEPTABLE, 'Số lượng vượt quá số lượng sản phẩm');
        }
        const purchaseInDb = await order_model_1.PurchaseModel.findOne({
            user: req.jwtDecoded.id,
            status: order_1.STATUS_ORDER.IN_CART,
            product: {
                _id: product_id,
            },
        }).populate({
            path: 'product',
            populate: {
                path: 'category',
            },
        });
        let data;
        if (purchaseInDb) {
            data = await order_model_1.PurchaseModel.findOneAndUpdate({
                user: req.jwtDecoded.id,
                status: order_1.STATUS_ORDER.IN_CART,
                product: {
                    _id: product_id,
                },
            }, {
                buy_count: purchaseInDb.buy_count + buy_count,
            }, {
                new: true,
            })
                .populate({
                path: 'product',
                populate: {
                    path: 'category',
                },
            })
                .lean();
        }
        else {
            const purchase = {
                user: req.jwtDecoded.id,
                product: product._id,
                buy_count: buy_count,
                price: product.price,
                price_before_discount: product.price_before_discount,
                status: order_1.STATUS_ORDER.IN_CART,
            };
            const addedPurchase = await new order_model_1.PurchaseModel(purchase).save();
            data = await order_model_1.PurchaseModel.findById(addedPurchase._id).populate({
                path: 'product',
                populate: {
                    path: 'category',
                },
            });
        }
        const response = {
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            data,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
    }
};
exports.addToCart = addToCart;
const updatePurchase = async (req, res) => {
    const { product_id, buy_count } = req.body;
    const purchaseInDb = await order_model_1.PurchaseModel.findOne({
        user: req.jwtDecoded.id,
        status: order_1.STATUS_ORDER.IN_CART,
        product: {
            _id: product_id,
        },
    })
        .populate({
        path: 'product',
        populate: {
            path: 'category',
        },
    })
        .lean();
    if (purchaseInDb) {
        if (buy_count > purchaseInDb.product.quantity) {
            throw new response_1.ErrorHandler(status_1.STATUS.NOT_ACCEPTABLE, 'Số lượng vượt quá số lượng sản phẩm');
        }
        const data = await order_model_1.PurchaseModel.findOneAndUpdate({
            user: req.jwtDecoded.id,
            status: order_1.STATUS_ORDER.IN_CART,
            product: {
                _id: product_id,
            },
        }, {
            buy_count,
        }, {
            new: true,
        })
            .populate({
            path: 'product',
            populate: {
                path: 'category',
            },
        })
            .lean();
        const response = {
            message: 'Cập nhật đơn thành công',
            data,
        };
        return (0, response_1.responseSuccess)(res, response);
    }
    else {
        throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy đơn');
    }
};
exports.updatePurchase = updatePurchase;
const buyProducts = async (req, res) => {
    const purchases = [];
    for (const item of req.body) {
        const product = await product_model_1.ProductModel.findById(item.product_id).lean();
        if (product) {
            if (item.buy_count > product.quantity) {
                throw new response_1.ErrorHandler(status_1.STATUS.NOT_ACCEPTABLE, 'Số lượng mua vượt quá số lượng sản phẩm');
            }
            else {
                let data = await order_model_1.PurchaseModel.findOneAndUpdate({
                    user: req.jwtDecoded.id,
                    status: order_1.STATUS_ORDER.IN_CART,
                    product: {
                        _id: item.product_id,
                    },
                }, {
                    buy_count: item.buy_count,
                    status: order_1.STATUS_ORDER.WAIT_FOR_CONFIRMATION,
                }, {
                    new: true,
                })
                    .populate({
                    path: 'product',
                    populate: {
                        path: 'category',
                    },
                })
                    .lean();
                if (!data) {
                    const purchase = {
                        user: req.jwtDecoded.id,
                        product: item.product_id,
                        buy_count: item.buy_count,
                        price: product.price,
                        price_before_discount: product.price_before_discount,
                        status: order_1.STATUS_ORDER.WAIT_FOR_CONFIRMATION,
                    };
                    const addedPurchase = await new order_model_1.PurchaseModel(purchase).save();
                    data = await order_model_1.PurchaseModel.findById(addedPurchase._id).populate({
                        path: 'product',
                        populate: {
                            path: 'category',
                        },
                    });
                }
                purchases.push(data);
            }
        }
        else {
            throw new response_1.ErrorHandler(status_1.STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm');
        }
    }
    const response = {
        message: 'Mua thành công',
        data: purchases,
    };
    return (0, response_1.responseSuccess)(res, response);
};
exports.buyProducts = buyProducts;
const getPurchases = async (req, res) => {
    const { status = order_1.STATUS_ORDER.ALL } = req.query;
    const user_id = req.jwtDecoded.id;
    let condition = {
        user: user_id,
        status: {
            $ne: order_1.STATUS_ORDER.ALL,
        },
    };
    if (Number(status) !== order_1.STATUS_ORDER.ALL) {
        condition.status = status;
    }
    let purchases = await order_model_1.PurchaseModel.find(condition)
        .populate({
        path: 'product',
        populate: {
            path: 'category',
        },
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    purchases = purchases.map((purchase) => {
        purchase.product = (0, product_controller_1.handleImageProduct)((0, lodash_1.cloneDeep)(purchase.product));
        return purchase;
    });
    const response = {
        message: 'Lấy đơn mua thành công',
        data: purchases,
    };
    return (0, response_1.responseSuccess)(res, response);
};
exports.getPurchases = getPurchases;
const deletePurchases = async (req, res) => {
    const purchase_ids = req.body;
    const user_id = req.jwtDecoded.id;
    const deletedData = await order_model_1.PurchaseModel.deleteMany({
        user: user_id,
        status: order_1.STATUS_ORDER.IN_CART,
        _id: { $in: purchase_ids },
    });
    return (0, response_1.responseSuccess)(res, {
        message: `Xoá ${deletedData.deletedCount} đơn thành công`,
        data: { deleted_count: deletedData.deletedCount },
    });
};
exports.deletePurchases = deletePurchases;
