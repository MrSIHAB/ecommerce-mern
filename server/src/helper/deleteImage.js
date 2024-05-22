const fs = require("fs").promises;
const { defaultImgDest } = require('../config/index.json')

const deleteImage = async (imgPath) => {
  try {
    if(imgPath === defaultImgDest) return;
    await fs.access(imgPath);
    await fs.unlink(imgPath);
    return true;
  } catch (error) {
    throw new Error("Unsuccesfull")
  }
};

module.exports = { deleteImage };
