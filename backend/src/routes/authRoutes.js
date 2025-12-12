import { signUp } from "../controllers/auth.js"
import {login} from "../controllers/auth.js"
import {logout} from "../controllers/auth.js"
import { Router } from "express"
const authRouter = Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
export default authRouter