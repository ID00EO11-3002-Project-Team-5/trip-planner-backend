import { supabase } from "../lib/supabaseClients";
import { lodgingSchema, LodgingInput } from "../validators/lodging.schema";

export const lodgingService = {
  async createLodging(lodgingData: LodgingInput) {
    const validatedData = lodgingSchema.parse(lodgingData);
    const { data, error } = await supabase
      .from("t_lodging_lodg")
      .insert([validatedData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateLodging(id_lodg: string, updates: Partial<LodgingInput>) {
    const validatedUpdates = lodgingSchema.partial().parse(updates);
    const { data, error } = await supabase
      .from("t_lodging_lodg")
      .update(validatedUpdates)
      .eq("id_lodg", id_lodg)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteLodging(id_lodg: string) {
    const { error } = await supabase
      .from("t_lodging_lodg")
      .delete()
      .eq("id_lodg", id_lodg);

    if (error) throw new Error(error.message);
    return { message: "Lodging details removed successfully" };
  },

  // GET: Fetch specific lodging by its ID
  async getLodgingById(id_lodg: string) {
    const { data, error } = await supabase
      .from("t_lodging_lodg")
      .select("*")
      .eq("id_lodg", id_lodg)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // GET: Fetch lodging linked to a timeline item
  async getLodgingByItinerary(id_itit: string) {
    const { data, error } = await supabase
      .from("t_lodging_lodg")
      .select("*")
      .eq("id_itit", id_itit)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },
};
