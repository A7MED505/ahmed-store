const User = require('../models/User');

// Authentication middleware
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
  if (req.session.userId && res.locals.user && res.locals.user.isAdmin) return next();
  res.redirect('/');
};
