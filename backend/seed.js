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
        // 2. Create Products
        const subCategories = ['T-Shirts', 'Jeans', 'Jackets', 'Dresses'];
        const products = [
            // MEN
            {
                name: "Classic White Crew Neck",
                description: "A timeless staple for every wardrobe. This premium cotton t-shirt offers breathable comfort and a perfect fit for any occasion.",
                price: 29.99,
                category: "Men",
                subCategory: "T-Shirts",
                sizes: ["S", "M", "L", "XL"],
                colors: ["White", "Black", "Grey"],
                image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
                stock: 50,
                isTrending: true
            },
            {
                name: "Slim Fit Denim Jeans",
                description: "Crafted from durable denim with a hint of stretch, these jeans provide a modern silhouette without compromising on comfort.",
                price: 89.99,
                category: "Men",
                subCategory: "Jeans",
                sizes: ["30", "32", "34", "36"],
                colors: ["Blue", "Black"],
                image: "https://images.unsplash.com/photo-1542272454315-4c01d7465196?auto=format&fit=crop&w=800&q=80",
                stock: 40,
                isTrending: false
            },
            {
                name: "Urban Bomber Jacket",
                description: "Elevate your street style with this sleek bomber jacket. Features a lightweight design perfect for layering in transitional weather.",
                price: 120.00,
                category: "Men",
                subCategory: "Jackets",
                sizes: ["M", "L", "XL"],
                colors: ["Black", "Olive"],
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
                stock: 25,
                isTrending: true
            },
            {
                name: "Heavyweight Cotton Hoodie",
                description: "Experience ultimate coziness with our heavyweight hoodie. Soft fleece lining and a relaxed fit make it your go-to for chilly days.",
                price: 65.00,
                category: "Men",
                subCategory: "Jackets", // Using Jackets category for hoodies for now
                sizes: ["S", "M", "L", "XL"],
                colors: ["Grey", "Navy"],
                image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80",
                stock: 60,
                isTrending: false
            },

            // WOMEN
            {
                name: "Floral Summer Dress",
                description: "Embrace the season with this airy floral dress. Designed with a flattering waistline and flowing fabric for effortless elegance.",
                price: 55.00,
                category: "Women",
                subCategory: "Dresses",
                sizes: ["XS", "S", "M", "L"],
                colors: ["Red", "Blue"],
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
                stock: 35,
                isTrending: true
            },
            {
                name: "High-Waist Skinny Jeans",
                description: "Sculpt your figure with our high-waist skinny jeans. Super-stretch fabric ensures a perfect fit that moves with you all day.",
                price: 75.00,
                category: "Women",
                subCategory: "Jeans",
                sizes: ["26", "28", "30", "32"],
                colors: ["Blue", "Black"],
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
                stock: 45,
                isTrending: false
            },
            {
                name: "Chic Leather Biker Jacket",
                description: "Add an edge to your outfit with this classic leather biker jacket. Features silver hardware and a tailored fit.",
                price: 150.00,
                category: "Women",
                subCategory: "Jackets",
                sizes: ["S", "M", "L"],
                colors: ["Black"],
                image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=800&q=80",
                stock: 20,
                isTrending: true
            },
            {
                name: "Essential V-Neck Tee",
                description: "A wardrobe must-have. This soft V-neck tee drapes beautifully and pairs perfectly with jeans or skirts.",
                price: 25.00,
                category: "Women",
                subCategory: "T-Shirts",
                sizes: ["XS", "S", "M", "L"],
                colors: ["White", "Pink", "Black"],
                image: "https://images.unsplash.com/photo-1529139574466-a302d20525a9?auto=format&fit=crop&w=800&q=80",
                stock: 80,
                isTrending: false
            },

            // KIDS
            {
                name: "Kids' Graphic T-Shirt",
                description: "Fun and playful graphic tee for everyday adventures. Made from soft, durable cotton that stands up to play.",
                price: 18.00,
                category: "Kids",
                subCategory: "T-Shirts",
                sizes: ["4Y", "6Y", "8Y", "10Y"],
                colors: ["Yellow", "Blue"],
                image: "https://images.unsplash.com/photo-1519238263496-6361937a42d8?auto=format&fit=crop&w=800&q=80",
                stock: 60,
                isTrending: false
            },
            {
                name: "Kids' Denim Overalls",
                description: "Classic denim overalls for a cute and practical look. Adjustable straps ensure they grow with your child.",
                price: 35.00,
                category: "Kids",
                subCategory: "Jeans",
                sizes: ["4Y", "6Y", "8Y"],
                colors: ["Blue"],
                image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",
                stock: 30,
                isTrending: true
            }
        ];

        await Product.insertMany(products);
        console.log(`${products.length} Curated Products Created`);

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
