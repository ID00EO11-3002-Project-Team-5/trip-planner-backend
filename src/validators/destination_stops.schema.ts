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

// Validates the URL parameters for GET /stops/trip/:tripId and DELETE /stops/:stopId
export const StopIdParamSchema = z.object({
  stopId: z.string().uuid("Invalid Stop ID format"),
});

export const TripIdParamSchema = z.object({
  tripId: z.string().uuid("Invalid Trip ID format"),
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
