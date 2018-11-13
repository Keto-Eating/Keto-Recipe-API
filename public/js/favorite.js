function saveFavorite(recipeId) {
  $.post("favorites/", {
    favoriteId: recipeId,
  });
}
