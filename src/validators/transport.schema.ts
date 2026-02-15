import { z } from "zod";

export const transportSchema = z.object({
  id_itit: z.string().uuid("Itinerary reference is required"),
  type_tran: z.string().min(1, "Transport type (e.g. Flight) is required"),
  provider_tran: z.string().optional().nullable(),
  deploc_tran: z.string().optional().nullable(),
  arrloc_tran: z.string().optional().nullable(),
  deptime_tran: z.string().optional().nullable(),
  arrtime_tran: z.string().optional().nullable(),
  link_tran: z.string().url().optional().nullable().or(z.literal("")),
});

export type TransportInput = z.infer<typeof transportSchema>;
