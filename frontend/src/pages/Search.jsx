import React, { useState, useEffect } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaSearchengin } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/UserSlice.js';
import dp from '../assets/dp1.png'

function Search() {
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const dispatch = useDispatch()

    const { searchData } = useSelector(state => state.user)

    const handleSearch = async (e) => {
        if (e) e.preventDefault()
        if (input.trim() === "") {
            dispatch(setSearchData([]))
            return
        }
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/search?keyword=${input}`,
                { withCredentials: true }
            )
            console.log(result.data)
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (input.trim() !== "") {
            handleSearch()
        } else {
            dispatch(setSearchData([]))
        }
    }, [input])

    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>

            {/* Back Button */}
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <IoMdArrowRoundBack
                    className='text-white h-[25px] cursor-pointer w-[25px]'
                    onClick={() => navigate('/')}
                />
            </div>

            {/* Search Input */}
            <div className='w-full h-[80px] flex items-center justify-center'>
                <form
                    className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'
                    onSubmit={handleSearch}
                >
                    <FaSearchengin className='h-[20px] w-[20px] text-white' />
                    <input
                        className='w-full h-full outline-0 rounded-full text-white px-[20px] text-[18px]'
                        type="text"
                        placeholder='Search...'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </form>
            </div>

            {/* Search Results */}
            {searchData?.map((user) => (
                <div
                    key={user._id} onClick={() => navigate(`/profile/${user.userName}`)}
                    className='w-[90vw] max-w-[700px] h-[80px] rounded-full bg-white flex items-center gap-[20px]'
                >
                    <div
                        className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'

                    >
                        <img
                            src={user.profileImage || dp}
                            alt=""
                            className='w-full h-full object-cover'
                        />
                    </div>

                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.userName}</div>
                        <div className='text-[14px] text-gray-400'>{user.name}</div>
                    </div>
                </div>
            ))}


            {!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here...</div>}

        </div>
    )
}

export default Search
