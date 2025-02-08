const express = require('express');
const routes = express.Router();

routes.get('/jobs');
routes.get('/job/:id');
routes.post('/job/:id');
routes.put('/job/:id');
routes.delete('/job/:id');

module.exports = jobRoutes;
