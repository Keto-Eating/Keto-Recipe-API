module.exports = (app) => {
  const http = require('https');
  const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
  const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
  const schedule = require('node-schedule');
  const RecipeSchema = require('../models/recipe');

  pullEdamamRecipes(); // do this once when server boots up
  const edamamJob = schedule.scheduleJob('59 59 23 * * *', () => {
    // schedule.scheduleJob(second min hr dayOfMonth month dayOfWeek)
    pullEdamamRecipes();
  });

  app.get('/', (req, res) => {
    let queryString = req.query.term;
    var regExpQuery = new RegExp(queryString, 'i');

    RecipeSchema.find({
      label: regExpQuery
    }, (err, recipes) => {
      console.log('***********************: call back');
      if (err) {
        console.error('Error finding recipes: ', err.message);
      } else {
        res.render('index', {
          recipes,
          queryString,
        });
      }
    })
  })

  function pullEdamamRecipes() {
    // TODO: add loop later to change from/to params + add max (currently 525 keto recipes)
    const url = `https://api.edamam.com/search?q=keto&from=0&to=100&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

    http.get(url, (response) => {
      response.setEncoding('utf8');
      let body = '';
      response.on('data', (d) => { body += d });

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

  app.get('/', (req, res) => {
    let queryString = req.query.term;
    var regExpQuery = new RegExp(queryString, 'i');

    RecipeSchema.find({ $or:
        [
          { label: regExpQuery },
          { url: regExpQuery },
          { ingredientLines: regExpQuery }
        ]
    }, function(err, recipes) {
      if (err) {
        console.error(err.message)
      } else {
        res.render('index', {
          recipes: recipes
        });
      }
    })
  })
}
