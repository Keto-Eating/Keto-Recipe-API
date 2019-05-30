/* eslint-disable func-names */
/* eslint-disable key-spacing */
const mongoose = require('mongoose');

const IngredientSchema = mongoose.Schema({
  createdAt         : { type: Date, default: Date.now },
  updatedAt         : { type: Date },
  acquired          : { type: Boolean, default: false },
  ingredient        : { type: String, required: true },
  unit              : { type: String },
  quantity          : { type: Number },
  minQty            : { type: Number },
  maxQty            : { type: Number },
  user              : { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', required: true },
},
{
  timestamps: true,
});

IngredientSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('Ingredient', IngredientSchema);
