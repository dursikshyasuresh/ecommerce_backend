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
    const products = await Product.find().populate("category","name slug").sort({createdAt: -1})

    if(!products || products.length === 0) throw ErrorMessage(404,"Products not found!")

    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
})

/** 
 * @desc get single product
 * @api /api/product/:id
 * @access Public
*/

export const getSingleProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id).populate("category","name slug")

    if(!product) throw ErrorMessage(404,"Product not found!")

    res.status(200).json({
        success: true,
        product
    })
})


/** 
 * @desc update product
 * @api /api/product/:id
 * @access Admin Only
*/

export const updateProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id)
    if(!product) throw ErrorMessage(404,"Product not found!")

    const {title,description,price,discountPrice,category,stock,isNewArrival} = req.body

    // update title and slug
    if(title){
        product.title = title
        product.slug = generateSlug(title)
    }

    // check category exists before updating
    if(category){
        const existingCategory = await Category.findById(category)
        if(!existingCategory) throw ErrorMessage(404,"Category not found!")
        product.category = category
    }

    if(description) product.description = description
    if(price !== undefined) product.price = price
    if(discountPrice !== undefined) product.discountPrice = discountPrice
    if(stock !== undefined) product.stock = stock
    if(isNewArrival !== undefined) product.isNewArrival = isNewArrival

    // replace images if new images are uploaded
    if(req.files && req.files.length > 0){
        product.images = req.files.map((file) => `/uploads/products/${file.filename}`)
    }

    await product.save()

    res.status(200).json({
        success: true,
        message: "Product updated sucessfully!",
        product
    })
})


/** 
 * @desc delete product
 * @api /api/product/:id
 * @access Admin Only
*/

export const deleteProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id)
    if(!product) throw ErrorMessage(404,"Product not found!")

    await Product.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Product deleted sucessfully!"
    })
})