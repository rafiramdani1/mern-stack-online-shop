import express from "express";
import fileUpload from "express-fileupload";
import routerAuth from './routes/routes.auth.js';
import routerProduct from "./routes/routes.products.js";
import routerSubCategory from "./routes/routes.subCategory.js";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDb from "./config/Db.js";
import routerUser from "./routes/routes.user.js";
import routerSizes from "./routes/routes.sizes.js";
import { categoryRouter } from "./src/category/category.route.js";

const app = express()
dotenv.config()

// validation connect db
connectDb().then(() => { console.log('Connected to database') }).catch((error) => { console.log(`Error connecting to database: ${error}`) })

// setup middleware
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(fileUpload())
app.use(express.static('public'))
app.use(cookieParser())

// setup routes
app.use('/api/auth', routerAuth)
app.use('/api/user', routerUser)
app.use('/api/categories', categoryRouter)
app.use('/api/products', routerProduct)
app.use('/api/sub-categories', routerSubCategory)
app.use('/api/sizes', routerSizes)

// server
const port = process.env.PORT
app.listen(port, () => console.log(`Server running on port ${port}`))