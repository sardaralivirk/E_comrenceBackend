import mongoose from "mongoose";

const salesSchema=new mongoose.Schema({
  
quantity:{
    type:Number
},
purchaser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product'
},
percentage:{
    type:Number
},
price:{
    type:Number
}
    
},{timestamps:true})
export const Sale=mongoose.model('sale',salesSchema)