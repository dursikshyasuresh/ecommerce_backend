import Category from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import ErrorMessage from "../utils/ErrorMessage.js"
import generateSlug from "../utils/generateSlug.js"
import Product from "../models/product.model.js";


/** 
 * @desc add new product
 * @api /api/product/create 
 * @access Admin only
*/

export const createProduct = asyncHandler(async(req,res) => {
    const {title,description,price,discountPrice,category,stock,isNewArrival} = req.body

    if(!title || !description || !price || !category) throw ErrorMessage(400,"Title, description, price and category are required!")
    if(!req.files || req.files.length === 0) throw ErrorMessage(400,"At least one product image is required!")

    // check category exists
    const existingCategory = await Category.findById(category)
    if(!existingCategory) throw ErrorMessage(404,"Category not found!")

    // create slug from product title
    const slug = generateSlug(title)

    // create product
    const product = await Product.create({
        title,
        description,
        price,
        discountPrice,
        category,
        stock,
        isNewArrival,
        images: req.files.map((file) => `/uploads/products/${file.filename}`),
        slug
    })

    res.status(201).json({
        success: true,
        message: "Product added sucessfully!",
        product
    })
})


/** 
 * @desc get all products
 * @api /api/products 
 * @access Public
*/

export const getProducts = asyncHandler(async(req,res) => {
    
})

/** 
 * @desc get single product
 * @api /api/product/:id
 * @access Public
*/

export const getSingleProduct = asyncHandler(async(req,res) => {
    
})


/** 
 * @desc update product
 * @api /api/product/:id
 * @access Admin Only
*/

export const updateProduct = asyncHandler(async(req,res) => {
    
})


/** 
 * @desc delete product
 * @api /api/product/:id
 * @access Admin Only
*/

export const deleteProduct = asyncHandler(async(req,res) => {
    
})