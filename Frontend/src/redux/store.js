// Creating Our Store
import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./messageSlice"
export const store = configureStore({
    reducer : {
        user : userSlice,// made the box of user
        message : messageSlice // made the box of messages
    }
})