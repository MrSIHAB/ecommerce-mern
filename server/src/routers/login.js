const { Router } = require("express");
const {
  handlePostRegister,
  handlePostLogin,
  handleLogout,
  handleUserActivation,
} = require("../controllers/loginController");
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration, validateUserLogin } = require("../validations/auth");
const runValidator = require("../validations");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");

const router = Router();

router
  .route("/register")
  .post(
    isLoggedOut,
    upload.single("image"),
    validateUserRegistration,
    runValidator,
    handlePostRegister
  );
router.route("/verify/:token").get(isLoggedOut ,handleUserActivation);
router.route("/login").post(isLoggedOut, validateUserLogin, runValidator, handlePostLogin);
router.route("/logout").post(isLoggedIn, handleLogout);

module.exports = router;
