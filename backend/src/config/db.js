import mongoose from "mongoose"
export async function  databaseConnect(){
    try{
       await mongoose.connect(process.env.MONGODB_URI);
        
    }catch(error){
        console.log({message: error.message})
    }
}