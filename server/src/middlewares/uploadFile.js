const multer = require("multer");
const path = require("path");
const { userImgDest, maxImgSize, allowedImgType } = require('../config/ppConfig.json');



const storage = multer.diskStorage({
    destination:(req, file, cb)=> cb(null, userImgDest),
    filename: (req, file, cb)=>{
        var ext = path.extname(file.originalname);
        cb(null, Date.now() + '_' + file.originalname.length * 156 + ext);
    }
});
const fileFilter = (req, file, cb) => {
    if(!file.mimetype.startsWith("image/"))
        return cb(new Error('Only image files are allowed'), false);
    if(file.size > maxImgSize)
        return cb(new Error(`Maximum image size is ${maxImgSize/1024}kb`), false);
    if(!allowedImgType.includes(file.mimetype))
        return cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);

    return cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter,
});

module.exports = upload;
