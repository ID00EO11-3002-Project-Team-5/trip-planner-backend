import { z } from "zod";

export const UploadDocumentSchema = z.object({
  id_trip: z.string().uuid({ message: "Invalid Trip ID format" }),

  category_docu: z
    .enum(["boarding_pass", "hotel", "activity", "other"])
    .optional(),

  custom_name: z.string().max(100).optional(),
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
