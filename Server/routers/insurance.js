import express, { application } from "express";
import {verifyAuth,roleBasedAuth} from "../middlewares/authMiddleware.js";
import {handleAdddInsurance,getInsuranceByCategory,getproductById,handleUpdateInsurance,handleDeleteInsurance} from "../controllers/insuranceController.js";

const route = express.Router(); 

route.post("/addInsurance",handleAdddInsurance,(req,res)=>{
    res.json({
        "Hello World":req.userId.role
    });
})
route.get('/category/:id',getInsuranceByCategory)
route.get('/getInsurance/:planId',getproductById)
route.put('/update/:planId',handleUpdateInsurance)
route.delete('/delete/:planId',handleDeleteInsurance)
export default route;