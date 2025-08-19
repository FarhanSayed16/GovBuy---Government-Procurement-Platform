// routes/supplier.routes.js  (or routes/document.routes.js)
import { Router } from "express";
import { getDocumentById } from "../controllers/document.controller.js";
import { verifyJWT }       from "../middlewares/auth.middleware.js";
import { checkRole }       from "../middlewares/roleCheck.middleware.js";

const router = Router();

// GET one document by ID (suppliers and gov roles)
router
  .route("/:documentId")
  .get(
    verifyJWT, // adjust roles as needed
    getDocumentById
  );

export default router;
