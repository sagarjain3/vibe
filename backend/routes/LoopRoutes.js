import express from 'express'
import isAuth from '../middlewars/isAuth.js'

import upload from '../middlewars/Multer.js'
import { comment, getAllLoops, like, uploadLoop } from '../controllers/LoopController.js'



const loopRouter = express.Router()

loopRouter.post("/upload", isAuth, upload.single("media"), uploadLoop)
loopRouter.get("/getall", isAuth, getAllLoops)
loopRouter.get("/like/:loopId", isAuth, like)

loopRouter.post("/comment/:loopId", isAuth, comment)


export default loopRouter