import express from "express"


const router=express()
import { userVerify } from "../midleware/middleware.js"
import {signUpUser,logIn,Sales,createCategory,productCreate,deleteProductInAdToCard,createOrder,AdtoCart,deleteApi,productMinseInAdToCart, updateCategory} from "../controller/controller.js"

router.post('/signUpUser',signUpUser)
router.post('/logIn',logIn)
router.post('/sales',Sales)
router.post('/createCategory',createCategory)
router.post('/productCreate',productCreate)
router.post('/createOrder',userVerify,createOrder)
router.post('/AdToCart',userVerify,AdtoCart)
router.delete('/delete',deleteApi)
router.put('/updatecatagory',updateCategory)
router.post('/productMinseInAdToCart',productMinseInAdToCart)
router.put('/deleteProductInAdToCard',deleteProductInAdToCard)



export {router}