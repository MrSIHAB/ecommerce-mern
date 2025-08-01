const { Router } = require("express");
const runValidator = require("../validations");
const upload = require("../middlewares/uploadFile");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../validations/auth");
const {
  handlePostRegister,
  handlePostLogin,
  handleLogout,
  handleUserActivation,
  handleRefreshToken,
} = require("../controllers/loginController");

const router = Router();

router
  .route("/register")
  .post(
    isLoggedOut,
    upload.single("image"),
    validateUserRegistration,
    runValidator,
    handlePostRegister,
  );
router.route("/verify/:token").get(isLoggedOut, handleUserActivation);
router.route("/login").post(
  isLoggedOut,
  validateUserLogin,
  runValidator,
  handlePostLogin,
);
router.route("/logout").post(isLoggedIn, handleLogout);
router.route("/refresh-token").post(handleRefreshToken);

module.exports = router;
