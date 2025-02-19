require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model'); // Adjust the path if needed
const Job = require('./models/job.model'); // Adjust the path if needed

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to generate random users
const generateUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('password123', 10), // Hash passwords
      isAdmin: faker.datatype.boolean(),
    });
  }
  return users;
};

// Function to generate random jobs
const generateJobs = async (users, count) => {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    const creator = faker.helpers.arrayElement(users); // Pick a random existing user

    jobs.push({
      title: faker.person.jobTitle(),
      description: faker.lorem.paragraph(),
      location: faker.location.city(),
      salary: `$${faker.number.int({ min: 30000, max: 150000 })}/year`,
      company: faker.company.name(),
      image: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
      verified: faker.datatype.boolean(),
      creatorID: creator._id, // Assign the job to an existing user
      applicants: [],
      skills: faker.helpers.arrayElements(
        [
          'JavaScript',
          'Python',
          'React',
          'Node.js',
          'MongoDB',
          'TypeScript',
          'GraphQL',
        ],
        3
      ),
    });
  }
  return jobs;
};

// Seed function
const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();
    console.log('Existing data removed...');

    // Create Users
    const users = await User.insertMany(await generateUsers(5)); // Create 5 users
    console.log('Users seeded!');

    // Create Jobs
    const jobs = await Job.insertMany(await generateJobs(users, 10)); // Create 10 jobs
    console.log(' Jobs seeded!');

    // Assign applicants to jobs
    for (let job of jobs) {
      const numApplicants = faker.number.int({ min: 1, max: 3 }); // 1-3 applicants per job
      job.applicants = faker.helpers.arrayElements(
        users.map((user) => user._id),
        numApplicants
      );

      // Also update users' `jobApplied`
      for (let applicantID of job.applicants) {
        await User.findByIdAndUpdate(applicantID, {
          $push: { jobApplied: job._id },
        });
      }

      await job.save();
    }

    console.log('Job applicants assigned!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
