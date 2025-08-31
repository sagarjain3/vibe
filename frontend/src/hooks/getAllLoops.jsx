import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'


import { setLoopData } from '../redux/LoopSlice.js'

function getAllLoop() {

    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {

        const fetchLoop = async () => {
            try {

                const result = await axios.get(`${serverUrl}/api/loop/getall`, { withCredentials: true })

                dispatch(setLoopData(result.data))

            } catch (error) {
                console.log(error)
            }
        }

        fetchLoop()
    }, [dispatch, userData])
}

export default getAllLoop
