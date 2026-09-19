import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: {
    type: Date,
    index: { expires: '0s' }
  },
});

export default mongoose.model("OTP", otpSchema);