const crypto = require('crypto');

module.exports = async (password, salt)=>{
    const signinHash = await crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    return signinHash;
}