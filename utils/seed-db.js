const mongoose = require('mongoose');
const {DATABASE_URL} = require('../config');

const Trip = require('../models/trip');
const Day = require('../models/day');
const Plan = require('../models/plan');
const User = require('../models/user');

const seedTrip = require('../db/seed/trip');
const seedDay = require('../db/seed/day');
const seedPlan = require('../db/seed/plan');
const seedUser = require('../db/seed/user');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      
      Trip.insertMany(seedTrip),

      Day.insertMany(seedDay),

      Plan.insertMany(seedPlan),

      User.insertMany(seedUser),

    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
