import React, { useEffect, useState } from 'react'
import dp from '../assets/dp1.png'
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

function StoryDp({ profileImage, userName, story }) {
    const hasStory = Array.isArray(story) && story.length > 0;

    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { storyData, storyList } = useSelector(state => state.story)

    const [viewed, setViewed] = useState(false)


    useEffect(() => {

        if (story?.viewers?.some((viewer) => viewer._id == userData._id)) {
            setViewed(true)
        } else {
            setViewed(false)
        }

    }, [story, userData, storyData, storyList])

    // viewers ko fetch//

    const handleViewers = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`, { withCredentials: true })
        } catch (error) {
            console.log(error)

        }
    }



    const handleClick = () => {
        if (!hasStory && userName == "Your Story") {
            navigate("/upload")
            //  humari story k lye
        } else if (hasStory && userName == "Your Story") {
            handleViewers()
            navigate(`/story/${userData.userName}`)
        } else {
            handleViewers()
            navigate(`/story/${userName}`)
        }

    }

    return (
        <div className='flex flex-col w-[80px]'>
            <div
                className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative
                ${hasStory ? "bg-gradient-to-b from-blue-500 to-blue-950" : ""} `}
            >
                <div onClick={handleClick}
                    className={`w-[70px] h-[70px] rounded-full cursor-pointer overflow-hidden 
                    ${hasStory ? "border-2 border-black" : ""}`}
                >
                    <img
                        src={profileImage || dp}
                        alt=""
                        className='w-full h-full object-cover'
                    />

                    {!hasStory && userName == "Your Story" && <div>
                        <CiCirclePlus className='text-black absolute bottom-[8px] bg-white right-[10px] rounded-b-full w-[22px] h-[22px]' />

                    </div>}

                </div>
            </div>

            {/* Username */}
            <div className='text-[14px] text-center truncate w-full text-white'>
                {userName}
            </div>
        </div>
    )
}

export default StoryDp
