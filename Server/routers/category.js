
    import { upload } from "../middlewares/upload.js";
    import { addCategory, getCategories, updateCategory, deleteCategory, getCategory } from "../controllers/catagoriesController.js";
    import express from "express";
    import { roleBasedAuth, verifyAuth } from "../middlewares/authMiddleware.js";
    const route = express.Router();
    route.post("/add",verifyAuth,roleBasedAuth(["admin","employee"]),upload.single("icon"), addCategory);
    route.get("/getCategories", getCategories);
    route.put("/update/:productId", updateCategory);
    route.delete("/delete/:productId", deleteCategory);
    route.get("/getCategory/:productId", getCategory);

    export default route;