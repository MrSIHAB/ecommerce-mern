const { body } = require("express-validator");

//  ===============   Registration   ==================
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required. Enter your full name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name must be 3-31 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required. Enter your regular email.")
    .isEmail()
    .withMessage("Invalid E-mail address. Please enter email correctly"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required. Enter a strong password.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 character long.")
  // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
  // .withMessage(
  //   "Password must contain one UpperCase letter, one LowerCase later, a number and a special character."
  // )
  ,
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is Required. Enter your delivery address.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Addess should be 2-50 characters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is Required. Enter your regular phone number.")
    .isMobilePhone()
    .withMessage("Invalid number address"),
  body("image")
    .optional()
    // .custom((value, { req }) => {
    //   if (!req.file || !req.file.buffer) throw new Error("Image required!");
    //   return true;
    // })
  ,
];



//  ===============   Login Validation   ==================
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is Required. Enter your regular email.")
    .isEmail()
    .withMessage("Invalid E-mail address. Please enter email correctly"),
  body("password")
    .notEmpty()
    .withMessage("Password is Required. Enter a strong password.")
]

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
