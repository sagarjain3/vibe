import mongoose from 'mongoose'

const msgSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    message: {
        type: String
    },
    image: {
        type: String
    }


}, { timestamps: true })

const Message = mongoose.model("Message", msgSchema)
export default Message