import { z } from "zod";

export const donorProfileSchema = z.object({

    weight: z
        .number({
            error: "Weight must be a number.",
        })
        .min(45, "Minimum weight to donate blood is 45 kg.")
        .max(250, "Please enter a valid weight.")
        .optional(),

    hemoglobin: z
        .number({
            error: "Hemoglobin must be a number.",
        })
        .min(12, "Hemoglobin must be at least 12 g/dL.")
        .max(20, "Please enter a valid hemoglobin level.")
        .optional(),

    diseases: z
        .array(z.string().trim().min(2))
        .optional(),

    isAvailableForDonation: z.boolean().default(false),

    lastDonationDate: z.coerce.date().optional(),
});