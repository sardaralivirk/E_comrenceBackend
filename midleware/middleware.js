import jwt from "jsonwebtoken";
import { user } from "../models/singup.model.js";


export const userVerify=async (req,res,next) => {
  try {
    const token = req.headers.token;
    const decoded =await jwt.verify(token,'2155')
    const find=await user.findOne({email:decoded})
    if(!find){
      res.status(500).json({message:'user not found'})
    }
    req.user = find
    
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'go and find error',error})
  }
}