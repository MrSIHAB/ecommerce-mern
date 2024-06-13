const crypto = require('crypto')
const createError = require('http-errors')
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const { findWithId } = require('../helper/findWithId');
const { successResponse } = require('../err/resopnse');
const { deleteImage } = require('../helper/deleteImage');
const { maxImgSize } = require('../config/ppConfig.json');
const { findAllUser } = require('../services/user');
const { usersLimitPerPage } = require('../config/pagination.json')
const { createJsonWebToken } = require('../helper/jsonWebToken');
const { emailWithNodemailer } = require('../services/email')
const passwordHash = require('../helper/passwordHash');

const jwtForgetPassKey = process.env.JWT_RESET_PASSWORD_KEY;
const CLIENT_URL = process.env.CLIENT_URL;

// -------------------- Global Conf
const options = {
  password: 0, // Hiding password
  salt: 0 // Hidding salt
}




//  =========================   Getting all Users (For Admin)   =========================
const getUser = async (req, res, next) => {
  /**
   * This handler will exicute all the users from database excluding Admin accounts.
   * This handler is also able to find specific accounts based on search result.
   * 
   * Searching result is flexible and can able to find more user friendly results.
   * 
   * We filled search result based on user's name, email and phone number.
   * We've also added pagination to make it more user friendly.
   */

  try {
    let search = req.query.search || ""; // search Query (frontend)
    let page = Number(req.query.page) || 1; // What is current page (frontend)
    let limit = Number(req.query.limit) || usersLimitPerPage; // user's limit per page (frontend)
    
    // Using findAllUser service
    const payload = await findAllUser(search, limit, page, options);

    //  success response is from error and success handeler file "err"
    return successResponse(res, {
        statusCode: 200,
        message:"users were returned successfully.",
        payload,
    })

  } catch (err) {
    if(err instanceof mongoose.Error)next(createError(404, "User not found."))

      return next(err);
  }
};



//  =========================   Getting User By their ID   ==============================
const getUserById = async (req, res, next) => {
  try {
    let id = req.params.id // Getting id from "api/users/:id"
    const user = await findWithId(User, id);
    if(!user) throw createError(404, "User does not exist!")
    
    return successResponse(res, {
      statusCode: 200,
      message:"users were returned successfully.",
      payload: {user} // sending data
    })
    
  } catch (err) {
    if(err instanceof mongoose.Error.CastError) throw createError(400, "Invalid ID")
    return next(err);
  }
};



//  =========================   Deleting User By their ID   ==============================
const deleteUser = async (req, res, next) => {
  try {
    let id = req.user._id // Getting id from "api/users/:id"
    const user = await findWithId(User, id);
    if(user.isAdmin = true) throw new Error("Admin Can't be deleted.")
    
    //  deleting user
    var userImagePath = user.image;
    await User.findByIdAndDelete({_id: id, isAdmin: false})
    deleteImage(userImagePath)
    
    return successResponse(res, {
      statusCode: 200,
      message:`${user.name} has been deleted successfully.`,
    })
    
  } catch (err) {
    if(err instanceof mongoose.Error) throw createError(404, "Could not delete the user.");
    if(err instanceof mongoose.Error.CastError) throw createError(400, "Invalid ID");
    return next(err);
  }
};



//  =========================   Updating User By ID   ==============================
const updateUserById = async (req, res, next)=>{
  try {
    const userId = req.user._id;
    var user = await findWithId(User, userId)
    const updateOptions = {new: true, runValidators: true, context: "query"}
    const body = req.body;

    if(req.email) throw createError(400, "Email can't be changed.");
    for(key in body){
      if(['name', 'password', 'address', 'phone'].includes(key))
        user[key] = body[key];
    }
    
    //  Deleting and updating User image
    try {
      if(req.file?.path){
        if(req.file.size > maxImgSize) throw new Error("Image too large.")
        await deleteImage(user.image);
        user.image = req.file.path;
      }
    } catch (error) {
      if(error) throw new Error(error)
    }

    let updateUser = await User.findByIdAndUpdate(userId, user, updateOptions);
    if(!updateUser) throw createError(404, "Changes wasn't saved!");

    return successResponse(res, {
      statusCode: 200,
      message: "User information updated sucessfully.",
      payload: updateUser
    })

  } catch (error) {
    if(err instanceof mongoose.Error.CastError) throw createError(400, "Invalid ID");
    return next(error);
  }
}



