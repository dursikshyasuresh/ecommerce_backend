import asyncHandler from "../utils/asyncHandler.js"
import ErrorMessage from "../utils/ErrorMessage.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const protect = asyncHandler(async (req, res, next) => {
  // get token from cookie
  const token = req.cookies.token

  // check if token exists
  if (!token) throw ErrorMessage(401, "Authentication required!")

  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // find user
  const user = await User.findById(decoded.userId)

  // check user
  if (!user) throw ErrorMessage(401, "User not found!")

  // attach user to request
  req.user = user
  next()
})

export default protect
