module.exports = (app) => {
  // const auth = require('./helpers/auth')
  const FavoriteSchema = require('../models/favorite');

  // Show all recipes saved in their cart
  app.get('/favorites', (req, res) => {
    console.log(app.locals.username);
    FavoriteSchema.find({}, 'recipeName', function(err, favorites) {
        if (err) {
            console.error(err);
        } else {
            res.render('favorites', {
                favorites: favorites
            });
        }
    });
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
      if (err) console.log(err);
      console.log("successfully saved a favorite");
    });
  });
};
