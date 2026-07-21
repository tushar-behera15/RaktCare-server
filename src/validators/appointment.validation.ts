import z from "zod";

export const appointmentSchema = z.object({
    hospitalId: z.string().min(1, "Hospital ID is required"),
    appointmentDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .refine((val) => new Date(val) > new Date(), {
            message: "Appointment date must be in the future",
        }),
    remarks: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
    appointmentDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .refine((val) => new Date(val) > new Date(), {
            message: "Appointment date must be in the future",
        })
        .optional(),
    remarks: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({
    status: z.enum(["pending", "approved", "rejected", "completed", "cancelled"], {
        error: "Status must be one of: pending, approved, rejected, completed, cancelled",
    }),
    remarks: z.string().optional(),
});
