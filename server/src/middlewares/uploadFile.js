const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { UPLOAD_USER_IMG_FOLDER, ALLOWED_FILE_TYPE, MAX_FILE_SIZE } = require('../config')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_FOLDER); /// upload directory comes from .env(UPLOAD_FOLDER) file
    },
    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + uniqueSuffix + extName);
    },
});
const fileFilter = (req, file, cb) => {
    const extName = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPE.includes(extName.substring(1)))
        return cb(new Error(400, "File Type not allowed"), false);
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

module.exports = upload;
