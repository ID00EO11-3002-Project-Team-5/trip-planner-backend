import { SupabaseClient } from "@supabase/supabase-js";
import { CreateStopInput } from "../validators/destination_stops.schema";

/**
 * Creates a destination stop
 */

export async function createStopService(
  supabase: SupabaseClient,
  payload: CreateStopInput,
) {
  const { data, error } = await supabase
    .from("t_location_loca")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
/**
 * Reorders destination stop
 */
export async function reorderStopsService(
  supabase: SupabaseClient,
  updates: { id_loca: string; position_loca: number }[],
) {
  const { data, error } = await supabase
    .from("t_location_loca")
    .upsert(updates)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * GET Array of location objects from t_location_loca
 */
export const getStopsByTripService = async (
  supabase: SupabaseClient,
  tripId: string,
) => {
  const { data, error } = await supabase
    .from("t_location_loca")
    .select("*")
    .eq("id_trip", tripId)
    .order("createdat_loca", { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * DELETE a destination stop
 */
export const deleteStopService = async (
  supabase: SupabaseClient,
  stopId: string,
) => {
  const { error } = await supabase
    .from("t_location_loca")
    .delete()
    .eq("id_loca", stopId); //

  if (error) throw error;
  return { success: true };
};
