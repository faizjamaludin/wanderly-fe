import { z } from "zod";
import { TRIP_TYPES } from "@/types";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");

export const tripDetailsSchema = z
  .object({
    name: z.string().trim().min(1, "Trip name is required"),
    destination: z.string().trim().min(1, "Destination is required"),
    startDate: isoDate,
    endDate: isoDate,
    type: z.enum(TRIP_TYPES as [string, ...string[]], {
      errorMap: () => ({ message: "Pick a trip type" }),
    }),
    notes: z.string().optional(),
  })
  .refine((v) => v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "End date must be on or after start date",
  });

export const collaboratorSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["viewer", "editor"]),
});

export const accommodationSchema = z
  .object({
    name: z.string().trim().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    confirmationNum: z.string().optional().default(""),
  })
  .refine(
    (v) => {
      if (!v.name) return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(v.startDate);
    },
    { path: ["startDate"], message: "Pick a start date" }
  )
  .refine(
    (v) => {
      if (!v.name) return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(v.endDate);
    },
    { path: ["endDate"], message: "Pick an end date" }
  )
  .refine((v) => !v.name || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "End date must be on or after start date",
  });

export const budgetSchema = z.object({
  total: z.coerce.number().nonnegative("Enter a non-negative amount"),
  currency: z.string().min(1, "Pick a currency"),
  splitMode: z.enum(["equal", "custom", "payg"]),
  travelerCount: z.coerce.number().int().min(1, "At least one traveler"),
});

export type TripDetailsValues = z.infer<typeof tripDetailsSchema>;
export type AccommodationValues = z.infer<typeof accommodationSchema>;
export type BudgetValues = z.infer<typeof budgetSchema>;
export type CollaboratorValues = z.infer<typeof collaboratorSchema>;
