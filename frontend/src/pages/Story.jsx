import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../redux/StorySlice.js'
import StoryCard from '../component/StoryCard.jsx'
import { IoMdArrowRoundBack } from "react-icons/io";

function Story() {
    const { userName } = useParams()
    const dispatch = useDispatch()
    const { storyData } = useSelector(state => state.story)
    // console.log("Redux storyData:", storyData);

    const handleStory = async () => {
        // dispatch(setStoryData(null))
        try {
            const result = await axios.get(
                `${serverUrl}/api/story/getbyusername/${userName}`,
                { withCredentials: true }
            )

            // poora array bhejo
            console.log("API Story Response:", result.data);
            dispatch(setStoryData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userName) {
            handleStory()
        }
    }, [userName])

    return (
        <div className="w-full h-[100vh] bg-black flex justify-center items-center">
            {storyData.length > 0 ? (
                storyData.map((s, index) => (
                    <StoryCard story={s} key={index} />
                ))
            ) : (

                <p className="text-white">No stories found</p>
            )}
        </div>
    )
}

export default Story
