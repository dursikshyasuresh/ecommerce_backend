import express from "express"
import createUpload from "../middlewares/upload.js"
import {createCategory, deleteCategory, getCategories, getSingleCategory, updateCategory} from "../controllers/category.controller.js" 


const router = express.Router()

const upload = createUpload("categories")

router.get("/categories",getCategories)
router.post("/category/create",upload.single("image"),createCategory)
router.get("/category/:id",getSingleCategory)
router.patch("/category/:id",upload.single("image"),updateCategory)
router.delete("/category/:id",deleteCategory)

export default router