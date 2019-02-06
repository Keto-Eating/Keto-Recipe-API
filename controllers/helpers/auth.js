exports.requireLogin = (req, res, next) => {
  // eslint-disable-next-line global-require
  const exp = require('express');
  const app = exp();

  // console.log(app);
  if (app.locals.user) {
    return next();
  }
  const err = new Error('You must log in to view this page');
  err.status = 401;

  return res.redirect('/login');
};
