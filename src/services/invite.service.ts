import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Send Invite Service
 */
export const sendInviteService = async (
  supabase: SupabaseClient,
  tripId: string,
  invitedUserId: string,
  currentUserId: string,
) => {
  // 1️⃣ Check inviter is member
  const { data: member, error: memberError } = await supabase
    .from("t_trip_member_trme")
    .select("id_trip")
    .eq("id_trip", tripId)
    .eq("id_user", currentUserId)
    .single();

  if (memberError || !member) {
    throw new Error("You are not a member of this trip");
  }

  // 2️⃣ Check invited user exists
  const { data: user, error: userError } = await supabase
    .from("t_user_user")
    .select("id_user")
    .eq("id_user", invitedUserId)
    .single();

  if (userError || !user) {
    throw new Error("Invited user does not exist");
  }

  // 3️⃣ Check invited user not already member
  const { data: existingMember } = await supabase
    .from("t_trip_member_trme")
    .select("id_trip")
    .eq("id_trip", tripId)
    .eq("id_user", invitedUserId)
    .maybeSingle();

  if (existingMember) {
    throw new Error("User is already a member of this trip");
  }

  // 4️⃣ Insert invite
  const { data: invite, error: inviteError } = await supabase
    .from("t_trip_invite_invi")
    .insert({
      id_trip: tripId,
      id_invited_user: invitedUserId,
      id_invited_by: currentUserId,
      status_invite_invi: "pending", // important
    })
    .select()
    .single();

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  return invite;
};

/**
 * Accept Invite Service
 */
export const acceptInviteService = async (
  supabase: SupabaseClient,
  inviteId: string,
  currentUserId: string,
) => {
  // 1️⃣ Get pending invite
  const { data: invite, error: inviteError } = await supabase
    .from("t_trip_invite_invi")
    .select("*")
    .eq("id_invi", inviteId)
    .eq("id_invited_user", currentUserId)
    .eq("status_invite_invi", "pending")
    .single();

  if (inviteError || !invite) {
    throw new Error("Invite not found or already handled");
  }

  // 2️⃣ Update invite status
  const { error: updateError } = await supabase
    .from("t_trip_invite_invi")
    .update({
      status_invite_invi: "accepted",
    })
    .eq("id_invi", inviteId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // 3️⃣ Insert into trip_member
  const { error: memberInsertError } = await supabase
    .from("t_trip_member_trme")
    .insert({
      id_trip: invite.id_trip,
      id_user: currentUserId,
    });

  if (memberInsertError) {
    throw new Error(memberInsertError.message);
  }

  return { message: "Invite accepted successfully" };
};

/**
 * Reject Invite Service
 */
export const rejectInviteService = async (
  supabase: SupabaseClient,
  inviteId: string,
  currentUserId: string,
) => {
  const { data: invite, error: inviteError } = await supabase
    .from("t_trip_invite_invi")
    .select("*")
    .eq("id_invi", inviteId)
    .eq("id_invited_user", currentUserId)
    .eq("status_invite_invi", "pending")
    .single();

  if (inviteError || !invite) {
    throw new Error("Invite not found or already handled");
  }

  const { error: updateError } = await supabase
    .from("t_trip_invite_invi")
    .update({
      status_invite_invi: "rejected",
    })
    .eq("id_invi", inviteId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return { message: "Invite rejected successfully" };
};
