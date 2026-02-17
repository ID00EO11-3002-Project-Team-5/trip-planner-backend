import { Request, Response } from "express";
import {
  sendInviteService,
  acceptInviteService,
  rejectInviteService,
} from "../services/invite.service";
import {
  SendInviteSchema,
  TripIdParamSchema,
  InviteIdParamSchema,
} from "../validators/invite.schema";

/**
 * Send Invite
 * POST /invites/trips/:tripId/invite
 */
export const sendInvite = async (
  req: Request<{ tripId: string }>,
  res: Response,
) => {
  if (!req.supabase || !req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

  // ✅ Validate Params
  const paramParsed = TripIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({
      message: "Invalid tripId",
      errors: paramParsed.error.flatten(),
    });
  }

  // ✅ Validate Body
  const bodyParsed = SendInviteSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: bodyParsed.error.flatten(),
    });
  }

  try {
    const invite = await sendInviteService(
      req.supabase,
      paramParsed.data.tripId,
      bodyParsed.data.invitedUserId,
      req.user.id,
    );

    return res.status(201).json(invite);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to send invite";

    return res.status(400).json({
      message: "Failed to send invite",
      error: message,
    });
  }
};

/**
 * Accept Invite
 * PATCH /invites/:inviteId/accept
 */
export const acceptInvite = async (
  req: Request<{ inviteId: string }>,
  res: Response,
) => {
  if (!req.supabase || !req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

  // ✅ Validate Params
  const paramParsed = InviteIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({
      message: "Invalid inviteId",
      errors: paramParsed.error.flatten(),
    });
  }

  try {
    const result = await acceptInviteService(
      req.supabase,
      paramParsed.data.inviteId,
      req.user.id,
    );

    return res.status(200).json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to accept invite";

    return res.status(400).json({
      message: "Failed to accept invite",
      error: message,
    });
  }
};

/**
 * Reject Invite
 * PATCH /invites/:inviteId/reject
 */
export const rejectInvite = async (
  req: Request<{ inviteId: string }>,
  res: Response,
) => {
  if (!req.supabase || !req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

  // ✅ Validate Params
  const paramParsed = InviteIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({
      message: "Invalid inviteId",
      errors: paramParsed.error.flatten(),
    });
  }

  try {
    const result = await rejectInviteService(
      req.supabase,
      paramParsed.data.inviteId,
      req.user.id,
    );

    return res.status(200).json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reject invite";

    return res.status(400).json({
      message: "Failed to reject invite",
      error: message,
    });
  }
};
