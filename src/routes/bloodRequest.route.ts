import { Router } from "express";
import {
    createBloodRequest,
    getAllBloodRequests,
    getBloodRequestById,
    updateBloodRequest,
    updateBloodRequestStatus,
    deleteBloodRequest,
} from "../controllers/bloodRequestController";
import { validate } from "../middlewares/authMiddleware";
import {
    bloodRequestSchema,
    updateBloodRequestSchema,
    updateBloodRequestStatusSchema,
} from "../validators/bloodRequest.validation";

const bloodRequestRouter = Router();

bloodRequestRouter.post(
    "/create",
    validate(bloodRequestSchema),
    createBloodRequest
);

bloodRequestRouter.get("/", getAllBloodRequests);


bloodRequestRouter.get("/:id", getBloodRequestById);

bloodRequestRouter.put(
    "/update/:id",
    validate(updateBloodRequestSchema),
    updateBloodRequest
);

bloodRequestRouter.patch(
    "/status/:id",
    validate(updateBloodRequestStatusSchema),
    updateBloodRequestStatus
);

bloodRequestRouter.delete("/delete/:id", deleteBloodRequest);

export default bloodRequestRouter;
