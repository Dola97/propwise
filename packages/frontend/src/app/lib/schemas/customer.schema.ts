import { z } from "zod";

export const customerSchema = z.object({
    full_name: z
        .string()
        .min(1, "Full name is required")
        .max(255, "Full name is too long"),
    email: z.email("Please enter a valid email").min(1, "Email is required"),
    phone_number: z
        .string()
        .min(1, "Phone number is required")
        .max(50, "Phone number is too long"),
    national_id: z
        .string()
        .max(100, "National ID is too long")
        .optional()
        .or(z.literal("")),
    internal_notes: z
        .string()
        .max(5000, "Notes are too long")
        .optional()
        .or(z.literal("")),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
