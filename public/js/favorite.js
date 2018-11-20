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
