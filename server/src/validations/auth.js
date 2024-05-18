const {body} = require('express-validator')


//  ===============   Registration   ==================
const validateUserRegistration = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({min: 3, max: 31})
    .withMessage("Name must be 3-31 characters long.")
]


module.exports = {
    validateUserRegistration,
}