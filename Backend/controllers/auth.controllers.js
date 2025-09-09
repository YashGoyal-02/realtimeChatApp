import genToken from "../config/token.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

// SignUp controller
export const signUp = async (req , res) => {
    try {
        const {userName,email,password} = req.body;

        const checkUserByUserName = await User.findOne({userName});
        if(checkUserByUserName){
            return res.status(400).json({message : "username already exist"});
        }

        const checkUserByEmail = await User.findOne({email});
        if(checkUserByEmail){
            return res.status(400).json({message : "Email already exist"});
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"});
        }

        const hashedPassword  = await bcrypt.hash(password,10); // hashing password
        
        const user = await User.create({
            userName,email,password:hashedPassword // creating user
        })

        const token = await genToken(user._id) // Generating a token using userid.

        res.cookie("token",token,{ // storing the token in cookie
            httpOnly : true,
            maxAge : 7*24*60*60*1000,// in ms 
            sameSite : "None",
            secure : true
        })

        // Now the user is Successfully created.
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({message : `signup error ${error}`});
    }
}


// Login Controller
export const login = async (req , res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "User doesn't exist"}); // checking for the existence of user.
        }

        const isMatch = await bcrypt.compare(password,user.password) // Matching the password.
        if(!isMatch){
            return res.status(400).json({message : "incorrect password"});
        }

        const token = await genToken(user._id) // Generating a token using userid.

        res.cookie("token",token,{ // storing the token in cookie
            httpOnly : true,
            maxAge : 7*24*60*60*1000,// in ms 
            sameSite : "None",
            secure : true
        })

        // Now the user is created
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message : `login error ${error}`});
    }
}


// Logout Controller -> clearing the token from cookie.
export const logout = async (req , res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message : "Logout Successfully"});
    } catch (error) {
        return res.status(500).json({message : `logout error ${error}`});
    }
};
