/* eslint-disable no-multi-spaces */
/* eslint-disable key-spacing */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  createdAt              :  {  type: Date  },
  updatedAt              :  {  type: Date  },
  password               :  {  type: String, select: false },
  username               :  {  type: String, required: true, unique: true },
  arrayOfFavoriteRecipes :  {  type: Array },
  recipesInCart          :  {  type: Array },
});

// Make sure that only 1 user can exist with the same username
UserSchema.plugin(uniqueValidator);

// Defines the callback with a regular function to avoid problems with this schema
UserSchema.pre('save', function (next) {
  // SET createdAt AND updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  // ENCRYPT PASSWORD
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (errHashing, hash) => {
      if (errHashing) return next(errHashing);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
