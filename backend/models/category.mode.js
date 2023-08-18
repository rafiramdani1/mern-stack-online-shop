import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true }, slug: { type: String, required: true }
})
const Categories = mongoose.model('category', categorySchema)
export default Categories