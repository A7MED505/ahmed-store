const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');
const userC   = require('../controllers/userController');

router.get ('/login',    userC.getLogin);
router.post('/login',    userC.postLogin);
router.get ('/register', userC.getRegister);
router.post('/register', userC.postRegister);
router.get ('/logout',   userC.logout);

router.get ('/account',           auth.isAuthenticated, userC.getAccount);
router.post('/update-account',    auth.isAuthenticated, userC.postUpdateAccount);
router.post('/change-password',   auth.isAuthenticated, userC.postChangePassword);

// allow admin to delete users
router.get('/admin/delete-user/:id', auth.isAuthenticated, auth.isAdmin, userC.deleteUser);

// Example: /login, /register, /account, etc.

module.exports = router;
