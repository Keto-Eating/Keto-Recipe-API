/* eslint-disable arrow-parens */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable global-require */
module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');
  // const IngredientSchema = require('../models/ingredient');
  const GroceryListSchema = require('../models/grocery-list');
  const getIngredients = require('./helpers/parse-ingredients.js');
  const _ = require('lodash');

  // route for showing cart
  app.get('/cart', (req, res) => {
    if (req.session.user) {
      console.log('User: ', req.session.user);
      const userId = req.session.user._id;
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
    const userId = req.session.user._id;

    // find user, save recipeId to recipesInCart
    UserSchema.findById(userId, (errFindingUser, userInDB) => {
      if (errFindingUser) return next(errFindingUser);
      if (userInDB.recipesInCart.includes(recipeId)) {
        // already addedToCart, remove from recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $pull: {
            recipesInCart: recipeId,
          },
        }, (errorInCallback) => {
          if (errorInCallback) return next(errorInCallback);
          res.send('removed');
        });
      } else {
        // user has not addedToCart before, add to recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: {
            recipesInCart: recipeId,
          },
        }, (errorUpdating) => {
          if (errorUpdating) return next(errorUpdating);
          res.send('added');
        });
      }
    });
  });

  createGroceryList = (user) => {
    RecipeSchema.find()
      .where('_id')
      .in(user.recipesInCart)
      .then((cartRecipes) => {
        // get ingredients from all recipes in cart
        const ingredients = getIngredients(cartRecipes, userId);
        // regenerate new grocery list
        const groceryList = new GroceryListSchema({
          recipes: user.recipesInCart,
          ingredients,
          user: user._id,
        });

        // save grocery list
        groceryList.save()
          .then(() => {
            user.groceryList = groceryList;
            user.save()
              .then(() => groceryList)
              .catch(error => next(error));
          })
          .catch(error => next(error));
      })
      .catch(error => next(error));
  };

  app.get('/cart/grocery-list/', (req, res, next) => {
    if (req.session.user) {
      UserSchema.findById(req.session.user._id, async (err, user) => {
        if (err) return next(err);
        if (user) {
          if (user.groceryList) {
            GroceryListSchema.findById(user.groceryList)
              .then((groceryList) => res.render('grocery-list', {
                ingredients: groceryList.ingredients,
                user,
              }))
              .catch(error => next(error));
          } else {
            const groceryList = await createGroceryList(user);
            res.render('grocery-list', {
              ingredients: groceryList.ingredients,
              user,
            });
          }
        }
      });
    } else { // user is not logged in
      return res.render('grocery-list');
    }
  });

  app.get('/cart/grocery-list/new', (req, res, next) => {
    if (req.session.user) {
      const userId = req.session.user._id;
      UserSchema.findById(userId, async (err, user) => {
        if (err) return next(err);
        // to get updated user object
        const groceryList = await createGroceryList(user);
        res.render('grocery-list', {
          ingredients: groceryList.ingredients,
          user,
        });
      });
    } else { // user is not logged in
      return res.render('grocery-list');
    }
  });

  app.post('/cart/grocery-list/toggleIngredient', (req, res, next) => {
    const { groceryListId, ingrIdx, newValue } = req.body;

    GroceryListSchema.findById(groceryListId, (err, groceryList) => {
      if (err) return next(err);

      // if was unchecked, change to checked & vice-versa
      groceryList.ingredients[ingrIdx].acquired = newValue;

      groceryList.markModified(`ingredients.${ingrIdx}.acquired`);

      // save updated grocery list
      groceryList.save().then((updatedList) => {
        console.log(updatedList.ingredients);
      }).catch(error => next(error));
    });
  });
};
