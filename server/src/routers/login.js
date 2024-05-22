const { Router } = require("express");
const {
  handlePostRegister,
  handlePostLogin,
  handleLogout,
  handleUserActivation,
} = require("../controllers/loginController");
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration } = require("../validations/auth");
const runValidator = require("../validations");

const router = Router();

router
  .route("/register")
  .post(
    upload.single("image"),
    validateUserRegistration,
    runValidator,
    handlePostRegister
  );
router.route("/verify").get(handleUserActivation);
router.route("/login").post(handlePostLogin);
router.route("/logout").post(handleLogout);

module.exports = router;
