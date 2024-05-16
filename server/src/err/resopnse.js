//  =========================   Error Handler   ====================================
const errorResponse =(res, statusCode = 500, message = "Internal server Error!")=>{
    /**
     * Error handling is very essential to prevent server crashes and security purpose.
     * 
     * we've made this handler function to handle serverside errors.
     * This function will mainly be used in app.js file.
     */

    return res.status(statusCode).json({
        success: false,
        message,
      })
        
}

//  =========================   Success Handler   ====================================
const successResponse =(res, {statusCode = 200, message = "Success", payload = {}})=>{
    /**
     * We can use this function to return any succesfull response.
     * The payload object will hold the response data.
     */

    return res.status(statusCode).json({
        success: true,
        message,
        payload
      })
        
}

module.exports = {
    errorResponse,
    successResponse
}