import jwt from "jsonwebtoken";
import JWT_SECRET  from "../config.js"; 

const verifyAuth=async(req,res,next)=>{
    const token = req.header("Auth");
    console.log(token);
    if (token){
        const verify = jwt.verify(token, JWT_SECRET);
        console.log(verify)
        if(verify){
            req.userId = verify;
            console.log(`verified`,verify)
            next();
        }else{
            return res.status(400).json({
                message: "unauthorised token"
            });
        }
    }else{
            return res.status(400).json({
                message: "unauthorised token"
            });
        }
}
const  roleBasedAuth=(role=[])=>{
    return (req,res,next)=>{
        if(role.includes(req.userId.role)){
            next();
        }else{
            return res.status(403).json({
                message: "unauthorised role"
            });
        }
    }
} 


const verifyRefershToken=async(req,res,next)=>{
    const cookie= req.cookies;
    if(cookie.refresh){
        const verify = jwt.verify(cookie.refresh,JWT_SECRET)
        if(verify){
            req.user=verify
            console.log(`verified`,verify)
            next()
        }else{
            return res.status(403).json({message:"unauthorised"})
        }
    }else{
        return res.status(403).json({message:"Refresh token is missing"})
    }
}

export {verifyAuth,roleBasedAuth,verifyRefershToken};
