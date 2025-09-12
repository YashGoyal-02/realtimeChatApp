import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector} from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaRegImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react'
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { appendMessageForUser, setMessagesForUser } from '../redux/messageSlice';

function MessageArea() {
  let {selectedUser,userData,socket} = useSelector(state => state.user)
  let dispatch = useDispatch();
  // state for picking the emojis
  let [showPicker,setShowPicker] = useState(false)
  // for emoji input
  let[input,setInput] = useState("")

  let[frontendImage,setFrontendImage] = useState(null)
  let[backendImage,setBackendImage] = useState(null)

  let image = useRef()

  const messagesByUser = useSelector(state => state.message.messagesByUser);
  const activeMessages = selectedUser?._id ? (messagesByUser[selectedUser._id] || []) : [];
  // keep a ref to always have the latest messages inside socket handler
  const messagesRef = useRef(activeMessages);

  useEffect(() => {
    messagesRef.current = activeMessages;
  }, [activeMessages]);

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file)); // Url bnakar file bhej dega
  }

  const handleSendMessage = async (e) => { // selected userId is receriver id.
    e.preventDefault()
    if(input.length == 0 && backendImage == null){
      return
    }
    try {
      let formData = new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      dispatch(appendMessageForUser({ userId: selectedUser._id, message: result.data }))
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData)=>{ // emojiData is an object 
    setInput(prevInput=>prevInput+emojiData.emoji)
    setShowPicker(false)
  }

  // update messages via socket.io only for the active conversation
  useEffect(() => {
    const handler = (mess) => {
      if (!selectedUser || !userData) return;
      const senderId = String(mess?.sender || "");
      const receiverId = String(mess?.receiver || "");
      const activeUserId = String(selectedUser?._id || "");
      const myId = String(userData?._id || "");
      // Only append if the message belongs to the active conversation and is addressed to this user
      if (senderId === activeUserId && receiverId === myId) {
        // Append to the active conversation only
        dispatch(appendMessageForUser({ userId: activeUserId, message: mess }));
      }
    };

    socket?.on("newMessage", handler);
    return () => socket?.off("newMessage", handler);
  }, [socket, selectedUser, userData, dispatch])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-slate-300 border-l-2 border-gray-300 `}>
      {selectedUser && 
      <div className='w-full h-[100vh] flex flex-col'>
      <div className="w-full h-[100px] bg-[#2196f3] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]">
        <div className='cursor-pointer' onClick = {()=>dispatch(setSelectedUser(null))}>
            <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white'/>
          </div>
          <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer bg-white'>
              <img src={selectedUser?.image || dp} alt="" className='h-[100%]'/>
              </div>
              <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || "user"}</h1>
        </div>
        <div className='w-full h-[70%] flex flex-col py-[30px] px-[20px] overflow-auto gap-[10px]'>

          {showPicker &&  <div className='absolute bottom-[120px] left-[20px]'><EmojiPicker width={250} height={350} className='shadow-gray-500 shadow-lg z-[100]' onEmojiClick={onEmojiClick}/></div>}



          {activeMessages && activeMessages
            .filter((m) => {
              const s = String(m?.sender || "");
              const r = String(m?.receiver || "");
              const me = String(userData?._id || "");
              const other = String(selectedUser?._id || "");
              return (s === me && r === other) || (s === other && r === me);
            })
            .map((mess, idx) => (
              String(mess?.sender || "") === String(userData?._id || "") ? (
                <SenderMessage key={mess._id || idx} image={mess.image} message={mess.message} />
              ) : (
                <ReceiverMessage key={mess._id || idx} image={mess.image} message={mess.message} />
              )
            ))}

        </div>
        </div>
        }

      {!selectedUser && 
      <div className='w-full h-full flex flex-col justify-center items-center '>
        <h1 className='text-gray-700 font-bold text-[50px]'>Welcome to Talksy</h1>
        <span className='text-gray-700 font-semibold text-[30px]'>Talk Easy !</span>
        </div>}

        {selectedUser && <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center '>
          <img src={frontendImage} alt="" className='w-[80px] absolute bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg'/>
          <form className='w-[95%] lg:w-[70%] h-[60px] bg-[#2196f3] rounded-full flex items-center gap-[20px] px-[20px] relative' onSubmit={handleSendMessage}>

          <div onClick={()=>setShowPicker(prev=>!prev)}>
          <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer'/>
          </div>
          
          <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>

          <input type="text" className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-gray-300'  placeholder='Type Your Message Here...' onChange = {(e)=>setInput(e.target.value)} value = {input}/>

          <div onClick={()=>image.current.click()}>
          <FaRegImages className='w-[25px] h-[25px] text-white cursor-pointer'/>
          </div>

          {(input.length > 0 || backendImage != null) && (<button>
          <RiSendPlane2Fill className='w-[25px] h-[25px] text-white cursor-pointer'/>
          </button>)}

        </form>
        </div>}
      
    </div>
  )
}

export default MessageArea