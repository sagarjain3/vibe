import React from 'react'
import { MdHome } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { RxVideo } from "react-icons/rx";
import { FaRegSquarePlus } from "react-icons/fa6";
import dp from '../assets/dp1.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function Nav() {

    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    return (
        <div className='w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>

            <div className='cursor-pointer' onClick={() => navigate("/")}><MdHome className='w-[25px] h-[25px] text-white' /></div>

            <div onClick={() => navigate('/search')}><CiSearch className='w-[25px] h-[25px] text-white cursor-pointer ' /></div>

            <div onClick={() => navigate("/upload")}><FaRegSquarePlus className='w-[25px] h-[25px] text-white cursor-pointer' /></div>

            <div onClick={() => navigate("/loops")}><RxVideo className='w-[25px] h-[25px] text-white cursor-pointer' /></div>

            <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
                <img src={userData.profileImage || dp} alt="" className='w-full object-cover' />
            </div>

        </div>
    )
}

export default Nav
