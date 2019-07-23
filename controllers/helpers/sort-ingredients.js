/* eslint-disable max-len */
module.exports = (listOfParsedIngredients) => {
  listOfParsedIngredients.sort((a, b) => ((a.ingredient.toLowerCase() > b.ingredient.toLowerCase()) ? 1 : -1));
};
