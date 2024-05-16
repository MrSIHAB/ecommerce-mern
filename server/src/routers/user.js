const { getUser, getUserById, deleteUser } = require('../controllers/userController')

const userRoute = require('express').Router()

userRoute.get("/", getUser);
userRoute.get("/:id", getUserById);
userRoute.delete("/:id", deleteUser)

module.exports = userRoute