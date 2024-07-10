/**
 *  Just normally set any type of cookie
 * **maxAge** follow days. set an Integer value that will be set as day
 */
const setCookie = (res, { cookieName, accessToken, maxAge }) => {
  res.cookie(cookieName, accessToken, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

/**
 * Set access token especially for auth(login) purpose
 */
const setAccessToken = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

/**
 * Set refresh to refresh accessToken and refresh it's own token
 * Expirity of refresh Token causes Auto logOut and need to login again
 */
setRefreshToken = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

module.exports = {
  setCookie,
  setAccessToken,
  setRefreshToken,
};
