// Example in controllers/adminController.js
const Product = require('../models/product');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  // You can add ordersCount and messagesCount later
  res.render('admin-dashboard', {
    products,
    users,
    stats: {
      products: productsCount,
      users: usersCount
      // orders: ordersCount,
      // messages: messagesCount
    }
  });
};