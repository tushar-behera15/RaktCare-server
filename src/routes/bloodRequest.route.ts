import { Router } from "express";
import {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequestById,
    updateBloodRequest,
    updateBloodRequestStatus,
    deleteBloodRequest,
} from "../controllers/bloodRequestController";
import { isAuthenticated, validate } from "../middlewares/authMiddleware";
import {
    bloodRequestSchema,
    updateBloodRequestSchema,
    updateBloodRequestStatusSchema,
} from "../validators/bloodRequest.validation";

const bloodRequestRouter = Router();

bloodRequestRouter.post(
    "/create",
    isAuthenticated,
    validate(bloodRequestSchema),
    createBloodRequest
);

bloodRequestRouter.get("/", getAllBloodRequests);


bloodRequestRouter.get("/:id", getBloodRequestById);

bloodRequestRouter.put(
    "/update/:id",
    isAuthenticated,
    validate(updateBloodRequestSchema),
    updateBloodRequest
);

bloodRequestRouter.patch(
    "/status/:id",
    isAuthenticated,
    validate(updateBloodRequestStatusSchema),
    updateBloodRequestStatus
);

bloodRequestRouter.delete("/delete/:id", isAuthenticated, deleteBloodRequest);

export default bloodRequestRouter;
