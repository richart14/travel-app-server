const express = require('express');
const passport = require('passport');

const router = express.Router();

const Day = require('../models/day');
const Plan = require('../models/plan');
const Trip = require('../models/trip');

const mongoose = require('mongoose');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/', (req, res, next) => {
  const userId = req.user.id;
  Day.find({userId})
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.get('/:id' , (req, res, next) => {
  const {id} = req.params;
  const userId = req.user.id;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Day.findOne({_id: id, userId})
    .populate('plans')
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
  const { content, plans = [] } = req.body;
  const userId = req.user.id;

  const newDay = { content, plans, userId };
  
  Day.create(newDay)
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
  const { content, plans = [] } = req.body;
  const {id} = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  const updateDay = {content, plans};

  Day.findOneAndUpdate({_id:id, userId}, updateDay, { new: true })
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

  const tripUpdatePromise = Trip.updateMany(
    { days: id, },
    { $pull: { days: id } }
  );

  const dayDeletePromise = Day.deleteOne({_id:id, userId});

  Day.findOne({_id:id})
    .then(day => day.plans)
    .then(planArray => 
      Promise.all([
        dayDeletePromise,
        tripUpdatePromise,
        Plan.deleteMany({_id:{$in:planArray}})
      ])
    )
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => next(err));

});

module.exports = router;
