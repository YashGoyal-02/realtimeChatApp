import express from 'express'
import { editProfile, getCurrentUser, getOtherUsers, search } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

const userRouter = express.Router();

// using isAuth middleware as we fetch the userid and check for the existence of the user in req.userIDd
userRouter.get("/current",isAuth,getCurrentUser) // used in custom hook
userRouter.get("/others",isAuth,getOtherUsers) // getotheruser route
userRouter.put("/profile",isAuth,upload.single("image"),editProfile) // route for edit the profile upload is multer middleware 
// upload.single for uploading single image at a time. and the name by which we send it from the frontend
userRouter.get("/search",isAuth,search) // creating search routes

export default userRouter
