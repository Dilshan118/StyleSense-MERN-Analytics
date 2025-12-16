require('dotenv').config();
const mongoose = require('mongoose');
const DailySales = require('./models/DailySales');
const Order = require('./models/Order');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stylesense';

const ADDRESSES = [
    { address: '123 Galle Road', city: 'Colombo', postalCode: '00300', country: 'Sri Lanka' },
    { address: '45 Kandy Road', city: 'Kandy', postalCode: '20000', country: 'Sri Lanka' },
    { address: '88 Beach Side', city: 'Galle', postalCode: '80000', country: 'Sri Lanka' },
    { address: '10 Temple St', city: 'Negombo', postalCode: '11500', country: 'Sri Lanka' },
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected for Comprehensive Seeding...');

        // 1. Fetch Dependencies
        const products = await Product.find({});
        if (products.length === 0) {
            console.error('Error: No products found. Please seed products first.');
            process.exit(1);
        }

        let users = await User.find({});
        if (users.length === 0) {
            console.log('No users found. Creating a dummy user...');
            const dummyUser = await User.create({
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'password123'
            });
            users = [dummyUser];
        }

        // 2. Clear Existing Data
        await Order.deleteMany({});
        await DailySales.deleteMany({});
        console.log('Cleared existing Orders and DailySales.');

        const today = new Date();
        const salesData = [];
        const allOrders = [];

        // 3. Generate 30 Days of Data
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // Random number of orders per day (5 to 15), increasing slightly over time
            const baseOrders = 5 + Math.floor((29 - i) / 5);
            const numOrders = baseOrders + Math.floor(Math.random() * 5); // Add randomness

            let dayRevenue = 0;
            const subCategoryCounts = {};

            // Generate Orders for this Day
            for (let j = 0; j < numOrders; j++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const address = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];

                // Items in this order (1 to 4)
                const numItems = Math.floor(Math.random() * 4) + 1;
                const items = [];
                let orderTotal = 0;

                for (let k = 0; k < numItems; k++) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    const qty = Math.floor(Math.random() * 3) + 1; // 1-3 qty

                    items.push({
                        product: product._id,
                        quantity: qty,
                        size: product.sizes[0] || 'M',
                        color: product.colors[0] || 'Black',
                        price: product.price
                    });

                    orderTotal += product.price * qty;

                    // Track category for trend
                    const subCat = product.subCategory;
                    subCategoryCounts[subCat] = (subCategoryCounts[subCat] || 0) + qty;
                }

                // Create Order
                const orderDate = new Date(date);
                orderDate.setHours(Math.floor(Math.random() * 12) + 9, Math.floor(Math.random() * 60)); // 9 AM - 9 PM

                allOrders.push({
                    user: user._id,
                    items: items,
                    total: orderTotal,
                    status: Math.random() > 0.1 ? 'Delivered' : 'Cancelled', // Mostly delivered
                    date: orderDate,
                    shippingAddress: address
                });

                if (Math.random() > 0.1) { // Only count revenue if not cancelled (approx)
                    dayRevenue += orderTotal;
                }
            }

            // Determine Top SubCategory for DailySales
            let topSellingSubCategory = 'N/A';
            let maxCount = 0;
            for (const [subCat, count] of Object.entries(subCategoryCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    topSellingSubCategory = subCat;
                }
            }

            salesData.push({
                date: date,
                totalRevenue: dayRevenue,
                topSellingSubCategory: topSellingSubCategory
            });
        }

        // 4. Batch Insert
        await Order.insertMany(allOrders);
        await DailySales.insertMany(salesData);

        console.log(`Successfully seeded ${allOrders.length} Orders and ${salesData.length} DailySales.`);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error(err);
        mongoose.connection.close();
    });
