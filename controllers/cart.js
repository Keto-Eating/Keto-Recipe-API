/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');
  const getIngredients = require('./helpers/ingredients-parser.js');

  // route for showing cart
  app.get('/cart', (req, res) => {
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
              instructions: 'You must first add recipes to your cart.',
            });
          });
      });
    } else {
      res.render('cart');
    }
  });

  // Send a POST request to the database to create the recipes collection
  app.post('/cart', (req, res) => {
    const recipeId = req.body.recipeId;
    const userId = app.locals.user.id;

    // find user, save recipeId to recipesInCart
    UserSchema.findById(userId, (errFindingUser, userInDB) => {
      if (errFindingUser) return next(errFindingUser);
      if (userInDB.recipesInCart.includes(recipeId)) {
        // already addedToCart, remove from recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $pull: {
            recipesInCart: recipeId,
          },
        }, (errorInCallback, user) => {
          if (errorInCallback) return next(errorInCallback);
          app.locals.user = user;
          app.locals.user.recipesInCart.pull(recipeId); // update user locally
          res.send('removed');
        });
      } else {
        // user has not addedToCart before, add to recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: {
            recipesInCart: recipeId,
          },
        }, (errorUpdating, user) => {
          if (errorUpdating) return next(errorUpdating);
          app.locals.user = user;
          app.locals.user.recipesInCart.push(recipeId); // update user locally
          res.send('added');
        });
      }
    });
  });

  app.get('/cart/grocery-list', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      const userId = app.locals.user.id;
      UserSchema.findById(userId, (err, user) => {
        if (err) return next(err);
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.recipesInCart)
          .then((cartRecipes) => {
            const ingredients = getIngredients(cartRecipes);
            res.render('grocery-list', { ingredients });
          })
          .catch(error => next(error));
      });
    } else {
      res.render('grocery-list');
    }
  });
};
