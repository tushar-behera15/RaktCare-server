import { Router } from "express";
import { createHospitalProfile, getAllHospitals, getHospitalById, updateHospitalProfile } from "../controllers/hospitalController";
import { validate, isAuthenticated } from "../middlewares/authMiddleware";
import { hospitalProfileSchema } from "../validators/hospital.validation";
import { recipientSchema } from "../validators/recipient.validation";
import { confirmDonation, createRecipient, deleteRecipientById, findMatchingDonors, getAllRecipient, getRecipientById, updateRecipientById } from "../controllers/recipientController";
import { bloodStockSchema } from "../validators/bloodStock.validation";
import { addBloodStock, getBloodStockByGroup, getHospitalBloodStock, updateBloodStock } from "../controllers/bloodStockController";


const hospitalRouter = Router();
// Hospital routes
hospitalRouter.post("/create-profile", isAuthenticated, validate(hospitalProfileSchema), createHospitalProfile)

hospitalRouter.put("/update-profile/:id", validate(hospitalProfileSchema), updateHospitalProfile)

hospitalRouter.get("/:id", getHospitalById)

hospitalRouter.get("/", getAllHospitals)

// Recipient routes
hospitalRouter.post("/recipient/create", isAuthenticated, validate(recipientSchema), createRecipient
);

hospitalRouter.get("/recipient/all", getAllRecipient);

hospitalRouter.get("/recipient/:id", getRecipientById);

hospitalRouter.delete("/recipient/delete/:id", deleteRecipientById);

hospitalRouter.put("/recipient/update/:id", updateRecipientById);

hospitalRouter.get("/recipient/:id/find-donors", findMatchingDonors);
hospitalRouter.post("/recipient/confirm-donation", confirmDonation);

//Blood stock routes
hospitalRouter.post("/bloodstock/create/:id", validate(bloodStockSchema), addBloodStock);
hospitalRouter.put("/bloodstock/update/:id", validate(bloodStockSchema), updateBloodStock);
hospitalRouter.get("/bloodstock/:id", getHospitalBloodStock);
hospitalRouter.get("/bloodstock/group/:bloodGroup", getBloodStockByGroup);

export default hospitalRouter;