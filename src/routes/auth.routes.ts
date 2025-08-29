import express, {type Router, } from "express";
import { dashboard, forgetPassword, login, logout, register, resendForgetPasswordOtp, resendOTP, setNewPassword, verifyForgetPasswordOTP, verifyOtp } from "../controllers/auth.controller.js";
import { validateResponse } from "../middleware/authMiddleware.js";

const authRouter: Router = express.Router();
authRouter.post("/register",register);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/resend-otp",resendOTP);
authRouter.post("/login",login);
authRouter.post("/forget-password",forgetPassword);
authRouter.post("/verify-forget-password-otp",verifyForgetPasswordOTP);
authRouter.post("/resend-forget-password-otp",resendForgetPasswordOtp);
authRouter.post("/new-password",setNewPassword);
authRouter.get("/dashboard",dashboard);
authRouter.post("/logout",validateResponse,logout);

export default authRouter;


