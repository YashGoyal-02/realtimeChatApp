// Here we get all the messages.
import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setMessagesForUser, clearMessagesForUser } from "../redux/messageSlice"

const getMessage = () => {
    let dispatch = useDispatch();
    let {userData,selectedUser} = useSelector(state => state.user) 
    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const fetchMessages = async () => { 
            // If no conversation selected or user not ready, clear and exit
            if (!selectedUser?._id || !userData?._id) {
                return;
            }

            // Clear immediately to avoid showing previous conversation messages
            dispatch(clearMessagesForUser(selectedUser._id));

            try {
                let result = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    { withCredentials: true, signal: controller.signal }
                );
                if (!active) return;
                dispatch(setMessagesForUser({ userId: selectedUser._id, messages: result.data }));
            } catch (error) {
                // Ignore cancellations; log other errors
                if (error?.name !== 'CanceledError' && error?.code !== 'ERR_CANCELED') {
                    console.log(error);
                }
            }
        }
        fetchMessages();

        return () => {
            active = false;
            controller.abort();
        }
    },[selectedUser?._id, userData?._id]) // refresh when the target participant changes
}

export default getMessage