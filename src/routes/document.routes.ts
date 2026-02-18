import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocumentUrl,
  getTripDocuments,
  deleteDocument,
} from "../controllers/document.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Use 'file' as the field name for the frontend
router.post("/", protect, upload.single("file"), uploadDocument);

router.get("/:docId/view", protect, getDocumentUrl);

router.get("/trip/:id_trip", protect, getTripDocuments);

router.delete("/:docId", protect, deleteDocument);
export default router;
