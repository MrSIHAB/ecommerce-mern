const {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
} = require("../controllers/userController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const upload = require('../middlewares/uploadFile')

const userRoute = require("express").Router();


//  Controller registration
userRoute.get("/", isLoggedIn, isAdmin, getUser);
userRoute.get("/:id", isLoggedIn, getUserById);
userRoute.delete("/:id", isLoggedIn, deleteUser);
userRoute.put("/:id", isLoggedIn, upload.single("image"), updateUserById);
userRoute.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUserById);
userRoute.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnbanUserById);

module.exports = userRoute;
