require('dotenv').config()

const PORT = process.env.PORT || 3005
const MongoURI = process.env.MONGODB_URI || "mongodb://localhost/27017"
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "key not found";
const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientURL = process.env.CLIENT_URL || "http://127.0.0.1:3005";

module.exports = {
    PORT,
    MongoURI,
    jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL,
}