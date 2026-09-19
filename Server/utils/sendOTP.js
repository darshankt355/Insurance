import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "retailhub266@gmail.com",        
    pass: "eatqqpvfrepohwif",                
  },
});

const sendOTP = async (email, otp) => {
  try {
    console.log("📧 Sending OTP to:", email);
    console.log("OTP:", otp)
    const info = await transporter.sendMail({
      from: `"eatqqpvfrepohwif" <retailhub266@gmail.com>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2>Your OTP Code</h2>
          <h1 style="color: blue;">${otp}</h1>
          <p>This OTP is valid for 2:30 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error; 
  }
};

export default sendOTP;