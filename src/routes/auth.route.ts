import { Router } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validation";
import { getMe, login, logout, signup, verifyOtp } from "../controllers/authController";
import { validate } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", getMe);
// authRouter.get("/refresh-token", refreshToken);
authRouter.get("/logout", logout);
authRouter.post("/verify-otp", verifyOtp);

export default authRouter;