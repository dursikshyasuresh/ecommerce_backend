import User from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ErrorMessage from "../utils/ErrorMessage.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/**
 * @desc register user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body

  // check if email already exists or not
  const existingEmail = await User.findOne({ email })

  if (existingEmail) throw ErrorMessage(409, "Email already exists!")

  // hashing password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10)

  // create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  })

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  })
})

/**
 * @desc login user
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) throw ErrorMessage(401, "Invalid username or password!")

  // compare password with hashed password
  const matchedPassword = await bcrypt.compare(password, user.password)

  if (!matchedPassword) throw ErrorMessage(401, "Invalid username or password!")

  // generate token
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES },
  )

  // Send cookie
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  })
})


/**
 * @desc logout user
 * @route POST /api/auth/logout
 * @access Public
 */

export const logoutUser = asyncHandler(async(req,res) => {
  res.clearCookie("token",{
    httpOnly: true,
    secure: false, // true in production (https)
    sameSite: "lax",
  })

  res.status(200).json({
    success: true,
    message: "User logout successfully."
  })

})