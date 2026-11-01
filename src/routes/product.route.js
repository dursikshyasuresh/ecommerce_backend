import express from "express"
import { createProduct, deleteProduct, getProducts, getRelatedProducts, getSingleProduct, updateProduct } from "../controllers/product.controller.js"
import createUpload from "../middlewares/upload.js"
import protect from "../middlewares/jwtVerify.js"
import { adminOnly } from "../middlewares/adminOnly.js"

const router = express.Router()

const upload = createUpload('products')

router.get("/products",getProducts)
router.post("/product/create",protect,adminOnly,upload.array("images",5),createProduct)
router.get("/product/:id",getSingleProduct)
router.get("/product/:id/related",getRelatedProducts)
router.patch("/product/:id",protect,adminOnly,upload.array("images",5),updateProduct)
router.delete("/product/:id",protect,adminOnly,deleteProduct)

export default router
