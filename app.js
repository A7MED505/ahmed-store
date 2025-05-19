require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const pageRoutes    = require('./routes/pageRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes    = require('./routes/userRoutes');

const app = express();

// ====== Database Connection (MongoDB) ======
mongoose.connect('mongodb+srv://ahmedahmed20:8zDMeSvzbQDvsXoW@ahmedstore.5reqdii.mongodb.net/ahmedStore')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Atlas connection error:', err));

// ====== Express Settings ======
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Static files (CSS, JS, Images)

// ====== Session Storage Settings ======
app.use(session({
  secret: 'your_secret_key_here',  // Change this to your own secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://ahmedahmed20:8zDMeSvzbQDvsXoW@ahmedstore.5reqdii.mongodb.net/ahmedStore',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24  // 24 hours
  }
}));

// ====== Make `user` available in all views ======
const User = require('./models/User');
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.use((req, res, next) => {
  // Extract page name from URL
  const path = req.path.split('/')[1] || 'home';
  res.locals.activePage = path;
  next();
});

app.use((req, res, next) => {
  res.locals.cart = req.session.cart || [];
  next();
});

// ====== View engine ======
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ====== Routes ======
app.use('/',     pageRoutes);
app.use('/',     userRoutes);    // login, register, account, etc.
app.use('/',     productRoutes); // products, add/edit/delete, admin dashboard

// ====== Example route ======
app.get('/about', (req, res) => {
  res.render('about', { user: req.user, activePage: 'about' });
});

// ====== Start server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
