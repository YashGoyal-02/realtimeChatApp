import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"

// custom is made to fetch the current user can be created using useEffect hook
const getCurrentUser = () => {
    let dispatch = useDispatch();
    let {userData} = useSelector(state => state.user) //  getting the userdata from userslice
    useEffect(() => {
        const fetchUser = async () => { // fetching the currentuser using useEffect hook.
            try {
                let result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true}) // jab hum /current pas apni request krenge toh hume current user ki details mil jyengi aur phir hum dispatch ko use krke apne store ke andar current user ka data daal denge (result.data having all the details of the current user)
                dispatch(setUserData(result.data)) // setting the user.
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser(); // calling fetchuser in useEffect
    },[]) // giving userData dependancies which means whenever their is change in userData then fetchuser calls.
}

export default getCurrentUser