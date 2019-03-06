const { parse } = require('recipe-ingredient-parser');

// const isNumber = require('is-number');

module.exports = (cartRecipes) => {
  const listOfIngredients = [];
  cartRecipes.forEach((recipe) => {
    // iterate through recipes in cart
    recipe.ingredientLines.forEach((ingredient) => {
      const ingrWithoutStars = ingredient.replace('*', '');
      const ingrWithoutPeriod = ingrWithoutStars.replace('.', '');
      const parsedIngredient = parse(ingrWithoutPeriod);
      listOfIngredients.push(parsedIngredient);
    });
  });
  console.log(listOfIngredients);
  return listOfIngredients;
};

// parseIngredient(ingredient) {
//   const ingrWithoutStars = ingredient.replace('*', '');
//     const ingrWordsArr = ingrWithoutStars.split(' ');

//     if (ingrWordsArr.length === 1) {
//       // this catches instances like "salt"
//       const qty = 1;
//       const unit = 'x';
//       const desc = ingrWordsArr.slice(0, ingrWordsArr.length).join(' ');
//       listOfIngredients.push([qty, unit, desc]);
//     } else if (ingrWordsArr.length === 2 && isNumber(ingrWordsArr[0])) {
//       // this catches instances like "1 Lime"
//       const qty = ingrWordsArr[0];
//       const unit = '';
//       const desc = ingrWordsArr.slice(1, ingrWordsArr.length).join(' ');
//       listOfIngredients.push([qty, unit, desc]);
//     } else {
//       // almost every other ingredient will land in here
//       const qty = ingrWordsArr[0];
//       const unit = ingrWordsArr[1];
//       const desc = ingrWordsArr.slice(2, ingrWordsArr.length).join(' ');
//       listOfIngredients.push([qty, unit, desc]);
//     }
// }
