import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../main';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser, setUserData } from '../redux/userSlice';

function Login() {
    let navigate  = useNavigate();
    let [show,setShow] = useState(false)

    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [loading,setLoading] = useState(false);
    let [err,setErr] = useState("")

    let dispatch = useDispatch(); // setting the user data

    const handleLogin = async (e) => {
        e.preventDefault() // to handle page refreshing
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/login`,{ // making two objects one is for sending data and one is for credentials.
                email,password
            },{withCredentials:true}) // withcredentials is true because if we are not doing that then we doesn't able to set the cookies.
            dispatch(setUserData(result.data)); // when we do signup data of the user comes using from userSlice.
            dispatch(setSelectedUser(null)); // giving null after login to the selecteduser.
            navigate("/") // after login navigate to home page
            setEmail("")
            setPassword("")
            setLoading(false)
            setErr("")
        } catch (error) {
            console.log(error);
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
        <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
            <div>
                <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
                    <h1 className="text-gray-600 font-bold text-[30px]">Login to <span className='text-white'>Talksy</span></h1>
                </div>
            </div>
            <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
                <input type="email" placeholder='Email' className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg  shadow-gray-200 shadow-lg text-gray-700 text-[19px]' onChange={(e) => setEmail(e.target.value)} value={email}/>
                <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative'>
                <input type={`${show?"text":"password"}`} placeholder='Password' className='w-full h-full outline-none px-[20px] py-[10px] bg-[white] text-gray-700 text-[19px]' onChange={(e) => setPassword(e.target.value)} value={password}/>
                <span className='absolute top-[10px] right-[20px] text-[19px] text-[#20c7ff] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show?"hidden":"show"}`}</span>
                </div>
                {err && <p className='text-red-500'>{"*" + err}</p>}
                <button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl  shadow-gray-200 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner text-gray-600' disabled = {loading}>{loading?"Loading..":"Login"}</button>
                <p className='cursor-pointer' onClick={() => navigate("/signup")}>Want to Create a New Account ? <span className='text-[#20c7ff] text-bold'>Sign Up</span></p>
            </form>
        </div>
    </div>
  )
}

export default Login
