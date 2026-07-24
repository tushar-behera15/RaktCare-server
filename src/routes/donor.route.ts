import { Router } from "express";
import { createDonorProfile, getAllDonors, getDonorById, updateDonorProfile } from "../controllers/donorController";
import { isAuthenticated, validate } from "../middlewares/authMiddleware";
import { donorProfileSchema } from "../validators/donor.validation";
import { appointmentSchema } from "../validators/appointment.validation";
import { createAppointment, getMyAppointments } from "../controllers/appointmentController";

const donorRouter = Router();
// Donor routes
donorRouter.post("/create-profile", validate(donorProfileSchema), createDonorProfile);
donorRouter.put("/update-profile", isAuthenticated, validate(donorProfileSchema), updateDonorProfile);
donorRouter.get("/:id", getDonorById);
donorRouter.get("/", getAllDonors);

// Appointment Routes
donorRouter.post("/appointment/create", isAuthenticated, validate(appointmentSchema), createAppointment);
donorRouter.get("/appointments", isAuthenticated, getMyAppointments);

export default donorRouter;