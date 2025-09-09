import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name : "message",
    initialState : { // use object for multiple data.
        messages : [],
    },
    reducers:{
        setMessages : (state,action) => { 
            state.messages = action.payload
        }
    }
});

export const {setMessages} = messageSlice.actions // exporting reducers

export default messageSlice.reducer // exporting the slide