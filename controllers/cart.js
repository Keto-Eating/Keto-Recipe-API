module.exports = (app) => {

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
          $pull: {
            recipesInCart: recipeId
          }
        }, function(err, user) {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.recipesInCart.pull(recipeId); // update user locally
        });
      } else {
        // user has not addedToCart before, add to recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: {
            recipesInCart: recipeId
          }
        }, function(err, user) {
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
        if (err) {
          console.error(err)
        }
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.recipesInCart)
          .exec(function(err, cartRecipes) {

            var ingredients = parseIngredients(cartRecipes);
            // console.log(ingredients);
            console.log(ingredients);

            res.render('grocery-list', {
              ingredients: ingredients
            });
          })
      });
    } else {
      res.render('cart');
    }
  });

  function parseIngredients(cartRecipes) {
    listOfUnits = ["serving", "teaspoon", "teaspoons", "tsp", "tsp.", "tablespoon",
    "tablespoons", "tbl", "tbl.", "tbs", "tbs.", "or tbsp.", "fluid ounce",
    "fl oz", "gill", "cup", "cups", "pint", "pt", "pt.", "fl pt", "quart", "qt",
    "fl qt", "gallon","gal", "ml", "mL", "milliliter", "millilitre", "large",
    " l ", "liter", "litre,", "dl", "dL", "deciliter", "decilitre","pound", "lb",
    "lb.", "lbs.", "ounce", "oz", "oz.", "mg", "milligram", "milligramme", " g ",
    "gram", "gramme", "kg", "kilogram", "kilogramme", "mm", "millimeter",
    "millimetre", "cm", "centimeter", "centimetre", " m ","meter", "metre",
    "inch", "in"]

    for (i = 0; i < cartRecipes.length; i++) {
      // console.log(recipes[i].ingredientLines);
      for (j = 0; j < cartRecipes[i].ingredientLines.length; j++) {

        let ingredientWords = cartRecipes[i].ingredientLines[j].split(" ");

        listOfUnits.forEach(function(unit) {
          // try to find one of the units above inside the ingredientsArr
          if (ingredientWords.indexOf(unit) != -1) {
            // console.log('it was found: ', unit, ingredientsArr);
            let inx = ingredientWords.indexOf(unit)
            let quantity = ingredientWords.slice(0, inx);
            let measurement = ingredientWords[inx];
            let ingredient = ingredientWords.slice(inx + 1, ingredientWords.length);

            console.log('quantity: ' + quantity);
            console.log('unit: ' + measurement);
            console.log('ingredient: ' + ingredient);
            return quantity, unit, ingredient;
            // const indexOfUnit = ingredient.indexOf(new RegExp(listOfUnits.join("|")))
            // console.log('Index of Unit: ', indexOfUnit);
          } else {
            let quantity = 1;
            let measurement = "x";
            let ingredient = ingredientWords;
            return quantity, unit, ingredient;
          }
        })
      }
    }
    // return quantity, unit, ingredient
  }
};
