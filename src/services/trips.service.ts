import { SupabaseClient } from "@supabase/supabase-js";
import { CreateTripInput } from "../validators/trip.schema";

export async function createTripService(
  supabase: SupabaseClient,
  payload: CreateTripInput,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("t_trip_trip")
    .insert({
      id_user_creator: user.id,
      title_trip: payload.title_trip,
      startdate_trip: payload.startdate_trip,
      enddate_trip: payload.enddate_trip,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserTripsService(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("t_trip_trip")
    .select("*")
    .eq("id_user_creator", user.id)
    .order("startdate_trip", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTripService(supabase: SupabaseClient, tripId: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("t_trip_trip")
    .select("*")
    .eq("id_trip", tripId)
    .eq("id_user_creator", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateTripService(
  supabase: SupabaseClient,
  tripId: string,
  payload: Partial<CreateTripInput>,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("t_trip_trip")
    .update(payload)
    .eq("id_trip", tripId)
    .eq("id_user_creator", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTripService(
  supabase: SupabaseClient,
  tripId: string,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("t_trip_trip")
    .delete()
    .eq("id_trip", tripId)
    .eq("id_user_creator", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
