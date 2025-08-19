// Submit a new Bid (Supplier Only)
// controllers/bid.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }     from "../utils/ApiError.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import { Bid }          from "../models/bid.model.js";
import { Tender }       from "../models/tender.model.js";
import { User }         from "../models/user.model.js";
import {
  uploadOnCloudinary,
} from '../utils/cloudinary.js';
import { Document } from "../models/document.model.js";
import mongoose from "mongoose";
import { createNotification } from "./notification.controller.js";
import { sendEmail } from "../utils/mailer.js";

const submitBid = asyncHandler(async (req, res) => {
  const { tenderId, amount, proposal } = req.body;

  if (!tenderId || !amount) {
    throw new ApiError(400, "Tender ID and bid amount are required");
  }

  // Ensure supplier is approved
  const supplier = await User.findById(req.user.id);
  if (supplier.status !== "approved") {
    throw new ApiError(403, "Supplier account must be approved before bidding");
  }

  // Verify tender
  const tender = await Tender.findById(tenderId);
  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  // **Prevent duplicate bids**
  const existing = await Bid.findOne({ tender: tenderId, supplier: req.user.id });
  if (existing) {
    throw new ApiError(409, "You have already placed a bid on this tender");
  }

  // Handle optional file upload
  let docRecord = null;
  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path);
    if (!result) {
      throw new ApiError(500, "Failed to upload proposal document");
    }
    docRecord = await Document.create({
      user:     req.user.id,
      filename: req.file.originalname,
      url:      result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size:     req.file.size
    });
  }

  // Create the bid
  const bid = await Bid.create({
    tender:      tenderId,
    bidAmount:   amount,
    proposal:    proposal || "",
    proposalDoc: docRecord?._id,
    supplier:    req.user.id
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bid, "Bid submitted successfully"));
});

// Get all Bids by the logged-in Supplier
const getMyBids = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const supplierObjectId = new mongoose.Types.ObjectId(req.user.id);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    // Note: aggregatePaginate's populate may not work exactly like paginate(),
    // you can also $lookup instead
    populate: [{
      path: 'tender',
      select: 'title closingDate budget status'
    },
    { path: 'proposalDoc',
      select: 'url filename' }]
  };

  const aggregate = Bid.aggregate([
    { $match: { supplier: supplierObjectId } }
  ]);

  const bids = await Bid.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, bids, 'Your bids fetched successfully'));
});

// DELETE /api/v1/bids/:bidId
const deleteBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  // 1) Try to find & delete the bid, but only if it belongs to the current user
  const bid = await Bid.findOneAndDelete({
    _id:      bidId,
    supplier: req.user.id
  });

  // 2) If nothing was deleted, it either didn’t exist or didn’t belong to them
  if (!bid) {
    throw new ApiError(404, 'Bid not found or you do not have permission to delete it');
  }

  // 3) Return success
  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Bid deleted successfully'));
});

// Get all Bids for a specific Tender (Admin Only)
const getTenderBids = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Verify tender exists
  const tender = await Tender.findById(tenderId);
  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  const options = {
    page:   parseInt(page, 10),
    limit:  parseInt(limit, 10),
    sort:   { bidAmount: 1 },
    populate: [
      { path: 'supplier', select: 'name email' },
      { path: 'tender',   select: 'title deadline budget status city' }
    ]
  };

  const bids = await Bid.paginate({ tender: tenderId }, options);

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Tender bids fetched successfully"));
});

// Update Bid Status (Admin Only)
const updateBidStatus = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Bid status is required");
  }

  const bid = await Bid.findByIdAndUpdate(
    bidId,
    { status },
    { new: true, runValidators: true }
  ).populate("supplier", "name email");

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  const message = `Your bid has been ${status}.`;
  await createNotification({
    userId: bid.supplier._id,
    message
  });

  // Send notification email to supplier
  const { supplier, tender } = bid;
  const subject = `Your bid on "${tender.title}" has been ${status}`;
  const html = `
    <p>Hi ${supplier.name},</p>
    <p>Your bid of <strong>₹${bid.bidAmount.toLocaleString()}</strong> on tender 
      "<strong>${tender.title}</strong>" has been <strong>${status}</strong>.</p>
    <p>Thank you for using GovBuy.</p>
    <p>— GovBuy Team</p>
  `;

  try {
    await sendEmail({ to: supplier.email, subject, html });
  } catch (mailErr) {
    console.error('Failed to send status email:', mailErr);
    // You can optionally log or swallow this error
  }

  return res
    .status(200)
    .json(new ApiResponse(200, bid, "Bid status updated successfully"));
});

const getBidDetails = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bidId)) {
    throw new ApiError(400, "Invalid Bid ID");
  }

  const bid = await Bid.findById(bidId)
    .populate({ path: "supplier",   select: "name email role status" })
    .populate({ path: "proposalDoc",select: "url filename" })
    .populate({
      path: "tender",
      select: "title deadline budget status city createdBy",
      // Also populate the createdBy user’s name/email if you want
      populate: { path: "createdBy", select: "name email role" }
    });

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, bid, "Bid details fetched successfully"));
});


export {
  submitBid,
  getMyBids,
  deleteBid,
  getTenderBids,
  updateBidStatus,
  getBidDetails
};
