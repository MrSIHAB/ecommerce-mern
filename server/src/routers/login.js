const { Router } = require("express");
const {
  handleGetRegister,
  handlePostRegister,
  handleGetLogin,
  handlePostLogin,
  handleLogout,
  handleUserActivation,
} = require("../controllers/loginController");

const router = Router();

router.route("/register").get(handleGetRegister).post(handlePostRegister);
router.route("/verify").get(handleUserActivation);
router.route("/login").get(handleGetLogin).post(handlePostLogin);
router.route("/logout").post(handleLogout);

module.exports = router;
