const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPassword = await bcrypt.compare(password, foundUser.password);

  if (!isPassword) {
    return res.status(403).json('Unauthorized');
  }

  const accessToken = jwt.sign(
    {
      userDetails: {
        id: foundUser._id,
        isAdmin: foundUser.isAdmin,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: '30s' }
  );

  const refreshToken = jwt.sign(
    {
      id: foundUser._id,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: '1h' }
  );
  res.status(200).json(accessToken);
  res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None' });
};

// get refresh token

const refresh = async (req, res) => {
  res.json({ message: 'okay' });
};

// logout

const logout = async (req, res) => {
  res.json({ message: 'okay' });
};

module.exports = { login, refresh, logout };
