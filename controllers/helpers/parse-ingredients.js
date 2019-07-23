/* eslint-disable no-underscore-dangle */
const { parse, combine } = require('recipe-ingredient-parser-v2');
const sortIngredients = require('./sort-ingredients.js');
// const IngredientSchema = require('../../models/ingredient');

module.exports = (cartRecipes, userId) => {
  const listOfIngredients = [];

  cartRecipes.forEach((recipe) => {
    // iterate through recipes in cart
    recipe.ingredientLines.forEach((ingredient) => {
      // remove symbols
      const ingrWithoutStars = ingredient.replace('*', '');
      const ingrWithoutPeriod = ingrWithoutStars.replace('.', '');

      // parse ingredient into object {ingredient: _, unit: _, quantity: _, minQty: _, maxQty: _}
      const parsedIngredient = parse(ingrWithoutPeriod);

      // add other info
      const ingr = {
        ...parsedIngredient,
        acquired: false,
      };

      // add parsed ingredient to the list of ingredients
      listOfIngredients.push(ingr);
    });
  });

  // deduplicate ingredients
  const dedupedIngredients = combine(listOfIngredients);

  // print results
  console.log(`Found ${listOfIngredients.length} TOTAL ingredients in the recipes`);
  console.log(`Became ${dedupedIngredients.length} UNIQUE ingredients after de-duplicating`);

  // TODO: REMOVE IF DECIDE TO KEEP INGREDIENTS AS AN ARRAY
  // const ingredientIds = [];
  // dedupedIngredients.forEach((ingr) => {
  //   const parsedIngredientWithUser = {
  //     ...ingr,
  //     user: userId,
  //   };
  //   const ingredient = new IngredientSchema(parsedIngredientWithUser);
  //   ingredient.save()
  //     .then((ingrFromDB) => {
  //       // add to array
  //       ingredientIds.push(ingrFromDB._id);
  //     })
  //     .catch(err => console.log(err));
  // });

  // sort ingredients
  sortIngredients(dedupedIngredients);

  // return ingredients before rendering the page
  return dedupedIngredients;
};
