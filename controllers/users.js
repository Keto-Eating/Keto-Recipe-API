/* eslint-disable no-param-reassign */
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
  app.post('/signup', (req, res, next) => {
    // CREATE User and JWT
    const user = new UserSchema(req.body);

    user.save()
      .then((savedUser) => {
        const token = jwt.sign({
          _id: savedUser._id,
        }, process.env.SECRET, {
          expiresIn: '120 days',
        });
        res.cookie('nToken', token, {
          maxAge: 900000,
          httpOnly: true,
        });
        // console.log(`user is: ${user}`);
        app.locals.user = user;
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
    UserSchema.findOne({
      username,
    }, 'username password arrayOfFavoriteRecipes')
      .then((user) => {
        if (!user) {
          // User not found
          const nextError = new Error('User with that username does not exist');
          nextError.status = 401;
          return next(nextError);
        } else {
          // console.log(user)
          // Check the password
          user.comparePassword(password, (err, isMatch) => {
            console.log(isMatch);
            if (!isMatch) {
              const nextError = new Error('Incorrect password');
              nextError.status = 401;
              return next(nextError);
            } else {
              app.locals.user = user;
              // Create the token
              const token = jwt.sign({
                _id: user._id,
                username: user.username,
              }, process.env.SECRET, {
                expiresIn: '120 days',
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
      .catch(err => next(err));
  });

  // LOGOUT
  app.post('/logout', (req, res) => {
    res.clearCookie('nToken');
    app.locals.user = null;
    res.redirect('back'); // to automatically redirect back to the page the request came from
  });

  // DELETE USER ACCOUNT
  app.post('/delete-user', (req, res, next) => {
    // Look for user in the database
    // if found, remove
    // if not found, return some sort of error
    UserSchema.findByIdAndRemove(app.locals.user.id, req.body)
      .then((deletedUser) => {
        console.log('User account has been removed');
        res.redirect('/');
      }).catch(err => next(err));
  });
};
