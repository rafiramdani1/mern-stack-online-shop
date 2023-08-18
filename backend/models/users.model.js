import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, default: 'user', required: true },
  refresh_token: { type: String, default: null }
})
const Users = mongoose.model('User', userSchema)
export default Users