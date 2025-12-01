const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Men', 'Women'],
        required: true,
    },
    subCategory: {
        type: String,
        enum: ['T-Shirts', 'Jeans', 'Jackets', 'Dresses'],
        required: true,
    },
    sizes: [{
        type: String,
    }],
    colors: [{
        type: String,
    }],
    image: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    isTrending: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Product', productSchema);
