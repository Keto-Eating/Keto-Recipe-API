/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// adds an onClick event listener for the heart button
// post to favs by recipe id
function saveFavorite(recipeId) {
  $.post('/favorites', {
    recipeId,
  });
  // get heart that was just clicked
  const heartId = `${recipeId}-heart`;
  heart = document.getElementById(heartId);
  // toggle 'favorited' class
  heart.classList.toggle('favorited');
}

function saveToCart(recipeId) {
  $.post('/cart', {
    recipeId,
  })
    .then((res) => {
      if (res === 'removed') {
        // do not redirect to cart if you just removed recipe
        location.reload(true);
      } else {
        // if you just added recipe, redirect to cart
        window.location.pathname = '/cart';
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
