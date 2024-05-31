const {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
  handleManageUserById,
  handleUpdatePassword,
} = require("../controllers/userController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const upload = require('../middlewares/uploadFile')

const userRoute = require("express").Router();


//  ============================================================  Controller registration
/**     Admin Only     */
userRoute.get("/all", isLoggedIn, isAdmin, getUser);
userRoute.get("/:id", isLoggedIn, getUserById);
userRoute.put("/manage-user/:id", isLoggedIn, isAdmin, handleManageUserById);
/**     Logged in users only     */
userRoute.delete("/", isLoggedIn, deleteUser);
userRoute.put("/", isLoggedIn, upload.single("image"), updateUserById);
userRoute.put("/update-password", isLoggedIn, isAdmin, handleUpdatePassword);

module.exports = userRoute;
