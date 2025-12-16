const express = require('express');
const router = express.Router();
const { getPredictions, getDashboardStats } = require('../controllers/analyticsController');

router.get('/predict', getPredictions);
router.get('/stats', getDashboardStats);

module.exports = router;
