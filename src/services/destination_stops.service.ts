import { SupabaseClient } from "@supabase/supabase-js";
import { CreateStopInput } from "../validators/destination_stops.schema";

export async function createStopService(
  supabase: SupabaseClient,
  payload: CreateStopInput,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

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
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("t_location_loca")
    .upsert(updates)
    .select();
  if (error) throw new Error(error.message);
  return data;
}
