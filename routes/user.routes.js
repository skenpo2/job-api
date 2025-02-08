const express = require('express');
const routes = express.Router();

const { createUser } = require('../controllers/user.controllers');

routes.post('/register', createUser);
routes.post('/login');
routes.get('/users');
routes.get('/user/:id');
routes.post('/user/:id');
routes.put('/user/:id');
routes.delete('/user/:id');

module.exports = routes;
