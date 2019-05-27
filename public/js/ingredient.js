/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// adds an onClick event listener for the heart button
// post to favs by recipe id
// function toggleIngredient(ingredientId) {
//   $.post('/favorites', {
//     recipeId,
//   });
//   // get heart that was just clicked
//   const heartId = `${recipeId}-heart`;
//   heart = document.getElementById(heartId);
//   // toggle 'favorited' class
//   heart.classList.toggle('favorited');
// }

function toggleIngredient(ingredientId) {
  $.post('/cart/grocery-list/toggleIngredient', {
    ingredientId,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
