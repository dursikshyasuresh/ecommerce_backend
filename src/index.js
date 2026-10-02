import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import categoryRoute from "./routes/category.route.js"
import productRoute from "./routes/product.route.js"
import orderRoute from "./routes/order.route.js"
import cartRoute from "./routes/cart.route.js"
import errorHandler from "./middlewares/error.middleware.js"

dotenv.config()
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))

// db connection
connectDB()


// home route
app.get("/", (req,res) => {
    res.json({
        message: "API is running"
    })
})

// routes
app.use("/api/auth",authRoute)
app.use("/api",userRoute)
app.use("/api",categoryRoute)
app.use("/api",productRoute)
app.use("/api",cartRoute)
app.use("/api",orderRoute)


// error middleware
app.use(errorHandler)


const PORT = process.env.PORT || 4500

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})