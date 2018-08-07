const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');

const {app} = require('../index');
const Trip = require('../models/trip');
const Day = require('../models/day');
const {TEST_DATABASE_URL} = require('../config');

const seedTrips = require('../db/seed/trip');
const seedDays = require('../db/seed/day');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Trip App API - Trips', function () {
  before(function() {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return Promise.all([
      Day.insertMany(seedDays),
      Trip.insertMany(seedTrips)
    ]);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('GET /api/trip', function() {
    it('should return the correct number of Trips', function() {
      return Promise.all([
        Trip.find(),
        chai.request(app)
          .get('/api/trip')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });
});