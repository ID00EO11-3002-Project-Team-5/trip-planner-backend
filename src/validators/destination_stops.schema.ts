import { z } from "zod";

export const CreateStopSchema = z.object({
  id_trip: z.string().uuid(),
  name_loca: z.string().min(1, "Name is required"),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export type CreateStopInput = z.infer<typeof CreateStopSchema>;

export const ReorderStopsSchema = z.object({
  updates: z.array(
    z.object({
      id_loca: z.string().uuid(),
      position_loca: z.number().int(),
    }),
  ),
});
