import { Request, Response } from "express";
import {
  uploadFileToStorage,
  getSecureDocumentUrlService,
  getTripDocumentsService,
  deleteDocumentService,
} from "../services/document.service";
import { UploadDocumentSchema } from "../validators/document.schema";

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const validation = UploadDocumentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.error.format(),
      });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No filr uploaded" });
    }
    const { id_trip } = validation.data;
    const userId = (req as any).user.id;

    const result = await uploadFileToStorage(
      req.supabase!,
      file,
      userId,
      id_trip,
    );
    return res.status(201).json({
      message: "Document uploaded succesfully",
      data: result,
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during upload";
    return res.status(500).json({ error: msg });
  }
};

export const getDocumentUrl = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const userId = (req as any).user.id;

    if (typeof docId !== "string") {
      return res.status(400).json({ error: "Invalid Document ID" });
    }

    const signedUrl = await getSecureDocumentUrlService(
      req.supabase!,
      docId,
      userId,
    );

    return res.json({ url: signedUrl });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";

    const status = msg.includes("Access denied") ? 403 : 500;
    return res.status(status).json({ error: msg });
  }
};

export const getTripDocuments = async (req: Request, res: Response) => {
  try {
    const { id_trip } = req.params;
    const userId = (req as any).user.id;

    if (typeof id_trip !== "string") {
      return res.status(400).json({ error: "Invalid Trip ID" });
    }

    const documents = await getTripDocumentsService(
      req.supabase!,
      id_trip,
      userId,
    );

    return res.json(documents);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    const status = msg.includes("Access denied") ? 403 : 500;
    return res.status(status).json({ error: msg });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const userId = (req as any).user.id;

    if (typeof docId !== "string") {
      return res.status(400).json({ error: "Invalid Document ID" });
    }

    await deleteDocumentService(req.supabase!, docId, userId);

    return res.json({ message: "Document deleted successfully" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Error";
    const status = msg.includes("permission") ? 403 : 500;
    return res.status(status).json({ error: msg });
  }
};
