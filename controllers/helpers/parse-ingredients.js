const { parse } = require('recipe-ingredient-parser-v2');
const sortIngredients = require('./sort-ingredients.js');
const IngredientSchema = require('../../models/ingredient');

module.exports = (cartRecipes, userId) => {
  const listOfIngredients = [];
  cartRecipes.forEach((recipe) => {
    // iterate through recipes in cart
    recipe.ingredientLines.forEach((ingredient) => {
      // remove symbols
      const ingrWithoutStars = ingredient.replace('*', '');
      const ingrWithoutPeriod = ingrWithoutStars.replace('.', '');

      // parse
      const parsedIngredient = parse(ingrWithoutPeriod);
      const parsedIngredientWithUser = {
        ...parsedIngredient,
        user: userId,
      };

      // console.log(parsedIngredient);
      // add to array
      const ingr = new IngredientSchema(parsedIngredientWithUser);
      ingr.save()
        .then((ingrFromDB) => {
          listOfIngredients.push(ingrFromDB);
          console.log(ingrFromDB);
        })
        .catch(err => console.log(err));
    });
  });

  sortIngredients(listOfIngredients);
  // console.log(listOfIngredients);
  return listOfIngredients;
};
