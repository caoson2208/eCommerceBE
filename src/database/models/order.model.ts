import mongoose, { Schema } from 'mongoose'
import { STATUS_ORDER } from '../../constants/order'

const OrderSchema = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' },
    product: { type: mongoose.SchemaTypes.ObjectId, ref: 'products' },
    buy_count: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    price_before_discount: { type: Number, default: 0 },
    status: { type: Number, default: STATUS_ORDER.WAIT_FOR_CONFIRMATION },
  },
  {
    timestamps: true,
  }
)
export const PurchaseModel = mongoose.model('order', OrderSchema)
