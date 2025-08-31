import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp1.png'
import { FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages } from '../redux/MsgSlice.js';
import SenderMsg from '../component/SenderMsg.jsx';
import ReceiverMsg from '../component/ReceiverMsg.jsx';

function MsgArea() {
    const { selectedUser, messages } = useSelector(state => state.message)
    const { userData } = useSelector(state => state.user)
    const { socket } = useSelector(state => state.socket)
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const imageInput = useRef()
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMsg = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("message", input)
        if (backendImage) {
            formData.append("image", backendImage)
        }

        try {
            const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true })
            dispatch(setMessages([...messages, result.data]))
            setInput("")
            setBackendImage(null)
            setFrontendImage(null)

        } catch (error) {
            console.log(error)
        }
    }

    const getAllMsg = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/message/getall/${selectedUser._id}`, { withCredentials: true })
            dispatch(setMessages(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllMsg()
    }, [])

    useEffect(() => {
        socket?.on("newMessage", (mess) => {
            dispatch(setMessages([...messages, mess]))
        })
        return () => socket?.off("newMessage")


    }, [messages, setMessages])




    return (
        <div className='w-full h-[100vh] bg-black relative'>

            <div className='flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black w-full'>
                <div className=' h-[80px] flex items-center gap-[20px] px-[20px] '>

                    <IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px]' onClick={() => navigate("/")} />



                </div>

                {/* profile image */}

                <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${selectedUser.userName}`)}>
                    <img src={selectedUser.profileImage || dp} alt="" className='w-full object-cover' />
                </div>


                <div className='text-white text-[18px] font-semibold'>
                    <div>{selectedUser.userName}</div>
                    <div className='text-[14px] text-gray-200'>{selectedUser.name}</div>
                </div>

            </div>

            {/* msg ko map krne ke lye */}

            <div className='w-full h-[80%] pt-[100px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black'>

                {messages && messages.map((mess, index) => (
                    mess.sender == userData._id ? <SenderMsg message={mess} /> : <ReceiverMsg message={mess} />
                ))}


            </div>

            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]'>

                <form onSubmit={handleSendMsg} className='w-[90%] max-w-[800px] h-[80%] rounded-b-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative'>


                    {frontendImage &&
                        <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                            <img src={frontendImage} alt="" className=' h-full object-cover ' />
                        </div>}

                    <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage} />

                    <input type="text" placeholder='Message...' className='w-full h-full px-[20px] text-[18px] text-white outline-0' onChange={(e) => setInput(e.target.value)} value={input} />

                    <div onClick={() => imageInput.current.click()}><FaImage className='w-[28px] h-[28px] text-white' /></div>

                    {(input || frontendImage) && <button className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center'><IoMdSend className='w-[25px] h-[25px] text-white cursor-pointer' /></button>}


                </form>

            </div>

        </div>
    )
}

export default MsgArea
