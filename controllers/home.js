/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
module.exports = (app) => {
  const schedule = require('node-schedule');
  const RecipeSchema = require('../models/recipe');
  const pullEdamamRecipes = require('./helpers/edamam.js');

  pullEdamamRecipes(); // do this once when server boots up

  schedule.scheduleJob('59 59 23 * * *', () => {
    // schedule.scheduleJob(second min hr dayOfMonth month dayOfWeek)
    pullEdamamRecipes();
  });

  app.get('/', (req, res) => {
    const queryString = req.query.term || 'empty';
    const regExpQuery = new RegExp(queryString, 'i');
    const currentPage = req.query.page || 1;
    console.log('currentPage:', currentPage);

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
          res.render('index', {
            recipes: results.docs,
            numPages: results.pages,
            pageNumbers,
            currentPage,
            instructions: 'Try another search term.',
          });
        });
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
          res.render('index', {
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
};
