$(document).ready(function() {

  $('.favorite-form').submit(function (e) {
    e.preventDefault();
    var recipeName = $('input[name="recipeName"]').val();
    console.log(recipeName);
    console.log('trying to fire ajax request');
    $.post("favorites/", {
      recipeName: recipeName,
      imageUrl: imageUrl,
      recipeUrl: recipeUrl,
      ingredients: ingredients,
      uri: uri
     });

     console.log(req.body.recipeName);
     console.log(req.body.imageUrl);
     console.log(req.body.recipeUrl);
     console.log(req.body.ingredients);
     console.log(req.body.uri);
    // $.ajax({
    //   type: 'POST',
    //   url: 'favorites/',
    //   data: { field1: "hello", field2 : "hello2"},
    //   success: function(data) {
    //     console.log("making an ajax request");
    //   },
    //   error: function(err) {
    //     console.log(err.messsage);
    //   }
    // });
  });

});
