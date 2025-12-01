const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, subCategory } = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }

        if (subCategory) {
            query.subCategory = subCategory;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
