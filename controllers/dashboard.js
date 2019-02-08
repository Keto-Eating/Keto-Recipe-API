/* eslint-disable consistent-return */
/* eslint-disable global-require */
module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');
  // Render the signup form
  app.get('/dashboard', (req, res) => {
    // TODO: (1) Search for user specific favorites (2) show them using code similar to below
    if (app.locals.user) {
      res.render('dashboard', {});
    } else {
      res.redirect('/login');
    }
  });

  // route for showing favorites
  app.get('/dashboard/favorites', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      const userId = app.locals.user.id;
      UserSchema.findById(userId, (errFindingUser, user) => {
        if (errFindingUser) return res.next(errFindingUser);
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.arrayOfFavoriteRecipes)
          .exec((_err, userFaves) => res.render('dashboard/favorites', {
            recipes: userFaves,
          }));
      });
    } else {
      return res.render('dashboard/favorites');
    }
  });

  // route for showing cart
  app.get('/cart', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      console.log('User: ', app.locals.user);
      const userId = app.locals.user.id;
      UserSchema.findById(userId, (err, user) => {
        if (err) return res.next(err);
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.recipesInCart)
          .exec((_err, cartRecipes) => {
            res.render('cart', {
              recipes: cartRecipes,
              user,
            });
          });
      });
    } else {
      res.render('cart');
    }
  });
};
