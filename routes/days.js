const express = require('express');

const router = express.Router();

const Day = require('../models/day');

const moment = require('moment');

router.get('/', (req, res, next) => {
  Day.find()
    .sort('index')
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

module.exports = router;

router.get('/:id' , (req, res, next) => {});

router.post('/', (req, res, next) => {});

router.put('/:id', (req, res, next) => {});

router.delete('/:id', (req, res, next) => {});