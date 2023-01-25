const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');

/* GET sign up form view */
/* ROUTE auth/signup */
router.get('/signup', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/signup', user)
});

/* POST sign up form data */
/* ROUTE auth/signup */
router.post('/signup', async (req, res, next) => {
  const { email, password, fullName, slackID, googleID } = req.body;
  if (!email || !password || !fullName) {
    res.render('auth/signup', { error: 'All fields are necessary' })
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/;
  if (!regex.test(password)) {
    res.render('auth/signup', { error: 'Password needs to contain at lesat 7 characters, one number, one lowercase an one uppercase letter.' })
    return;
  }
  try {
    const isUserInDB = await User.findOne({ email: email });
    if (isUserInDB) {
      res.render('auth/signup', { error: `There already is a user with email ${email}.` })
      return;
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({ email, hashedPassword, fullName, slackID, googleID });
      res.render('auth/signupOk', user);
    }
  } catch (error) {
    next(error)
  }
});

/* GET log in form view */
/* ROUTE auth/login */
router.get('/login', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/login', user)
});

/* POST log in form data */
/* ROUTE auth/login */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('auth/login', { error: 'username or password do not match' })
    return;
  }
  try {
    const isUserInDB = await User.findOne({ email: email });
    if (!isUserInDB) {
      res.render('auth/login', { error: `There are no users by ${username}` })
      return;
    } else {
      const passwordMatch = await bcrypt.compare(password, isUserInDB.hashedPassword);
      if (passwordMatch) {
        req.session.currentUser = isUserInDB;
        res.render('auth/profile', { user: isUserInDB });
      } else {                              
        res.render('auth/login', { error: 'Unable to authenticate user. Sorry :(' })
        return;
      }
    }
  } catch (error) {
    next(error)
  }
});

/* GET profile view */
/* ROUTE auth/profile */
router.get('/profile', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('auth/profile', { user })
});

/* GET log out*/
/* ROUTE auth/logout */
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.clearCookie('rooms-app');
      res.redirect('/auth/login');
    }
  });
});


module.exports = router;