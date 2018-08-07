const mongoose = require('mongoose');
const {DATABASE_URL} = require('../config');

const Trip = require('../models/trip');
const Day = require('../models/day');

const seedTrip = require('../db/seed/trip');
const seedDay = require('../db/seed/day');

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

      Day.insertMany(seedDay)

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
