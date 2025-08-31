import React from 'react'
import logo from '../assets/vibe.png'
import { CiHeart } from "react-icons/ci";
import StoryDp from './StoryDp';
import Nav from './Nav.jsx';
import { useSelector } from 'react-redux';
import Post from './Post.jsx';
import { LuMessageCircleMore } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

function Feed() {

    const { postData } = useSelector(state => state.post)
    const { userData, notificationData } = useSelector(state => state.user)
    const { storyList, currentUserStory } = useSelector(state => state.story)

    const navigate = useNavigate()

    return (
        <div className='lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto'>


            {/* logo */}
            <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>

                <img src={logo} alt="" className='w-[80px] rounded-full' />

                <div className='flex items-center gap-[10px]'>
                    <div className='relative'>
                        <CiHeart className='text-[white] w-[25px] h-[25px]' onClick={() => navigate("/notification")} />

                        {notificationData && notificationData.some((noti) => noti.isRead === false) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-1px]'></div>)}


                    </div>
                    <LuMessageCircleMore className='text-[white] w-[25px] h-[25px]' onClick={() => navigate("/messages")} />
                </div>

            </div>

            <div className='flex w-full overflow-auto gap-[10px] items-center p-[20px]'>
                <StoryDp userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory} />

                {storyList?.map((story, index) => (
                    <StoryDp userName={story.author?.userName} profileImage={story.author?.profileImage} story={story} key={index} />
                ))}

            </div>

            {/* post div */}

            <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>

                <Nav />


                {postData?.map((post, index) => (
                    <Post post={post} key={index} />
                ))}


            </div>
        </div>
    )
}

export default Feed
