import Category from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js"
import ErrorMessage from "../utils/ErrorMessage.js"
import generateSlug from "../utils/generateSlug.js"
import Product from "../models/product.model.js";
import searchFilter from "../filters/searchFilter.js";
import createPagination from "../filters/pagination.js";
import SearchFilter from "../filters/searchFilter.js";



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
 * @api /api/products?search=
 * @access Public
*/

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    page,
    limit,
    category,
    minPrice,
    maxPrice,
    sort,
    isNewArrival,
    isFeatured,
  } = req.query

  let filter = {
    ...SearchFilter(search, ["title"]), // schema field is "title", not "name"
  }

  // category
  if (category) {
    const existsCategory = await Category.findById(category)
    if (!existsCategory) throw ErrorMessage(404, "Category not found!")
    filter.category = existsCategory._id
  }

  // price range
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }

  // new arrival & featured (query strings are "true"/"false", not booleans)
  if (isNewArrival === "true") filter.isNewArrival = true
  if (isFeatured === "true") filter.isFeatured = true

  // Map each allowed `sort` query value to a MongoDB sort object
  // (1 = ascending, -1 = descending)
  const sortMap = {
    asc: { price: 1 }, // price: low to high
    desc: { price: -1 }, // price: high to low
    oldest: { createdAt: 1 }, // oldest products first
    newest: { createdAt: -1 }, // newest products first
  }

  // Look up the sort option from the query (?sort=asc).
  // If `sort` is missing or not one of the keys above, fall back to newest first.
  const sortOptions = sortMap[sort] || { createdAt: -1 }

  const total = await Product.countDocuments(filter)
  const pagination = createPagination(page, limit, total)
  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .populate("category", "name slug")

  res.status(200).json({ success: true, products, pagination })
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


/** 
 * @desc get related product
 * @api /api/product/:id/related
 * @access Public
*/
export const getRelatedProducts = asyncHandler(async (req, res) => {
  // Get current product ID from URL params
  const { id } = req.params;

  // Find the current product
  const product = await Product.findById(id);

  // Check whether product exists
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found!",
    });
  }

  // Find other products from the same category
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .sort({ createdAt: -1 })
    .limit(5)

  return res.status(200).json({
    success: true,
    products: relatedProducts,
  });
});