import { z } from "zod";

export const lodgingSchema = z.object({
  id_itit: z.string().uuid("Itinerary reference is required"),
  name_lodg: z.string().min(1, "Lodging name is required"),
  address_lodg: z.string().optional().nullable(),
  checkin_lodg: z.string().optional().nullable(), // ISO string or DateTime
  checkout_lodg: z.string().optional().nullable(),
  confirmation_lodg: z.string().optional().nullable(),
  link_lodg: z.string().url().optional().nullable().or(z.literal("")),
});

export type LodgingInput = z.infer<typeof lodgingSchema>;
