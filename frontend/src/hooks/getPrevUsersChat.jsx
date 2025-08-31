import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/UserSlice.js'
import { setCurrentUserStory } from '../redux/StorySlice.js'
import { setPrevUsersChat } from '../redux/MsgSlice.js'

function getPrevUsersChat() {

    const dispatch = useDispatch()
    const { messages } = useSelector(state => state.message)

    useEffect(() => {

        const fetchPrevChat = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/message/prevchats`, { withCredentials: true })

                dispatch(setPrevUsersChat(result.data))
                console.log(result.data)



            } catch (error) {
                console.log(error)
            }
        }

        fetchPrevChat()
    }, [messages])
}

export default getPrevUsersChat
