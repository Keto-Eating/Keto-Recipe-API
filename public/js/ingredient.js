/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function toggleIngredient(elmt, groceryListId, ingrIdx) {
  $.post('/cart/grocery-list/toggleIngredient', {
    groceryListId,
    ingrIdx,
    newValue: elmt.checked, // if checkbox was checked before toggling it
  })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
