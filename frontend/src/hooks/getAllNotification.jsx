import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
// import { setUserData } from '../redux/UserSlice.js'
import { setPostData } from '../redux/PostSlice.js'
import { setNotificationData } from '../redux/UserSlice.js'

function getAllNotification() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        const fetchNotification = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/user/getallnotification`, { withCredentials: true })

                dispatch(setNotificationData(result.data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchNotification()
    }, [dispatch, userData])
}

export default getAllNotification
