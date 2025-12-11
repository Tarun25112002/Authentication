import User from "../models/user.model.js"
import bcrypt from "bcrypt"
export const signUp = async (req, res) => {
    try {
        const {firstName, lastName, userName, email, password} = req.body
        if(!firstName || !lastName || !userName || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({firstName, lastName, userName, email, password: hashedPassword})
        return res.json({user:{
            firstName,
            lastName,
            userName,
            email
        }})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}