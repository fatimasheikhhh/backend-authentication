import { Router } from "express";
import {
  forgetPassword,
  login,
  register,
  resendForgetPasswordOtp,
  resendOTP,
  setNewPassword,
  verifyForgetPasswordOTP,
  verifyOtp,
} from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendForgetPasswordOtpSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyForgotPasswordSchema,
  verifyOtpSchema,
} from "../utils/validation.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
authRouter.post("/resend-otp", validate(resendOtpSchema), resendOTP);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post(
  "/forget-password",
  validate(forgotPasswordSchema),
  forgetPassword
);
authRouter.post(
  "/verify-forget-password-otp",
  validate(verifyForgotPasswordSchema),
  verifyForgetPasswordOTP
);
authRouter.post(
  "/resend-forget-password-otp",
  validate(resendForgetPasswordOtpSchema),
  resendForgetPasswordOtp
);
authRouter.post("/new-password", validate(resetPasswordSchema), setNewPassword);

export default authRouter;
