import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
     },
     discretion:{
        type:String,
     },
      adminId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"admin"
      }
},{timestamps:true})


export const category=mongoose.model('category',categorySchema)
