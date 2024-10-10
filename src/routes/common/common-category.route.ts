import { Router } from 'express'
import { wrapAsync } from '../../utils/response'
import categoryController from '../../controllers/category.controller'
import categoryMiddleware from '../../middleware/cateogry.middleware'
import helpersMiddleware from '../../middleware/helpers.middleware'

const commonCategoryRouter = Router()
commonCategoryRouter.get(
  '/',
  categoryMiddleware.getCategoryRules(),
  helpersMiddleware.entityValidator,
  wrapAsync(categoryController.getCategories)
)
commonCategoryRouter.get(
  '/:category_id',
  helpersMiddleware.idRule('category_id'),
  helpersMiddleware.idValidator,
  wrapAsync(categoryController.getCategory)
)
export default commonCategoryRouter
