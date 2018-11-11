module.exports = (app) => {

  // Render the signup form
  app.get('/dashboard', (req, res) => {

    // TODO: (1) Search for user's favorites (2) show them using code similar to below

    // FavoriteSchema.find({}).sort({'createdAt': -1}).limit(3).exec(function(err, favorites) {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       // console.log(favorites);
    //       res.render('dashboard', {
    //         favorites: favorites
    //       });
    //     }
    //     // `posts` will be of length 20
    //   });
  });

  app.get('/dashboard/favorites', (req, res) => {
    // TODO: (1) Find user's favorites (2) show all of them
    res.render('dashboard/favorites');
  });

}
