module.exports = (app) => {

  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  // Send a POST request to the database to create the recipes collection
  app.post('/cart/', (req, res) => {
    console.log("in POST request");
    const recipeId = req.body.recipeId;
    const userId = app.locals.user.id;

    // find user, save recipeId to recipesInCart
    UserSchema.findById(userId, function(err, userInDB) {
      if (err) return handleError(err);
      if (userInDB.recipesInCart.includes(recipeId)) {
        // already addedToCart, remove from recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $pull: { recipesInCart: recipeId }}, function(err, user) {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.recipesInCart.pull(recipeId); // update user locally
        });
      } else {
        // user has not addedToCart before, add to recipesInCart
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: { recipesInCart: recipeId }}, function(err, user) {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.recipesInCart.push(recipeId); // update user locally
        });
      }
    });
  });
};
