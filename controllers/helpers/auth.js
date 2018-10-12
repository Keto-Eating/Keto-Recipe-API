exports.requireLogin = (req, res, next) => {
  console.log(app);
  if(app.locals.username) {
    return next();
  } else {
    let err = new Error('You must log in to view this page');
    err.status = 401;

    return res.redirect('/login');
  }
}
