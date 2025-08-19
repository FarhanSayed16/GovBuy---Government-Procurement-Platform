// controllers/supplier.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Bid } from "../models/bid.model.js";
import { Document } from "../models/document.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import {User} from "../models/user.model.js"

// GET /api/supplier/dashboard
// Fetch bid stats & recent activity for supplier
const getSupplierDashboard = asyncHandler(async (req, res) => {
  const supplierId = req.user.id;
  
  // Total bids by supplier
  const totalBids = await Bid.countDocuments({ supplier: supplierId });
  // Accepted bids
  const acceptedBids = await Bid.countDocuments({ supplier: supplierId, status: 'accepted' });
  // Rejected bids
  const rejectedBids = await Bid.countDocuments({ supplier: supplierId, status: 'rejected' });
  // Pending bids
  const pendingBids = await Bid.countDocuments({ supplier: supplierId, status: 'submitted' });
  // Win rate
  const winRate = totalBids > 0 ? (acceptedBids / totalBids) * 100 : 0;

  // Recent bids (last 5)
  const recentBids = await Bid.find({ supplier: supplierId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('tender', 'title deadline budget');

  const stats = {
    totalBids,
    acceptedBids,
    rejectedBids,
    pendingBids,
    winRate: winRate.toFixed(2),
    recentBids,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Supplier dashboard data fetched'));
});

const getSupplierById = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  console.log(supplierId)
  // Find the user and ensure they are a supplier
  const supplier = await User.findById(supplierId)
    .select("name email phone role addresses status createdAt")
    .lean();

  if (!supplier || supplier.role !== "supplier") {
    throw new ApiError(404, "Supplier not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, supplier, "Supplier fetched successfully"));
});


// POST /api/supplier/documents
// Upload a new document (e.g., KYC, certifications) to Cloudinary
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  // Upload to Cloudinary
  const result = await uploadOnCloudinary(req.file.path);
  if (!result) {
    throw new ApiError(500, 'Cloud upload failed');
  }

  // Save document record
  const doc = await Document.create({
    user: req.user.id,
    filename: req.file.originalname,
    url: result.secure_url,
    publicId: result.public_id,
    mimeType: req.file.mimetype,
    size: req.file.size
  });

  return res
    .status(201)
    .json(new ApiResponse(201, doc, 'Document uploaded successfully'));
});

// GET /api/supplier/documents
// List all uploaded documents for supplier
const getDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, docs, 'Documents fetched successfully'));
});

// DELETE /api/supplier/documents/:documentId
// Remove a document from Cloudinary and DB
const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const doc = await Document.findOne({ _id: documentId, user: req.user.id });
  if (!doc) {
    throw new ApiError(404, 'Document not found');
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(doc.url);
  // Remove DB record
  await doc.deleteOne();;

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Document deleted successfully'));
});

export {
  getSupplierDashboard,
  uploadDocument,
  getDocuments,
  deleteDocument,
  getSupplierById
};



