import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

// Connect DB
const connectDb = () => {
  mongoose.set('strictQuery', false)
  return mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-mern', { useNewUrlParser: true, useUnifiedTopology: true })
}
export default connectDb