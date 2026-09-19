import express from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otpController.js";

import { preventSpamOtp, validateEmail } from "../middlewares/otp.js";

const router = express.Router();

// 🔥 SEND OTP
router.post(
  "/send_otp",validateEmail,preventSpamOtp,sendOtpController  
);

// 🔥 VERIFY OTP
router.post("/verify_otp",validateEmail,verifyOtpController
);

export default router;