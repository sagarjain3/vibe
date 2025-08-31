import React, { useRef, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp1.png'
import axios from 'axios';
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/UserSlice.js';
import { ClipLoader } from 'react-spinners';


function EditProfile() {


    const { userData } = useSelector(state => state.user)

    const navigate = useNavigate()

    const imageInput = useRef()

    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp)
    const [backendImage, setBackendImage] = useState(null)


    const [name, setName] = useState(userData.name || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [gender, setGender] = useState(userData.gender || "")

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }


    const handleEditProfile = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("userName", userName)
            formData.append("bio", bio)
            formData.append("profession", profession)
            formData.append("gender", gender)

            if (backendImage) {
                formData.append("profileImage", backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/user/editprofile`, formData, { withCredentials: true })
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate(`/profile/${userData.userName}`)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] '>

            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] '>

                <IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px]' onClick={() => navigate(`/profile/${userData.userName}`)} />

                <h1 className='text-white font-semibold text-[20px]'>Edit Profile</h1>

            </div>


            {/* dp div */}

            <div className='w-[80px] h-[80px] md:w-[100px] md:h-[100px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ' onClick={() => imageInput.current.click()}>

                <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                <img src={frontendImage} alt="" className='w-full object-cover' />
            </div>

            <div className='text-blue-600 text-center text-[18px] font-semibold cursor-pointer' onClick={() => imageInput.current.click()}>Change Your Profile Picture</div>

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter Your userName' value={userName} onChange={(e) => setUserName(e.target.value)} />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Bio' value={bio} onChange={(e) => setBio(e.target.value)} />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Profession' value={profession} onChange={(e) => setProfession(e.target.value)} />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Gender' value={gender} onChange={(e) => setGender(e.target.value)} />

            <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl' onClick={handleEditProfile} disabled={loading}>{loading ? <ClipLoader size={30} color='black' /> : "Save Profile"}</button>
        </div>
    )
}

export default EditProfile
