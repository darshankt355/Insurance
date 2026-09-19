import express from "express";
import { verifyAuth, roleBasedAuth } from "../middlewares/authMiddleware.js";
import { handleGetTotalConsumers, handleGetTotalEmployees, handleGetTotalInsurances } from "../controllers/analyticsController.js";
const route =express.Router();
route.get('/total_consumers', handleGetTotalConsumers);
route.get('/total_employees',handleGetTotalEmployees);
route.get('/total_insurances', handleGetTotalInsurances);

export default route;
