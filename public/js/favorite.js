$(document).ready(function() {

  $('.favorite-form').submit(function(e) {
    e.preventDefault();
    let favoriteId = $('input[name="favoriteId"]').val();
    let userId = $('input[name="userId"]').val(); // TODO: find a safer way to do this
    // console.log(user);
    if (userId != null) {
      // logged in, post to favorites
      $.post("favorites/", {
        favoriteId: favoriteId,
      });
    } else {
      // not logged in, redirect to login
      var url = "/login";
      $(location).attr('href', url);
    }
  });
});
