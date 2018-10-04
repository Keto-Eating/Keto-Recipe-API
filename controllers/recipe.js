/* eslint-disable no-shadow */
// controllers/recipe.js


module.exports = (app) => {
  // const pinterestRecipes = require(node_pinterest)
  // const RecipeSchema /= require('../models/recipe');
  // Display a random selection of recipes
  // app.get('/', (req, res) => {
  //   pinterestRecipes.goGetTheKetos()
  //         if ('content-type' === 'application/json') {
  //           .then( res => {
  //             res.json('the recipes');
  //           })
  //         } else {
  //           res.render('someTemplate') // <----- design the response to work with templates
  //         }
  //
  // });

  // Display a single recipe from the cart
  app.get('/recipes/:id', (req, res) => {
    RecipeSchema.find({}, (err, recipes) => {
      res.send({ recipes })
        .then(console.log({ recipes })
          .catch(console.log( 'nope') ));
    });
  });



  // Show all recipes saved in their cart
  app.get('/recipes', (req, res) => {
    res.send('YoLo');

    RecipeSchema.findById(req.params._id);
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
