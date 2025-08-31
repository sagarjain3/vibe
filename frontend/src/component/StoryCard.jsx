import React, { useEffect, useState } from 'react'
import dp from '../assets/dp1.png'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { useSelector } from 'react-redux';
import { FaEye } from "react-icons/fa";


function StoryCard({ story }) {




    const navigate = useNavigate()
    const [progress, setProgress] = useState(0)
    const [showViewers, setShowViewers] = useState(false)

    const { userData } = useSelector(state => state.user)

    console.log(story)

    useEffect(() => {

        const intervel = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(intervel)
                    navigate("/")
                    return 100
                }

                return prev + 1
            })
        }, 150)

        return () => clearInterval(intervel)

    }, [navigate])

    return (
        <div className=' w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center '>

            <div className='flex items-center gap-[10px] absolute top-[30px] px-[10px]'>

                <IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px]' onClick={() => navigate(`/`)} />

                <div className='w-[30px] h-[30px]  md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>

                    <img src={story.author?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>

                <div className='w-[120px] text-white font-semibold truncate'>{story.author?.userName}</div>
            </div>

            {/* progress bar */}
            <div className='absolute top-[10px] left-0 w-full h-[5px] bg-gray-900'>

                <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

                </div>

            </div>

            {/* // media type */}

            {!showViewers && <>

                <div className='w-full h-[90vh]  flex  items-center justify-center '>
                    {story.mediaType == "image" &&

                        <div className='w-[90%]   flex  items-center justify-center '>
                            <img src={story.media} className='h-[100%] rounded-2xl  object-cover' />


                        </div>}

                    {/* video k lye */}

                    {story.mediaType == "video" &&

                        <div className='w-[80%]  flex flex-col items-center justify-center '>

                            <VideoPlayer media={story.media} />



                        </div>}


                </div>





                {/* viewers div */}

                {story?.author?.userName == userData?.userName && <div className='w-full h-[70px] text-white absolute bottom-0 p-2 left-0 flex items-center gap-[10px]' onClick={() => setShowViewers(true)}>

                    <div className='text-white flex items-center gap-[5px]'><FaEye />{story.viewers.length}</div>

                    <div className='flex relative'>

                        {story?.viewers?.slice(0, 3).map((viewers, index) => (

                            <div className={`w-[30px] h-[30px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}>
                                <img src={viewers?.profileImage || dp} alt="" className='w-full object-cover' />
                            </div>

                        ))}


                    </div>

                </div>}

            </>}


            {showViewers && <>

                <div className='w-full h-[30%]  flex  items-center justify-center mt-[100px] overflow-hidden py-[30px]  cursor-pointer' onClick={() => setShowViewers(false)}>
                    {story.mediaType == "image" &&

                        <div className='h-full   flex  items-center justify-center '>
                            <img src={story.media} className='h-[80%] rounded-2xl  object-cover' />


                        </div>}

                    {/* video k lye */}

                    {story.mediaType == "video" &&

                        <div className='h-full  flex flex-col items-center justify-center '>

                            <VideoPlayer media={story.media} />



                        </div>}


                </div>

                <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]'>

                    <div className='text-white flex items-center gap-[10px]'><FaEye /><span>{story?.viewers?.length}</span><span>Viewers</span></div>

                    {/* viewers ko map */}

                    <div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>

                        {story?.viewers?.map((viewers, index) => (
                            <div className='w-full flex items-center gap-[10px]'>
                                <div className='w-[30px] h-[30px]  md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>

                                    <img src={viewers?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>

                                <div className='w-[120px] text-white font-semibold truncate'>{viewers?.userName}</div>

                            </div>
                        ))}

                    </div>

                </div>


            </>}






        </div>
    )
}

export default StoryCard
