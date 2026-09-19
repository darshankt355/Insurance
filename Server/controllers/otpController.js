import  OTP  from "../modules/otp.js";
import Users from "../modules/users.js";
import  sendOTP from "../utils/sendOTP.js";

// 🔥 SEND OTP
const sendOtpController = async (req, res) => {
  const { email } = req.body;
  const {otpType}=req.body;
  console.log(otpType);
  if(otpType==="signup"){
    const user = await Users.findOne({ email });
    if(user){
      return res.status(400).json({ message: "Email already exists" });
    }

  }
  if(otpType==="forget"){
    const user = await Users.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "Email does not exists" });
    }
  }


  const otp = Math.floor(100000 + Math.random() * 900000);

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + (2 * 60 * 1000) + (30 * 1000)),
  });

  await sendOTP(email, otp);

  res.json({ message: "OTP sent successfully to your mail" });
};

 const verifyOtpController = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  await OTP.deleteMany({ email });

  res.json({ message: "OTP verified successfully" });
};

export { sendOtpController, verifyOtpController }
