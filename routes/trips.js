const express = require('express');
const passport = require('passport');

const router = express.Router();

const Trip = require('../models/trip');
const Day = require('../models/day');
const Plan = require('../models/plan');

const moment = require('moment');

const mongoose = require('mongoose');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Trip.find({userId})
    .sort({updatedAt: -1})
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  
  const {id} = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Trip.findOne({_id: id, userId})
    .populate('days')
    // .populate({
    //   path: 'days',
    //   populate: {  path: 'plans'  }
    // }) 
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
  const { destination, name, startDate, description, isTravler, days } = req.body;
  const userId = req.user.id;
  const newTrip = { destination, name, startDate, description, isTravler, days, userId };


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
  const userId = req.user.id;
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

  Trip.findOneAndUpdate({_id:id, userId}, updateTrip, { new: true })
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
  const userId = req.user.id;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const tripDeletePromise = Trip.deleteOne({_id:id, userId});


  let dayArray;
  let planArray=[];
  Trip.findOne({_id:id, userId})
    .then((trip) => {
      dayArray = trip.days;
      return dayArray;
    })
    .then(days => {
      return Day.find({_id:{$in:days}});
    })
    .then(days => {
      days.map(days => days.plans).forEach(id => {
        planArray = planArray.concat(id);
      });
      return planArray;
    })
    .then(() => (
      Promise.all([
        Day.deleteMany({_id:{$in:dayArray}}),
        Plan.deleteMany({_id:{$in:planArray}}),
        tripDeletePromise
      ])
    ))
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => next(err));

});

module.exports = router;