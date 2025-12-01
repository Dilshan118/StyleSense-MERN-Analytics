const DailySales = require('../models/DailySales');
const ss = require('simple-statistics');

exports.getPredictions = async (req, res) => {
    try {
        // 1. Fetch last 30 days of sales
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesData = await DailySales.find({
            date: { $gte: thirtyDaysAgo },
        }).sort({ date: 1 });

        if (salesData.length < 2) {
            return res.status(400).json({ message: 'Not enough data for prediction' });
        }

        // 2. Prepare data for Linear Regression
        // x = day index (0 to 29), y = revenue
        const dataPoints = salesData.map((day, index) => [index, day.totalRevenue]);

        const regressionLine = ss.linearRegression(dataPoints);
        const predict = ss.linearRegressionLine(regressionLine);

        // 3. Predict next 7 days
        const predictions = [];
        const lastDate = new Date(salesData[salesData.length - 1].date);

        for (let i = 1; i <= 7; i++) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + i);

            // Predict using the next index
            const predictedRevenue = predict(salesData.length - 1 + i);

            predictions.push({
                date: nextDate,
                predictedRevenue: Math.max(0, Math.round(predictedRevenue)), // Ensure no negative revenue
            });
        }

        // 4. Trend Alert: Most frequent topSellingSubCategory in last 7 days of ACTUAL data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSales = await DailySales.find({
            date: { $gte: sevenDaysAgo },
        });

        const subCategoryCounts = {};
        recentSales.forEach(sale => {
            if (sale.topSellingSubCategory) {
                subCategoryCounts[sale.topSellingSubCategory] = (subCategoryCounts[sale.topSellingSubCategory] || 0) + 1;
            }
        });

        let trendAlert = 'N/A';
        let maxCount = 0;

        for (const [subCat, count] of Object.entries(subCategoryCounts)) {
            if (count > maxCount) {
                maxCount = count;
                trendAlert = subCat;
            }
        }

        res.json({
            predictions,
            trendAlert,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
