const createError = require('http-errors')
const User = require('../models/user')


const findAllUser = async (search, limit, page, options) => {
    try {
        var searchRegEx = new RegExp(".*" + search + ".*", 'i');

        //  Filtering search to get more better result
        let filter = {
            isAdmin: { $ne: true }, // removing Admin accounts
            $or: [
                { name: { $regex: searchRegEx } },// looking for match in name
                { email: { $regex: searchRegEx } },// looking for match in email
                { phone: { $regex: searchRegEx } },// looking for match in phone
            ]
        }
        
        
        // ---------------------------------------------------- Getting users from DB
        const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit);
        if (!users) throw createError(404, "No users found")
        const count = await User.find(filter).countDocuments()

        //  success response is from error and success handeler file "err"
        return payload = {
            users,
            pagination: {
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page < Math.ceil(count / limit) ? page + 1 : null
            }
        }
    } catch (error) {
        throw error;
    }
}


module.exports = {
    findAllUser,
}