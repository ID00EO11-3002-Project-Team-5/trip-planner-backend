import { SupabaseClient } from "@supabase/supabase-js";
import { CreateStopInput } from "../validators/destination_stops.schema";

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

export async function reorderStopsService(
  supabase: SupabaseClient,
  updates: { id_loca: string; position_loca: number }[],
) {
  // Redundant getUser() check removed
  const { data, error } = await supabase
    .from("t_location_loca")
    .upsert(updates)
    .select();

  if (error) throw new Error(error.message);
  return data;
}
