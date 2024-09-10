import { user } from "../models/singup.model.js"
import { Sale} from "../models/sale.model.js"
import { category } from "../models/catagory.model.js"
import { product } from "../models/product.model.js"
import { order } from "../models/order.model.js"
import { adCart } from "../models/addToCart.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import otp from "otp-generator"
import nodemailer from "nodemailer"
import Enum from "enum"
const secretKey="2155"
const saltRounds=10


const signUpUser=async (req,res) => {
    try {
        const {name,email,password,role}=req.body
    
    const hasdpassword=await bcrypt.hash(password,saltRounds)
    const token=jwt.sign(email,secretKey)
    console.log(hasdpassword)
    const createUser= await user.create({name:name,email:email,password:hasdpassword,role:role,token:token})
    return res.status(200).json({message:'user has been created :',createUser})
        
    } catch (error) {
        return res.status(500).json({message:'user already excits ',error})
    }
}
const logIn=async (req,res) => {
    try {
        const {email,password,newpassword,OTP}=req.body
        console.log({email,OTP});
        
        const find= await user.findOne({email})
    
        if(!find){
            return res.status(500).json({message:'user not found '})
        }
        if(password==find.password){
             return res.json({message:"you have login"})

        }

        const oTp=otp.generate()
        const matchUpDate=await user.findOneAndUpdate({email},{$set:{Otp:oTp}})
      if(OTP !==matchUpDate.Otp){
           return res.status(500).json({message:'your otp incorrect'})
      }
        const token=await jwt.sign(email,secretKey)
        const hash=await bcrypt.hash(newpassword,saltRounds)
        const changePwd=await user.findOneAndUpdate({email},{$set:{password:hash}})
        console.log(token)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure:false,
            auth: {
              user: "sardaralivirk@gmail.com",
              pass: "hqpqljmuhxtfpgmo",
            },
          });
          const info = await transporter.sendMail({
            from: '<sardaralivirk@gmail.com>', // sender address
            to: "alivirk4160@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?",
            html:`<h1>is this ${otp}email</h1>` // plain text body
          });
        res.json({message:'user found&& enterd newpassword for login&  send a maail :',find})

    } catch (error) {
        console.log('you have a errors many reason go and find:',error)
    }
}
const Sales=async (req,res) => {
    try {
    const {productId,percentage}=req.body
   const find=await product.findOne({_id:productId})
   const price=(find.price/percentage)*100
   console.log(price)
   const addPrice=await Sale.create({price:price})

    res.status(500).json({message:'you have a create a admin',addPrice})   
} catch (error) {
    console.log(error)
    res.status(200).json({message:'you have a error go find and solve',error})
}
    
}
const createCategory=async (req,res) => {
    try {
        const {adminId,name,discretion}=req.body
        const find=await user.findOne({_id:adminId,role:'Administrator'})
        if(!find){
            return res.status(500).json({message:'user not found'})
        }
        const createCategory=await category.create({discretion:discretion,name:name})
        res.status(500).json({message:'admin has been found',find,createCategory})
    } catch (error) {
        res.status(200).json({message:'go find error and solve it',error})
    }
    
}

