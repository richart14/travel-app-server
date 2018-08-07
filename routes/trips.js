const express = require('express');

const router = express.Router();

const Trip = require('../models/trip');
const Day = require('../models/day');

const moment = require('moment');

const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Trip.find()
    .sort({updatedAt: -1})
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Trip.findOne({_id: id})
    .populate('days')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const { destination, name, startDate, description, isTravler } = req.body;
  const newTrip = { destination, name, startDate, description, isTravler };

  if (!destination) {
    const err = new Error('Missing `destination` in request body');
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

router.put('/:id', (req, res, next) => {
  const { destination, name, startDate, description, isTraveler } = req.body;
  const { id } = req.params;

  if (!destination) {
    const err = new Error('Missing `destination` in request body');
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

  const updateTrip = { destination, name, startDate, description, isTraveler };

  Trip.findOneAndUpdate({_id:id}, updateTrip, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));

});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const dayDeletePromise = Day.deleteMany({tripId: id});
  const tripDeletePromise = Trip.deleteOne({_id:id});
  
  Promise.all([tripDeletePromise, dayDeletePromise])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => next(err));

});

module.exports = router;