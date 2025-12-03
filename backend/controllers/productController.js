const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, subCategory, minPrice, maxPrice, sort } = req.query;
        const query = {};

        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        if (subCategory) {
            query.subCategory = { $regex: new RegExp(subCategory, 'i') };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (req.query.sizes) {
            const sizes = req.query.sizes.split(',');
            query.sizes = { $in: sizes };
        }

        if (req.query.colors) {
            const colors = req.query.colors.split(',');
            query.colors = { $in: colors };
        }

        let productsQuery = Product.find(query);

        if (sort) {
            if (sort === 'price_asc') {
                productsQuery = productsQuery.sort({ price: 1 });
            } else if (sort === 'price_desc') {
                productsQuery = productsQuery.sort({ price: -1 });
            } else if (sort === 'newest') {
                productsQuery = productsQuery.sort({ createdAt: -1 });
            }
        } else {
            // Default sort by newest
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
