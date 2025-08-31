import { configureStore } from '@reduxjs/toolkit'

import userSlice from './UserSlice.js'
import postSlice from './PostSlice.js'
import storySlice from './StorySlice.js'
import loopSlice from './LoopSlice.js'
import msgSlice from './MsgSlice.js'
import socketSlice from './SocketSlice.js'

const store = configureStore({
    reducer: {
        user: userSlice,
        post: postSlice,
        story: storySlice,
        loop: loopSlice,
        message: msgSlice,
        socket: socketSlice
    }
})

export default store