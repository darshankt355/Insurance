
import OTP from "../modules/otp.js";

const preventSpamOtp = async (req, res, next) => {
  const { email } = req.body;

  const lastOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (lastOtp) {
    const diff = Date.now() - new Date(lastOtp.createdAt).getTime();

    if (diff < 60000) {
      return res.status(429).json({
        message: "Wait 60 seconds before requesting another OTP",
      });
    }
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  next(); 
};

export { preventSpamOtp, validateEmail }
