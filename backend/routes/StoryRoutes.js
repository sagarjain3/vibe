import express from 'express'
import isAuth from '../middlewars/isAuth.js'

import upload from '../middlewars/Multer.js'
import { getAllStories, getStoryByUserName, uploadStory, viewStory } from '../controllers/StoryController.js'




const storyRouter = express.Router()

storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory)
storyRouter.get("/getbyusername/:userName", isAuth, getStoryByUserName)
storyRouter.get("/getall", isAuth, getAllStories)
storyRouter.get("/view/:storyId", isAuth, viewStory)




export default storyRouter