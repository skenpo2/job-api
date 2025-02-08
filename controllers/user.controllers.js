const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(401).json({ message: 'Please provide your details' });
  }

  try {
    // checking if the email provided exist already in the database
    const isRegisteredUser = await userModel.findOne({ email });

    if (isRegisteredUser) {
      return res.status(409).json({ message: 'Email Already in Use' });
    }

    // hashing user password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // creating a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // saving the user data to database
    await newUser.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { createUser };
