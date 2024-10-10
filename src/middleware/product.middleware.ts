import { body, query, param } from 'express-validator'

const getProductsRules = () => {
  return [
    query('page').optional().isInt().withMessage('page không đúng định dạng'),
    query('limit').optional().isInt().withMessage('limit không đúng định dạng'),
    query('category')
      .optional()
      .isMongoId()
      .withMessage('category không đúng định dạng'),
    query('exclude')
      .optional()
      .isMongoId()
      .withMessage('exclude không đúng định dạng'),
  ]
}

const getAllProductsRules = () => {
  return [
    query('category')
      .optional()
      .isMongoId()
      .withMessage('category không đúng định dạng'),
  ]
}

const getPagesRules = () => {
  return [
    query('limit').exists().isInt().withMessage('limit không đúng định dạng'),
    query('category')
      .optional()
      .isMongoId()
      .withMessage('category không đúng định dạng'),
  ]
}

const addProductRules = () => {
  return [
    body('name')
      .exists({ checkFalsy: true })
      .withMessage('Tên sản phẩm không được để trống')
      .isLength({ max: 160 })
      .withMessage('Tên sản phẩm phải ít hơn 160 kí tự'),
    body('image')
      .exists({ checkFalsy: true })
      .withMessage('image không được để trống')
      .isLength({ max: 1000 })
      .withMessage('image phải ít hơn 1000 kí tự'),
    body('images').optional().isArray().withMessage('images phải dạng array'),
    body('category')
      .exists({ checkFalsy: true })
      .withMessage('category không được để trống')
      .isMongoId()
      .withMessage('category phải là id hợp lệ'),
    body('price')
      .exists({ checkFalsy: true })
      .withMessage('Giá không được để trống')
      .isNumeric()
      .withMessage('price phải ở định dạng số'),
    body('price_before_discount')
      .optional()
      .isNumeric()
      .withMessage('price_before_discount phải ở định dạng số'),
    body('quantity')
      .exists({ checkFalsy: true })
      .withMessage('Số lượng không được để trống')
      .isNumeric()
      .withMessage('quantity phải ở định dạng số'),
    body('sold').optional().isNumeric().withMessage('sold phải ở định dạng số'),
    body('rating')
      .optional()
      .isNumeric()
      .withMessage('rating phải ở định dạng số'),
  ]
}

const updateProductRules = () => {
  return [
    body('name')
      .optional()
      .isLength({ max: 160 })
      .withMessage('Tên sản phẩm phải ít hơn 160 kí tự'),
    body('image')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('image phải ít hơn 1000 kí tự'),
    body('images').optional().isArray().withMessage('images phải là array'),
    body('category')
      .optional()
      .isMongoId()
      .withMessage('category phải là id hợp lệ'),
    body('price')
      .optional()
      .isNumeric()
      .withMessage('price phải ở định dạng số'),
    body('price_before_discount')
      .optional()
      .isNumeric()
      .withMessage('price_before_discount phải ở định dạng số'),
    body('quantity')
      .optional()
      .isNumeric()
      .withMessage('quantity phải ở định dạng số'),
    body('sold').optional().isNumeric().withMessage('sold phải ở định dạng số'),
    body('rating')
      .optional()
      .isNumeric()
      .withMessage('rating phải ở định dạng số'),
  ]
}

const deleteProductRules = () => {
  return [
    param('product_id')
      .exists()
      .withMessage('product_id không được để trống')
      .isMongoId()
      .withMessage('product_id không đúng định dạng'),
  ]
}

const ProductMiddleware = {
  addProductRules,
  updateProductRules,
  getProductsRules,
  getPagesRules,
  getAllProductsRules,
  deleteProductRules,
}

export default ProductMiddleware
