
// adds an onClick event listener for the heart button
// post to favs by recipe id
function saveFavorite(recipeId) {
  $.post("favorites/", {
    favoriteId: recipeId,
  });
  // get heart that was just clicked
  let heartId = recipeId + "-heart";
  heart = document.getElementById(heartId);
  // toggle 'favorited' class
  heart.classList.toggle('favorited');
}

function saveToCart(cartId) {
  $.post('cart/', {
    cartId: recipeId,
  });
  // get button that was just clicked
  let buttonId = recipeId + "button";
  heart = document.getElementById(heartId);
  // toggle 'favorited' class
  heart.classList.toggle('favorited');
}