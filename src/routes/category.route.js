import express from "express"
import upload from "../middlewares/upload.js"
import {createCategory} from "../controllers/category.controller.js" 


const router = express.Router()

router.post("/category/create",upload.single("image"),createCategory)

export default router