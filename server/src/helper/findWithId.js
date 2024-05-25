const { default: mongoose } = require("mongoose");
const createError = require("http-errors");

const findWithId = async (Model, id, options = {password: 0, salt: 0}) => {
  try {
    //  getting specific user
    let item = await Model.findById(id, options);
    if (!item) throw createError(404, `${Model.modelName} does not exist with this ID.`); // create http-error

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) throw createError(404, "Invalid User ID");
     /**
       * if the error comes from mongoose.Error, we'll handle that.
       * 
       * else the error will pass through next(err) bellow and our errResponse will
       * handle that
       */
    throw error;
  }
};

module.exports = {findWithId}
