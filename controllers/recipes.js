module.exports = (app) => {
  const http = require('https');
  const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
  const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
  const schedule = require('node-schedule');
  const RecipeSchema = require('../models/recipe');

  const edamamJob = schedule.scheduleJob('59 59 23 * * *', function() {
    // second min hr dayOfMonth month dayOfWeek

    // TODO: add loop later to change from/to params
    const url = `https://api.edamam.com/search?q=keto&from=0&to=100&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

    http.get(url, (response) => {
      response.setEncoding('utf8');
      let body = '';

      response.on('data', (d) => {
        body += d;
      });

      response.on('end', () => {
        // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
        const parsed = JSON.parse(body);
        parsed.hits.forEach(function(hit) {
          const recipe = new RecipeSchema(hit.recipe);
          RecipeSchema.findOne({ uri: hit.recipe.uri })
            .then(function(recipe) {
              if (recipe) {
                console.log("recipe already exists");
              } else if (!recipe) {
                // recipe isn't in DB, save ot
                recipe.save(function(err, recipe) {
                  if (err) console.log(err);
                  console.log("successfully saved a recipe: " + hit.recipe.label);
                });
              }
            })
            .catch((error, done) => {
              return done(error)
            });
        });
      });
    });
  });

	app.get('/', (req, res) => {
    let queryString = req.query.term;

		// find recipe(s) searching with term above
		results = RecipeSchema.find({ label: `${queryString}`/i}, (function(recipes) {
				console.log(recipes);
			}));
		// if found assign array to results

		// Index Template & pass recipe data to the template
		res.render('index', {
			//results is an array
			// recipes: results
		});
  });
}
