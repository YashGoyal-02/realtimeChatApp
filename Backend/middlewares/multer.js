import multer from "multer"

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{ // req , file , callback
        cb(null,"./public") // ./public is the destination means where we want to store the image.
    },
    filename:(req,file,cb)=>{ // image name 
        cb(null,file.originalname)
    }
})

export const upload = multer({storage}) // upload is the middleware where we upload the image