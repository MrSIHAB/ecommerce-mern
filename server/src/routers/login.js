const { Router } = require("express");
const {
  handleGetRegister,
  handlePostRegister,
  handleGetLogin,
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
  .get(handleGetRegister)
  .post(
    upload.single("image"),
    validateUserRegistration,
    runValidator,
    handlePostRegister
  );
router.route("/verify").get(handleUserActivation);
router.route("/login").get(handleGetLogin).post(handlePostLogin);
router.route("/logout").post(handleLogout);

module.exports = router;
