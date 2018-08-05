const express = require('express');

const router = express.Router();

const Trip = require('../models/trip');

const moment = require('moment');

// when you add in id validation
// const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Trip.find()
    .sort('startDate')
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { name, startDate } = req.body;
  const newTrip = { name, startDate };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!startDate) {
    const err = new Error('Missing `startDate` in request body');
    err.status = 400;
    return next(err);
  }

  if (!moment.isDate(new Date(startDate))) {
    const err = new Error('Invalid `startDate` in request body');
    err.status = 422;
    return next(err);
  }

  Trip.create(newTrip)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;