// single story hi upload kr skte h 

import uploadOncloudinary from "../config/Cloudinary.js"
import Story from "../models/StoryModel.js"
import User from "../models/UserModel.js"

export const uploadStory = async (req, res) => {
    try {

        const user = await User.findById(req.userId)

        if (user.story) {
            await Story.findByIdAndDelete(user.story)
            user.story = null
        }

        const { mediaType } = req.body

        let media;

        if (req.file) {
            media = await uploadOncloudinary(req.file.path)
        } else {
            return res.status(400).json({ msg: "media is required" })
        }

        const story = await Story.create({
            author: req.userId, mediaType, media
        })

        user.story = story._id
        await user.save()

        const populateStory = await Story.findById(story._id).populate("author", "name userName profileImage").populate("viewers", "name userName profileImage")


        return res.status(201).json(populateStory)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `upload story error ${error}` })
    }
}


export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId

        const story = await Story.findById(storyId)

        if (!story) {
            return res.status(404).json({ msg: "story not found" })
        }

        const viewersIds = story.viewers.map(id => id.toString())// ek baar story dekhne pr ek hi baar show ho baar baar nhi//

        if (!viewersIds.includes(req.userId.toString())) {
            story.viewers.push(req.userId)
            await story.save()
        }

        const populateStory = await Story.findById(story._id).populate("author", "name userName profileImage").populate("viewers", "name userName profileImage")

        return res.status(201).json(populateStory)
    } catch (error) {

        console.log(error)
        return res.status(500).json({ msg: `view story error ${error}` })

    }
}


// click krke story dekhne k lye apni wali ///

export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName

        const user = await User.findOne({ userName })

        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        }

        const story = await Story.find({
            author: user._id
        }).populate("viewers author")

        return res.status(201).json(story)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `get story error ${error}` })
    }
}

// sare following walo ki story k dekhne k lye//

export const getAllStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
        const followingIds = currentUser.following

        const stories = await Story.find({
            author: { $in: followingIds }
        }).populate("viewers author").sort({ createdAt: -1 })

        return res.status(201).json(stories)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: `get all story error ${error}` })
    }
}