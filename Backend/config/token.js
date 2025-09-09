import jwt from "jsonwebtoken"
const genToken = async (userId)=>{ // generating token based on the id of the user
    try {
        const token = await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn : "7d"});
        return token
    } catch (error) {
        console.log("gen token error");
    }
}

export default genToken