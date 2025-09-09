import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
function ReceiverMessage({image,message}) { // passing props to the child function
    let scroll = useRef()

    let {selectedUser} = useSelector(state => state.user);

    useEffect(() => {
        scroll?.current.scrollIntoView({behaviour : "smooth"})
    },[message,image])

    const handleImageScroll = () => {
        scroll?.current.scrollIntoView({behaviour : "smooth"})
    }
  return (
    <div className='flex items-start gap-[10px]'>
        <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer bg-white '>
            <img src={selectedUser.image || dp} alt="" className='h-[100%]'/>
        </div>
        <div ref={scroll} className='w-fit max-w-[500px] bg-[rgb(23,151,194)] px-[20px] py-[10px] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0 mr-auto shadow-gray-400 shadow-lg gap-[10px] flex flex-col'>
        {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
        {message && <span>{message}</span>}
        </div>
        </div>
  )
}

export default ReceiverMessage