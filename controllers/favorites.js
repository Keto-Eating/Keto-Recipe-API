/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
module.exports = (app) => {
  const RecipeSchema = require('../models/recipe');
  const UserSchema = require('../models/user');

  // route for showing favorites
  app.get('/dashboard/favorites', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    if (req.session.user) {
      const userId = req.session.user._id;
      UserSchema.findById(userId, (errFindingUser, user) => {
        if (errFindingUser) return res.next(errFindingUser);
        // to get updated user object
        RecipeSchema.find()
          .where('_id')
          .in(user.arrayOfFavoriteRecipes)
          .exec((_err, userFaves) => res.render('dashboard/favorites', {
            user,
            recipes: userFaves,
            instructions: 'You must save recipes as favorites.',
          }));
      });
    } else {
      return res.render('dashboard/favorites');
    }
  });

  // Send a POST request to the database to create the recipes collection
  app.post('/favorites', (req) => {
    console.log('***************** HERE');
    const favoriteId = req.body.recipeId;
    const userId = req.session.user._id;

    // find recipe, add userId to usersWhoFavorited
    RecipeSchema.findById(favoriteId, (errFindingFave, favoriteInDB) => {
      if (errFindingFave) return next(errFindingFave);
      if (favoriteInDB.usersWhoFavorited.includes(userId)) {
        // user already favorited, and is trying to un-favorite
        RecipeSchema.findByIdAndUpdate(favoriteId, {
          $pull: {
            usersWhoFavorited: userId,
          },
        }, (errPullingFave) => {
          if (errPullingFave) return next(errPullingFave);
        });
      } else {
        // user has not favorited before
        RecipeSchema.findByIdAndUpdate(favoriteId, {
          $addToSet: {
            usersWhoFavorited: userId,
          },
        }, (errSavingFave) => {
          if (errSavingFave) return next(errSavingFave);
        });
      }
    });

    // find user, save favorite to arrayOfFavoriteRecipes
    UserSchema.findById(userId, (errFindingUser, userInDB) => {
      console.log(' ******** LOOKING FOR USER ******** ');
      if (errFindingUser) {
        console.log(' COULDNT FIND USER ');
        return next(errFindingUser);
      }
      if (userInDB.arrayOfFavoriteRecipes.includes(favoriteId)) {
        console.log(' USER ALREADY FAVORITED ');
        // already favorited, remove from arrayOfFavoriteRecipes
        UserSchema.findByIdAndUpdate(userId, {
          $pull: {
            arrayOfFavoriteRecipes: favoriteId,
          },
        }, (errRemovingFave) => {
          if (errRemovingFave) {
            console.log(' ERROR REMOVING FROM USERSCHEMA ');
            return next(errRemovingFave);
          }
          console.log(' REMOVED FROM DATABASE ');
        });
      } else {
        // user has not favorited before, add to arrayOfFavoriteRecipes
        UserSchema.findByIdAndUpdate(userId, {
          $addToSet: {
            arrayOfFavoriteRecipes: favoriteId,
          },
        }, (errAddingFave) => {
          if (errAddingFave) {
            console.log(' ERROR ADDING TO USERSCHEMA ');
            return next(errAddingFave);
          }
          console.log(' ADDED TO USER MODEL ');
        });
      }
    });
  });
};
