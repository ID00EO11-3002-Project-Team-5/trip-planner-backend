import { z } from "zod";

/**
 * Send Message Body Schema
 */
export const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Message content cannot be empty" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
});

/**
 * Trip ID Param Schema
 */
export const TripIdParamSchema = z.object({
  tripId: z.string().uuid({ message: "tripId must be a valid UUID" }),
});
