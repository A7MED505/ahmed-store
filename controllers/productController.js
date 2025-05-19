const path = require('path');
const multer = require('multer');
const Product = require('../models/product');

// Multer setup (drop uploaded files into public/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
exports.upload = multer({ storage });

exports.getHomePage = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.render('home', { products });
  } catch (err) {
    console.error(err);
    res.render('home', { products: [] });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    
    const productSearch = req.query.productSearch || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

    let productQuery = {};
    if (productSearch) {
      productQuery.$or = [
        { name: { $regex: productSearch, $options: 'i' } },
        { description: { $regex: productSearch, $options: 'i' } }
      ];
    }
    if (category) {
      productQuery.category = category;
    }
    if (minPrice !== null || maxPrice !== null) {
      productQuery.price = {};
      if (minPrice !== null) productQuery.price.$gte = minPrice;
      if (maxPrice !== null) productQuery.price.$lte = maxPrice;
    }

    
    const categories = await Product.distinct('category');
    const products = await Product.find(productQuery).sort({ createdAt: -1 }).lean();
    res.render('products', {
      products,
      productSearch,
      category,
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      categories
    });
  } catch (err) {
    console.error(err);
    res.render('products', { products: [], categories: [], productSearch: '', category: '', minPrice: '', maxPrice: '' });
  }
};

exports.getAddProduct = (req, res) => {
  res.render('add-product', { error: null });
};

exports.postAddProduct = async (req, res) => {
  const { name, price, description, category } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : '';
  try {
    await Product.create({ name, price, description, image, category });
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.render('add-product', { error: 'An error occurred while adding the product' });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
  
    const userSearch = req.query.userSearch || '';
    let userQuery = {};
    if (userSearch) {
      userQuery = {
        $or: [
          { username: { $regex: userSearch, $options: 'i' } },
          { email: { $regex: userSearch, $options: 'i' } }
        ]
      };
    }

  
    const productSearch = req.query.productSearch || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

    let productQuery = {};
    if (productSearch) {
      productQuery.$or = [
        { name: { $regex: productSearch, $options: 'i' } },
        { description: { $regex: productSearch, $options: 'i' } }
      ];
    }
    if (category) {
      productQuery.category = category;
    }
    if (minPrice !== null || maxPrice !== null) {
      productQuery.price = {};
      if (minPrice !== null) productQuery.price.$gte = minPrice;
      if (maxPrice !== null) productQuery.price.$lte = maxPrice;
    }

   
    const categories = await Product.distinct('category');

    const users    = await require('../models/User').find(userQuery).lean();
    const products = await Product.find(productQuery).lean();
    const productsCount = await Product.countDocuments();
    const usersCount = await require('../models/User').countDocuments();

    res.render('admin-dashboard', {
      users,
      products,
      stats: {
        products: productsCount,
        users: usersCount
      },
      userSearch,
      productSearch,
      category,
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      categories
    });
  } catch (err) {
    console.error(err);
    res.send('An error occurred while loading the admin dashboard');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    res.render('edit-product', { product, error: null });
  } catch (err) {
    console.error(err);
    res.send('An error occurred while fetching product data');
  }
};

exports.postEditProduct = async (req, res) => {
  const { name, price, description, category } = req.body;
  const updateData = { name, price, description, category };
  if (req.file) updateData.image = '/uploads/' + req.file.filename;
  try {
    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.render('edit-product', {
      product: { _id: req.params.id, name, price, description, category },
      error: 'An error occurred while updating the product'
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('An error occurred while deleting the product');
  }
};
