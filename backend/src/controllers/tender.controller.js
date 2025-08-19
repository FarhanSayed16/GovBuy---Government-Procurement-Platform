// controllers/tender.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tender } from "../models/tender.model.js";
import { Document }      from '../models/document.model.js';
import {
  uploadOnCloudinary,
  deleteFromCloudinary
} from '../utils/cloudinary.js';
import fs from 'fs';

// Create Tender (Admin Only)

const createTender = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    budget,
    deadline,
    city
  } = req.body;

  // Validate required fields
  if (
    !title || !category || !budget ||
    !deadline || !city ||
    !req.files || req.files.length === 0
  ) {
    throw new ApiError(400, 'All fields and at least one attachment are required');
  }

  // 1️⃣ Upload each file to Cloudinary → create Document
  const docs = [];
  for (const file of req.files) {
    const result = await uploadOnCloudinary(file.path);

    if (!result) {
      // cleanup previously uploaded docs if one fails
      docs.forEach(d => deleteFromCloudinary(d.publicId));
      throw new ApiError(500, 'Failed to upload attachment');
    }

    const doc = await Document.create({
      user:     req.user.id,
      filename: file.originalname,
      url:      result.secure_url,
      publicId: result.public_id,
      mimeType: file.mimetype,
      size:     file.size
    });
    docs.push(doc);
  }

  // 2️⃣ Create the tender, referencing document IDs
  const tender = await Tender.create({
    title,
    description,
    category,
    budget,
    deadline: new Date(deadline),
    city,
    attachments: docs.map(d => d._id),
    createdBy: req.user.id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tender, 'Tender created with attachments'));
});
// Get All Tenders (with pagination)
const getTenders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "createdBy",
      select: "name email"
    }
  };

  const tenders = await Tender.aggregatePaginate(
    Tender.aggregate([{ $match: filter }, { $project: { __v: 0 } }]),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tenders, "Tenders fetched successfully"));
});

// Get Single Tender by ID
const getTender = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;

  const tender = await Tender.findById(tenderId)
    .populate("createdBy", "name email")
    .select("-__v");

  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tender, "Tender details fetched successfully"));
});

// Update Tender (Admin Only)
const updateTender = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;
  const { title, description, closingDate, budget, status } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (closingDate) updateData.closingDate = closingDate;
  if (budget) updateData.budget = budget;
  if (status) updateData.status = status;

  const updated = await Tender.findByIdAndUpdate(
    tenderId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy", "name email");

  if (!updated) {
    throw new ApiError(404, "Tender not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Tender updated successfully"));
});

// Delete Tender (Admin Only)
const deleteTender = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;

  const tender = await Tender.findByIdAndDelete(tenderId);

  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tender deleted successfully"));
});

const getMyTenders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find tenders where createdBy matches current user
  const myTenders = await Tender.find({ createdBy: userId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, myTenders, 'Your tenders fetched successfully'));
});

export {
  createTender,
  getTenders,
  getTender,
  updateTender,
  deleteTender,
  getMyTenders,
};