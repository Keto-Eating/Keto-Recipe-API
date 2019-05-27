/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
module.exports = (app) => {
  const http = require('https');
  const schedule = require('node-schedule');
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
  const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;

  // pullEdamamRecipes(); // do this once when server boots up

  schedule.scheduleJob('59 59 23 * * *', () => {
    // schedule.scheduleJob(second min hr dayOfMonth month dayOfWeek)
    pullEdamamRecipes();
  });

  app.get('/', (req, res) => {
    const queryString = req.query.term || 'empty';
    const regExpQuery = new RegExp(queryString, 'i');
    const currentPage = req.query.page || 1;
    const userId = req.session.user._id;

    UserSchema.findById(userId, (errFindingUser, user) => {
      if (errFindingUser) return res.next(errFindingUser);

      if (queryString === 'empty') {
        RecipeSchema.paginate({},
          {
            sort: { usersWhoFavorited: -1 },
            page: currentPage,
            limit: 24,
          })
          // { currentPage, offset: 12, limit: 12 })
          .then((results) => {
            const pageNumbers = [];
            for (let i = 1; i <= results.pages; i += 1) {
              pageNumbers.push(i);
            }
            return res.render('index', {
              user,
              recipes: results.docs,
              numPages: results.pages,
              pageNumbers,
              currentPage,
              instructions: 'Try another search term.',
            });
          })
          .catch(err => res.send(err));
      } else {
        // user searching for recipe
        RecipeSchema.paginate({
          $or:
            [
              { label: regExpQuery },
              { url: regExpQuery },
              { ingredientLines: regExpQuery },
            ],
        },
        {
          sort: { usersWhoFavorited: -1 },
          page: currentPage,
          limit: 24,
        })
          .then((results) => {
            const pageNumbers = [];
            for (let i = 1; i <= results.pages; i += 1) {
              pageNumbers.push(i);
            }
            return res.render('index', {
              recipes: results.docs,
              numPages: results.pages,
              pageNumbers,
              currentPage,
              instructions: 'Try another search term.',
              queryString,
            });
          })
          .catch(err => res.send(err));
      }
    });
  });

  function pullEdamamRecipes() {
    let start;
    const increment = 100;
    for (start = 0; start <= 600; start += increment) {
      const url = `https://api.edamam.com/search?q=keto&from=${start}&to=${start + increment}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`;

      http.get(url, (response) => {
        response.setEncoding('utf8');
        let body = '';
        response.on('data', (d) => { body += d; });

        response.on('end', () => {
          const parsed = JSON.parse(body);
          console.log(`${parsed.count} recipes were fetched`);
          console.log(`Edamam reports that there are ${parsed.hits.length} keto recipes available`);
          parsed.hits.forEach((hit) => {
            const recipeFromAPI = new RecipeSchema(hit.recipe);

            RecipeSchema.findOne({ uri: hit.recipe.uri })
              .exec((err, recipeInDB) => {
                if (err) {
                  console.log('Error in recipe save: ', err.message);
                } else if (recipeInDB) {
                  // console.log("recipe already exists");
                } else {
                  // recipe is not in DB yet, save it
                  recipeFromAPI.save((error, recipe) => {
                    if (error) {
                      console.log('Error in recipe save: ', error.message);
                    } else {
                      console.log(`successfully saved a recipe: ${recipe.label}`);
                    }
                  });
                }
              });
          }); // <--------- END of forEach()
        });
      }); // <---------- END of fetch request
    } // <--- END of foor loop
  }
};
