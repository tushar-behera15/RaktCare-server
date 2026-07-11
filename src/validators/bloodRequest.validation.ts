import z from "zod";

export const bloodRequestSchema = z.object({
    hospitalId: z.string().min(1, "Hospital ID is required"),
    recipientId: z.string().min(1, "Recipient ID is required"),
    unitsRequired: z.number().min(1, "At least 1 unit is required"),
    urgency: z.enum(["low", "medium", "high", "critical"]).default("medium"),
    reason: z.string().min(3, "Reason must be at least 3 characters"),
    requiredDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    remarks: z.string().optional(),
});

export const updateBloodRequestStatusSchema = z.object({
    status: z.enum(["pending", "approved", "rejected", "completed"], {
        error: "Status must be one of: pending, approved, rejected, completed",
    }),
    remarks: z.string().optional(),
});

export const updateBloodRequestSchema = z.object({
    unitsRequired: z.number().positive().optional(),
    urgency: z.enum(["low", "medium", "high", "critical"]).optional(),
    reason: z.string().optional(),
    requiredDate: z.string().optional(),
    remarks: z.string().optional(),
});
