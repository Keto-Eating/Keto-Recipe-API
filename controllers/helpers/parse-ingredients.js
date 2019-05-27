const { parse } = require('recipe-ingredient-parser-v2');
const sortIngredients = require('./sort-ingredients.js');

module.exports = (cartRecipes) => {
  const listOfIngredients = [];
  cartRecipes.forEach((recipe) => {
    // iterate through recipes in cart
    recipe.ingredientLines.forEach((ingredient) => {
      // remove symbols
      const ingrWithoutStars = ingredient.replace('*', '');
      const ingrWithoutPeriod = ingrWithoutStars.replace('.', '');

      // parse
      const parsedIngredient = parse(ingrWithoutPeriod);

      // add to array
      listOfIngredients.push(parsedIngredient);
    });
  });

  sortIngredients(listOfIngredients);
  console.log(listOfIngredients);
  return listOfIngredients;
};
