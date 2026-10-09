import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"Product title is required."],
        trim: true
    },
    description: {
        type: String,
        required: [true,"Product description is required."],
        trim: true
    },
    price: {
        type: Number,
        required: [true,"Product price is required."],
        min: [0,"Price cannot be negative."]
    },
    discountPrice: {
        type: Number,
        min: [0,"Discount price cannot be negative."],
        validate: {
            validator: function (value) {
                return value == null || value <= this.price
            },
            message: "Discount price cannot be greater than price."
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true,"Product category is required."]
    },
    images: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    stock: {
        type: Number,
        required: [true,"Product stock is required."],
        default: 0,
        min: [0,"Stock cannot be negative."]
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    slug:{
        type: String,
        required: true
    }
},{
    timestamps: true
})


const Product = mongoose.model("Product",productSchema)
export default Product
