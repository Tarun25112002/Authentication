import { signUp } from "../controllers/auth.js"
import { Router } from "express"
const authRouter = Router()

authRouter.post("/signup", signUp)

export default authRouter