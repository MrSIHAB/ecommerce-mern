const { Schema, model } = require("mongoose");
const crypto = require("crypto");
const createError = require('http-errors');
const {defaultImgDest} = require('../config/index.json')

//    -----------------------------------------------------------------------------  mongodb user schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name Lenght can't be less than 2 character"],
      maxlength: [25, "Name Lenght can't be more than 25 character"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This email is already used"],
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g , "Please Enter a valid Email address."]
    },
    phone: {
      type: String,
      required: [true, "Please fill your Phone Correctly."],
      unique: true,
      trim: true,
    },
    address:{
      type: String,
      required: [true, "Address is required"]
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "You must give a password."],
    },
    image: {
      type: String,
      default: defaultImgDest
    },
    isAdmin:{
      type: Boolean,
      default: false
    },
    isBan:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
/**
 * Why do we make Schemas in NoSQL Database?
 *
 * MongoDB is no SQL database who save data in BSON format.
 * In NoSQL, we needn't define any Schema. We can save data whatever we want.
 * But It's a good practice to make a Schema so that we can get exact data we need.
 * This Schema also help us to debug or Handle ERRORs.
 * But we can continue without Schema
 */

//   --------------------------------------------------------------------    Hashing Password before saving data
userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return; // if password is already hashed,

  let salt = crypto.randomBytes(16).toString(); // making sault
  // hashing password
  let hasedPassword = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt; // saving sault
  this.password = hasedPassword; // saving hashed password
  next(); // Express will automatically detect the next function
});

//  -----------------------------------------------------------------------     matching email, password while singin
userSchema.static("matchPassword", async function (email, password) {
  let user = await this.findOne({ email });
  if (!user) throw new Error("User not found!!");
  
  let salt = await user.salt;
  let hasedPassword = await user.password;
  
  const signinHash = await crypto
  .createHmac("sha256", salt)
  .update(password)
  .digest("hex");
  
  if (signinHash !== hasedPassword) throw createError(403, "Incorrect Password !");
  if (user.isBan) throw createError(401, "You're baned! Please contact authority.");

  user.password = undefined;
  user.salt = undefined;

  return user;
});

//      -------------------------------------     Main Model
const User = model("user", userSchema);

module.exports = User;
