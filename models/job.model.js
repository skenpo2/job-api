const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
    },

    company: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    creatorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const jobModel = mongoose.model('job', jobSchema);

module.exports = jobModel;
