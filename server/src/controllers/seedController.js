const User = require("../models/user");
const data = require("../data.json");

const seedUser = async (req, res, next) => {
  try {
    await User.deleteMany({}); // deleting all existing users

    // inserting new users
    const users = await User.create(data);

    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  seedUser,
};


