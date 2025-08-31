import express from 'express'
import isAuth from '../middlewars/isAuth.js'

import upload from '../middlewars/Multer.js'
import { comment, getAllPosts, like, savedPost, uploadPost } from '../controllers/PostController.js'


const postRouter = express.Router()

postRouter.post("/upload", isAuth, upload.single("media"), uploadPost)
postRouter.get("/getall", isAuth, getAllPosts)
postRouter.get("/like/:postId", isAuth, like)
postRouter.get("/saved/:postId", isAuth, savedPost)
postRouter.post("/comment/:postId", isAuth, comment)


export default postRouter