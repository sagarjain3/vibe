import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers } from '../redux/UserSlice.js'

function getSuggestedUsers() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        const fetchUser = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/user/suggested`, { withCredentials: true })

                dispatch(setSuggestedUsers(result.data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchUser()
    }, [userData])
}

export default getSuggestedUsers
