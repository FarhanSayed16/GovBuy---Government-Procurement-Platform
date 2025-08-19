import { Router } from "express";
import multer from "multer";
import {
  submitBid,
  getMyBids,
  getTenderBids,
  updateBidStatus,
  deleteBid,
  getBidDetails,
} from "../controllers/bid.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";

const router = Router();
const upload = multer({ dest: "./public/temp" });

// Supplier-only: submit a bid + optional proposal doc
router
  .route("/")
  .post(
    verifyJWT,
    checkRole("supplier"),
    upload.single("proposalDoc"),  // <- accept file
    submitBid
  );

router
  .route("/my")
  .get(verifyJWT, checkRole("supplier"), getMyBids);

router
  .route('/:bidId')
  .delete(verifyJWT, checkRole('supplier'), deleteBid);

// Admin: View & Manage Bids for a Tender
router
  .route('/tender/:tenderId')
  .get(verifyJWT, checkRole('admin','procurement_officer','department_head'), getTenderBids);

router
  .route('/:bidId/status')
  .patch(verifyJWT, checkRole('admin',"procurement_officer","department_head"), updateBidStatus);


router
  .route("/:bidId")
  .get(
    verifyJWT,
    checkRole("admin","government","procurement_officer","department_head","supplier"),
    getBidDetails
  );


export default router;
