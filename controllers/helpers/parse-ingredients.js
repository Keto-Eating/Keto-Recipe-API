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

      // add parsed ingredient to the list of ingredients
      listOfIngredients.push(parsedIngredient);
    });
  });

  // deduplicate ingredients
  const dedupedIngredients = combine(listOfIngredients);

  // print results
  console.log(`Found ${listOfIngredients.length} TOTAL ingredients in the recipes`);
  console.log(`Became ${dedupedIngredients.length} UNIQUE ingredients after de-duplicating`);

  // dedupedIngredients.forEach((ingr) => {
  //   const parsedIngredientWithUser = {
  //     ...ingr,
  //     user: userId,
  //   };
  //   // add to array
  //   const ingredient = new IngredientSchema(parsedIngredientWithUser);
  //   ingredient.save()
  //     .then((ingrFromDB) => {
  //       listOfIngredients.push(ingrFromDB);
  //     })
  //     .catch(err => console.log(err));
  // });

  // sort ingredients
  sortIngredients(dedupedIngredients);

  // return ingredients before rendering the page
  return dedupedIngredients;
};
