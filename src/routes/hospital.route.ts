import { Router } from "express";
import { createHospitalProfile, getAllHospitals, getHospitalById, updateHospitalProfile } from "../controllers/hospitalController";
import { isAuthenticated, validate } from "../middlewares/authMiddleware";
import { hospitalProfileSchema } from "../validators/hospital.validation";
import { recipientSchema } from "../validators/recipient.validation";
import { confirmDonation, createRecipient, deleteRecipientById, findMatchingDonors, getAllRecipient, getRecipientById, updateRecipientById } from "../controllers/recipientController";
import { bloodStockSchema } from "../validators/bloodStock.validation";
import { addBloodStock, getBloodStockByGroup, getHospitalBloodStock, updateBloodStock } from "../controllers/bloodStockController";
import { getAllAppointments, getAppointmentById, updateAppointmentStatus } from "../controllers/appointmentController";
import { updateAppointmentStatusSchema } from "../validators/appointment.validation";


const hospitalRouter = Router();
// Hospital routes
hospitalRouter.post("/create-profile", validate(hospitalProfileSchema), createHospitalProfile)

hospitalRouter.put("/update-profile/:id", validate(hospitalProfileSchema), updateHospitalProfile)
hospitalRouter.get("/:id", getHospitalById)


hospitalRouter.get("/", getAllHospitals)

// Recipient routes
hospitalRouter.post("/recipient/create", validate(recipientSchema), createRecipient
);

hospitalRouter.get("/recipient/all", getAllRecipient);

hospitalRouter.get("/recipient/:id", getRecipientById);

hospitalRouter.delete("/recipient/delete/:id", deleteRecipientById);

hospitalRouter.put("/recipient/update/:id", updateRecipientById);

hospitalRouter.get("/recipient/:id/find-donors", findMatchingDonors);
hospitalRouter.post("/recipient/confirm-donation", confirmDonation);

//Blood stock routes
hospitalRouter.post("/bloodstock/create", isAuthenticated, validate(bloodStockSchema), addBloodStock);
hospitalRouter.put("/bloodstock/update/:id", isAuthenticated, validate(bloodStockSchema), updateBloodStock);
hospitalRouter.get("/bloodstock/all", isAuthenticated, getHospitalBloodStock);
hospitalRouter.get("/bloodstock/group/:bloodGroup", getBloodStockByGroup);

// Appointement routes
hospitalRouter.get("/appointments/all", isAuthenticated, getAllAppointments);

hospitalRouter.get("/appointment/:id", getAppointmentById);
hospitalRouter.patch("/appointment/status/:id", validate(updateAppointmentStatusSchema), updateAppointmentStatus);


export default hospitalRouter;