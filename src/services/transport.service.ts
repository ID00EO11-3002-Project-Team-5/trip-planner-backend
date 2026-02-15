import { supabase } from "../lib/supabaseClients";
import {
  transportSchema,
  TransportInput,
} from "../validators/transport.schema";

export const transportService = {
  async createTransport(transportData: TransportInput) {
    const validatedData = transportSchema.parse(transportData);
    const { data, error } = await supabase
      .from("t_transport_tran")
      .insert([validatedData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateTransport(id_tran: string, updates: Partial<TransportInput>) {
    const validatedUpdates = transportSchema.partial().parse(updates);
    const { data, error } = await supabase
      .from("t_transport_tran")
      .update(validatedUpdates)
      .eq("id_tran", id_tran)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteTransport(id_tran: string) {
    const { error } = await supabase
      .from("t_transport_tran")
      .delete()
      .eq("id_tran", id_tran);

    if (error) throw new Error(error.message);
    return { message: "Transport details removed successfully" };
  },

  // GET: Fetch specific transport by its ID
  async getTransportById(id_tran: string) {
    const { data, error } = await supabase
      .from("t_transport_tran")
      .select("*")
      .eq("id_tran", id_tran)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // GET: Fetch transport linked to a timeline item
  async getTransportByItinerary(id_itit: string) {
    const { data, error } = await supabase
      .from("t_transport_tran")
      .select("*")
      .eq("id_itit", id_itit)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },
};
