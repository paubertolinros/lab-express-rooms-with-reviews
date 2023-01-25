const loggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/auth/login')
  } else {
    next()
  }
};

module.exports = loggedIn;