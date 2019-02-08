/* eslint-disable func-names */
/* eslint-disable key-spacing */
const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
  createdAt         : { type: Date },
  updatedAt         : { type: Date },
  uri               : { type: String, required: true },
  label             : { type: String, required: true },
  image             : { type: String, required: true },
  url               : { type: String, required: true },
  yield             : { type: Number },
  cautions          : { type: Array },
  healthLabels      : { type: Array },
  dietLabels        : { type: Array },
  ingredientLines   : { type: Array },
  calories          : { type: Number },
  totalWeight       : { type: Number },
  totalTime         : { type: Number },
  usersWhoFavorited : { type: Array },
});

RecipeSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
