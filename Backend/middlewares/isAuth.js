import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        let token = req.cookies.token;
        if(!token){
            return res.status(400).json({message : "token is not found"})
        }
        // .verify function gives an object.
        let verifytoken = await jwt.verify(token,process.env.JWT_SECRET);
        req.userId = verifytoken.userId; // here we can access the id of the user.
        next();

    } catch (error) {
        return res.status(500).json({message : `isAuth error ${error}`});
    }
}

export default isAuth