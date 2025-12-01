const express = require('express');
const router = express.Router();
const { getPredictions } = require('../controllers/analyticsController');

router.get('/predict', getPredictions);

module.exports = router;
