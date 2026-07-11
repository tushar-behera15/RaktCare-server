
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
        .optional(),

    totalUnits: z
        .number({
            error: "Total units must be a number.",
        })
        .min(0, {
            error: "Total units cannot be negative.",
        }),
    lastUpdated: z.date().optional(),
})
    .refine(
        (data) => data.availableUnits + data.reservedUnits! <= data.totalUnits,
        {
            message:
                "Available units + Reserved units cannot exceed Total units.",
            path: ["totalUnits"],
        }
    );