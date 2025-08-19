// controllers/dashboard.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError }     from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Tender } from "../models/tender.model.js";
import { Bid } from "../models/bid.model.js";

// GET /api/admin/dashboard/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  // Total Suppliers (approved)
  const totalSuppliers = await User.countDocuments({ role: 'supplier', status: 'approved' });

  // Pending Supplier Approvals
  const pendingSuppliers = await User.countDocuments({ role: 'supplier', status: 'pending' });

  // Total Tenders
  const totalTenders = await Tender.countDocuments();

  // Open vs Closed Tenders
  const openTenders = await Tender.countDocuments({ deadline: { $gt: new Date() } });
  const closedTenders = totalTenders - openTenders;

  // Total Bids
  const totalBids = await Bid.countDocuments();

  // Avg Bids per Tender
  const avgBidsPerTender = totalTenders > 0
    ? (await Bid.countDocuments()) / totalTenders
    : 0;

  // Recent 5 Tenders
  const recentTenders = await Tender.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title createdAt deadline');

  // Recent 5 Bids
  const recentBids = await Bid.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('supplier', 'name email')
    .populate('tender', 'title');

  const stats = {
    totalSuppliers,
    pendingSuppliers,
    totalTenders,
    openTenders,
    closedTenders,
    totalBids,
    avgBidsPerTender,
    recentTenders,
    recentBids,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

const getSupplierDashboard = asyncHandler(async (req, res) => {
  const supplierId = req.user.id;

  // Ensure only approved suppliers can view their dashboard
  if (req.user.status !== "approved") {
    throw new ApiError(403, "Supplier account must be approved to view dashboard");
  }

  // 1) Aggregate bid counts by status
  const [ totalBids, acceptedBids, rejectedBids, pendingBids ] = await Promise.all([
    Bid.countDocuments({ supplier: supplierId }),
    Bid.countDocuments({ supplier: supplierId, status: "accepted" }),
    Bid.countDocuments({ supplier: supplierId, status: "rejected" }),
    Bid.countDocuments({ supplier: supplierId, status: "pending" }),
  ]);

  // 2) Calculate win rate
  const winRate = totalBids > 0
    ? Number(((acceptedBids / totalBids) * 100).toFixed(2))
    : 0;

  // 3) Fetch the last 5 bids, include tender info
  const recentBids = await Bid.find({ supplier: supplierId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("bidAmount status createdAt tender")
    .populate("tender", "title deadline budget status");

  // 4) Build and send response
  const payload = {
    totalBids,
    acceptedBids,
    rejectedBids,
    pendingBids,
    winRate,
    recentBids,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Supplier dashboard data fetched successfully"));
});


export { getDashboardStats,getSupplierDashboard };


