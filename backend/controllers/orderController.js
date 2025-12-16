const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { items, total, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Verify stock before creating order
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
        }

        // Deduct stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user._id, // From auth middleware
            items,
            total,
            shippingAddress,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .populate('items.product', 'name image price')
            .sort({ createdAt: -1 }); // Newest first

        // Filter out orders with null users (deleted users) just in case
        const validOrders = orders.filter(order => order.user !== null);

        res.json(validOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, cancellationReason } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            order.isDelivered = status === 'Delivered';
            if (status === 'Delivered') {
                order.deliveredAt = Date.now();
            }
            if (status === 'Cancelled' && cancellationReason) {
                order.cancellationReason = cancellationReason;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name image price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching my orders:', error);
        res.status(500).json({ message: error.message });
    }
};
