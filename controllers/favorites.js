module.exports = (app) => {
  // const auth = require('./helpers/auth')
  const User = require('../models/favorite');

  // Show all recipes saved in their cart
  app.get('/favorites', (req, res) => {
    console.log(app.locals.username);
    res.render('favorites', {username: app.locals.username});
    // render favorites using a URL structure like this: `https://api.edamam.com/search?r=${RECIPE.URI}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`

  });

  // Send a POST request to the database to create the recipes collection
  // Test the db is connected

  app.post('/favorites/', (req, res) => {
    console.log(req.body.recipeName);
    console.log(req.body.imageUrl);
    console.log(req.body.recipeUrl);
    console.log(req.body.ingredients);
    console.log(req.body.uri);
    // const favorite = new FavoriteSchema({
    //   name: 'taco'
    // });

    // food.save((err, food) => res.send(food)
    //   .then((food) => {
    //     console.log(`You're a beast! ${food}`);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   }));
  });
};
