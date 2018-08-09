const express = require('express');

const router = express.Router();

const Plan = require('../models/plan');
const Day = require('../models/day');

const mongoose = require('mongoose');

const moment = require('moment');

router.get('/', (req, res, next) => {
  Plan.find()
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
  
  Plan.findOne({_id: id})
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
  
  const newPlan = { type, description, location, locationName, address, endAddress, checkIn, checkOut, notes, confirmation };
  
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

  Plan.findOneAndUpdate({_id:id}, updatePlan, { new: true })
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const dayUpdatePromise = Day.updateMany(
    { plans: id, },
    { $pull: { plans: id } }
  );

  const deletePlanPromise = Plan.deleteOne({_id:id});

  Promise.all([dayUpdatePromise, deletePlanPromise])
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;