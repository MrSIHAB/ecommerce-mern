const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/user");
const { findWithId } = require("../helper/findWithId");
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;


//  =================== isAdmin ==================

const isAdmin = async (req, res, next)=>{
    try {
        if(!req.user.isAdmin) throw createError(403, "Access denied.");
        if(req.user.isAdmin === true) return next();

        throw createError(500, "Something went wrong");
    } catch (error) {
        return next(error);
    }
}




//  =================== isLoggedIn ==================

const isLoggedIn = async (req, res, next)=>{
    try {
        const accessToken = await req.cookies.accessToken;
        if(!accessToken) throw createError(404, "You are not logged in.");
        
        const decoded = jwt.verify(accessToken, JWT_ACCESS_KEY);
        if(!decoded){
            res.clearCookie("accessToken");
            throw next(createError(400, "Invalid access token!!!"));
        };

        const user = await findWithId(User, decoded.user._id)
        req.user = user;

        return next();
    } catch (error) {
        return next(error);
    }
}




//  =================== isLoggedOut ==================

const isLoggedOut = async (req, res, next)=>{
    try {
        let accessToken = req.cookies.accessToken;
        if(accessToken) throw createError(404, "User already logged in.");
        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    isAdmin,
    isLoggedIn,
    isLoggedOut,
}