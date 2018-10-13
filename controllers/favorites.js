module.exports = (app) => {
  // const auth = require('./helpers/auth')
  const FavoriteSchema = require('../models/favorite');

  // Show all recipes saved in their cart
  app.get('/favorites', (req, res) => {
    console.log(app.locals.username);
    res.render('favorites', {username: app.locals.username});

  });

  // Send a POST request to the database to create the recipes collection

  app.post('/favorites/', (req, res) => {

    const favorite = new FavoriteSchema({
      recipeName: req.body.recipeName,
      imageUrl: req.body.imageUrl,
      recipeUrl: req.body.recipeUrl,
      ingredients: req.body.ingredients,
      uri: req.body.uri
    });

    favorite.save(function(err, favorite) {
    if(err) console.log(err);
    console.log("successfully saved a favorite");
  });
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
