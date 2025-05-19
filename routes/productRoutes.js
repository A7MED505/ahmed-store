const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');        // see note below
const productC= require('../controllers/productController');
const Product = require('../models/product');

router.get('/products', productC.getAllProducts);
router.get('/add-product',   auth.isAuthenticated, auth.isAdmin,  productC.getAddProduct);
router.post('/add-product',  auth.isAuthenticated, auth.isAdmin,  productC.upload.single('image'), productC.postAddProduct);

router.get('/admin',           auth.isAuthenticated, auth.isAdmin, productC.getAdminDashboard);

router.get('/admin/edit-product/:id', auth.isAuthenticated, auth.isAdmin, productC.getEditProduct);
router.post('/admin/edit-product/:id', auth.isAuthenticated, auth.isAdmin, productC.upload.single('image'), productC.postEditProduct);

router.get('/admin/delete-product/:id', auth.isAuthenticated, auth.isAdmin, productC.deleteProduct);

// Add product to cart
router.post('/cart/add/:id', (req, res) => {
  const productId = req.params.id;
  if (!req.session.cart) req.session.cart = [];
  req.session.cart.push(productId);
  res.redirect('/cart');
});

// View cart
router.get('/cart', async (req, res) => {
  const cart = req.session.cart || [];
  // Fetch products from the database based on the IDs in the cart
  const products = await Product.find({ _id: { $in: cart } });
  res.render('cart', { cart, products });
});

router.get('/checkout', (req, res) => {
  res.render('checkout', { cart: req.session.cart || [] });
});

module.exports = router;

// Example: /products, /add-product, /admin, etc.
