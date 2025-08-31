import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/UserSlice.js'
import { setCurrentUserStory } from '../redux/StorySlice.js'

function getFollowingList() {

    const dispatch = useDispatch()
    const { storyData } = useSelector(state => state.story)

    useEffect(() => {

        const fetchFollow = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/user/followinglist`, { withCredentials: true })


                dispatch(setFollowing(result.data))


            } catch (error) {
                console.log(error)
            }
        }

        fetchFollow()
    }, [storyData])
}

export default getFollowingList
