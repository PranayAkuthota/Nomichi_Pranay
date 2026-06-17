import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(
      /^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+\d{1,3}[\-\s]?)?\d{10,14}$/,
      "Enter a valid phone number"
    ),
  email: z.string().email("Enter a valid email address"),
  trip_id: z.string().uuid("Select a trip"),
  group_type: z.enum(["solo", "friends", "couple", "family"], {
    errorMap: () => ({ message: "Select a group type" }),
  }),
  preferred_month: z.string().min(1, "Select a preferred month"),
  trip_feeling: z
    .string()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(1000, "Keep it under 1000 characters"),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const tripSchema = z.object({
  name: z.string().min(2, "Trip name is required"),
  destination: z.string().min(2, "Destination is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  price_including_gst: z.coerce
    .number()
    .positive("Price must be greater than 0"),
  total_seats: z.coerce
    .number()
    .int()
    .positive("Seats must be at least 1"),
  status: z.enum(["open", "closed"]),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Keep description under 500 characters"),
});

export type TripFormValues = z.infer<typeof tripSchema>;

export const touchpointSchema = z.object({
  content: z
    .string()
    .min(1, "Note cannot be empty")
    .max(2000, "Keep notes under 2000 characters"),
});

export type TouchpointFormValues = z.infer<typeof touchpointSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
