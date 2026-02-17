import { z } from "zod";

/**
 * Send Invite Body Schema
 * Validates invitedUserId
 */
export const SendInviteSchema = z.object({
  invitedUserId: z
    .string()
    .uuid({ message: "invitedUserId must be a valid UUID" }),
});

/**
 * Trip ID Param Schema
 */
export const TripIdParamSchema = z.object({
  tripId: z
    .string()
    .uuid({ message: "tripId must be a valid UUID" }),
});

/**
 * Invite ID Param Schema
 */
export const InviteIdParamSchema = z.object({
  inviteId: z
    .string()
    .uuid({ message: "inviteId must be a valid UUID" }),
});
