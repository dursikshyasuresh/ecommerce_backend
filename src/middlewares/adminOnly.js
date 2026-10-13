import ErrorMessage from "../utils/ErrorMessage.js"

export const adminOnly = (req,res,next) => {
    if(req.user?.role !== "admin") throw ErrorMessage(403,"Access Denied, admin only!")
    next()    
}