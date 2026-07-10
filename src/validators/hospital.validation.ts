import { z } from "zod";

export const hospitalProfileSchema = z.object({
    hospitalName: z
        .string()
        .trim()
        .min(3, "Hospital name must be at least 3 characters.")
        .max(100),

    registrationNumber: z
        .string()
        .trim()
        .min(3, "Registration number is required."),

    licenseNumber: z
        .string()
        .trim()
        .min(3, "License number is required."),

    address: z
        .string()
        .trim()
        .min(5, "Address is required."),

    city: z
        .string()
        .trim()
        .min(2, "City is required."),

    state: z
        .string()
        .trim()
        .min(2, "State is required."),

    pincode: z
        .string()
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),

    emergencyContact: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid mobile number."),

    openingTime: z
        .string()
        .min(1, "Opening time is required."),

    closingTime: z
        .string()
        .min(1, "Closing time is required."),

    isVerified: z.boolean().optional(),
});