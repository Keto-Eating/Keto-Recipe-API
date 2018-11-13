function saveFavorite(recipeId) {
  $.post("favorites/", {
    favoriteId: recipeId,
  });
  // TODO: get heart that was just clicked
  // TODO: toggle 'favorited' class
}
