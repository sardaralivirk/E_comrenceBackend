import mongoose from "mongoose";
 const orderSchema=new mongoose.Schema({
    
    quantity:{
        type:Number
    },
    purchaser:[String],
    productId:[{
        productId:String,
        quantity:Number
    }],
    saleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sale'
    },
    price:String
},{timestamps:true})
export const order=mongoose.model('order',orderSchema)