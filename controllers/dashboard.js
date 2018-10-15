module.exports = (app) => {

  // Render the signup form
  app.get('/dashboard', (req, res) => {
    res.render('dashboard.hbs');
  });

}
