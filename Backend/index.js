const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// Routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');
const aiRoutes = require('./src/ai/ai.route')

app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);


// DB + Server
async function main() {
  await mongoose.connect(process.env.DB_URL);

  console.log('Connected to MongoDB');

  app.get('/', (req, res) => {
    res.send('Book server is running');
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch(err => console.log(err));