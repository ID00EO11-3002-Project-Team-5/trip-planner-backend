import { z } from "zod";

export const createTripSchema = z.object({
  title_trip: z.string().min(1, "Title is required"),
  startdate_trip: z.string(), // ISO date
  enddate_trip: z.string(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
