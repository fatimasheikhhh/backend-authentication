import express, {type Router, } from "express";
import { dashboard, login, logout, register, resendOTP, verifyOtp } from "../controllers/auth.controller.js";
import { validateResponse } from "../middleware/authMiddleware.js";

const authRouter: Router = express.Router();
authRouter.post("/register",register);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/resend-otp",resendOTP);
authRouter.post("/login",login);
authRouter.get("/dashboard",dashboard);
authRouter.post("/logout",validateResponse,logout);

export default authRouter;


