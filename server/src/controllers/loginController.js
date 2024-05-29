const createError = require("http-errors");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("../err/resopnse");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { emailWithNodemailer } = require("../services/email");
const jwt = require("jsonwebtoken");

// Environment variables
const JWT_ACTIVATION_KEY = process.env.JWT_ACTIVATION_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY




//  ===================   Registration   ====================

const handlePostRegister = async (req, res, next) => {
  try {
    // gettitng data from frontend
    const { name, email, password, phone, address } = req.body;
    /** Mongoose Configurations... */
    let isUserExist = await User.exists({email})
    if(isUserExist)return next(createError(409, "User Already exist."));

    var info = { name, email, password, phone, address };
    const image = req.file?.path;
    if(image)info.image = image;

    // -------------------------------------- Create JWT token
    const varifyToken = createJsonWebToken(info, JWT_ACTIVATION_KEY, "5m")
    // ------------------------------------ Preparing Email
    const emailData = {
      email,
      subject: "account activation mail.",
      html: `
        <h2>Hello ${name} !</h2>
        <p>Please click the link bellow to confirm your E-mail and activate your account.</p>
        <a 
          href="${CLIENT_URL}/api/activate/${varifyToken}" 
          target="_blank"
        >
          <button
          style="
            height: 50px;
            width: 300px;
            border-radius: 30px;
            background: #0099ff;
            color: #001;
            border: 0;
            outline: 0;
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
      payload:{  }
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
      const deCodedAccount = jwt.verify(token, JWT_ACTIVATION_KEY);
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



//  ===============   SingIn   ==================
const handlePostLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if(!email || !password) throw createError(400, "Bad request")
    const user = await User.matchPassword(email, password);
    if(!user) throw createError(404, "Singin faild");

    let token = await createJsonWebToken( { user }, JWT_ACCESS_KEY, "15m");
    res.cookie("accessToken", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })

    return successResponse(res, {
      statusCode: 200,
      message: "User Logged in",
      payload: user,
    })
  } catch (error) {
    return next(error);
  }
};



//  ===============   Logout   ==================
const handleLogout = (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    
    return successResponse(res, {
      statusCode: 200,
      message: "User Logged Out successfully."
    })
  } catch (error) {
    next(error)
  }
};



module.exports = {
  handlePostRegister,
  handleUserActivation,
  handlePostLogin,
  handleLogout,
};
