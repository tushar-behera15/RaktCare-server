import z from "zod";

export const recipientSchema = z.object({
    patientName: z.string().min(3, "Patient name must be at least 3 characters long"),
    age: z.number().min(1, "Age must be at least 1 year old"),
    gender: z.enum(["male", "female", "other"]),
    contactNo: z.string().min(10, "Contact number must be at least 10 digits long"),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    unitNeeded: z.number().min(1, "Unit needed must be at least 1"),
    urgency: z.enum(["high", "medium", "low"]),
    diseases: z.array(z.string()).optional(),
});