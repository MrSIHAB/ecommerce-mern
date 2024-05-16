const { Router } = require("express");
const {
  handleGetRegister,
  handlePostRegister,
  handleGetLogin,
  handlePostLogin,
  handleLogout,
} = require("../controllers/loginController");

const router = Router();

router.route("/register").get(handleGetRegister).post(handlePostRegister);
router.route("/login").get(handleGetLogin).post(handlePostLogin);
router.route("/logout").post(handleLogout);

module.exports = router;
