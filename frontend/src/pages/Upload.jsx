// upload k lye story loop and posts//

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState } from 'react';
import { FaRegSquarePlus } from "react-icons/fa6";
import { useRef } from 'react';
import VideoPlayer from '../component/VideoPlayer.jsx';
import axios from 'axios'
import { serverUrl } from '../App.jsx';
import { ClipLoader } from 'react-spinners'
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/PostSlice.js';
// import { setStoryData } from '../redux/StorySlice.js';
import { setLoopData } from '../redux/LoopSlice.js';
import { setUserData } from '../redux/UserSlice.js';
import { setCurrentUserStory } from '../redux/StorySlice.js';

function Upload() {

    const navigate = useNavigate()

    const [uploadType, setUploadType] = useState("Post")
    const [frontendMedia, setFrontendMedia] = useState(null)
    const [backendMedia, setBackendMedia] = useState(null)
    const [mediaType, setMediaType] = useState("")
    const [caption, setCaption] = useState("")
    const [loading, setLoading] = useState(false)

    const mediaInput = useRef()

    const dispatch = useDispatch()
    const { postData } = useSelector(state => state.post)
    const { storyData } = useSelector(state => state.story)
    const { loopData } = useSelector(state => state.loop)

    const handleMedia = (e) => {
        const file = e.target.files[0]
        // console.log(file)

        if (file.type.includes("image")) {
            setMediaType("image")
        } else {
            setMediaType("video")
        }

        setBackendMedia(file)
        setFrontendMedia(URL.createObjectURL(file))
    }


    const uploadPost = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("caption", caption)
            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)

            const result = await axios.post(`${serverUrl}/api/post/upload`, formData, { withCredentials: true })

            dispatch(setPostData([...postData, result.data]))
            setLoading(false)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const uploadStory = async () => {
        setLoading(true)
        try {
            const formData = new FormData()

            formData.append("mediaType", mediaType)
            formData.append("media", backendMedia)

            const result = await axios.post(`${serverUrl}/api/story/upload`, formData, { withCredentials: true })
            dispatch(setCurrentUserStory(result.data))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const uploadLoop = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("caption", caption)

            formData.append("media", backendMedia)

            const result = await axios.post(`${serverUrl}/api/loop/upload`, formData, { withCredentials: true })
            dispatch(setLoopData([...loopData, result.data]))
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const handleUpload = () => {
        // if (!backendMedia) {
        //     alert("Please select a file to upload.");
        //     return;
        // }
        // if ((uploadType === "Post" || uploadType === "Loop") && !caption.trim()) {
        //     alert("Please enter a caption.");
        //     return;
        // }
        if (uploadType === "Post") {
            uploadPost();
        } else if (uploadType === "Story") {
            uploadStory();
        } else {
            uploadLoop();
        }
    }
    return (
        <div className='w-full h-[100vh] bg-black flex flex-col items-center'>



            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>

                <IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px]' onClick={() => navigate("/")} />

                <h1 className='text-white font-semibold text-[20px]'>Upload Media</h1>

            </div>

            <div className='w-[90%] max-w-[600px] h-[80px]  bg-white rounded-full flex justify-around items-center gap-[10px]'>

                <div className={`${uploadType == "Post" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("Post")}>Post</div>

                <div className={`${uploadType == "Story" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("Story")}>Story</div>

                <div className={`${uploadType == "Loop" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setUploadType("Loop")}>Loop</div>

            </div>

            {/* upload krne ke lye div */}
            {!frontendMedia &&
                <div className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[8px] mt-[15px] rounded-2xl cursor-pointer hover:bg-[#353a3d]' onClick={() => mediaInput.current.click()}>

                    <input type="file" accept={uploadType == "Loop" ? "video/*" : ""} hidden ref={mediaInput} onChange={handleMedia} />

                    <FaRegSquarePlus className='w-[25px] h-[25px] text-white cursor-pointer' />
                    <div className='text-white text-[19px] font-semibold'> Upload {uploadType}</div>
                </div>}


            {frontendMedia &&

                <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
                    {mediaType == "image" &&

                        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
                            <img src={frontendMedia} className='h-[60%] rounded-2xl' />

                            {/* caption k lye */}
                            {uploadType != "Story" && <input type="text" className='w-full border-b-gray-400  border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' placeholder='Write Caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}

                        </div>}

                    {/* video k lye */}

                    {mediaType == "video" &&

                        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>

                            <VideoPlayer media={frontendMedia} />

                            {/* caption k lye */}
                            {uploadType != "Story" && <input type="text" className='w-full border-b-gray-400  border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' placeholder='Write Caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}

                        </div>}


                </div>}

            {frontendMedia && <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[50px] cursor-pointer rounded-2xl font-semibold' onClick={handleUpload}>{loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType} `} </button>}

        </div>
    )
}

export default Upload
