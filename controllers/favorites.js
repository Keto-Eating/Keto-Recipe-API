module.exports = (app) => {
  // const auth = require('./helpers/auth')
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
        res.render('index', {
          recipes: recipes
        });
        console.log(recipes);
      }
    })
  });

  // Send a POST request to the database to create the recipes collection
  app.post('/favorites/', (req, res) => {
    const favoriteId = req.body.favoriteId;
    const userId = app.locals.user.userId

    // find recipe, add username to usersWhoFavorited
    RecipeSchema.findByIdAndUpdate(req.body.favoriteId, {
      $addToSet: {
        usersWhoFavorited: userId
      }
    }, function(err) {
      if (err) {
        console.error(err)
      };
    });
    // find user, save favorite to arrayOfFavoriteRecipes
    UserSchema.findByIdAndUpdate(req.body.userId, {
      $addToSet: {
        arrayOfFavoriteRecipes: userId
      }
    }, function(err) {
      if (err) {
        console.error(err)
      };
    });
  });
};
