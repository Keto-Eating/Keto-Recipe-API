module.exports = (app) => {
  // const auth = require('./helpers/auth')
<<<<<<< HEAD
  const FavoriteSchema = require('../models/favorite');
  
  // Show all recipes saved in their cart
  app.get('/favorites', (req, res) => {
    console.log(app.locals.username);
    FavoriteSchema.find({}, function(err, favorites) {
      if (err) {
        console.error(err);
      } else {
        console.log(favorites);
        res.render('favorites', {
          favorites: favorites
        });
      }
    });
=======
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  // Show all recipes saved in their cart
  app.get('/favorites', (req, res) => {
    // find recipe, return ones that have been favorited 1+ times
    RecipeSchema.find({
      'usersWhoFavorited': {
        $ne: null
      }
    }, function(err, recipes) {
      if (err) {
        console.error(err);
      } else {
        res.render('favorites', {
          recipes: recipes
        });
        console.log(recipes);
      }
    })
>>>>>>> favorites
  });

  // Send a POST request to the database to create the recipes collection
  app.post('/favorites/', (req, res) => {
<<<<<<< HEAD
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
=======
    const favoriteId = req.body.favoriteId;
    const userId = app.locals.user.id

    // find recipe, add userId to usersWhoFavorited
    RecipeSchema.findByIdAndUpdate(favoriteId, {
      $addToSet: {usersWhoFavorited: userId }}, function(err) {
      if (err) return handleError(err);
    });
    // find user, save favorite to arrayOfFavoriteRecipes
    UserSchema.findByIdAndUpdate(userId, {
      $addToSet: { arrayOfFavoriteRecipes: favoriteId }}, function (err, user) {
      if (err) return handleError(err);
      app.locals.user = user // update user locally
      console.log(user);
>>>>>>> favorites
    });
  });
};
