import mongoose from "mongoose";
 const productSchema=new mongoose.Schema({
    name:{
        type:String,

    },
    description:{
        type:String,
        
    },
    OriginalPrice:{
        type:Number,
        
    },
    Quantity:{
        type:Number,
        
    },
    discountPrice:{
        type:Number
    },
    percentage:{
        type:Number
    }
    ,
},{timestamps:true})
export const product= mongoose.model('product',productSchema)