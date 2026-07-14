import { Router } from "express";
import { createDonorProfile, getAllDonors, getDonorById, updateDonorProfile } from "../controllers/donorController";
import { validate } from "../middlewares/authMiddleware";
import { donorProfileSchema } from "../validators/donor.validation";

const donorRouter = Router();

donorRouter.post("/create-profile", validate(donorProfileSchema), createDonorProfile);
donorRouter.put("/update/:id", validate(donorProfileSchema), updateDonorProfile);
donorRouter.get("/:id", getDonorById);
donorRouter.get("/", getAllDonors);

export default donorRouter;