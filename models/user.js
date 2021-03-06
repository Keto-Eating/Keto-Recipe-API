/* eslint-disable no-use-before-define */
/* eslint-disable no-multi-spaces */
/* eslint-disable key-spacing */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  createdAt              : { type: Date, default: Date.now },
  updatedAt              : { type: Date },
  password               : { type: String, select: false },
  username               : { type: String, required: true, unique: true },
  recipesInCart          : { type: Array },
  arrayOfFavoriteRecipes : { type: Array }, /* --> an array of recipeIds */
  groceryList            : { type: mongoose.Schema.Types.ObjectId, ref: 'GroceryListSchema' },
});

// Make sure that only 1 user can exist with the same username
UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

// Defines the callback with a regular function to avoid problems with this schema
UserSchema.pre('save', function (next) {
  const user = this;
  user.updatedAt = Date.now;

  // if password has been modified
  if (this.isModified('password')) {
    // ENCRYPT PASSWORD
    bcrypt.hash(user.password, 10, (errHashing, hash) => {
      if (errHashing) return next(errHashing);
      user.password = hash;
      next();
    });
  }
  next();
});

UserSchema.statics.authenticate = function (username, password, next) {
  // eslint-disable-next-line quotes
  console.log("username:", username, "password:", password);
  User
    .findOne({
      username,
    }, 'username password') // fetch username and password
    .then((user) => {
      if (!user) {
        const error = new Error('User not found.');
        error.status = 401;
        return next(error);
      }
      if (user) {
        // User found, compare password
        console.log(user);
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) return next(error);
          if (isMatch === true) {
            return next(null, user);
          }
          return next(null, false);
        });
      }
    })
    .catch(err => next(err));
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
