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


/** 
 * @desc get all categories
 * @api /api/categories
 * @access Public
*/

export const getCategories = asyncHandler(async(req,res) => {
      const categories = await Category.find()

      if(!categories || categories.length === 0) throw ErrorMessage(404,"Categories not found!")

      res.status(200).json({
        success: true,
        categories
      })  
})

/** 
 * @desc get single category
 * @api /api/category/id
 * @access Public
*/

export const getSingleCategory = asyncHandler(async(req,res) => {
    const category = await Category.findById(req.params.id)

    if(!category) throw ErrorMessage(404,"Category not found!")
    
    res.status(200).json({
        success: true,
        category
      })      
})

/** 
 * @desc update category
 * @api /api/category/id
 * @access Admin only
*/

export const updateCategory = asyncHandler(async(req,res) => {
    const category = await Category.findById(req.params.id)
    if(!category) throw ErrorMessage(404,"Category not found!")
    
    // update name and slug
    if(req.body.name){
        category.name = req.body.name,
        category.slug = generateSlug(req.body.name)
    } 
    
    // update image if new image is uploaded
    if(req.file){
        category.image = `uploads/categories/${req.file.filename}`
    }

    await category.save()

    res.status(200).json({
        success: true,
        category
      })  
})

/** 
 * @desc delete category
 * @api /api/category/id
 * @access Admin only
*/

export const deleteCategory = asyncHandler(async(req,res) => {
    const category = await Category.findById(req.params.id)
    if(!category) throw ErrorMessage(404,"Category not found!")
    
   await Category.findByIdAndDelete(req.params.id)    
   res.status(200).json({
    success: true,
    message: "Category deleted sucessfully"
   }) 
})