// routes/supplier.routes.js
import { Router } from "express";
import multer from "multer";
import {
  getSupplierDashboard,
  uploadDocument,
  getDocuments,
  deleteDocument,
  getSupplierById,
} from "../controllers/supplier.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";

const router = Router();
const upload = multer({ dest: './public/temp' });

// Supplier Dashboard
router
  .route('/dashboard')
  .get(verifyJWT, checkRole('supplier'), getSupplierDashboard);

// Document Upload & Management (Cloudinary)  
router
  .route('/documents')
  .post(verifyJWT, checkRole('supplier'), upload.single('file'), uploadDocument)
  .get(verifyJWT, checkRole('supplier'), getDocuments);

router
  .route('/documents/:documentId')
  .delete(verifyJWT, checkRole('supplier'), deleteDocument);

router
.route("/:supplierId")
.get(verifyJWT, getSupplierById);


export default router;  