import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async(req,_,next)=>{

    try {
        //cookies for websites header for mobile devices
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
        if(!token){
            throw new ApiError(401,"Unauthorized Access");
        }
    
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodeToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized access: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            throw new ApiError(401, "Invalid access token");
          } else if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
          } else {
            throw new ApiError(401, error?.message || "Unauthorized access");
          }
    }
})

export {verifyJWT};