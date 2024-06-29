import mongoose from "mongoose";

const orderShcema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'user' },
  order_date: { type: Date, required: true },
  total_amout: { type: Number, required: true },
  status: { type: String, default: 'pending', required: true },
  items: [
    {
      product_id: {
        type: mongoose.Types.ObjectId, required: true,
        ref: 'product'
      },
      quantity: { type: Number, required: true }
    }
  ]
})

const Orders = mongoose.model('order', orderShcema)
export default Orders