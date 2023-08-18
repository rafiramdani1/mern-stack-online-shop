import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  title: { type: String, required: true }, slug: { type: String, required: true }, id_category: { type: mongoose.Types.ObjectId, required: true, ref: 'category' }
})
const SubCategories = mongoose.model('SubCategories', subCategorySchema)
export default SubCategories