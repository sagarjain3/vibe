import { createSlice } from "@reduxjs/toolkit"
const storySlice = createSlice({
    name: "story",
    initialState: {
        storyData: [],
        storyList: [],
        currentUserStory: null

    },
    reducers: {
        // currnet user k lye
        setStoryData: (state, action) => {
            state.storyData = action.payload
        },
        // other logon ki story dekhne k lye
        setStoryList: (state, action) => {
            state.storyList = action.payload
        },
        setCurrentUserStory: (state, action) => {
            state.currentUserStory = action.payload
        },
    }
})

export const { setStoryData, setStoryList, setCurrentUserStory } = storySlice.actions
export default storySlice.reducer