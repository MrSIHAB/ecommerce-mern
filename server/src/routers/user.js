const {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
  handleManageUserById,
} = require("../controllers/userController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const upload = require('../middlewares/uploadFile')

const userRoute = require("express").Router();


//  Controller registration
userRoute.get("/", isLoggedIn, isAdmin, getUser);
userRoute.get("/:id", isLoggedIn, getUserById);
userRoute.delete("/:id", isLoggedIn, deleteUser);
userRoute.put("/:id", isLoggedIn, upload.single("image"), updateUserById);
userRoute.put("/manage-user/:id", isLoggedIn, isAdmin, handleManageUserById);

module.exports = userRoute;
