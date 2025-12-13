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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        console.log(`[ProductId: ${req.params.id}] Deleting product...`);
        const product = await Product.findByIdAndDelete(req.params.id);

        if (product) {
            console.log(`[ProductId: ${req.params.id}] Product deleted successfully.`);
            res.json({ message: 'Product removed' });
        } else {
            console.log(`[ProductId: ${req.params.id}] Product not found.`);
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(`[ProductId: ${req.params.id}] Error deleting product:`, error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const { name, price, category, subCategory, description, sizes, colors, stock, isTrending } = req.body;

        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        const product = new Product({
            name,
            price: Number(price),
            category,
            subCategory,
            description,
            image: imagePath,
            sizes: sizes ? sizes.split(',') : [],
            colors: colors ? colors.split(',') : [],
            stock: Number(stock),
            isTrending: isTrending === 'true',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, category, subCategory, description, sizes, colors, stock, isTrending } = req.body;
        console.log(`[ProductId: ${req.params.id}] Update Request Body:`, req.body); // Debug log

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.category = category || product.category;
            product.subCategory = subCategory || product.subCategory;
            product.description = description || product.description;
            product.stock = stock || product.stock;
            product.isTrending = isTrending === 'true' ? true : false;

            if (sizes) product.sizes = sizes.split(',');
            if (colors) product.colors = colors.split(',');

            if (req.file) {
                product.image = `/uploads/${req.file.filename}`;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
