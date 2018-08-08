const express = require('express');

const router = express.Router();

const Day = require('../models/day');

const moment = require('moment');

const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
  Day.find()
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

router.get('/:id' , (req, res, next) => {
  const {id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  
  Day.findOne({_id: id})
    .populate('plans')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { content, plans = [] } = req.body;

  const newDay = { content, plans };
  
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

router.put('/:id', (req, res, next) => {});

router.delete('/:id', (req, res, next) => {});

module.exports = router;
