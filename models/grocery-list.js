/* eslint-disable func-names */
/* eslint-disable key-spacing */
const mongoose = require('mongoose');

const GroceryListSchema = mongoose.Schema({
  createdAt         : { type: Date, default: Date.now },
  updatedAt         : { type: Date },
  ingredients       : { type: Array },
  recipes           : { type: Array },
  user              : { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', required: true },
},
{
  timestamps: true,
});

GroceryListSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('GroceryList', GroceryListSchema);
