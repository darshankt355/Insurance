import express from "express";
import { handelContact,handelGetContact,handelDeleteContact } from "../controllers/contant.js";



const route = express.Router();
route.post("/contactMessage",handelContact)
route.get("/getContact",handelGetContact)
route.delete("/deleteContact/:id",handelDeleteContact)
export default route;