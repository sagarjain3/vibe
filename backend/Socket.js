//npm i socket.io//backend me
//npm i socket.io-client//frontend me
import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://vibe-ndt7.onrender.com",
        methods: ["GET", "POST"]
    }
})

const useSocketMap = {}

// message send ke lye real time me receiver ko
export const getSocketId = (receiverId) => {
    return useSocketMap[receiverId]
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId// handshake frontend s handshake krega //
    if (userId != undefined) {
        useSocketMap[userId] = socket.id
    }

    // emit event frontend me jayega
    io.emit('getOnlineUsers', Object.keys(useSocketMap))

    // jab user logout kr de

    socket.on("disconnect", () => {
        delete useSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(useSocketMap))
    })
})





export { app, io, server }
