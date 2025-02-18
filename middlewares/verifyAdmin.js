const userModel = require('../models/user.model');

const verifyAdmin = async (req, res, next) => {
  const id = req.id;

  const isAllowed = await userModel.findById({ _id: id }).lean();

  if (isAllowed.isAdmin == false) {
    return res.status(403).json({ message: ' Not allowed' });
  }
  next();
};

module.exports = verifyAdmin;
