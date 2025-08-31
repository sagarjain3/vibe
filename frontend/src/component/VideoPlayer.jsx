import React from 'react'
import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { IoVolumeHighOutline } from "react-icons/io5";
import { FaVolumeXmark } from "react-icons/fa6";

function VideoPlayer({ media }) {

    const videoTag = useRef()
    const [mute, setMute] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)


    const handleClick = () => {
        if (isPlaying) {
            videoTag.current.pause()
            setIsPlaying(false)
        } else {
            videoTag.current.play()
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // console.log(entry)  entry k andar ek isIntersecting hota h

            const video = videoTag.current

            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            } else {
                video.pause()
                setIsPlaying(false)
            }
            // threshold mtlb kitne percerntage pr vdo play ho jaye 0.6 matlb 60%
        }, { threshold: 0.6 })

        if (videoTag.current) {
            observer.observe(videoTag.current)

        }
        return () => {
            if (videoTag.current) {
                observer.unobserve(videoTag.current)
            }
        }


    }, [])


    return (


        <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden '>

            <video src={media} ref={videoTag} loop muted={mute} autoPlay className='h-[100%] cursor-pointer w-full object-cover rounded-2xl' onClick={handleClick} />

            <div className='absolute bottom-[10px] right-[10px] ' onClick={() => setMute(prev => !prev)}>

                {!mute ? <IoVolumeHighOutline className='w-[20px] h-[20px] text-white font-semibold' /> : <FaVolumeXmark className='w-[20px] h-[20px] text-white font-semibold' />}
            </div>

        </div>
    )
}

export default VideoPlayer
