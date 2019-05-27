/* eslint-disable consistent-return */
/* eslint-disable global-require */
module.exports = (app) => {
  // Render the signup form
  app.get('/dashboard', (req, res) => {
    // TODO: (1) Search for user specific favorites (2) show them using code similar to below
    if (req.session.user) {
      res.render('dashboard', {});
    } else {
      res.redirect('/login');
    }
  });
};
