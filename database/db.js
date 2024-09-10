import mongoose from "mongoose";
export const db=async (req,res) => {
    try {
        const db1=await mongoose.connect(`${process.env.db_url}/${process.env.db_name}`)
        
        console.log(`your db is connect on :${db1.connection.host}`)
        
    } catch (error) {
        console.log('your db not connect',error)
    }
}



