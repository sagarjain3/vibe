import uploadOncloudinary from "../config/Cloudinary.js";
import Notification from "../models/NotificationModel.js";
import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import { getSocketId, io } from "../Socket.js";

export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body

        let media;

        if (req.file) {
            media = await uploadOncloudinary(req.file.path)
        } else {
            return res.status(400).json({ msg: "media is required" })
        }

        const post = await Post.create({
            caption, media, mediaType, author: req.userId
        })

        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()

        const populatePost = await Post.findById(post._id).populate("author", "name userName profileImage")

        return res.status(201).json(populatePost)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `upload post error ${error}` })
    }
}


// sabhi  ki post get k lye
// sort k use se jo post nyi aai h vo uper dikhegi

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find({}).populate("author", "name userName profileImage").populate("comments.author", "name userName profileImage").sort({ createdAt: -1 })
        return res.status(201).json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `getAll post error ${error}` })
    }
}


export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(400).json({ msg: "post not found" })
        }
        // some true ya false deta h
        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())

        if (alreadyLiked) {
            post.likes = post.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            post.likes.push(req.userId)
            if (post.author._id != req.userId) {
                const notification = await Notification.create({
                    sender: req.userId,
                    receiver: post.author._id,
                    type: "like",
                    post: post._id,
                    message: "liked your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")

                const receiverSocketId = getSocketId(post.author._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }



        await post.save()
        await post.populate("author", "name userName profileImage")

        io.emit("likedPost", {
            postId: post._id,
            likes: post.likes
        })

        return res.status(201).json(post)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `like error ${error}` })
    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body

        const postId = req.params.postId

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ msg: "post not found" })
        }

        post.comments.push({
            author: req.userId,
            message
        })

        if (post.author._id != req.userId) {
            const notification = await Notification.create({
                sender: req.userId,
                receiver: post.author._id,
                type: "comment",
                post: post._id,
                message: "commented on your post"
            })
            const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")

            const receiverSocketId = getSocketId(post.author._id)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotification)
            }
        }

        await post.save()

        await post.populate("author", "name userName profileImage")
        await post.populate("comments.author")


        io.emit("commentedPost", {
            postId: post._id,
            comments: post.comments
        })

        return res.status(201).json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `comments error ${error}` })
    }
}

export const savedPost = async (req, res) => {
    try {
        const postId = req.params.postId

        const user = await User.findById(req.userId)


        // some true ya false deta h
        const alreadySaved = user.saved.some(id => id.toString() == postId.toString())

        if (alreadySaved) {
            user.saved = user.saved.filter(id => id.toString() != postId.toString())
        } else {
            user.saved.push(postId)
        }

        await user.save()
        await user.populate("saved")
        return res.status(201).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `savedPost  error ${error}` })
    }
}