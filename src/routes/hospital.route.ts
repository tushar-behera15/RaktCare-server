import { Router } from "express";
import { createHospitalProfile, getAllHospitals, getHospitalById, updateHospitalProfile } from "../controllers/hospitalController";
import { validate, isAuthenticated } from "../middlewares/authMiddleware";
import { hospitalProfileSchema } from "../validators/hospital.validation";


const hospitalRouter = Router();

hospitalRouter.post("/create-profile", isAuthenticated, validate(hospitalProfileSchema), createHospitalProfile)

hospitalRouter.put("/update-profile/:id", validate(hospitalProfileSchema), updateHospitalProfile)

hospitalRouter.get("/:id", getHospitalById)

hospitalRouter.get("/", getAllHospitals)



export default hospitalRouter;