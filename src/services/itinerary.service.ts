import { SupabaseClient } from "@supabase/supabase-js";
import { CreateItineraryInput } from "../validators/itinerary.schema";
import { supabase } from "../lib/supabaseClients";
import { id } from "zod/v4/locales";

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
    id_trip: tripId,
  }));

  const { data, error } = await supabase.rpc("reorder_itinerary", {
    p_updates: payload,
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
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export const updateItineraryService = async (
  supabase: SupabaseClient,
  id: String,
  updates: any,
) => {
  const { data, error } = await supabase
    .from("t_itinerary_item_itit")
    .update(updates)
    .eq("id_itit", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTripCostSummaryService = async (
  supabase: SupabaseClient,
  tripId: string,
) => {
  const { data, error } = await supabase
    .from("t_itinerary_item_itit")
    .select("cost_itit, title_itit")
    .eq("id_trip", tripId);

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const total = data.reduce(
    (sum, item) => sum + (Number(item.cost_itit) || 0),
    0,
  );

  return {
    tripId,
    totalCost: total,
    currency: "USD", // to be changed  to other curuncies once it works
    itemsCount: data.length,
  };
};
