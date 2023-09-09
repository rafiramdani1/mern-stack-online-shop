import express from "express";
import fileUpload from "express-fileupload";
import routerAuth from './routes/auth.js';
import routerCategories from "./routes/routes.categories.js";
import routerProduct from "./routes/routes.products.js";
import routerSubCategory from "./routes/routes.subCategory.js";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDb from "./config/Db.js";

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
app.use('/auth', routerAuth)
app.use('/categories', routerCategories)
app.use('/products', routerProduct)
app.use('/sub-categories', routerSubCategory)

// server
const port = process.env.PORT
app.listen(port, () => console.log(`Server running on port ${port}`))