import express from "express"
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/product.controller.js"
import createUpload from "../middlewares/upload.js"
import protect from "../middlewares/jwtVerify.js"

const router = express.Router()

const upload = createUpload('products')

router.get("/products",getProducts)
router.post("/product/create",protect,upload.array("images",5),createProduct)
router.get("/product/:id",getSingleProduct)
router.patch("/product/:id",protect,upload.array("images",5),updateProduct)
router.delete("/product/:id",protect,deleteProduct)

export default router
