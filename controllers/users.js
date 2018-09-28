// controllers/users.js

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.send('Hello Keto!');
  });

};