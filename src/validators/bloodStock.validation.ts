import { z } from "zod";

export const bloodStockSchema = z.object({
    bloodGroup: z.enum(
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        {
            error: "Please select a valid blood group.",
        }
    ),

    availableUnits: z
        .number({
            error: "Available units must be a number.",
        })
        .min(0, {
            error: "Available units cannot be negative.",
        }),

    reservedUnits: z
        .number({
            error: "Reserved units must be a number.",
        })
        .min(0, {
            error: "Reserved units cannot be negative.",
        })
        .default(0),

    lastUpdated: z.date().optional(),
});