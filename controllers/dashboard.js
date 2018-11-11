module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  // Render the signup form
  app.get('/dashboard', (req, res) => {
    // TODO: (1) Search for user specific favorites (2) show them using code similar to below
    if (app.locals.user) {
      user = app.locals.user;
      res.render('dashboard', {});
    } else {
      res.redirect('/login');
    }
});

  app.get('/dashboard/favorites', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    res.render('dashboard/favorites');
  });

}
