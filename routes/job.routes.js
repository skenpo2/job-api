const express = require('express');
const routes = express.Router();
const createJob = require('../controllers/job.controllers');

routes.get('/jobs');
routes.get('/job/:id');
routes.post('/job');
routes.put('/job/:id');
routes.delete('/job/:id');

module.exports = routes;
