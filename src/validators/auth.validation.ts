import { z } from "zod";

export const signupSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters long.")
        .max(50, "Full name cannot exceed 50 characters."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email address."),


    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(30, "Password cannot exceed 30 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(
            /[@$!%*?&]/,
            "Password must contain at least one special character (@$!%*?&)."
        ),

    role: z.enum(["admin", "donor", "hospital", "recipient"], {
        error: "Role must be one of: admin, donor, hospital, or recipient.",
    }),


    dateOfBirth: z.coerce.date({
        error: "Please enter a valid date of birth.",

    }).nullable().optional(),

    bloodGroup: z.enum(
        ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        {
            error: "Please select a valid blood group.",
        }
    ).nullable().optional(),


    gender: z.enum(["male", "female", "other"], {
        error: "Please select a valid gender.",
    }).nullable().optional(),
    address: z
        .string()
        .trim()
        .max(200, "Address cannot exceed 200 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .max(50, "City name cannot exceed 50 characters.")
        .optional(),

    state: z
        .string()
        .trim()
        .max(50, "State name cannot exceed 50 characters.")
        .optional(),

    pincode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Pincode must be exactly 6 digits.")
        .optional(),
})
export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .max(30, "Password cannot exceed 30 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(
            /[@$!%*?&]/,
            "Password must contain at least one special character (@$!%*?&)."
        )
})