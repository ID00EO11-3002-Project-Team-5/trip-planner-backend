import { SupabaseClient } from "@supabase/supabase-js";
import { CreateItineraryInput } from "../validators/itinerary.schema";

export async function getTripScheduleService(
  supabase: SupabaseClient,
  tripId: string,
) {
  const { data, error } = await supabase
    .from("t_itinerary_item_itit")
    .select(
      `
      *,
      formal_location: t_location_loca (name_loca, coordinates)
    `,
    )
    .eq("id_trip", tripId)
    .order("date_itit", { ascending: true })
    .order("time_itit", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createItineraryItemService(
  supabase: SupabaseClient,
  payload: CreateItineraryInput,
) {
  const { data, error } = await supabase
    .from("t_itinerary_item_itit")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function reorderItineraryService(
  supabase: SupabaseClient,
  updates: { id_itit: string; position_itit: number }[],
  tripId: string,
) {
  const payload: any = updates.map((item) => ({
    id_itit: item.id_itit,
    position_itit: item.position_itit,
    id_trip: tripId, // Use the 3rd argument here. Match your DB column name (id_trip)
  }));

  const { data, error } = await supabase.rpc("reorder_itinerary", {
    p_updates: payload, // Just pass the array directly
    p_trip_id: tripId,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteItineraryItemService(
  supabase: SupabaseClient,
  itemId: string,
) {
  const { data, error } = await supabase
    .from("t_itinerary_item_itit")
    .delete()
    .eq("id_itit", itemId)
    .select(); // Returning the deleted item is helpful for UI confirmation

  if (error) throw new Error(error.message);
  return data;
}
