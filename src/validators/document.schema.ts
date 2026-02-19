import { z } from "zod";

export const UploadDocumentSchema = z.object({
  // Ensure the trip ID is a valid UUID
  id_trip: z.string().uuid({ message: "Invalid Trip ID format" }),

  // Optional: Allow the user to categorize the document
  category_docu: z
    .enum(["boarding_pass", "hotel", "activity", "other"])
    .optional(),

  // Optional: A custom name if they don't want to use the filename
  custom_name: z.string().max(100).optional(),
});

// Type for use in your Controller
export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
