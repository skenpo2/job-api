const jobModel = require('../models/job.model');
const userModel = require('../models/user.model');

// create a job post
// access is for authenticated user only
const createJob = async (req, res) => {
  const { title, description, location, salary, company, image, verified } =
    req.body;
  const id = req.id;

  if (!id) {
    return res
      .status(400)
      .json({ message: ' userID required, kindle Authenticate' });
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
  const jobs = await jobModel.find().lean();

  const verifiedJobs = jobs.filter((job) => job.verified === true);

  console.log(verifiedJobs);
  res.status(200).json(verifiedJobs);
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
module.exports = {
  createJob,
  getVerifiedJobs,
  getAllJobs,
  getSingleVerifiedJob,
  getSingleJob,
  updateJob,
};
