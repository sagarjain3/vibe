import axios from 'axios'
import React, { useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/UserSlice.js'
import { useEffect } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from '../assets/dp1.png'
import Nav from '../component/Nav.jsx'
import FollowBtn from '../component/FollowBtn.jsx'
import Post from '../component/Post.jsx'
import { setSelectedUser } from '../redux/MsgSlice.js'

function Profile() {
    //get profile k lye//


    const { userName } = useParams()
    const dispatch = useDispatch()
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)

    const [postType, setPostType] = useState("Posts")

    const navigate = useNavigate()

    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getprofile/${userName}`, { withCredentials: true })
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }



    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])

    return (
        <div className='w-full min-h-screen bg-black'>

            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-white'>

                <div onClick={() => navigate("/")}><IoMdArrowRoundBack className='text-white h-[25px] cursor-pointer w-[25px]' /></div>


                <div className='text-[20px] font-semibold'>{profileData?.userName}</div>

                <div className='font-semibold cursor-pointer text-[20px] text-blue-500' onClick={handleLogOut}>Log Out</div>


            </div>


            {/* profile */}

            <div className='w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>
                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>

                <div>
                    <div className='font-semibold text-white text-[22px]'>{profileData?.name}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[17px] text-[#ffffffe8]'>{profileData?.bio}</div>
                </div>

            </div>

            {/* followers */}


            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-white'>


                <div>

                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-white'>Posts</div>


                </div>

                <div>

                    <div className='flex items-center justify-center gap-[20px]'>

                        <div className='flex relative'>

                            {profileData?.followers?.slice(0, 3).map((user, index) => (

                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}>
                                    <img src={user?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>

                            ))}








                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers.length}
                        </div>

                    </div>
                    <div className='text-white text-[18px] md:text-[22px] '>Followers</div>

                </div>
                <div>

                    <div className='flex items-center justify-center gap-[20px]'>

                        <div className='flex relative'>

                            {profileData?.following?.slice(0, 3).map((user, index) => (

                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}>
                                    <img src={user?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>

                            ))}


                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following.length}
                        </div>

                    </div>
                    <div className='text-white text-[18px] md:text-[22px] '>Following</div>

                </div>

            </div>
            {/* btn */}

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>

                {profileData?._id == userData._id &&
                    <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>}


                {profileData?._id != userData._id &&

                    <>

                        <FollowBtn tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange={handleProfile} />

                        {/* <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl'>Follow</button> */}
                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl' onClick={() => {
                            dispatch(setSelectedUser(profileData))
                            navigate("/messagesarea")
                        }}>Message</button>

                    </>

                }

            </div>


            {/* posts */}

            <div className='w-full min-h-[100vh] flex justify-center'>

                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>


                    {profileData?._id == userData._id &&

                        <div className='w-[90%] max-w-[500px] h-[80px]  bg-white rounded-full flex justify-center items-center gap-[10px]'>

                            <div className={`${postType == "Posts" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("Posts")}>Post</div>

                            <div className={`${postType == "Saved" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("Saved")}>Saved</div>



                        </div>


                    }

                    <Nav />

                    {profileData?._id == userData._id &&

                        <>
                            {/* user ki post */}

                            {postType == "Posts" && postData.map((post, index) => (
                                post.author?._id == profileData?._id && <Post post={post} />
                            ))}

                            {/* saved post k lye */}
                            {postType == "Saved" && postData.map((post, index) => (
                                userData.saved.includes(post._id) && <Post post={post} />
                            ))}

                        </>

                    }


                    {profileData?._id != userData._id &&
                        postData.map((post, index) => (
                            post.author?._id == profileData?._id && <Post post={post} />
                        ))

                    }



                </div>

            </div>

        </div>
    )
}

export default Profile
