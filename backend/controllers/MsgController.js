import uploadOncloudinary from "../config/Cloudinary.js";
import Conversation from "../models/CoversationModel.js";
import Message from "../models/MsgModel.js";
import { getSocketId, io } from "../Socket.js";

export const sendMsg = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.params.receiverId

        const { message } = req.body

        let image;

        if (req.file) {
            image = await uploadOncloudinary(req.file.path)
        }

        const newMsg = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message,
            image
        })

        let conversation = await Conversation.findOne({
            participate: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participate: [senderId, receiverId],
                messages: [newMsg._id]
            })
        } else {
            conversation.messages.push(newMsg._id)
            await conversation.save()

        }

        const receiverSocketId = getSocketId(receiverId)
        // console.log("Receiver socket id:", receiverSocketId)

        // sb ko msg krte toh emit ka use krte pr msg sirf ek particular user ko krna h toh to ka use krege

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMsg)
        }



        return res.status(200).json(newMsg)
    } catch (error) {

        console.log(error)
        return res.status(500).json({ msg: `send msg error ${error}` })

    }
}

// do user k bich msg ko get k lye//

export const getAllMessages = async (req, res) => {
    try {
        const senderId = req.userId
        const receiverId = req.params.receiverId

        const conversation = await Conversation.findOne({
            participate: { $all: [senderId, receiverId] }
        }).populate("messages")

        return res.status(200).json(conversation?.messages)

    } catch (error) {

        console.log(error)
        return res.status(500).json({ msg: `get all  msg error ${error}` })
    }
}

// phele hum kis se baat kr chuke h 

export const getPrevUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId

        const conversations = await Conversation.find({
            participate: currentUserId
        }).populate("participate").sort({ updatedAt: -1 })

        // wahi user chiaye jinse hum baat kr chuke h

        const userMap = {}

        conversations.forEach((conv) => {
            conv.participate.forEach((user) => {
                if (user._id != currentUserId) {
                    userMap[user._id] = user
                }
            })
        })
        // sb prevUser mil jayege jinse baat ki h
        const previousUsers = Object.values(userMap)

        return res.status(200).json(previousUsers)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `previous user  error ${error}` })
    }
}