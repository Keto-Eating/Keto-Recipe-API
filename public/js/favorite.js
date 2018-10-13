$(document).ready(function() {

  $('.favorite-form').submit(function (e) {
    e.preventDefault();
    let recipeName = $('input[name="recipeName"]').val();
    let imageUrl = $('input[name="imageUrl"]').val();
    let recipeUrl = $('input[name="recipeUrl"]').val();
    let ingredients = $('input[name="ingredients"]').val();
    let uri = $('input[name="uri"]').val();

    $.post("favorites/", {
      recipeName: recipeName,
      imageUrl: imageUrl,
      recipeUrl: recipeUrl,
      ingredients: ingredients,
      uri: uri
     });
  });
});
