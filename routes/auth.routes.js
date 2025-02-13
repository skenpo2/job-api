const express = require('express');

const authController = require('../controllers/auth.controllers');

const routes = express.Router();

routes.post('/login', authController.login);
routes.get('/refresh', authController.refresh);
routes.post('/logout', authController.logout);

module.exports = routes;
