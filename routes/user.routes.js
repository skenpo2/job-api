const express = require('express');
const routes = express.Router();

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');

routes.post('/register', createUser);
routes.get('/api/users', getAllUsers);
routes.get('/api/user/:id', getSingleUser);
routes.patch('/api/user/', updateUser);
routes.delete('/api/user/', deleteUser);

module.exports = routes;
