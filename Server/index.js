import express from "express";
import connectDB from "./connectDB.js";
import userRoute from "./routers/users.js";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import categoryRoute from "./routers/category.js";
import insuranceRoute from "./routers/insurance.js";
import analyticsRoute from "./routers/analytics.js";
import contactRoute from "./routers/contact.js";
import otpRoute from "./routers/otp.js";



const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/insurance", insuranceRoute);
app.use("/contact", contactRoute);
app.use("/otp", otpRoute);

app.use("/analytics", analyticsRoute);
app.use("/uploads", express.static("uploads"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(8282, () => {
  console.log("Server is running on port http://localhost:8282");
});