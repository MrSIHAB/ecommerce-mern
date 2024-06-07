const {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
  handleManageUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const upload = require('../middlewares/uploadFile');
const runValidator = require("../validations");
const {
  validateReplacePassword, 
  validateForgetPassword, 
  validateResetPassword
} = require("../validations/auth");

const userRoute = require("express").Router();


//  ============================================================  Controller registration
/**     Logged in users only     */
userRoute.delete("/", isLoggedIn, deleteUser);
userRoute.put("/", isLoggedIn, upload.single("image"), updateUserById);

userRoute.put("/update-password",
  isLoggedIn,
  isAdmin,
  validateReplacePassword,
  runValidator,
  handleUpdatePassword
);
userRoute.post("/forget-password",
  validateForgetPassword,
  runValidator,
  handleForgetPassword
);
userRoute.put('/reset-password/:token',
  validateResetPassword,
  runValidator,
  handleResetPassword
)

/**     Admin Only     */
userRoute.get("/all", isLoggedIn, isAdmin, getUser);
userRoute.put("/manage-user/:id", isLoggedIn, isAdmin, handleManageUserById);
userRoute.get("/:id", isLoggedIn, getUserById);

module.exports = userRoute;
