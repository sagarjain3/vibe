import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'

import { setStoryList } from '../redux/StorySlice.js'

function getAllStory() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const { storyData } = useSelector(state => state.story)

    useEffect(() => {

        const fetchStories = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/story/getall`, { withCredentials: true })

                dispatch(setStoryList(result.data))


            } catch (error) {
                console.log(error)
            }
        }

        fetchStories()
    }, [userData, storyData])
}

export default getAllStory
