const { validationResult } = require('express-validator')
const { errorResponse } = require('../err/resopnse')

const runValidator = (req, res, next) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return errorResponse(res, 422, errors.array()[0].msg)
        }

        return next()

    } catch (error) {
        return next(error)
    }
}

module.exports = runValidator;