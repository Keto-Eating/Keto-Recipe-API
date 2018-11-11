$(document).ready(function() {

  $('.favorite-form').submit(function (e) {
    e.preventDefault();
    let favoriteId = $('input[name="favoriteId"]').val();
    console.log(favoriteId);
    $.post("favorites/", {
      favoriteId: favoriteId,
     });
  });
});
