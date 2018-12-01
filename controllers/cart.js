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
        listOfIngredients.push(ingredientLine);
      })
    })
    return listOfIngredients
  }

  function parseIngredients(cartRecipes) {

    let listOfMeasurements = ["serving", "drops", "teaspoon", "teaspoons", "tsp", "tsp.",
    "tablespoon", "tablespoons", "tbl", "tbl.", "tbs", "tbs.", "tbsp.",
    "fluid ounce", "fl oz", "gill", "cup", "cups", "pint", "pt", "pt.", "fl pt",
    "quart", "qt", "fl qt", "gallon", "gal", "ml", "mL", "milliliter", "millilitre",
    "large", "l", "liter", "litre,", "dl", "dL", "deciliter", "decilitre",
    "pound", "lb", "lb.", "lbs.", "ounce", "oz", "oz.", "mg", "milligram",
    "milligramme", "g", "gram", "gramme", "kg", "kilogram", "kilogramme", "mm",
    "millimeter", "millimetre", "cm", "centimeter", "centimetre", "m ", "meter",
    "metre", "inch", "in", "in."]

    cartRecipes.forEach(function(recipe) {
      // iterate through recipes in cart
      recipe.ingredientLines.forEach(function(ingredientLine) {
        // iterate through each ingredient in trecipe
        let ingrWordsArr = ingredientLine.split(" ");
        // splits ingredient itself into an array of words
        let ingredientHasMeasurement = false;

        ingrWordsArr.map(function(measurement) {
          if (listOfMeasurements.indexOf(measurement) != -1) {
            // unit of measurement (ex: tsp) was found inside ingrWordsArr
            console.log("index of measurements for: " + ingrWordsArr + " is: " + listOfMeasurements.indexOf(measurement));
            //   let quantity = ingrWordsArr.slice(0,indexOfMeasurement);
            //   let unit = ingrWordsArr[indexOfMeasurement];
            //   let description = ingrWordsArr.slice(indexOfMeasurement+1, ingrWordsArr.length);
            //
            //   console.log('quantity: ' + quantity);
            //   console.log('unit: ' + measurement);
            //   console.log('ingredient: ' + description);
            ingredientHasMeasurement = true;
          }
        })
        // after .map() done iterating, check if measurement was never found:
        if (ingredientHasMeasurement == false) {
          console.log('no measurement was found inside: ' + ingrWordsArr);
        }

        // listOfMeasurements.forEach(function(measurement) {
        //   // iterate through
        //
        //   const index = fruits.findIndex(fruit => fruit === "blueberries");
        //
        //
        //   let quantity = ingrWordsArr.slice(0,indexOfMeasurement);
        //   let unit = ingrWordsArr[indexOfMeasurement];
        //   let description = ingrWordsArr.slice(indexOfMeasurement+1, ingrWordsArr.length);
        //
        //   console.log('quantity: ' + quantity);
        //   console.log('unit: ' + measurement);
        //   console.log('ingredient: ' + description);
        // }
        // }
        // listOfMeasurements.forEach(function(measurement) {
        //   indexOfMeasurement = ingrWordsArr.indexOf(measurement);
        //
        //   if (indexOfMeasurement != -1) {
        //     // measurement unit (ex: teaspoon) was found inside ingrWordsArr
        //     let quantity = ingrWordsArr.slice(0,indexOfMeasurement);
        //     let unit = ingrWordsArr[indexOfMeasurement];
        //     let description = ingrWordsArr.slice(indexOfMeasurement+1, ingrWordsArr.length);
        //     console.log('quantity: ' + quantity);
        //     console.log('unit: ' + measurement);
        //     console.log('ingredient: ' + description);
        //   } else {
        //     console.log('index of measurement is: ' + indexOfMeasurement);
        //   }
        // })

        // if (listOfUnits.some(r=> ingrWordsArr.indexOf(r)) != -1) {
          // let indexOfUnit = ingrWordsArr.indexOf(r)
          // console.log(indexOfUnit);
        // }
        // some(..) checks each element of the array against a test function
        // and returns true if any element of the array passes the test function,
        // otherwise, it returns false.
        // indexOf(..) >= 0 and includes(..) both return true if the given argument
        // is present in the array.

        // if (unitFound) {
        //   console.log('found a unit at index: ' + ingrWordsArr);
        //
        // } else {
        //   console.log('did not find a unit inside: ' + ingrWordsArr);
        // }

        // listOfUnits.forEach(function(unit) {
        //   if (ingrWordsArr.indexOf(unit) == -1) {
        //     // NO unit (ex: tsp.) was found inside ingrWordsArr
        //     console.log('the following is calling the else statement: ' + ingrWordsArr);
        //
        //     //   // let quantity = 1;
        //     //   // let measurement = "x";
        //     //   // let ingredient = ingrWordsArr
        //   } else {
        //     // one of the units above (ex: tsp.) was found inside ingrWordsArr
        //     let inx = ingrWordsArr.indexOf(unit)
        //
        //     let quantity = ingrWordsArr.slice(0,inx);
        //     let measurement = ingrWordsArr[inx];
        //     let ingredient = ingrWordsArr.slice(inx+1, ingrWordsArr.length);
        //
        //     console.log('quantity: ' + quantity);
        //     console.log('unit: ' + measurement);
        //     console.log('ingredient: ' + ingredient);
        //   }
        // })
      })
    })
  }
};
