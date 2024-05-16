const fs = require("fs").promises;

const deleteImage = async (imgPath) => {
  try {
    await fs.access(imgPath);
    await fs.unlink(imgPath);
    console.log("User image is deleted.");

  } catch (error) {
      console.error("User image does not exist!")
  }
};

module.exports = { deleteImage };
