const seedRouter = require('express').Router()
const { seedUser } = require('../controllers/seedController')


seedRouter.get("/users", seedUser)

module.exports = seedRouter