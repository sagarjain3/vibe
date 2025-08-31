import sendMail from "../config/Mail.js";
import getToken from "../config/Token.js";
import User from "../models/UserModel.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { name, email, password, userName } = req.body
        const findByEmail = await User.findOne({ email });

        if (findByEmail) {
            return res.status(400).json({ msg: "Email already exist" })
        }

        const findByUserName = await User.findOne({ userName });
        if (findByUserName) {
            return res.status(400).json({ msg: "User name already exist" })
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "password must be at least 6 characters long" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            userName,
            email,
            password: hashedPassword

        })

        const token = getToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false
        })

        return res.status(201).json(user)
    } catch (error) {
        console.log("signup error")
        return res.status(500).json({ msg: `sign up error ${error}` })
    }
}


export const login = async (req, res) => {
    try {
        const { password, userName } = req.body


        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ msg: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: "Password is incorrect" })
        }


        const token = getToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log("login error")
        return res.status(500).json({ msg: `login error ${error}` })
    }
}


export const logOut = async (req, res) => {
    try {
        // Clear cookie with matching options
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        })
        return res.status(200).json({ msg: "logOut successful" })

    } catch (error) {
        console.log("logout error")
        return res.status(500).json({ msg: `logout error ${error}` })
    }
}

//send otp//

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ msg: "User not found" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false

        await user.save()

        await sendMail(email, otp)

        return res.status(200).json({ msg: "email successfully send" })

    } catch (error) {
        console.log("send otp error")
        return res.status(500).json({ msg: `send otp error ${error}` })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expire otp" })
        }

        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined

        await user.save()

        return res.status(200).json({ msg: "otp verified" })
    } catch (error) {
        console.log("otp verified error")
        return res.status(500).json({ msg: `otp verified error ${error}` })
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ msg: "otp verification required" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        user.isOtpVerified = false

        await user.save()

        return res.status(200).json({ msg: "password reset successfully" })

    } catch (error) {
        console.log("reset password error")
        return res.status(500).json({ msg: `reset password  error ${error}` })
    }
}
