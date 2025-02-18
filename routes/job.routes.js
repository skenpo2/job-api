const express = require('express');
const routes = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAdmin = require('../middlewares/verifyAdmin');
const {
  createJob,
  getVerifiedJobs,
  getAllJobs,
  getSingleVerifiedJob,
  getSingleJob,
} = require('../controllers/job.controllers');

routes.get('/jobs/verified', getVerifiedJobs);
routes.get('/job/verified/:id', getSingleVerifiedJob);
routes.get('/jobs', verifyJWT, verifyAdmin, getAllJobs);
routes.get('/job/:id', verifyJWT, verifyAdmin, getSingleJob);
routes.get('/job/:id');
routes.post('/job', verifyJWT, createJob);
routes.put('/job/:id');
routes.delete('/job/:id');

module.exports = routes;
