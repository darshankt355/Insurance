import express from "express";
import {handleRegister,handleLogin,handelRefershToken,handelForgetPassword,handleGetUsers,getUserById,handleUserProfile} from "../controllers/userController.js";
import {verifyAuth,roleBasedAuth} from "../middlewares/authMiddleware.js";
import User from "../modules/users.js";
 
const route =express.Router();
route.post("/register",handleRegister);
route.post("/login",handleLogin);
route.get('/userSecret',verifyAuth,(req,res)=>{
    res.json({
        "Hello World":req.userId
    });
})
route.get('/admin',verifyAuth,roleBasedAuth(["admin"]),(req,res)=>{
    res.json({
        "Hello World":req.userId.role
    });
})
route.get('/employee',verifyAuth,roleBasedAuth(["employee"]),(req,res)=>{
    res.json({
        "Hello World":req.userId.role
    });
})
route.get('/consumer',verifyAuth,roleBasedAuth(["consumer"]),(req,res)=>{
    res.json({
        "Hello World":req.userId.role
    });
})

route.put('/forgetPassword',handelForgetPassword);
route.get("/profile", verifyAuth, async (req, res) => {
  const user = await User.findById(req.userId.userId);

  res.json(user);
  
});


route.post('/usersList',handleGetUsers)
route.get("/:userId", getUserById);




export default route;