import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Forgot from './pages/Forgot.jsx'
import Home from './pages/Home.jsx'
import { useDispatch, useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser.jsx'
import getSuggestedUsers from './hooks/getSuggestedUsers.jsx'
import Profile from './pages/Profile.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Upload from './pages/Upload.jsx'
import getAllPost from './hooks/getAllPosts.jsx'
import Loop from './pages/Loop.jsx'
import getAllLoop from './hooks/getAllLoops.jsx'
import Story from './pages/Story.jsx'
import getAllStory from './hooks/getAllStory.jsx'
import Msg from './pages/Msg.jsx'
import MsgArea from './pages/MsgArea.jsx'
import { io } from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/SocketSlice.js'
import getFollowingList from './hooks/getFollowingList.jsx'
import getPrevUsersChat from './hooks/getPrevUsersChat.jsx'
import Search from './pages/Search.jsx'
import getAllNotification from './hooks/getAllNotification.jsx'
import Notification from './pages/Notification.jsx'
import { setNotificationData } from './redux/UserSlice.js'

export const serverUrl = "https://vibe-backend-emgt.onrender.com"

function App() {
  getSuggestedUsers()
  getCurrentUser()
  getAllPost()
  getAllLoop()
  getAllStory()
  getFollowingList()
  getPrevUsersChat()
  getAllNotification()
  const { userData, notificationData } = useSelector(state => state.user)
  const { socket } = useSelector(state => state.socket)

  const dispatch = useDispatch()

  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData._id,
          //ye id backend me jaygi socket.js k useSocketMap object me //
        }
      })
      dispatch(setSocket(socketIo))


      socketIo.on('getOnlineUsers', (users) => {
        // console.log(users)
        dispatch(setOnlineUsers(users))  // online users 
      })

      return () => socketIo.close()
    } else {
      if (socket) {
        socket.close()
        dispatch(setSocket(null))
      }
    }



  }, [userData])


  socket?.on("newNotification", (noti) => {
    dispatch(setNotificationData([...notificationData, noti]))
  })


  return (
    <Routes>

      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/login"} />} />
      <Route path='/forgot-password' element={!userData ? <Forgot /> : <Navigate to={"/"} />} />
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={"/login"} />} />
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to={"/login"} />} />
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/login"} />} />
      <Route path='/loops' element={userData ? <Loop /> : <Navigate to={"/login"} />} />
      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to={"/login"} />} />
      <Route path='/messages' element={userData ? <Msg /> : <Navigate to={"/login"} />} />
      <Route path='/messagesarea' element={userData ? <MsgArea /> : <Navigate to={"/login"} />} />
      <Route path='/search' element={userData ? <Search /> : <Navigate to={"/login"} />} />
      <Route path='/notification' element={userData ? <Notification /> : <Navigate to={"/login"} />} />
    </Routes>
  )
}

export default App
