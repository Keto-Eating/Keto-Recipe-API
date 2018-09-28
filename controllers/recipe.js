/* eslint-disable no-shadow */
// controllers/recipe.js


module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  // Display all the recipes saved in a users cart

  app.get('/', (req, res) => {
    RecipeSchema.find({}, (err, recipes) => {
      res.send({ recipes })
        .then(console.log({ recipes })
          .catch(console.log('nope') ));
    });
  });

  app.get('/recipes', (req, res) => {
    res.send('YoLo');
  });

  // Send a POST request to the database to create the recipes collection
  // Test the db is connected

  app.post('/recipes/new', (req, res) => {
    const food = new RecipeSchema({
      name: 'taco'
    });

    food.save((err, food) => res.send(food)
      .then((food) => {
        console.log("You're a beast!");
      })
      .catch((err) => {
        console.log(err.message);
      }));
  });
};
