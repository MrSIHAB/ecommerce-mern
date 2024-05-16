const jwt = require('jsonwebtoken')

const createJsonWebToken=(payload, secretKey, expiresIn)=>{

    if(typeof payload !== 'object' || !payload) throw new Error("Payload must be an object.")

    let token = jwt.sign(payload, secretKey, {expiresIn})

    return token;
}

module.exports = {
    createJsonWebToken,
}