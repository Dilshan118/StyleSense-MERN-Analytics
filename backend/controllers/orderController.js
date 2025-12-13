const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        console.log('Creating order with body:', req.body); // LOG
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = new Order({
            user: req.user.id, // From auth middleware
            items,
            total,
        });

        const createdOrder = await order.save();
        console.log('Order created successfully:', createdOrder._id); // LOG
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error); // LOG
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        console.log('Fetching all orders...'); // LOG
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 }); // Newest first
        console.log(`Found ${orders.length} orders`); // LOG

        // Filter out orders with null users (deleted users) just in case
        const validOrders = orders.filter(order => order.user !== null);

        res.json(validOrders);
    } catch (error) {
        console.error('Error fetching orders:', error); // LOG
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            order.isDelivered = status === 'Delivered';
            if (status === 'Delivered') {
                order.deliveredAt = Date.now();
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
