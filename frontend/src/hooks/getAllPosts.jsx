import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
// import { setUserData } from '../redux/UserSlice.js'
import { setPostData } from '../redux/PostSlice.js'

function getAllPost() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        const fetchPost = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/post/getall`, { withCredentials: true })

                dispatch(setPostData(result.data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchPost()
    }, [dispatch, userData])
}

export default getAllPost
