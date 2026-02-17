import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  sendInvite,
  acceptInvite,
  rejectInvite,
} from "../controllers/invite.controller";

const router = Router();

/**
 * Send Invite
 * POST /invites/trips/:tripId/invite
 */
router.post("/trips/:tripId/invite", protect, sendInvite);

/**
 * Accept Invite
 * PATCH /invites/:inviteId/accept
 */
router.patch("/:inviteId/accept", protect, acceptInvite);

/**
 * Reject Invite
 * PATCH /invites/:inviteId/reject
 */
router.patch("/:inviteId/reject", protect, rejectInvite);

export default router;
