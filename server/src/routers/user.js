const {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
} = require("../controllers/userController");
const upload = require('../middlewares/uploadFile')

const userRoute = require("express").Router();


//  Controller registration
userRoute.get("/", getUser);
userRoute.get("/:id", getUserById);
userRoute.delete("/:id", deleteUser);
userRoute.put("/:id", upload.single("image"), updateUserById);

module.exports = userRoute;
