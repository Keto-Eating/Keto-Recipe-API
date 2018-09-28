// controllers/users.js

module.exports = (app) => {

  app.get('/login', (req, res) => {
    res.send('Hello Keto!');
  });
}