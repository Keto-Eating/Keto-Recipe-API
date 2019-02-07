/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
// controllers/users.js

module.exports = (app) => {
  const jwt = require('jsonwebtoken');
  const UserSchema = require('../models/user');

  // Render the signup form
  app.get('/signup', (req, res) => {
    res.render('signup.hbs');
  });

  // POST: creates a new user
  app.post('/signup', (req, res) => {
    // CREATE User and JWT
    const user = new UserSchema(req.body);

    user.save().then((savedUser) => {
      const token = jwt.sign({
        _id: savedUser._id,
      }, process.env.SECRET, {
        expiresIn: '60 days',
      });
      res.cookie('nToken', token, {
        maxAge: 900000,
        httpOnly: true
      });
      console.log(`user is: ${user}`);
      app.locals.user = user;
      res.redirect('/');
      // res.send("blah")
    }).catch(err => res.status(400).send({
      err,
    }));
  });

  // LOGIN FORM
  app.get('/login', (req, res) => {
    res.render('login.hbs');
  });

  // LOGIN USER
  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Look for this user name
    UserSchema.findOne({
      username,
    }, 'username password arrayOfFavoriteRecipes')
      .then((user) => {
        if (!user) {
          // User not found
          return res.status(401).send({
            message: 'User with that username does not exist',
          });
        } else {
          // console.log(user)
          // console.log('app locals user: ' + app.locals.user);
          // Check the password
          user.comparePassword(password, (err, isMatch) => {
            console.log(isMatch);
            if (!isMatch) {
              return res.status(401).send({
                message: 'Incorrect password',
              });
            } else {
              app.locals.user = user;
              // Create the token
              const token = jwt.sign({
                _id: user._id,
                username: user.username,
              }, process.env.SECRET, {
                expiresIn: '60 days',
              });
              // Set a cookie and redirect to root
              res.cookie('nToken', token, {
                maxAge: 900000,
                httpOnly: true,
              });
              console.log('Successfully logged in.');
              res.redirect('/dashboard');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  // LOGOUT
  app.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    app.locals.user = null;
    res.redirect('back'); // to automatically redirect back to the page the request came from
  });
};
