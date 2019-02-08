/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
module.exports = (app) => {
  const isNumber = require('is-number');
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  function getIngredients(cartRecipes) {
    const listOfIngredients = [];
    cartRecipes.forEach((recipe) => {
      // iterate through recipes in cart
      recipe.ingredientLines.forEach((ingredientLine) => {
        const ingrWithoutStars = ingredientLine.replace('*', '');
        const ingrWordsArr = ingrWithoutStars.split(' ');
        // console.log(ingrWordsArr);

        if (ingrWordsArr.length === 1) {
          // this catches instances like "salt"
          const qty = 1;
          const unit = 'x';
          const desc = ingrWordsArr.slice(0, ingrWordsArr.length).join(' ');
          listOfIngredients.push([qty, unit, desc]);
        } else if (ingrWordsArr.length === 2 && isNumber(ingrWordsArr[0])) {
          // this catches instances like "1 Lime"
          const qty = ingrWordsArr[0];
          const unit = '';
          const desc = ingrWordsArr.slice(1, ingrWordsArr.length).join(' ');
          listOfIngredients.push([qty, unit, desc]);
        } else {
          // almost every other ingredient will land in here
          const qty = ingrWordsArr[0];
          const unit = ingrWordsArr[1];
          const desc = ingrWordsArr.slice(2, ingrWordsArr.length).join(' ');
          listOfIngredients.push([qty, unit, desc]);
        }
        // console.log(listOfIngredients);
      });
    });
    return listOfIngredients;
  }

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
          res.redirect('/cart');
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
          res.redirect('/cart');
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
