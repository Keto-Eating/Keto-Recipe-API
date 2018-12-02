module.exports = (app) => {
  const isNumber = require('is-number');
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  // Send a POST request to the database to create the recipes collection
  app.post('/cart/', (req, res) => {
    console.log("in POST request");
    const recipeId = req.body.recipeId;
    const userId = app.locals.user.id;

    // find user, save recipeId to recipesInCart
    UserSchema.findById(userId, function(err, userInDB) {
      if (err) return handleError(err);
      if (userInDB.recipesInCart.includes(recipeId)) {
        // already addedToCart, remove from recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $pull: { recipesInCart: recipeId }}, function(err, user) {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.recipesInCart.pull(recipeId); // update user locally
        });
      } else {
        // user has not addedToCart before, add to recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: { recipesInCart: recipeId }}, function(err, user) {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.recipesInCart.push(recipeId); // update user locally
        });
      }
    });
  });

  app.get('/cart/grocery-list', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      userId = app.locals.user.id;
      UserSchema.findById(userId, function(err, user) {
        if (err) { console.error(err) }
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.recipesInCart)
          .then(function(cartRecipes) {
            let ingredients = getIngredients(cartRecipes);
            res.render('grocery-list', {
              ingredients: ingredients
            });
          })
          .catch(function(err) {
            console.log('error: ' + err);
          })
      });
    } else {
      res.render('grocery-list');
    }
  });

  function getIngredients(cartRecipes) {
    listOfIngredients = [];
    cartRecipes.forEach(function(recipe) {
      // iterate through recipes in cart
      recipe.ingredientLines.forEach(function(ingredientLine) {
        let ingrWithoutStars = ingredientLine.replace("* ","");
        let ingrWordsArr = ingrWithoutStars.split(" ");
        // console.log(ingrWordsArr);

        if (ingrWordsArr.length == 1) {
          // this catches instances like "salt"
          let qty = 1;
          let unit = 'x'
          let desc = ingrWordsArr.slice(0, ingrWordsArr.length).join(' ')
          listOfIngredients.push([qty, unit, desc]);
        } else if ((ingrWordsArr.length == 2) && (isNumber(ingrWordsArr[0]))) {
          // this catches instances like "1 Lime"
          let qty = ingrWordsArr[0];
          let unit = ''
          let desc = ingrWordsArr.slice(1, ingrWordsArr.length).join(' ')
          listOfIngredients.push([qty, unit, desc]);
        } else {
          // almost every other ingredient will land in here
          let qty = ingrWordsArr[0];
          let unit = ingrWordsArr[1]
          let desc = ingrWordsArr.slice(2, ingrWordsArr.length).join(' ')
          listOfIngredients.push([qty, unit, desc]);
        }
        console.log(listOfIngredients);
      })
    })
    return listOfIngredients
  }
};
