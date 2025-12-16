require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Make uploads folder static (Served before rate limits)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Set security headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));

// Rate limiting (Only for API routes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit to 1000
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stylesense')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
    res.send('StyleSense API is running');
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
