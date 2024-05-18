const createError = require("http-errors");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("../err/resopnse");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodemailer } = require("../helper/email");
const jwt = require("jsonwebtoken");



//  ===============   Registration   ==================
const handleGetRegister = (req, res) => {
  return res.status(200).send("Singup Form");
};
//  post register
const handlePostRegister = async (req, res, next) => {
  try {
    // gettitng data from frontend
    const { name, email, password, phone, address } = await req.body;
    /** Mongoose Configurations... */
    let isUserExist = await User.exists({email: email})
    if(isUserExist) next(createError(409, "User Already exist."));

    // -------------------------------------- Create JWT token
    const varifyToken = createJsonWebToken(
    { name, email, password, phone, address },
    jwtActivationKey,
    "5m"
    )
    // ------------------------------------ Preparing Email
    const emailData = {
      email,
      subject: "account activation mail.",
      html: `
        <h2>Hello ${name} !</h2>
        <p>Please click the link bellow to confirm your E-mail and activate your account.</p>
        <a 
          href="${clientURL}/api/activate/${varifyToken}" 
          target="_blank"
        >
          <button
          style="
            height: 50px;
            width: 300px;
            border-redius: 30px;
            background: #00ffff;
            color: #eef
          "
          >
            Activate account
          </button>
        </a>
        <footer>Thanks for choosing our site.</footer>
      `
    }
    try {
      await emailWithNodemailer(emailData); // ---------- Sending Email
    } catch (error) {
      return next(createError(500, "Failed to send varification email."));
    }

    // if everything went right...
    return successResponse(res, {
      statusCode: 200,
      message: `Please check your Email(${email}) for varification.`,
      payload:{ varifyToken }
    })


  } catch (error) {
    if (error instanceof mongoose.Error)
      next(createError(404, "Incorrect entry! Refresh and try again."));

    next(createError(404, "Could not create an account!"));
  }
};



//  ===============   Varify account   ==================
const handleUserActivation= async (req, res, next)=>{
  try {
    let token = req.body.token // getting token from frontend
    if(!token) throw createError(404, "Token not found!!!")

    try {
      /** Decoding the access token with the enCoding activation key */
      const deCodedAccount = jwt.verify(token, jwtActivationKey);
      if(!deCodedAccount) throw createError(401, "User not able to varify.")
      if(await User.exists({email: deCodedAccount.email}))
        throw createError(409,"User Already Exist. SignIN please.");
      await User.create(deCodedAccount); // saving user
    }catch (error) {
      if(error.name === "TokenExpiredError") throw createError(401, 'Token Expired');
      if(error.name === "JsonWebTokenError") throw createError(401, 'Invalid Token');
      throw error;
    }
    
    return successResponse(res,{
      statusCode: 201,
      message: "Account registered Successfully."
    })
  } catch (error) {
    return next(error)
  }
}



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
  handleUserActivation,
  handleGetLogin,
  handlePostLogin,
  handleLogout,
};
