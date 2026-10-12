import express from "express"
import createUpload from "../middlewares/upload.js"
import {createCategory, deleteCategory, getCategories, getSingleCategory, updateCategory} from "../controllers/category.controller.js" 
import protect from "../middlewares/jwtVerify.js"

const router = express.Router()

const upload = createUpload("categories")

router.get("/categories",getCategories)
router.post("/category/create",protect,upload.single("image"),createCategory)
router.get("/category/:id",getSingleCategory)
router.patch("/category/:id",protect,upload.single("image"),updateCategory)
router.delete("/category/:id",protect,deleteCategory)

export default router