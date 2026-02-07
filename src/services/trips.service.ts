import { SupabaseClient } from "@supabase/supabase-js";
import { CreateTripInput } from "../validators/trip.schema";

export async function createTripService(
  supabase: SupabaseClient,
  payload: CreateTripInput,
) {
  const { data, error } = await supabase
    .from("t_trip_trip")
    .insert({
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
