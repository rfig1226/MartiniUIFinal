function fetchIngredientData(recipe_id) {
  let id_send = { item_id: recipe_id };
  console.log("fetching ingred");
  $.ajax({
    type: "POST",
    url: "/load_recipe",
    contentType: "application/json",
    data: JSON.stringify(id_send),
    success: function (response) {
      // Update page content with the fetched data
      var ingredients = response.data.ingredients;

      let title = "Ingredients for " + response.data["recipe_name"];
      $("#ingred-title").append(title);

      addIngredients(ingredients);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching recipe data:", error);
    },
  });
}

function addIngredients(ingredients) {
  for (let ingredient in ingredients) {
    let ingredientlist = $(`<div class="row ingredient-list-item">
                <div class="col-md-6">
                    ${ingredient}
                <div>
                <div class="col-md-6">
                    ${ingredients[ingredient]}
                <div>
            </div>
        `);

    $(".ingred-list").append(ingredientlist);
  }
}

$(document).ready(function () {
  fetchIngredientData(recipe_id);

  // Redirect to ingredients quiz
  $("#move-to-ingred-quiz").click(function () {
    window.location.href = "/ingredients_quiz/" + recipe_id;
  });
});
