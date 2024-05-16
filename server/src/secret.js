require('dotenv').config()

const PORT = process.env.PORT || 3005
const MongoURI = process.env.MONGODB_URI || "mongodb://localhost/27017"
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "key not found";

module.exports = {
    PORT,
    MongoURI,
    jwtActivationKey,
}