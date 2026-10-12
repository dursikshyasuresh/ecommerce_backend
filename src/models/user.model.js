import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: [true,"FullName is required!"],
        trim: true,
        minLength: [3,"FullName must be atleast 3 charcters"],
        maxLength: [100,"Fullname must not exceed 100 characters."]
    },
    email:{
        type: String,
        required: [true,"Email is required!"],
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true,"Password is required!"],
        minLength: 8
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: "user"
    }
},{
    timestamps: true
})

const User = mongoose.model("User",userSchema)
export default User