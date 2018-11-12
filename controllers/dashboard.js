module.exports = (app) => {
  const FavoriteSchema = require('../models/favorite');
  // Render the signup form
  app.get('/dashboard', (req, res) => {

    FavoriteSchema.find({}).sort({
      'createdAt': -1
    }).limit(3).exec(function(err, favorites) {
      if (err) {
        console.error(err);
      } else {
        res.render('dashboard', {
          favorites: favorites
        });
      }
    });
  });

  app.get('/dashboard/favorites', (req, res) => {

    FavoriteSchema.find({}).sort({
      'createdAt': -1
    }).exec(function(err, favorites) {
      if (err) {
        console.error(err);
      } else {
        res.render('dashboard/favorites', {
          favorites: favorites
        });
      }
    });
  });
};
