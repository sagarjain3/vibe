import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/Db.js'
dotenv.config()
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from './routes/AuthRoutes.js'
import userRouter from './routes/UserRoutes.js'
import postRouter from './routes/PostRoutes.js'
import loopRouter from './routes/LoopRoutes.js'
import storyRouter from './routes/StoryRoutes.js'
import msgRouter from './routes/MsgRoutes.js'
import { app, server } from './Socket.js'


// const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "https://vibe-ndt7.onrender.com",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/loop", loopRouter)
app.use("/api/story", storyRouter)
app.use("/api/message", msgRouter)


server.listen(port, () => {
    connectDb()
    console.log(`server is running on port ${port}`)
})
