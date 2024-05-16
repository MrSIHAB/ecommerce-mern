const createError = require("http-errors");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("../err/resopnse");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey } = require("../secret");



//  ===============   Signup   ==================
const handleGetRegister = (req, res) => {
  return res.status(200).send("Singup Form");
};
const handlePostRegister = async (req, res, next) => {
  // gettitng data from frontend
  try {
    let { name, email, password, phone, address } = await req.body;

    /** Mongoose Configurations... */
    let isUserExist = await User.exists({email: email})
    if(isUserExist) next(createError(409, "userExist"));

    //  --- Create JWT token
     const varifyToken = createJsonWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
     )

    // await User.create({ name, email, password, phone, address });
    
    return successResponse(res, {
      statusCode: 200,
      message: `${name}'s account has been created successfully`,
      payload: { varifyToken }
    })
  } catch (error) {
    if (error instanceof mongoose.Error)
      next(createError(404, "Incorrect entry! Refresh and try again."));

    next(createError(404, "Could not create an account!"));
  }
};



//  ===============   Login   ==================
const handleGetLogin = (req, res) => {
  return res.status(200).send("LoginForm");
};
const handlePostLogin = (req, res) => {
  return res.status(200).send("You're logged in");
};



//  ===============   Logout   ==================
const handleLogout = (req, res) => {
  return res.status(200).send("Logged Out");
};



module.exports = {
  handleGetRegister,
  handlePostRegister,
  handleGetLogin,
  handlePostLogin,
  handleLogout,
};
