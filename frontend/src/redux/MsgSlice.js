import { createSlice } from "@reduxjs/toolkit"
const msgSlice = createSlice({
    name: "message",
    initialState: {
        selectedUser: null,
        messages: [],
        prevUsersChat: null

    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setPrevUsersChat: (state, action) => {
            state.prevUsersChat = action.payload
        },

    }
})

export const { setSelectedUser, setMessages, setPrevUsersChat } = msgSlice.actions
export default msgSlice.reducer