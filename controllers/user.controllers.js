const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  const users = await userModel.find().select('-password').lean();

  if (!users?.length) {
    return res.status(404).json({ message: 'No user available' });
  }

  res.status(200).json({ users });
};

const getSingleUser = async (req, res) => {
  const userID = req.params.id;

  const isUser = await userModel
    .findOne({ _id: userID })
    .select('-password')
    .lean();

  if (!isUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(isUser);
};

const createUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(401).json({ message: 'Please provide your details' });
  }
  // checking if the email provided exist already in the database
  const isRegisteredUser = await userModel
    .findOne({ email })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

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
};

const updateUser = async (req, res) => {
  const id = req.id;

  const { password, email, name, isAdmin } = req.body;

  const isUser = await userModel.findById({ _id: id }).lean();

  if (!isUser) {
    return res.status(404).json({ message: ' User does not exist' });
  }
  const updatedUser = { password, email, name, isAdmin };
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    updatedUser.password = hashedPassword;
  }

  const duplicate = await userModel
    .findOne({ email: updatedUser.email })
    .lean();

  if (duplicate) {
    return res.status(409).json({ message: 'Email already in Use' });
  }

  const newData = await userModel
    .findOneAndUpdate({ _id: id }, updatedUser, {
      new: true,
    })
    .select('-password');
  res.status(201).json(newData);
};

const deleteUser = async (req, res) => {
  const { email } = req.body;

  console.log({ email });

  if (!email) {
    return res.status(401).json({ message: 'User ID required' });
  }

  const isUser = await userModel.findOne({ email });

  if (!isUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // later to check if to be deleted user has job applied or posted

  const result = await isUser.deleteOne();
  res.status(201).json({ message: `${result.name} deleted successfully` });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
