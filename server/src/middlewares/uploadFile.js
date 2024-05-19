const multer = require("multer");
const path = require("path");
const { ALLOWED_FILE_TYPE, MAX_FILE_SIZE } = require('../config')



const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if(!file.mimetype.startsWith("image/"))
        return cb(new Error('Only image files are allowed'), false);
    if(file.size > MAX_FILE_SIZE)
        return cb(new Error(`Maximum image size is ${MAX_FILE_SIZE/1024}kb`), false);
    if(!ALLOWED_FILE_TYPE.includes(file.mimetype))
        return cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);

    return cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter,
});

module.exports = upload;
