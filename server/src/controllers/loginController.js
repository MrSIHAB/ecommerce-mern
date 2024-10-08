const createError = require("http-errors");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("../err/resopnse");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const { emailWithNodemailer } = require("../services/email");
const jwt = require("jsonwebtoken");
const { findWithId } = require("../helper/findWithId");
const { setRefreshToken, setAccessToken } = require("../helper/setCookie");

// Environment variables
const JWT_ACTIVATION_KEY = process.env.JWT_ACTIVATION_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;

//  ===================   Registration   ====================

const handlePostRegister = async (req, res, next) => {
  try {
    // gettitng data from frontend
    const { name, email, password, phone, address } = req.body;
    /** Mongoose Configurations... */
    let isUserExist = await User.exists({ email });
    if (isUserExist) return next(createError(409, "User Already exist."));

    var info = { name, email, password, phone, address };
    const image = req.file?.path;
    if (image) info.image = image;

    // -------------------------------------- Create JWT token
    const varifyToken = createJsonWebToken(info, JWT_ACTIVATION_KEY, "5m");
    // ------------------------------------ Preparing Email
    const emailData = {
      email,
      subject: "account activation mail.",
      html: `
        <h2>Hello ${name} !</h2>
        <p>This email has been sent from Test-ecommerce site.
          You recently filled an singup form in our site with this email.
          For corfirmation, we need to verify your email address.
          Please click bellow to verify your account.
        </p>
        <a 
          href="${CLIENT_URL}/api/verify/${varifyToken}" 
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
        <footer>Thanks for choosing our site. Best of luck...</footer>
      `,
    };
    try {
      await emailWithNodemailer(emailData); // ---------- Sending Email
    } catch (error) {
      return next(createError(500, "Failed to send varification email."));
    }

    // if everything went right...
    return successResponse(res, {
      statusCode: 200,
      message: `Please check your Email(${email}) for varification.`,
      payload: {
        token: varifyToken, //! removeable
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error)
      next(createError(404, "Incorrect entry! Refresh and try again."));

    next(createError(404, "Could not create an account!"));
  }
};

//  ===============   Varify account   ==================
const handleUserActivation = async (req, res, next) => {
  try {
    let token = req.params.token; // getting token from frontend
    if (!token) throw createError(404, "Token not found!!!");

    try {
      /** Decoding the access token with the enCoding activation key */
      const deCodedAccount = jwt.verify(token, JWT_ACTIVATION_KEY);
      if (!deCodedAccount) throw createError(401, "User not able to varify.");
      if (await User.exists({ email: deCodedAccount.email }))
        throw createError(409, "User Already Exist. SignIN please.");
      await User.create(deCodedAccount); // saving user
    } catch (error) {
      if (error.name === "TokenExpiredError")
        throw createError(401, "Token Expired");
      if (error.name === "JsonWebTokenError")
        throw createError(401, "Invalid Token");
      throw error;
    }

    return successResponse(res, {
      statusCode: 201,
      message: "Account registered Successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

//  ===============   SingIn   ==================
const handlePostLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) throw createError(400, "Bad request");
    const user = await User.matchPassword(email, password);
    if (!user) throw createError(404, "Singin faild");

    /*
     *  Setting accessToken and refreshToken in user cookies
     */
    // accessToken
    let accessToken = await createJsonWebToken({ user }, JWT_ACCESS_KEY, "15m");
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    //  refreshToken
    let refreshToken = await createJsonWebToken(
      { user },
      JWT_REFRESH_KEY,
      "7d"
    );
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    //  responsebody
    return successResponse(res, {
      statusCode: 200,
      message: "User Logged in",
      payload: user,
    });
  } catch (error) {
    return next(error);
  }
};

//  ===============   Logout   ==================
const handleLogout = (req, res, next) => {
  try {
    res.clearCookie("accessToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User Logged Out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

//  =========================   Refresh Token   ==============================
const handleRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(createError(401, "No refresh token provided"));

    // Verify the old refresh token
    const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    if (!decoded) throw createError(401, "invalid refreshToken");
    var user = await findWithId(User, decoded.user._id);

    /**
     *  Setting accessToken and refreshToken in user cookies
     */
    // accessToken
    let accessToken = await createJsonWebToken({ user }, JWT_ACCESS_KEY, "15m");
    setAccessToken(res, accessToken);
    //  refreshToken
    let newRefreshToken = await createJsonWebToken(
      { user },
      JWT_REFRESH_KEY,
      "7d"
    );
    setRefreshToken(res, newRefreshToken);

    // Assuming token generation logic is implemented here
    // For demonstration, returning a placeholder response
    return successResponse(res, {
      statusCode: 200,
      message: "Successfully refreshed access token",
      // Token generated
    });
  } catch (error) {
    return next(createError(500, "Failed to refresh access token"));
  }
};

module.exports = {
  handlePostRegister,
  handleUserActivation,
  handlePostLogin,
  handleLogout,
  handleRefreshToken,
};
