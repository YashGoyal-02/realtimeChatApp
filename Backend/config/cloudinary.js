import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath) // it is an object we fetch url from that and uploades it.
        fs.unlinkSync(filePath) // deleting the filepath
        return uploadResult.secure_url // taking the url after uploading we can delete it in our public folder as we upload it using fs module.
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log(error)
    }
}

export default uploadOnCloudinary