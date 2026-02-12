import { z } from "zod";

export const createItinerarySchema = z.object({
  id_trip: z.string().uuid(),
  title_itit: z.string().min(1, "Title is required"),
  date_itit: z.string(), // YYYY-MM-DD
  time_itit: z.string().optional(), // HH:mm:ss
  location_itit: z.string().optional().nullable(),
  cost_itit: z.number().optional().nullable(),
  position_itit: z.number().int().default(0),
  id_loca: z.string().uuid().optional().nullable(), // Link to t_location_loca
});

export const reorderItinerarySchema = z.object({
  tripId: z.string().uuid(),
  updates: z.array(
    z.object({
      id_itit: z.string().uuid(),
      position_itit: z.number().int().nonnegative(),
    })
  ),
});

export type CreateItineraryInput = z.infer<typeof createItinerarySchema>;
