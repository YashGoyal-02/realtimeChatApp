// Here we get all the messages.
import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsers, setUserData } from "../redux/userSlice"
import { setMessages } from "../redux/messageSlice"

const getMessage = () => {
    let dispatch = useDispatch();
    let {userData,selectedUser} = useSelector(state => state.user) 
    useEffect(() => {
        const fetchMessages = async () => { 
            try {
                let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,{withCredentials:true}) // for storing all the messages.
                dispatch(setMessages(result.data)) // sending the messages through dispatch
            } catch (error) {
                console.log(error);
            }
        }
        fetchMessages(); // calling fetchuser in useEffect
    },[selectedUser,userData]) // refresh according to the change in user.
}

export default getMessage