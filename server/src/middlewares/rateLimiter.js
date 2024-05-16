const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // time defination
    max: 10,
    message: "too may request, Please try again later."
})

module.exports = {
    rateLimiter
}