//  =========================   Manage Ban User   ==============================
const handleManageUserById = async (req, res, next)=>{
  try {
    const id = req.params.id;
    let user = await findWithId(User, id);

    //  --------- Checking if user is Admin or already Banned
    if(user.isAdmin) throw createError(409, "An Admin can't be modified!");
    
    let BanOption = req.body.ban;

    //  --------- Banning user
    const updateOptions = {new: true, runValidators: true, context: "query"};
    let updateResult = await User.findByIdAndUpdate(id, {isBan: BanOption}, updateOptions);
    if(!updateResult) throw createError(400, "Process failed.");

    successResponse(res, {
      statusCode: 200,
      message: `${user.name} was ${updateResult.isBan? "banned": "unbanned"} successfully.`
    })
  } catch (error) {
    if(err instanceof mongoose.Error.CastError) throw createError(400, "Invalid ID");
    return next(error);
  }
}



//  =========================   Update User's password   ==============================
const handleUpdatePassword = async (req, res, next)=>{
  try {
    let { email, _id, salt } = await req.user // isLoggedIn(middleware)
    const { oldPassword, newPassword, confirmPassword } = req.body; // frontend

    // checking existing password
    try {
      var user = await User.matchPassword(email, oldPassword);
    } catch (error) {
      throw createError(400, "Wrong email/password!!")
    }
    if(!user) throw createError(404, "user not found");
    if(newPassword !== confirmPassword) throw createError(406, "Confirm your password correctly");
    
    //  Hashing newPassword
    let password = await passwordHash(newPassword, salt);
    let updatedUser = await User.findByIdAndUpdate(_id, {password}, {new: true} ); //update
    if(!updatedUser) throw createError(400, "Proccess faild")

    return successResponse(res,{
      statusCode: 200,
      message: "Password Updated succcessfully",
      payload: {updatedUser},
    })
  } catch (error) {
    return next(error);
  }
}



//  =========================   Forget password   ==============================
const handleForgetPassword = async (req, res, next)=>{
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if(!user) throw createError(404, "User dosen't exist.");
 
     // -------------------------------------- Create JWT token
     const resetToken = createJsonWebToken(
      { email, id: user._id, salt: user.salt },
      jwtForgetPassKey,
      "10m"
     )
     // ------------------------------------ Preparing Email
     const emailData = {
       email,
       subject: "Recover Password.",
       html: `
         <h2>Hello ${user.name} !</h2>
         <p>This email has been sent from Test-ecommerce site.
           We've got request of forget password of this email address.
           please Click the link below to reset your password.
         </p>
         <a 
           href="${CLIENT_URL}/api/users/reset-password/${resetToken}" 
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
             Reset Password
           </button>
         </a>
         <footer>Thanks for choosing our site. Best of luck...</footer>
       `
     }
     try {
       await emailWithNodemailer(emailData); // ---------- Sending Email
     } catch (error) {
       return next(createError(500, "Failed to send email."));
     }
 
     // if everything went right...
     return successResponse(res, {
       statusCode: 200,
       message: `Please check your Email(${email}) for varification.`,
       payload:{ 
         token: resetToken, //! removeable
       }
     })
 
  } catch (error) {
    return next(error);
  }
}



//  =========================   Reset password   ==============================
const handleResetPassword = async (req, res, next)=>{
  try {
    const { token, password } = req.body;

    const deCodedToken = await jwt.verify(token, jwtForgetPassKey);
    if(!deCodedToken) throw createError(402, "Unauthorized token");
    let newSalt = crypto.randomBytes(16).toString(); // making sault
    const hashedPassword = await passwordHash(password, newSalt);
    
    const user = await User.findOneAndUpdate({
      email: deCodedToken.email,
      salt: deCodedToken.salt,
      _id: deCodedToken.id
    },{password: hashedPassword, salt: newSalt }, {new: true});
    console.log(user)

    return successResponse(res, {
      statusCode: 200,
      message: "Successfully Reset password.",
      payload: {user}
    })
  } catch (error) {
    return next(error)
  }
}


/** */
module.exports = {
  getUser,
  getUserById,
  deleteUser,
  updateUserById,
  handleManageUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};