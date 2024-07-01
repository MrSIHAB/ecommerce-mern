const createError = require("http-errors");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { successResponse } = require("../err/resopnse");
const { createJsonWebToken } = require("../helper/jsonWebToken");
const jwt = require("jsonwebtoken");
const { findWithId } = require("../helper/findWithId");
const { JWT_ACCESS_KEY } = require("./loginController");

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

    /*
     *  Setting accessToken and refreshToken in user cookies
     */
    //! needs to be refactored with a separate file/function
    // accessToken
    let accessToken = await createJsonWebToken({ user }, JWT_ACCESS_KEY, "15m");
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    //! needs to be refactored with a separate file/function
    //  refreshToken
    let newRefreshToken = await createJsonWebToken(
      { user },
      JWT_REFRESH_KEY,
      "7d"
    );
    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

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
