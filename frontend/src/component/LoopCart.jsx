import React, { useEffect, useRef, useState } from 'react'
import { IoVolumeHighOutline } from "react-icons/io5";
import { FaVolumeXmark } from "react-icons/fa6";
import dp from '../assets/dp1.png'
import FollowBtn from './FollowBtn.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { setLoopData } from '../redux/LoopSlice.js';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoMdSend } from "react-icons/io";
function LoopCart({ loop }) {

    const videoRef = useRef()

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute, setIsMute] = useState(true)
    const [progress, setProgress] = useState(0)
    const { userData } = useSelector(state => state.user)
    const { loopData } = useSelector(state => state.loop)
    const { socket } = useSelector(state => state.socket)
    const [showHeart, setShowHeart] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")

    const dispatch = useDispatch()
    const commentsRef = useRef()

    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    // IntersectionObserver ka use jis reel pr h uski ka sound sunai de isliye kr rhe h

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // console.log(entry)  entry k andar ek isIntersecting hota h

            const video = videoRef.current

            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            } else {
                video.pause()
                setIsPlaying(false)
            }
            // threshold mtlb kitne percerntage pr vdo play ho jaye 0.6 matlb 60%
        }, { threshold: 0.6 })

        if (videoRef.current) {
            observer.observe(videoRef.current)

        }
        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current)
            }
        }


    }, [])


    const handleTimeUpdate = () => {
        const video = videoRef.current

        if (video) {
            const percent = (video.currentTime / video.duration) * 100
            setProgress(percent)
        }
    }

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true)
        setTimeout(() => setShowHeart(false), 6000)
        { !loop.likes?.includes(userData._id) ? handleLike() : null }
    }


    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, { withCredentials: true })

            const updatedLoop = result.data

            const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)

            dispatch(setLoopData(updatedLoops))
        } catch (error) {
            console.log(error)
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, { message }, { withCredentials: true })

            const updatedLoop = result.data

            const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)

            dispatch(setLoopData(updatedLoops))
            setMessage("")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (commentsRef.current && !commentsRef.current.contains(event.target)) {
                setShowComment(false)
            }

        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside)
        } else {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [showComment])

    useEffect(() => {

        socket?.on("likedLoop", (updatedData) => {
            const updatedLoops = loopData.map(p => p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p)
            dispatch(setLoopData(updatedLoops))
        })

        socket?.on("commentedLoop", (updatedData) => {
            const updatedLoops = loopData.map(p => p._id == updatedData.loopId ? { ...p, comments: updatedData.comments } : p)
            dispatch(setLoopData(updatedLoops))
        })


        return () => {
            socket?.off("likedLoop")
            socket?.off("commentedLoop")
        }

    }, [socket, loopData, dispatch])

    return (
        <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-900 relative overflow-hidden'>

            {/* index.css m heart animation bnaya h */}

            {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  heart-animation z-50'>
                <GoHeartFill className='w-[100px] h-[100px]  text-white drop-shadow-2xl' />
            </div>}


            {/* showComment div */}

            <div ref={commentsRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] left-0  transition-transform duration-500 ease-in-out ${showComment ? "translate-y-0" : "translate-y-[100%] "}`}>

                <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

                {/* comments map k lye */}
                <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

                    {loop.comments.length == 0 && <div className='text-center text-white text-[20px] font-semibold mt-[50px]'>No Comments Yet</div>}

                    {loop.comments?.map((comm, index) => (
                        <div className='w-full  flex flex-col gap-[5px] border-b-[1px] border-gray-700 justify-center pb-[10px] mt-[10px]'>
                            <div className='flex justify-start items-center md:gap-[20px] gap-[10px]'>

                                <div className='w-[30px] h-[30px]  md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                    <img src={comm.author?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>

                                <div className='w-[150px] font-semibold text-white truncate'>{comm.author?.userName}</div>



                            </div>

                            <div className='text-white pl-[60px]'>{comm.message}</div>

                        </div>
                    ))}

                </div>

                <div className='w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px]'>

                    <div className='w-[30px] h-[30px]  md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>

                    <input type="text" className='px-[10px] border-b-2 text-white border-b-gray-600 w-[90%] outline-none h-[40px] placeholder:text-white' placeholder='Write Comment...' onChange={(e) => setMessage(e.target.value)} value={message} />
                    {message && <button className='absolute right-[20px] cursor-pointer'><IoMdSend className='w-[25px] h-[25px] text-white' onClick={handleComment} /></button>}
                </div>

            </div>

            <video ref={videoRef} src={loop?.media} autoPlay muted={isMute} loop className='w-full max-h-full' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick} />

            <div className='absolute top-[20px] right-[20px] z-[100]' onClick={() => setIsMute(prev => !prev)}>
                {!isMute ? <IoVolumeHighOutline className='w-[20px] h-[20px] text-white font-semibold' /> : <FaVolumeXmark className='w-[20px] h-[20px] text-white font-semibold' />}
            </div>



            {/* progress bar */}

            <div className='absolute bottom-0 left-0 w-full h-[5px] bg-gray-900'>

                <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

                </div>

            </div>

            {/* username */}

            <div className='w-full absolute bottom-[10px] h-[100px] p-[10px] flex flex-col gap-[10px]'>

                <div className='flex  items-center  gap-[5px]'>

                    <div className='w-[30px] h-[30px]  md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>

                    <div className='w-[120px] text-white font-semibold truncate'>{loop.author.userName}</div>

                    <FollowBtn targetUserId={loop.author?._id} tailwind={"px-[10px] py-[5px] text-white border-2 border-white text-[14px] rounded-2xl"} />

                </div>

                {/* caption */}

                <div className='text-white px-[10px]'>
                    {loop.caption}
                </div>

                {/* like and comment */}

                <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>

                    {/* like */}
                    <div className='flex flex-col items-center cursor-pointer ' onClick={handleLike}>

                        <div>
                            <div>{!loop.likes.includes(userData._id) && <GoHeart className='w-[25px] h-[25px] cursor-pointer' />}</div>
                            <div>{loop.likes.includes(userData._id) && <GoHeartFill className='w-[25px] h-[25px] cursor-pointer text-red-600' />}</div>
                        </div>

                        <div>{loop.likes.length}</div>

                    </div>

                    {/* comment */}

                    <div className='flex flex-col items-center cursor-pointer'>

                        <div onClick={() => setShowComment(true)}>< MdOutlineComment className='w-[25px] h-[25px] cursor-pointer' /></div>
                        <div>{loop.comments.length}</div>

                    </div>

                </div>


            </div >

        </div >
    )
}

export default LoopCart
