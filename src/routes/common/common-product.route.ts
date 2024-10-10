import { Router } from 'express'
import { wrapAsync } from '../../utils/response'
import ProductController from '../../controllers/product.controller'
import productMiddleware from '../../middleware/product.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'

const commonProductRouter = Router()
/**
 * [Get products paginate]
 * @queryParam type: string, page: number, limit: number, category:mongoId, exclude: mongoId product
 * @route products
 * @method get
 */
commonProductRouter.get(
  '/',
  productMiddleware.getProductsRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.getProducts)
)

commonProductRouter.get(
  '/:product_id',
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.getProduct)
)

commonProductRouter.put(
  '/:product_id',
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  productMiddleware.updateProductRules(), // Middleware xác thực dữ liệu cập nhật
  helpersMiddleware.entityValidator,
  wrapAsync(ProductController.updateProduct)
)

commonProductRouter.delete(
  '/:product_id',
  helpersMiddleware.idRule('product_id'),
  helpersMiddleware.idValidator,
  wrapAsync(ProductController.deleteProduct)
)

commonProductRouter.get('/search', wrapAsync(ProductController.searchProduct))
export default commonProductRouter
