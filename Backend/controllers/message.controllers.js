import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req , res) => {
    try { // we require two things one is sender one is receiver we have a sender in req.user.id but we want receiver also
        let sender = req.userId
        let {receiver} = req.params
        let {message} = req.body

        let image;
        if(req.file){ //  as multer puts the image in req.file
            image = await uploadOnCloudinary(req.file.path) //  cloudinary sends the string of the image
        }

        let conversation = await Conversation.findOne({
            participants : {$all : [sender,receiver]} // check for the past converstion 
        })

        let newMessage = await Message.create({
            sender,receiver,message,image
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants : [sender,receiver],
                messages : [newMessage._id]
            })
        }else{
            conversation.messages.push(newMessage._id) //  pushing the newMessage to the existence conersation 
            await conversation.save() // saving the newMessage
        }

        const receiverSocketId = getReceiverSocketId(receiver)

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json(newMessage)// here this message receive when we refresh the page.
    } catch (error) {
        return res.status(500).json({message : `send Message error ${error}`})
    }
}

// Controllers for getting the messages.

export const getMessages = async (req,res) => {
    try {
        let sender = req.userId
        let {receiver} = req.params
        let conversation = await Conversation.findOne({ 
            participants : {$all : [sender,receiver]} // we have the _id of the messages
        }).populate("messages") // now we are populating the messages means pushing all the things in it messages,images etc.
        
        if(!conversation){
            return res.status(400).json({message:"conversation not found"})
        }

        return res.status(200).json(conversation?.messages)
    } catch (error) {
        return res.status(500).json({message : `get Message error ${error}`})
    }
}