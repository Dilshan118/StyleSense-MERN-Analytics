require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stylesense';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected to Inject Stock Risks...');

        // 1. Find 3 random products
        const products = await Product.find({}).limit(3);

        if (products.length === 0) {
            console.log('No products found.');
            process.exit(1);
        }

        // 2. Update them to be LOW stock and TRENDING
        for (const product of products) {
            product.stock = Math.floor(Math.random() * 5) + 1; // 1 to 5 items left
            product.isTrending = true; // High demand factor
            await product.save();
            console.log(`UPDATED: ${product.name} -> Stock: ${product.stock}, Trending: true`);
        }

        console.log('Successfully simulated stock risks.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });
