import express from "express"
import createUpload from "../middlewares/upload.js"
import {createCategory, deleteCategory, getCategories, getSingleCategory, updateCategory} from "../controllers/category.controller.js" 
import protect from "../middlewares/jwtVerify.js"
import { adminOnly } from "../middlewares/adminOnly.js"

const router = express.Router()

const upload = createUpload("categories")

router.get("/categories",getCategories)
router.post("/category/create",protect,adminOnly,upload.single("image"),createCategory)
router.get("/category/:id",getSingleCategory)
router.patch("/category/:id",protect,adminOnly,upload.single("image"),updateCategory)
router.delete("/category/:id",protect,adminOnly,deleteCategory)

export default router