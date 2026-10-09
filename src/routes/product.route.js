import express from "express"
import { createProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from "../controllers/product.controller.js"

const router = express.Router()

router.get("/products",getProducts)
router.post("/product/create",createProduct)
router.get("/product/:id",getSingleProduct)
router.patch("/product/:id",updateProduct)
router.delete("/product/:id",deleteProduct)

export default router