const productCreate=async (req,res) => {
    try {
        const {adminId,name,description,OriginalPrice,Quantity,percentage}=req.body
        const discount_Price=(OriginalPrice*percentage)/100
        const discountPrice=OriginalPrice-discount_Price
    const find=await user.findOne({_id:adminId,role:'Administrator'})
    if(!find){
        return res.status(500).json({message:'administrator not find'})
    }
    const createproduct=await product.create({name:name,description:description,OriginalPrice:OriginalPrice,percentage:percentage,Quantity:Quantity,discountPrice:discountPrice})
    return res.status(500).json({message:'administrator  find',createproduct})  
    } catch (err) {
             console.log(err)
        res.status(500).json({message:"go and find error",err})
        
    }

    
}
const createOrder=async (req,res) => {
    try {
       const find= await adCart.find({isCheckedOut:false})
         let totalprice=0
           find.forEach(a => {
            if(a.discountPricePrice)
                {totalprice+=a.discountPrice}
        });
        let totalProductId= []
         find.forEach(b=>{if(b.productId){totalProductId.push({productId:b.productId,quantity:b.quantity})}})
            let userId=[]
        find.forEach(c=>{if(c.userId){userId.push(c.userId)} })
    const order1=await order.create({price:totalprice,productId:totalProductId,purchaser:userId})
  
     const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure:false,
        auth: {
          user: "sardaralivirk@gmail.com",
          pass: "hqpqljmuhxtfpgmo",
        },
      });
      const info = await transporter.sendMail({
        from: '<sardaralivirk@gmail.com>', // sender address
        to: "alivirk4160@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?",
        html:`<h1>  ${order1} </h1>`
      });
     const updateAdToCart= await adCart.findOneAndUpdate({isCheckedOut:false},{$set:{isCheckedOut:true}})
     console.log(updateAdToCart)
     return res.status(500).json({message:"you have successfully ordered",updateAdToCart})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"go and find error",error})
        
    }
}
const AdtoCart=async (req,res) => {
try {
    const {productId,quantity}=req.body
    const user=req.user
    const findproduct=await product.findOne({_id:productId})
    findproduct.Quantity -= quantity
    await findproduct.save()
 //const FInd=await product.findById(productId)
 console.log(findproduct.discountPrice)
const price = findproduct.discountPrice;
let Price=price*quantity 
console.log(Price)
const find = await adCart.findOneAndUpdate(
  { productId: productId, userId: user._id },  // Query
  { $inc: { quantity: quantity, price: Price}},  // Update
  { new: true, upsert: true }  // Options
);
console.log(find)
if (!find) {
  return res.status(200).json({
    message: 'Your product has been added to the cart',
    adInCart: find
  });
} 
const findAll= await adCart.find({isCheckedOut:false})
let totalprice=0
 findAll.forEach(a => {
    if(a.price){
        totalprice+=a.price
    }
});
console.log(totalprice)

return res.status(200).json({message:'your product has been added'})

} catch (error) {
    console.log(error)
    return res.status(500).json({message:'go and find error and solve use our mind if you have',error})
}
    
}
const deleteApi=async (req,res) => {
    try {
        
        const{userId,categoryId}=req.body
        const find=await user.findOne({_id:userId,role:'Administrator'})
        if(!find){
            return res.status(500).json({message:'plz enter a correct user'})

        }
        const findCatagory=await category.deleteOne({_id:categoryId})

        res .status(200).json({message:"user find"})
    }


     catch (error) {
        console.log(error)
        return res.status(200).json({message:'go find erroe',error})
    }
}
  const updateCategory=async (req,res) => {
    try {
        
        const{userId,categoryId}=req.body
        const find=await user.findOne({_id:userId,role:'Administrator'})
        if(!find){
            return res.status(500).json({message:'plz enter a correct user'})

        }
        const update_Category=await category.findOneAndUpdate({_id:categoryId})
        
        res .status(200).json({message:"user find"})
    }


     catch (error) {
        console.log(error)
        return res.status(200).json({message:'go find erroe',error})
    }
}
const productMinseInAdToCart=async (req,res) => {
    try {
        const {productId,quantity,isdelete}=req.body
        const find=await adCart.findOne({productId:productId})
        if(isdelete){
            console.log("jhjhgguy")
            const dlt=await adCart.deleteOne({productId:productId})
            return res.status(500).json({message:'you remove a quantity in your cart',dlt})
        }
    if(find&&find.quantity>0){
        find.quantity-=quantity
        await find.save()
        return res.status(500).json({message:'you remove a quantity in your cart',find})
    }


        
        return res.status(500).json({message:'this product not exist in your cart',find})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'go and find error',error})
    }
}
const deleteProductInAdToCard=async (req,res) => {
    try {
        const productId=req.body
        const find= await adCart.deleteOne({productId:productId})
        return res.status(200).json({message:'product has been delete',find})
    } catch (err) {
        console.log(err)
        return res.status(500).json({message:'go find and error'})
    }
    
}

export {signUpUser,logIn,Sales,createCategory,productCreate,createOrder,AdtoCart,deleteApi,updateCategory,productMinseInAdToCart,deleteProductInAdToCard}