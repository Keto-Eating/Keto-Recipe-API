/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  // Send a POST request to the database to create the recipes collection
  app.post('/favorites/', (req, res) => {
    const favoriteId = req.body.recipeId;
    const userId = app.locals.user.id;

    // find recipe, add userId to usersWhoFavorited
    RecipeSchema.findById(favoriteId, (err, favoriteInDB) => {
      if (err) return handleError(err);
      if (favoriteInDB.usersWhoFavorited.includes(userId)) {
        // user already favorited, and is trying to un-favorite
        RecipeSchema.findByIdAndUpdate(favoriteId, {
          $pull: { usersWhoFavorited: userId }}, (err) => {
          if (err) return handleError(err);
        });
      } else {
        // user has not favorited before
        RecipeSchema.findByIdAndUpdate(favoriteId, {
          $addToSet: { usersWhoFavorited: userId }}, (err) => {
          if (err) return handleError(err);
        });
      }
    });

    // find user, save favorite to arrayOfFavoriteRecipes
    UserSchema.findById(userId, (err, userInDB) => {
      if (err) return handleError(err);
      if (userInDB.arrayOfFavoriteRecipes.includes(favoriteId)) {
        // already favorited, remove from arrayOfFavoriteRecipes
        UserSchema.findByIdAndUpdate(userId, {
          $pull: { arrayOfFavoriteRecipes: favoriteId }}, (err, user) => {
          if (err) return handleError(err);
          app.locals.user = user;
          app.locals.user.arrayOfFavoriteRecipes.pull(favoriteId); // update user locally
        });
      } else {
        // user has not favorited before, add to arrayOfFavoriteRecipes
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: { arrayOfFavoriteRecipes: favoriteId }}, (err, user) => {
          if (err) return handleError(err);
          app.locals.user = user
          app.locals.user.arrayOfFavoriteRecipes.push(favoriteId); // update user locally
        });
      }
    });
  });
}
