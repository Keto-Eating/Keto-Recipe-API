// src/config/database.js

// To export this without a function, use Key : value pair
module.exports = {
  'uri' : process.env.MONGODB_URI || 'mongodb://localhost:27017/keto'
};
