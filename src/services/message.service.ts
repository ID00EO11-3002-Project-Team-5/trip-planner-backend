import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Send Message Service
 */
export const sendMessageService = async (
  supabase: SupabaseClient,
  tripId: string,
  content: string,
  currentUserId: string,
) => {
  // Check user is member of the trip
  const { data: member } = await supabase
    .from("t_trip_member_trme")
    .select("id_trip")
    .eq("id_trip", tripId)
    .eq("id_user", currentUserId)
    .maybeSingle();

  if (!member) {
    throw new Error("You are not a member of this trip");
  }

  // Insert message
  const { data, error } = await supabase
    .from("t_message_mssg")
    .insert({
      id_trip: tripId,
      id_user: currentUserId,
      content_mssg: content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get Messages By Trip Service
 */
export const getMessagesByTripService = async (
  supabase: SupabaseClient,
  tripId: string,
  currentUserId: string,
) => {
  //  Check membership
  const { data: member } = await supabase
    .from("t_trip_member_trme")
    .select("id_trip")
    .eq("id_trip", tripId)
    .eq("id_user", currentUserId)
    .maybeSingle();

  if (!member) {
    throw new Error("Access denied");
  }

  //  Fetch messages ordered by time
  const { data, error } = await supabase
    .from("t_message_mssg")
    .select(`
      id_mssg,
      id_trip,
      id_user,
      content_mssg,
      created_at_mssg
    `)
    .eq("id_trip", tripId)
    .order("created_at_mssg", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
