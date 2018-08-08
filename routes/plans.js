const express = require('express');

const router = express.Router();

const Plan = require('../models/plan');

router.get('/', (req, res, next) => {
  Plan.find()
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const {id} = req.params;
  
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

module.exports = router;