module.exports = (app) => {
  const http = require('https');
  const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
  const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
  const schedule = require('node-schedule');
  const RecipeSchema = require('../models/recipe');
	const UserSchema = require('../models/user');

  pullEdamamRecipes(); // do this once when server boots up
  const edamamJob = schedule.scheduleJob('59 59 23 * * *', function() {
    // schedule.scheduleJob(second min hr dayOfMonth month dayOfWeek)
    pullEdamamRecipes();
  });

  app.get('/', (req, res) => {
    let queryString = req.query.term;
    var regExpQuery = new RegExp(queryString, 'i');

    RecipeSchema.find({
      label: regExpQuery
    }, function(err, recipes) {
      console.log('***********************: call back')
      if (err) {
        console.error(err.message)
      } else {
        res.render('index', {
          recipes: recipes
        });
        for (i = 0; i < 5; i++) {
            console.log(recipes[i].ingredientLines);
            parseIngredients(recipes[i].ingredientLines[i]);
        }
      }
    })
  })

  function pullEdamamRecipes() {
    // TODO: add loop later to change from/to params + add max (currently 525 keto recipes)
    const url = `https://api.edamam.com/search?q=keto&from=0&to=100&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;
    http.get(url, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (d) => {
        body += d;
      });
      response.on('end', () => {
        const parsed = JSON.parse(body);
        parsed.hits.forEach(function(hit) {
          const recipeFromAPI = new RecipeSchema(hit.recipe);
          RecipeSchema.findOne({ uri: hit.recipe.uri })
            .exec(function(err, recipeInDB) {
              if (err) {
                console.log('Error in recipe save: ', err.message)
              } else if (recipeInDB) {
                // console.log("recipe already exists");
              } else {
                // recipe is not in DB yet, save it
                recipeFromAPI.save((err, recipe) => {
                  if (err) {
                    console.log('Error in recipe save: ', err.message)
                  } else {
                    console.log(`successfully saved a recipe: ${ recipe.label }`)
                  }
                });
              }
            });
        }); // <--------- END of forEach()
      });
    }); // <---------- END of fetch request
  }

  function parseIngredients(ingredient) {
    // var unitsFile = fs.readFileSync("./cooking-units-of-measurement.txt");
    // var unitsByLine = text.split("\n")
    listOfUnits = ["teaspoon", "tsp", "tsp.", "tablespoon", "tbl", "tbl.", "tbs", "tbs.", "or tbsp.", "fluid ounce",
    "fl oz", "gill", "cup", "cups", "pint", "pt", "pt.", "fl pt", "quart", "qt", "fl qt", "gallon",
    "gal", "ml", "mL", "milliliter", "millilitre", " l ", "liter", "litre,", "dl", "dL", "deciliter", "decilitre",
    "pound", "lb", "lb.", "lbs.", "ounce", "oz", "oz.", "mg", "milligram", "milligramme", " g ", "gram", "gramme",
    "kg", "kilogram", "kilogramme", "mm", "millimeter", "millimetre", "cm", "centimeter", "centimetre", " m ",
    "meter", "metre", "inch", "in"]

    let ingredientsArr = ingredient.split(" ");

    // array.indexOf(thing your looking for)
    listOfUnits.forEach(function(unit) {
      if (ingredientsArr.indexOf(unit) != -1) {
        console.log('it was found: ', unit, ingredientsArr);
        // const indexOfUnit = ingredient.indexOf(new RegExp(listOfUnits.join("|")))
        // console.log('Index of Unit: ', indexOfUnit);
      }
    })


    if (new RegExp(listOfUnits.join("|")).test(ingredient)) {
    // At least one match
    // if found, separate on found item:
      // save anything before unit as: quantity
      // save anything after unit: as ingredient itself)
    }

  }
}
