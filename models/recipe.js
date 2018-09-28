// models/recipe.js
const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  name: { type: String, required: true }
});


RecipeSchema.pre('save', function (next) {
  const now = new Date();
  // SET createdAt AND updatedAt
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
