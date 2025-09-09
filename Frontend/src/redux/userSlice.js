import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : { // use object for multiple data.
        userData : null,
        otherUsers : null,// for users except us
        selectedUser : null,
        socket : null,
        onlineUsers : null,
        searchData : null,
    },
    reducers:{
        setUserData : (state,action) => { // state defines the initialstate and action define the change in initialstate
            state.userData = action.payload
        },
        setOtherUsers : (state,action) => { // otheruserdata to get other users.
            state.otherUsers = action.payload
        },
        setSelectedUser : (state,action) => {
            state.selectedUser = action.payload // change the selecteduser state
        },
        setSocket : (state,action) => {
            state.socket = action.payload // change the selecteduser state
        },
        setOnlineUsers : (state,action) => {
            state.onlineUsers = action.payload // change the selecteduser state
        },
        setSearchData : (state,action) => {
            state.searchData = action.payload // change the searchdata state
        },
    }
});

export const {setUserData , setOtherUsers , setSelectedUser , setSocket , setOnlineUsers , setSearchData} = userSlice.actions // exporting reducers

export default userSlice.reducer // exporting the slide
