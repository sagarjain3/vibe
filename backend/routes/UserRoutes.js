import express from 'express'
import isAuth from '../middlewars/isAuth.js'
import { editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from '../controllers/UserController.js'
import upload from '../middlewars/Multer.js'


const userRouter = express.Router()

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.get("/suggested", isAuth, suggestedUsers)
userRouter.get("/getprofile/:userName", isAuth, getProfile)
userRouter.get("/follow/:targetUserId", isAuth, follow)
userRouter.get("/followinglist", isAuth, followingList)
userRouter.get("/getallnotification", isAuth, getAllNotifications)
userRouter.post("/markasread", isAuth, markAsRead)
userRouter.get("/search", isAuth, search)
userRouter.post("/editprofile", isAuth, upload.single("profileImage"), editProfile)


export default userRouter