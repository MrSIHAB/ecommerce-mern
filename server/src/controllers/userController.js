const createError = require('http-errors')
const User = require("../models/user");
const { successResponse } = require('../err/resopnse');
const { findWithId } = require('../helper/findWithId');
const { default: mongoose } = require('mongoose');
const { deleteImage } = require('../helper/deleteImage');


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
    let limit = Number(req.query.limit) || 5; // user's limit per page (frontend)
    //  regEx to return a user including similer query
    var searchRegEx = new RegExp(".*" + search + ".*", 'i');
    
    //  Filtering search to get more better result
    let filter = {
        isAdmin: {$ne: true}, // removing Admin accounts
        $or: [
            {name: {$regex: searchRegEx}},// looking for match in name
            {email: {$regex: searchRegEx}},// looking for match in email
            {phone: {$regex: searchRegEx}},// looking for match in phone
        ]
    }

    // ---------------------------------------------------- Getting users from DB
    const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit);
    if(!users) throw createError(404, "No users found")
    const count = await User.find(filter).countDocuments()

    //  success response is from error and success handeler file "err"
    return successResponse(res, {
        statusCode: 200,
        message:"users were returned successfully.",
        payload: {
            users,
            pagination:{
              totalPage: Math.ceil(count/limit),
              currentPage: page,
              previousPage: page - 1 > 0? page - 1 : null,
              nextPage: page<Math.ceil(count/limit)? page + 1: null
            }
        }
    })

  } catch (err) {
    if(err instanceof mongoose.Error)next(createError(404, "User not found."))

    next(err);
  }
};



//  =========================   Getting User By their ID   ==============================

const getUserById = async (req, res, next) => {
  try {
    let id = req.params.id // Getting id from "api/users/:id"
    const user = await findWithId(User, id, options);
    
    return successResponse(res, {
      statusCode: 200,
      message:"users were returned successfully.",
      payload: {user} // sending data
    })
    
  } catch (err) {
    next(err);
  }
};

//  =========================   Deleting User By their ID   ==============================

const deleteUser = async (req, res, next) => {
  try {
    let id = req.params.id // Getting id from "api/users/:id"
    const user = await findWithId(User, id, options);

    //  deleting user
    var userImagePath = user.profileImg
    await User.findByIdAndDelete({_id: id, isAdmin: false})
    deleteImage(userImagePath)

    return successResponse(res, {
      statusCode: 200,
      message:`${user.name} has been deleted successfully.`,
    })
    
  } catch (err) {
    if(err instanceof mongoose.Error) throw createError(404, "Could not delete the user.")
    next(err);
  }
};



/** */
module.exports = {
  getUser,
  getUserById,
  deleteUser,
};
