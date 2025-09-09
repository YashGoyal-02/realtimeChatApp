import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import getCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Profile from './pages/Profile'
import Home from './pages/Home'
import getOtherUsers from './customHooks/getOtherUsers'
import io from "socket.io-client"
import { serverUrl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'

function App() {
  getCurrentUser(); //calling getuser function
  getOtherUsers();
  let {userData,socket,onlineUsers} = useSelector(state => state.user); // getting the userdata
  let dispatch = useDispatch()

  useEffect(()=>{
    if(userData){
      const socketio = io(`${serverUrl}`,{
        query:{ // we get the query by handshake of frontend and backend
          userId : userData?._id
        }
      }) // now both socket gets connected.
      dispatch(setSocket(socketio))
  
      socketio.on("getOnlineUsers" , (users) => {
        dispatch(setOnlineUsers(users))
      })
  
      return () => socketio.close()
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }

  },[userData])
  return ( // doing routing 
    <Routes>
      <Route path = '/login' element = {!userData ? <Login/> : <Navigate to = "/"/>}/>
      <Route path = '/signup' element = {!userData ? <SignUp/> : <Navigate to = "/profile"/>}/>
      <Route path = '/' element = {userData ? <Home/> : <Navigate to = "/login"/>}/>
      <Route path = '/profile' element = {userData ? <Profile/> : <Navigate to = "/signup"/>}/>
    </Routes>
  )
}

export default App