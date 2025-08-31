import React, { useState } from 'react'
import logo from '../assets/vibe.png'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios'
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/UserSlice.js';

function SignUp() {



    const [inputClicked, setInputClicked] = useState({
        name: false,
        userName: false,
        email: false,
        password: false
    })

    const [showPassword, setShowPassword] = useState(false)

    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")

    const navigate = useNavigate()


    const dispatch = useDispatch()
    const handleSignUp = async () => {
        setLoading(true)
        setErr("")
        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name,
                userName,
                password,
                email
            }, { withCredentials: true })

            dispatch(setUserData(result.data))
            setLoading(false)

            console.log(result.data)

        } catch (error) {
            setErr(error.response?.data?.msg)
            setLoading(false)
            console.log(error)
        }
    }

    return (




        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>

            <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>

                {/* input k lye */}
                <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]'>


                    <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
                        <span>Sign Up to</span>
                        <img src={logo} alt="" className='w-[60px] rounded-4xl' />
                    </div>

                    <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, name: true })}>

                        <label htmlFor="name" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.name ? "top-[-15px] " : ""}`}> Enter Your Name...</label>

                        <input type="text" id="name" className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required value={name} onChange={(e) => setName(e.target.value)} />




                    </div>


                    <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, userName: true })}>

                        <label htmlFor="username" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.userName ? "top-[-15px] " : ""}`}> Enter Username...</label>

                        <input type="text" id="username" className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required value={userName} onChange={(e) => setUserName(e.target.value)} />




                    </div>

                    <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, email: true })}>

                        <label htmlFor="email" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px] " : ""}`}> Enter Your Email...</label>

                        <input type="email" id="email" className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required value={email} onChange={(e) => setEmail(e.target.value)} />




                    </div>

                    <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, password: true })}>

                        <label htmlFor="password" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? "top-[-15px] " : ""}`}> Enter Password...</label>

                        <input type={showPassword ? "text" : "password"} id="password" className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' required value={password} onChange={(e) => setPassword(e.target.value)} />



                        {!showPassword && <FaEye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={() => setShowPassword(true)} />}

                        {showPassword && <FaEyeSlash className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={() => setShowPassword(false)} />}
                    </div>

                    {err && <p className='text-red-500'>{err}</p>}

                    <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' disabled={loading} onClick={handleSignUp}>{loading ? <ClipLoader size={30} color='white' /> : "Sign In"}</button>
                    <p className='cursor-pointer gray-800' onClick={() => navigate("/login")}>Already Have An Account ? <span className='border-b-2 border-b-black pb-[3px] text-black'>Sign In</span></p>
                </div>

                {/* vibe image */}

                <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>

                    <img src={logo} alt="" className='w-[40%] rounded-4xl' />
                    <p>Not Just A Platform, It's A VIBE</p>

                </div>



            </div>

        </div>
    )
}

export default SignUp
