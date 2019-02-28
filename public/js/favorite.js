/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// adds an onClick event listener for the heart button
// post to favs by recipe id
function saveFavorite(recipeId) {
  $.post('favorites/', {
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
    .then(() => {
      window.location.pathname = '/cart';
    })
    .catch((err) => {
      console.log(err);
    });
  // get button that was just clicked
  const buttonId = `${recipeId} button`;
  // cartButton = document.getElementById(buttonId);
}
