/* eslint-disable no-shadow */
// controllers/recipe.js


module.exports = (app) => {
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
        console.log(`You're a beast! ${food}`);
      })
      .catch((err) => {
        console.log(err.message);
      }));
  });
};
