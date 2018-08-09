const express = require('express');
const passport = require('passport');

const router = express.Router();

const Plan = require('../models/plan');
const Day = require('../models/day');

const mongoose = require('mongoose');

const moment = require('moment');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Plan.find({userId})
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
  
  Plan.findOne({_id: id, userId})
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { type, description, location, locationName, address, endAddress, checkIn, checkOut, notes, confirmation } = req.body;
  const userId = req.user.id;

  if (!type) {
    const err = new Error('Missing `type` in request body');
    err.status = 400;
    return next(err);
  }

  if (!checkIn) {
    const err = new Error('Missing `checkIn` in request body');
    err.status = 400;
    return next(err);
  }

  if (!moment.isDate(new Date(checkIn))) {
    const err = new Error('Invalid `checkIn` in request body');
    err.status = 422;
    return next(err);
  }

  if (!moment.isDate(new Date(checkOut))) {
    const err = new Error('Invalid `checkOut` in request body');
    err.status = 422;
    return next(err);
  }
  
  const newPlan = { type, description, location, locationName, address, endAddress, checkIn, checkOut, notes, confirmation, userId };
  
  Plan.create(newPlan)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { type, description, location, locationName, address, endAddress, checkIn, checkOut, notes, confirmation } = req.body;
  const {id} = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!type) {
    const err = new Error('Missing `type` in request body');
    err.status = 400;
    return next(err);
  }

  if (!checkIn) {
    const err = new Error('Missing `checkIn` in request body');
    err.status = 400;
    return next(err);
  }

  if (!moment.isDate(new Date(checkIn))) {
    const err = new Error('Invalid `checkIn` in request body');
    err.status = 422;
    return next(err);
  }

  if (!moment.isDate(new Date(checkOut))) {
    const err = new Error('Invalid `checkOut` in request body');
    err.status = 422;
    return next(err);
  }

  const updatePlan = { type, description, location, locationName, address, endAddress, checkIn, checkOut, notes, confirmation };

  Plan.findOneAndUpdate({_id:id, userId}, updatePlan, { new: true })
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
  const {id} = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const dayUpdatePromise = Day.updateMany(
    { plans: id, },
    { $pull: { plans: id } }
  );

  const deletePlanPromise = Plan.deleteOne({_id:id, userId});

  Promise.all([dayUpdatePromise, deletePlanPromise])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;