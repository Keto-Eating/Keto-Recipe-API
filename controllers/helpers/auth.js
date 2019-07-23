exports.requireLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  }
  const err = new Error('You must log in to view this page');
  err.status = 401;

  res.redirect('/login');
};
