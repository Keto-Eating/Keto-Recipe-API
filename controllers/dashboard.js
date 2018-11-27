module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');
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

  // route for showing favorites
  app.get('/dashboard/favorites', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      userId = app.locals.user.id;
      UserSchema.findById(userId, function(err, user) {
        if (err) { console.error(err) };
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.arrayOfFavoriteRecipes)
          .exec(function(err, userFaves) {
            res.render('dashboard/favorites', {
              recipes: userFaves
            });
          })
      });
    } else {
      res.render('dashboard/favorites');
    }
  });

  // route for showing cart
  app.get('/cart', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (app.locals.user) {
      userId = app.locals.user.id;
      UserSchema.findById(userId, function(err, user) {
        if (err) { console.error(err) }
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.recipesInCart)
          .exec(function(err, cartRecipes) {
            res.render('cart', {
              recipes: cartRecipes
            });
            for (i = 0; i < cartRecipes.length; i++) {
                // console.log(recipes[i].ingredientLines);
                for (j = 0; j < cartRecipes[i].ingredientLines.length; j++) {
                  parseIngredients(cartRecipes[i].ingredientLines[j]);
                }
            }
          })
      });
    } else {
      res.render('cart');
    }
  });

  function parseIngredients(ingredient) {
    // var unitsFile = fs.readFileSync("./cooking-units-of-measurement.txt");
    // var unitsByLine = text.split("\n")
    listOfUnits = ["serving", "teaspoon", "teaspoons", "tsp", "tsp.", "tablespoon", "tablespoons", "tbl", "tbl.", "tbs", "tbs.", "or tbsp.", "fluid ounce",
    "fl oz", "gill", "cup", "cups", "pint", "pt", "pt.", "fl pt", "quart", "qt", "fl qt", "gallon",
    "gal", "ml", "mL", "milliliter", "millilitre", "large", " l ", "liter", "litre,", "dl", "dL", "deciliter", "decilitre",
    "pound", "lb", "lb.", "lbs.", "ounce", "oz", "oz.", "mg", "milligram", "milligramme", " g ", "gram", "gramme",
    "kg", "kilogram", "kilogramme", "mm", "millimeter", "millimetre", "cm", "centimeter", "centimetre", " m ",
    "meter", "metre", "inch", "in"]

    let ingredientsArr = ingredient.split(" ");

    listOfUnits.forEach(function(unit) {
      // try to find one of the units above inside the ingredientsArr
      if (ingredientsArr.indexOf(unit) != -1) {
        // console.log('it was found: ', unit, ingredientsArr);
        let inx = ingredientsArr.indexOf(unit)
        let quantity = ingredientsArr.slice(0,inx);
        let measurement = ingredientsArr[inx];
        let ingredient = ingredientsArr.slice(inx+1, ingredientsArr.length);

        console.log('quantity: ' + quantity);
        console.log('unit: ' + measurement);
        console.log('ingredient: ' + ingredient);
        return quantity, unit, ingredient
        // const indexOfUnit = ingredient.indexOf(new RegExp(listOfUnits.join("|")))
        // console.log('Index of Unit: ', indexOfUnit);
      } else {
        let quantity = 1;
        let measurement = "x";
        let ingredient = "ingredientsArr"
        return quantity, unit, ingredient
      }
    })
    // return quantity, unit, ingredient
  }
}
