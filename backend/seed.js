require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Product = require('./models/Product');
const DailySales = require('./models/DailySales');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stylesense')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const generateClothingName = (category, subCategory) => {
    const adjectives = ['Slim Fit', 'Oversized', 'Vintage', 'Cotton', 'Denim', 'Summer', 'Winter', 'Classic', 'Urban', 'Chic', 'Casual', 'Formal', 'Sporty', 'Elegant', 'Cozy'];
    const materials = ['Cotton', 'Leather', 'Silk', 'Wool', 'Linen', 'Polyester', 'Velvet', 'Satin'];

    const adj = faker.helpers.arrayElement(adjectives);
    // Avoid duplicating material if adjective is material
    let mat = faker.helpers.arrayElement(materials);
    if (adj === mat) mat = '';

    return `${adj} ${mat} ${subCategory}`.replace(/\s+/g, ' ').trim();
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await DailySales.deleteMany({});
        await Order.deleteMany({});

        console.log('Data Cleared');

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@stylesense.com',
                password: hashedPassword,
                role: 'admin',
            },
            {
                name: 'John Doe',
                email: 'customer@stylesense.com',
                password: hashedPassword,
                role: 'customer',
            },
        ]);

        console.log('Users Created');

        // 2. Create Products
        const products = [];
        const categories = ['Men', 'Women'];
        const subCategories = ['T-Shirts', 'Jeans', 'Jackets', 'Dresses'];
        const sizes = ['XS', 'S', 'M', 'L', 'XL'];
        const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink'];

        for (let i = 0; i < 50; i++) {
            const category = faker.helpers.arrayElement(categories);
            // Filter subcategories slightly based on category for realism (optional but nice)
            let possibleSubCats = subCategories;
            if (category === 'Men' && subCategories.includes('Dresses')) {
                possibleSubCats = subCategories.filter(s => s !== 'Dresses');
            }
            const subCategory = faker.helpers.arrayElement(possibleSubCats);

            products.push({
                name: generateClothingName(category, subCategory),
                price: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
                category,
                subCategory,
                sizes: faker.helpers.arrayElements(sizes, { min: 3, max: 5 }),
                colors: faker.helpers.arrayElements(colors, { min: 2, max: 5 }),
                image: faker.image.urlLoremFlickr({ category: 'fashion' }),
                stock: faker.number.int({ min: 10, max: 100 }),
                isTrending: faker.datatype.boolean(),
            });
        }

        await Product.insertMany(products);
        console.log('50 Products Created');

        // 3. Create Daily Sales (Last 365 Days)
        const dailySales = [];
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Seasonal Trend: Sales higher in recent days (last 30 days) or specific months
            // Let's simulate a simple trend where sales are higher in the last 30 days (Winter/Holiday season simulation)
            let baseRevenue = faker.number.int({ min: 1000, max: 5000 });

            if (i < 30) {
                baseRevenue += faker.number.int({ min: 2000, max: 5000 }); // Boost for recent month
            }

            dailySales.push({
                date: date,
                totalRevenue: baseRevenue,
                topSellingSubCategory: faker.helpers.arrayElement(subCategories),
            });
        }

        await DailySales.insertMany(dailySales);
        console.log('365 Daily Sales Records Created');

        console.log('Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Error Seeding Data:', error);
        process.exit(1);
    }
};

seedData();
