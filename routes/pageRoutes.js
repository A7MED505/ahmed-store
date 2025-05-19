// routes/pageRoutes.js
const express = require('express');
const router  = express.Router();

const userC    = require('../controllers/userController');
const productC = require('../controllers/productController');
const contactC = require('../controllers/contactController');
const auth     = require('../middlewares/auth');


router.get('/', productC.getHomePage);


router.get('/about', (req, res) => res.render('about'));


router.get('/contact', contactC.getContact);
router.post('/contact', contactC.postContact);


router.get('/login',    userC.getLogin);
router.post('/login',   userC.postLogin);
router.get('/register', userC.getRegister);
router.post('/register',userC.postRegister);
router.get('/logout',   userC.logout);

router.get('/account',          auth.isAuthenticated, userC.getAccount);
router.post('/update-account',  auth.isAuthenticated, userC.postUpdateAccount);
router.post('/change-password', auth.isAuthenticated, userC.postChangePassword);


router.get('/products', productC.getAllProducts);


router.get( '/add-product',                   auth.isAuthenticated, auth.isAdmin, productC.getAddProduct);
router.post('/add-product', auth.isAuthenticated, auth.isAdmin, productC.upload.single('image'), productC.postAddProduct);

router.get( '/admin',                         auth.isAuthenticated, auth.isAdmin, productC.getAdminDashboard);
router.get( '/admin/edit-product/:id',        auth.isAuthenticated, auth.isAdmin, productC.getEditProduct);
router.post('/admin/edit-product/:id', auth.isAuthenticated, auth.isAdmin, productC.upload.single('image'), productC.postEditProduct);
router.get( '/admin/delete-product/:id',      auth.isAuthenticated, auth.isAdmin, productC.deleteProduct);


router.get( '/admin/delete-user/:id',         auth.isAuthenticated, auth.isAdmin, userC.deleteUser);

module.exports = router;
