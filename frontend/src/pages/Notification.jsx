import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import NotificationCard from '../component/NotificationCard.jsx';
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { setNotificationData } from '../redux/UserSlice.js';

function Notification() {
    const navigate = useNavigate()
    const { notificationData } = useSelector(state => state.user)
    const ids = notificationData?.map((n) => n._id)
    const dispatch = useDispatch()

    const markAsRead = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/markasread`, { notificationId: ids }, { withCredentials: true })

            await fetchNotification()

        } catch (error) {
            console.log(error)
        }
    }

    const fetchNotification = async () => {
        try {

            const result = await axios.get(`${serverUrl}/api/user/getallnotification`, { withCredentials: true })

            dispatch(setNotificationData(result.data))

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        markAsRead()
    }, [])

    return (
        <div className='w-full h-[100vh] bg-black overflow-auto'>

            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>

                <IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px] lg:hidden' onClick={() => navigate('/')} />

                <h1 className='text-white font-semibold text-[20px]'>Notifications</h1>

            </div>

            {/* notification map */}

            <div className='w-full h-[100%] flex flex-col gap-[20px] overflow-auto px-[10px]'>

                {notificationData?.map((noti, index) => (
                    <NotificationCard noti={noti} key={index} />
                ))}
            </div>

        </div>
    )
}

export default Notification
