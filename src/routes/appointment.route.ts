import { Router } from "express";
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
} from "../controllers/appointmentController";
import { isAuthenticated, validate } from "../middlewares/authMiddleware";
import {
    appointmentSchema,
    updateAppointmentSchema,
    updateAppointmentStatusSchema,
} from "../validators/appointment.validation";

const appointmentRouter = Router();

appointmentRouter.post(
    "/create",
    isAuthenticated,
    validate(appointmentSchema),
    createAppointment
);

appointmentRouter.get("/", isAuthenticated, getAllAppointments);

appointmentRouter.get("/:id", isAuthenticated, getAppointmentById);

appointmentRouter.put(
    "/update/:id",
    isAuthenticated,
    validate(updateAppointmentSchema),
    updateAppointment
);

appointmentRouter.patch(
    "/status/:id",
    isAuthenticated,
    validate(updateAppointmentStatusSchema),
    updateAppointmentStatus
);

appointmentRouter.delete("/delete/:id", isAuthenticated, deleteAppointment);

export default appointmentRouter;
