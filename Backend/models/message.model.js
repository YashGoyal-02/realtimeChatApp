import mongoose from "mongoose"
const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId, // reference the other model i.e user model
        ref : "User",
        required : true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId, // reference the other model i.e user model
        ref : "User",
        required : true
    },
    message : {
        type : String,
        default : "",
    },
    image : {
        type : String,
        default : ""
    }
},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)

export default Message