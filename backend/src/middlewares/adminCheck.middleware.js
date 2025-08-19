import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyAdmin = asyncHandler(async (req,_,next)=>{
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Forbidden: Admin privileges required");
    }
    next();
})

export {verifyAdmin};