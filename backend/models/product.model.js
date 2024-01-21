import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, },
  description: { type: String, required: true },
  id_category: { type: mongoose.Types.ObjectId, required: true, ref: 'category' },
  id_sub_category: { type: mongoose.Types.ObjectId, ref: 'SubCategories', required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  url: { type: String, required: true }
})
const Product = mongoose.model('product', ProductSchema)
export default Product  