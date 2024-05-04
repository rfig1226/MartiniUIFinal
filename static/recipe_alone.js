function fetchRecipeData(recipe_id) {
  $.ajax({
    type: "POST",
    url: "/load_recipe",
    contentType: "application/json",
    data: JSON.stringify({ item_id: recipe_id }),
    dataType: "json", // Ensure you're expecting a JSON response
    success: function (response) {
      // Update page content with the fetched data
      var recipe_data = response.data;

      $(".recipe-alone-title").text(
        `${
          recipe_data.recipe_name.charAt(0).toUpperCase() +
          recipe_data.recipe_name.slice(1)
        } Recipe`
      );

      createSteps(recipe_data);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching recipe data:", error);
    },
  });
}

$(document).ready(function () {
  fetchRecipeData(recipe_id);
});
