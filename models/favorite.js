// models/recipe.js
const mongoose = require('mongoose');

const FavoriteSchema = mongoose.Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  recipeName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  recipeUrl: { type: String, required: true },
  ingredients: { type: Array, required: true },
  uri: {type: String, required: true }
});

FavoriteSchema.pre('save', function (next) {
  const now = new Date();
  // SET createdAt AND updatedAt
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
