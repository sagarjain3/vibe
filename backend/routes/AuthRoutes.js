import express from "express"
import { login, logOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/AuthController.js"
const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)
authRouter.get("/logout", logOut)


export default authRouter