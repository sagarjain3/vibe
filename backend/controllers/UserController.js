import uploadOncloudinary from "../config/Cloudinary.js"
import Notification from "../models/NotificationModel.js"
import User from "../models/UserModel.js"
import { getSocketId, io } from "../Socket.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password").populate("posts loops posts.author posts.comments saved saved.author story following")
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `get current user ${error}` })
    }
}

// suggestuser//


export const suggestedUsers = async (req, res) => {
    try {

        const users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password")

        return res.status(200).json(users)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `suggest user error ${error}` })

    }
}


// profile edit//

export const editProfile = async (req, res) => {
    try {
        const { name, userName, bio, profession, gender } = req.body

        const user = await User.findById(req.userId).select("-password")

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        const sameUserWithUsername = await User.findOne({ userName }).select("-password")

        if (sameUserWithUsername && sameUserWithUsername._id != req.userId) {
            return res.status(400).json({ msg: "User name already exist" })
        }

        let profileImage;

        if (req.file) {
            profileImage = await uploadOncloudinary(req.file.path)
        }
        user.name = name
        user.userName = userName
        if (profileImage) {
            user.profileImage = profileImage
        }
        user.bio = bio
        user.profession = profession
        user.gender = gender

        user.save()

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `editprofile error ${error}` })
    }
}

// user ko find krna userName se

export const getProfile = async (req, res) => {
    try {
        const userName = req.params.userName

        const user = await User.findOne({ userName }).select("-password").populate("posts loops following followers")

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `getProfile error ${error}` })
    }
}

// jo follow kr rha h vo h currentuser jisko follow krna h vo h target user

export const follow = async (req, res) => {
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.targetUserId

        if (!targetUserId) {
            return res.status(404).json({ msg: "target User not found" })
        }

        if (currentUserId == targetUserId) {
            return res.status(404).json({ msg: "you can not follow yourself" })
        }

        const currentUser = await User.findById(currentUserId)
        const targetUser = await User.findById(targetUserId)

        const isFollowing = currentUser.following.includes(targetUserId)

        //  unfollow k lye

        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId)
            targetUser.followers = currentUser.followers.filter(id => id.toString() != currentUserId)

            await currentUser.save()
            await targetUser.save()

            return res.status(200).json({
                following: false,
                msg: "unfollow succesfull"
            })
        } else {
            // follow k lye

            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId)

            if (currentUser._id != targetUser._id) {
                const notification = await Notification.create({
                    sender: currentUser._id,
                    receiver: targetUser._id,
                    type: "follow",

                    message: "started following you"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")

                const receiverSocketId = getSocketId(targetUser._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }

            await currentUser.save()
            await targetUser.save()

            return res.status(200).json({
                following: true,
                msg: "follow succesfull"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `follow error ${error}` })
    }
}

export const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
        return res.status(200).json(result?.following)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `following list error ${error}` })
    }
}

export const search = async (req, res) => {
    try {
        const keyword = req.query.keyword
        if (!keyword) {
            return res.status(400).json({ msg: "keyword is required" })
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: keyword, $options: "i" } },
                { name: { $regex: keyword, $options: "i" } }
            ]
        }).select("-password")

        return res.status(200).json(users)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `search  error ${error}` })
    }
}

// sb notification ko get krne k lye//

export const getAllNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({
            receiver: req.userId
        }).populate("sender receiver post loop").sort({ creadtedAt: -1 })
        return res.status(200).json(notification)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `getall notification  error ${error}` })
    }
}

// koi notification dekh liye ho toh is read ko true ke lye//

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body


        if (Array.isArray(notificationId)) {
            await Notification.updateMany(

                { _id: { $in: notificationId }, receiver: req.userId },
                { $set: { isRead: true } }
            )
        } else {
            //mark single notification as read
            await Notification.updateMany(

                { _id: notificationId, receiver: req.userId },
                { $set: { isRead: true } }
            )


        }
        return res.status(200).json({ msg: "marked as read" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `read notification  error ${error}` })
    }
}