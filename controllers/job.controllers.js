const jobModel = require('../models/job.model');
const userModel = require('../models/user.model');

const dateFn = require('../config/dateUtil');

// create a job post
// access is for authenticated user only
const createJob = async (req, res) => {
  const { title, description, location, salary, company, image, verified } =
    req.body;
  const id = req.id;

  if (!id) {
    return res
      .status(400)
      .json({ message: ' userID required, kindly Authenticate' });
  }

  const canSave = [title, description, location, company].every(Boolean);

  if (!canSave) {
    return res
      .status(400)
      .json({ message: 'Please provide all required fields' });
  }

  const job = new jobModel({
    title,
    description,
    location,
    salary,
    company,
    image,
    creatorID: id,
  });

  await job.save();

  res.status(201).json(job);
};

// get all verified
// access is public

const getVerifiedJobs = async (req, res) => {
  const jobs = await jobModel
    .find()
    .lean()
    .select('title salary createdAt skills company image _id verified');

  const verifiedJobs = jobs.filter((job) => job.verified === true);
  const jobWithDate = verifiedJobs.map((job) => {
    job.createdAt = dateFn(job.createdAt);
  });

  res.status(200).json({ verifiedJobs });
};

// get all jobs
// access is private
// for admin user only
const getAllJobs = async (req, res) => {
  const jobs = await jobModel.find().lean();

  res.status(200).json(jobs);
};

// get single verified job
// access is public
const getSingleVerifiedJob = async (req, res) => {
  const jobID = req.params.id;

  const job = await jobModel.findById({ _id: jobID }).lean();

  if (!job) {
    return res.status(404).json({ message: 'job not found' });
  }

  if (job.verified === false) {
    return res.status(401).json({ message: ' Not allowed' });
  }
  res.status(200).json(job);
};

const getSingleJob = async (req, res) => {
  const jobID = req.params.id;

  const job = await jobModel.findById({ _id: jobID }).lean();

  if (!job) {
    return res.status(404).json({ message: 'job not found' });
  }
  res.status(200).json(job);
};

const updateJob = async (req, res) => {
  const { title, description, location, salary, company, image, verified } =
    req.body;
  const id = req.id;

  const jobID = req.params.id;

  const job = await jobModel.findById({ _id: jobID }).lean();
  const user = await userModel.findById({ _id: id }).lean();

  if (!job) {
    return res.status(404).json({ message: 'job not found' });
  }

  if (user.isAdmin) {
    const updatedJob = await jobModel.findByIdAndUpdate(
      jobID,
      {
        title,
        description,
        location,
        salary,
        company,
        image,
        verified,
      },
      { new: true }
    );
    return res.status(201).json(updatedJob);
  }
  const updatedJob = await jobModel.findByIdAndUpdate(
    jobID,
    {
      title,
      description,
      location,
      salary,
      company,
      image,
    },
    { new: true }
  );
  return res.status(201).json(updatedJob);
};

const applyJob = async (req, res) => {
  const id = req.id; // Extract user ID from JWT
  const jobID = req.params.id; // Extract job ID from request params

  // Update job and user in parallel
  const [updatedJob, updatedUser] = await Promise.all([
    jobModel.findByIdAndUpdate(
      jobID,
      { $addToSet: { applicants: id } }, // Prevents duplicate applications
      { new: true }
    ),
    userModel.findByIdAndUpdate(
      id,
      { $addToSet: { jobApplied: jobID } },
      { new: true } // Return only necessary fields
    ),
  ]);

  // Handle errors
  if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
  if (!updatedUser)
    return res.status(403).json({ message: 'User not found, cannot apply' });

  // Send response
  res.status(201).json({ job: updatedJob, user: updatedUser });
};

module.exports = {
  createJob,
  getVerifiedJobs,
  getAllJobs,
  getSingleVerifiedJob,
  getSingleJob,
  updateJob,
  applyJob,
};
