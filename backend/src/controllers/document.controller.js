// controllers/document.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }     from "../utils/ApiError.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import { Document }     from "../models/document.model.js";

/**
 * GET /api/v1/documents/:documentId
 * Fetch a single Document record (url, filename, etc.) by its ID.
 */
const getDocumentById = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  // Find the document
  const doc = await Document.findById(documentId).select(
    "_id url filename mimeType size createdAt"
  );
  if (!doc) {
    throw new ApiError(404, "Document not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doc, "Document fetched successfully"));
});

export { getDocumentById };
