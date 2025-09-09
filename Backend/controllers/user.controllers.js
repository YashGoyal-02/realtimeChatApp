import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser = async (req,res) => {
    try {
        let userId = req.userId
        let user = await User.findById(userId).select("-password") // sending all the details of the user except password.
        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({message : `Current user error ${error}`})
    }
}

export const editProfile = async (req,res) => {
    try {
        let {name} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path) // Uploading the image from cloudinary
        }
        let user = await User.findByIdAndUpdate(req.userId,{ // updating the usermodel.
            name,
            image
        },{new : true});

        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({message : `Profile error ${error}`})
    }
}

// Setting controllers to get other user. in home page.

export const getOtherUsers = async (req,res) => {
    try {
        let users = await User.find({
            _id : {$ne:req.userId} // Getting all the user except self.
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json({message : `get other users error ${error}`})
    }
}

// Creating the search

export const search = async (req,res) => {
    try {
        let {query} = req.query; //  sending query parameter so by using this we can search user by name or username.
        if(!query){
            return res.status(400).json({message : "query is required for search"})
        }
        let users = await User.find({
            $or :[ // using or so we can serch the user by 
                {name : {$regex : query , $options:"i"}}, // i means insensitive means for both uppercase and lowercase.
                {userName : {$regex : query , $options:"i"}}
            ]
        })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json({message : `search users error ${error}`})
    }
}