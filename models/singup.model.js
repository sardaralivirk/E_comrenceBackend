import mongoose, { Schema } from "mongoose";
import { type } from "os";

const UserSchema=new mongoose.Schema({

    email:{
        type:String,
       unique:true,
       required:true
    },
    password:{
        type:String,
       required:true
    },
    name:{
        type:String,
       unique:true,
       required:true
    },
    Otp:{
        type:String
    },
    role:{
        type:String,
        enum:['Administrator','user'],
        default:'user'
    },
    token:String
   ,
   orderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'order'
   }
},{timestamps:true})
export const user=mongoose.model('user',UserSchema)