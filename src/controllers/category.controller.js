import Category from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import ErrorMessage from "../utils/ErrorMessage.js"
import generateSlug from "../utils/generateSlug.js"

/** 
 * @desc add new category
 * @api /api/category/create 
 * @access Admin only
*/

export const createCategory = asyncHandler(async(req,res) => {
    const {name} = req.body

    if(!name) throw ErrorMessage(400,"Category name is required!")
    if(!req.file) throw ErrorMessage(400,"Category image is required!")
    
    // create slug from category name
    const slug = generateSlug(name) 
    
    // create category
    const category = await Category.create({
        name,
        image: `/uploads/categories/${req.file.filename}`,
        slug
    })

    res.status(201).json({
        success: true,
        message: "Category added sucessfully!",
        category
    })
       
})