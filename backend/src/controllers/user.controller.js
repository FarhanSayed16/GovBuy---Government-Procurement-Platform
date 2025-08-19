import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
// import { Product } from "../models/product.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import validator from "validator"
import jwt from "jsonwebtoken"

//to avoid modification of cookies through frontend 
const options = {
    httpOnly:true,
    secure:true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password,role="citizen",addresses=[],phone} = req.body;

    if([name,email,password].some(field=>!field)){
        throw new ApiError(400,"Name, Email & Password are must");
    }
    //check if user already exist
    const existedUser = await User.findOne({email});
    if(existedUser){
        throw new ApiError(409,"User already exist")
    }
    //check for invalid role
    const allowedRoles = [
        'government',         // government account (tender owner)
        'procurement_officer',
        'department_head',
        'finance_officer',
        'legal_advisor',
        'supplier',
        'citizen',
        'admin',
        
      ];

    if (role && !allowedRoles.includes(role)) {
        throw new ApiError(400, 'Invalid role');
    }

    //email validation
    if (!validator.isEmail(email)) {
        throw new ApiError(400, 'Invalid email format');
    }

    //phone validation
    if (phone && !validator.isMobilePhone(phone,"any")) {  
        throw new ApiError(400, 'Invalid phone number');
    }

    if (addresses && !Array.isArray(addresses)) {
        throw new ApiError(400, 'Addresses must be an array');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        addresses,
        phone
    })
    
    const createdUser = await User.findById(user._id).select("-password");
    if(!createdUser) throw new ApiError(500,"Something went wrong while registering the user");

    return res.status(201).json(new ApiResponse(201,createdUser,"User registered Successfully"));
})

const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body
    if(!(email && password)){
        throw new ApiError(401,"Email and Password are required");
    }

    const userExist = await User.findOne({email});
    if(!userExist){
        throw new ApiError(404,"User not found");
    }

    const isMatch = await userExist.isPasswordCorrect(password);
    if(!isMatch){
        throw new ApiError(401,"Incorrect Password");
    }

    const {refreshToken,accessToken} = await generateAccessTokenAndRefreshToken(userExist._id);

    const loggedInUser = await User.findById(userExist._id).select("-password -refreshToken");
    
    res.status(200)
  .cookie("accessToken", accessToken, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  })
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
  .json(new ApiResponse(200, { user:loggedInUser }, "Login successful"));
})

const logout = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset:{
                refreshToken:1
            }   
        },
        {
            new:true
        }
    
    );

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"));
})

const refreshAcessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if(!incomingRefreshToken) throw new ApiError(401,"Unauthorized Request")
    
    const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodeToken._id);
    if(!user) throw new ApiError(401,"Invalid refresh token: User not found");

    if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401,"Refresh token is expired or used");

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,"Access token refreshed"))
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect) throw new ApiError(400,"Invalid Old Password");

    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(
        new ApiResponse(200,{},"Password changed successfully")
    )

})

const getCurrentUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user._id)
  .select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200,user,"Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email, phone, addresses=[], addressAction, addressType } = req.body;
  
    // Check if at least one field is provided
    if (!name && !email && !phone && !addresses) {
      throw new ApiError(400, "At least one field is required to update");
    }
  
    // Create an object to store the fields to be updated
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
  
    // Handle address updates based on the action
    if (addresses) {
      switch (addressAction) {
        case "add": {
          // When adding, enforce that each address type is unique.
          // First, get the current user document.
          const currentUser = await User.findById(req.user?._id);
          // For each new address, we will check if an address with the same type already exists.
          for (const address of addresses) {
            // Use provided type or default to 'home'
            const addrType = address.type || "home";
            if (currentUser.addresses.some((a) => a.type === addrType)) {
              throw new ApiError(
                400,
                `An address of type ${addrType} already exists. Please update the existing address instead.`
              );
            }
          }
          // If no duplicates, push the new address(es)
          updateFields.$push = { addresses: { $each: addresses } };
          break;
        }
        case "update": {
          // For update, ensure addressType is provided and only one address is given
          if (!addressType) {
            throw new ApiError(400, "Address type (home, office, other) is required for update");
          }
          if (!addresses || addresses.length !== 1) {
            throw new ApiError(400, "Please provide exactly one address for update");
          }
          const addressToUpdate = addresses[0];
          if (!addressToUpdate) {
            throw new ApiError(400, "Address details are required for update");
          }
          // Use arrayFilters to target the address with the specified type
          updateFields.$set = { "addresses.$[elem]": addressToUpdate };
          break;
        }
        case "remove": {
          // For removal, ensure addressType is provided
          if (!addressType) {
            throw new ApiError(400, "Address type (home, office, other) is required for removal");
          }
          updateFields.$pull = { addresses: { type: addressType } };
          break;
        }
        default: {
          // Replace the entire addresses array
          updateFields.addresses = addresses;
          break;
        }
      }
    }
  
    // Prepare options for updating. For 'update' action, include arrayFilters.
    const updateOptions = {
      new: true, // Return the updated document
      arrayFilters: addressAction === "update" ? [{ "elem.type": addressType }] : undefined,
    };
  
    // Update the user details
    const user = await User.findByIdAndUpdate(req.user?._id, updateFields, updateOptions)
      .select("-password -refreshToken");
  
    // Check if the user was found and updated
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Return success response
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    const deletedUser = await User.findByIdAndDelete(userId);
  
    if (!deletedUser) {
      throw new ApiError(404, "User not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users (excluding sensitive fields)
    const users = await User.find({}).select("-password -refreshToken");
  
    // Check if users exist
    if (!users || users.length === 0) {
      throw new ApiError(404, "No users found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const updateUserRoleAndStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role, status } = req.body;

  // Must supply at least one of role or status
  if (!role && !status) {
    throw new ApiError(400, "You must provide a new role or status (or both).");
  }

  // Validate role if provided
  const allowedRoles = [
    "government",
    "procurement_officer",
    "department_head",
    "finance_officer",
    "legal_advisor",
    "supplier",
    "citizen",
    "admin",
  ];
  if (role && !allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Validate status if provided
  const allowedStatuses = ["pending", "approved", "rejected"];
  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  // Build the update object
  const updateFields = {};
  if (role)   updateFields.role = role;
  if (status) updateFields.status = status;

  // Find and update
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateFields,
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export {
    registerUser,
    login,
    logout,
    refreshAcessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    deleteUser,
    getAllUsers,
    updateUserRoleAndStatus,
}