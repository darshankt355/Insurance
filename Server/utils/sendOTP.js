import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // link:  https://myaccount.google.com/apppasswords 
    // create your gmail id pass by using above the link, This password and your gmail ID login password both different. This password is automatically generated
    user: "email@gmail.com",        
    pass: "12346789",                
  },
});

const sendOTP = async (email, otp) => {
  try {
    console.log("📧 Sending OTP to:", email);
    console.log("OTP:", otp)
    const info = await transporter.sendMail({
      from: `"12346789" <email@gmail.com>`,
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
