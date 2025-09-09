import mongoose from "mongoose"
const conversationSchema = new mongoose.Schema({
    participants : [ // participants array contains participants that interacts which each other
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    messages : [
        { 
            type : mongoose.Schema.Types.ObjectId,
            ref : "Message" //  reference to the message model
        }
    ]
},{
    timestamps : true
})

const Conversation = mongoose.model("Conversation",conversationSchema);

export default Conversation