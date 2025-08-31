import express from 'express'
import isAuth from '../middlewars/isAuth.js'

import upload from '../middlewars/Multer.js'
import { getAllMessages, getPrevUserChats, sendMsg } from '../controllers/MsgController.js'




const msgRouter = express.Router()

msgRouter.post("/send/:receiverId", isAuth, upload.single("image"), sendMsg)
msgRouter.get("/getall/:receiverId", isAuth, getAllMessages)
msgRouter.get("/prevchats", isAuth, getPrevUserChats)



export default msgRouter