import { z } from "zod";
export const createTripSchema = z
  .object({
    title_trip: z.string().min(1, "Title is required"),

    startdate_trip: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "startdate_trip must be a valid ISO date string",
    }),

    enddate_trip: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "enddate_trip must be a valid ISO date string",
    }),
  })
  .superRefine((obj, ctx) => {
    const start = Date.parse(obj.startdate_trip);

    const end = Date.parse(obj.enddate_trip);

    if (!Number.isFinite(start) || !Number.isFinite(end)) return;
    // individual refinements already report

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        message: "enddate_trip must be the same or after startdate_trip",
        path: ["enddate_trip"],
      });
    }
  });
export type CreateTripInput = z.infer<typeof createTripSchema>;
