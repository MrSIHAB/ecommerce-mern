const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const xxsClean = require("xss-clean");

const getAllUserRoute = require("./routers/user"); // getting all users
const seedRoute = require("./routers/seedRouter") || null; // SeedRoute
const loginRoute = require("./routers/login"); // SignUP, Login, Logout

const { rateLimiter } = require("./middlewares/rateLimiter");
const { errorResponse } = require("./err/response");

// *  ======================    Configure Module   ======================
const app = express();
require("dotenv").config();

//  ====================    Register Npm Middlewares   ======================
app.use(cookieParser());
app.use(xxsClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  =====================    Register our Middlewares   ======================
app.use(rateLimiter);

//  ========================    Importing Routers   ======================

//  ==========================    Register Routers   ======================
app.get("/", (req, res) => res.send("Welcome to Home")); // Home Route
app.use("/api/auth", loginRoute);
app.use("/api/seed", seedRoute);
app.use("/api/users", getAllUserRoute);

//  ===========================    Error Handling   ======================

//  ------- client side errors
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
//  ------- server side error
app.use((err, req, res, next) => errorResponse(res, err.status, err.message));

module.exports = app; //we'll listen app from server.js
