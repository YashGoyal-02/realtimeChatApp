import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        // Store messages per conversation, keyed by other user's id
        messagesByUser: {},
    },
    reducers: {
        setMessagesForUser: (state, action) => {
            const { userId, messages } = action.payload;
            state.messagesByUser[userId] = messages;
        },
        appendMessageForUser: (state, action) => {
            const { userId, message } = action.payload;
            const prev = state.messagesByUser[userId] || [];
            state.messagesByUser[userId] = [...prev, message];
        },
        clearMessagesForUser: (state, action) => {
            const userId = action.payload;
            state.messagesByUser[userId] = [];
        },
    },
});

export const { setMessagesForUser, appendMessageForUser, clearMessagesForUser } = messageSlice.actions;

export default messageSlice.reducer;
