const express = require('express');
const routes = express.Router();

routes.post('/register');
routes.post('/login');
routes.get('/users');
routes.get('/user/:id');
routes.post('/user/:id');
routes.put('/user/:id');
routes.delete('/user/:id');

module.exports = userRoutes;
