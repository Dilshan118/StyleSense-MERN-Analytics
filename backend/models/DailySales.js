const mongoose = require('mongoose');

const dailySalesSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    totalRevenue: {
        type: Number,
        required: true,
    },
    topSellingSubCategory: {
        type: String,
    },
});

module.exports = mongoose.model('DailySales', dailySalesSchema);
