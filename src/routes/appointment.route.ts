import { Router } from "express";
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
} from "../controllers/appointmentController";
import { validate } from "../middlewares/authMiddleware";
import {
    appointmentSchema,
    updateAppointmentSchema,
    updateAppointmentStatusSchema,
} from "../validators/appointment.validation";

const appointmentRouter = Router();

appointmentRouter.post(
    "/create",
    validate(appointmentSchema),
    createAppointment
);

appointmentRouter.get("/", getAllAppointments);

appointmentRouter.get("/:id", getAppointmentById);

appointmentRouter.put(
    "/update/:id",
    validate(updateAppointmentSchema),
    updateAppointment
);

appointmentRouter.patch(
    "/status/:id",
    validate(updateAppointmentStatusSchema),
    updateAppointmentStatus
);

appointmentRouter.delete("/delete/:id", deleteAppointment);

export default appointmentRouter;
