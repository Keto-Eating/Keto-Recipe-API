// controllers/users.js

/* eslint-disable no-param-reassign */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */

module.exports = (app) => {
  const UserSchema = require('../models/user');

  // Render the signup form
  app.get('/signup', (req, res) => {
    res.render('signup.hbs');
  });

  // POST: creates a new user
  app.post('/signup', (req, res, next) => {
    // CREATE User and JWT
    const user = new UserSchema(req.body);

    user.save()
      .then((savedUser) => {
        req.session.user = savedUser;
        res.redirect('/');
      })
      .catch(() => {
        const nextError = new Error('Email address already taken. Did you mean to login?');
        nextError.status = 422; // validation error
        return next(nextError);
      });
  });

  // LOGIN FORM
  app.get('/login', (req, res) => {
    res.render('login.hbs');
  });

  // LOGIN USER
  app.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // Look for this user name
    UserSchema.authenticate(username, password, (err, user) => {
      if (err || !user) {
        return next(err);
      }
      // user authenticated correctly
      req.session.user = user;
      // redirect back to the page the request came from
      res.redirect('/');
    });
  });

  // LOGOUT
  app.get('/logout', (req, res, next) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) return next(err);
      });
    }
    // redirect back to the page the request came from
    res.redirect('back');
  });
};
