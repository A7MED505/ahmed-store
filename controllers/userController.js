const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Nodemailer transporter (uses .env values)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.getLogin = (req, res) => {
  res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render('login', { error: 'Email is not registered' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)  return res.render('login', { error: 'Incorrect password' });
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'An error occurred during login' });
  }
};

exports.getRegister = (req, res) => {
  res.render('register', { error: null });
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'An error occurred during registration' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

exports.getAccount = (req, res) => {
  res.render('account', {
    errorAcc: null, successAcc: null,
    errorPwd: null, successPwd: null
  });
};

exports.postUpdateAccount = async (req, res) => {
  const { username, email } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.userId, { username, email });
    res.render('account', { successAcc: 'Account info updated successfully', errorAcc: null, errorPwd: null, successPwd: null });
  } catch (err) {
    console.error(err);
    res.render('account', { errorAcc: 'An error occurred while updating info', successAcc: null, errorPwd: null, successPwd: null });
  }
};

exports.postChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!await bcrypt.compare(oldPassword, user.password)) {
      return res.render('account', { errorPwd: 'Current password is incorrect', successPwd: null, errorAcc: null, successAcc: null });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.render('account', { successPwd: 'Password changed successfully', errorPwd: null, errorAcc: null, successAcc: null });
  } catch (err) {
    console.error(err);
    res.render('account', { errorPwd: 'An error occurred while changing password', successPwd: null, errorAcc: null, successAcc: null });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (u.isAdmin) return res.send('Cannot delete an admin account');
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.send('An error occurred while deleting the user');
  }
};
