import { userPurchaseRouter } from './order.route'
import { userUserRouter } from './user-user.route'

const userRoutes = {
  prefix: '/api/',
  routes: [
    {
      path: 'user',
      route: userUserRouter,
    },
    {
      path: 'purchases',
      route: userPurchaseRouter,
    },
  ],
}

export default userRoutes
