$(document).ready(function () {
  fetchRecipeData(recipe_id);

  function fetchRecipeData(recipe_id) {
    $.ajax({
      type: "POST",
      url: "/load_recipe",
      contentType: "application/json",
      data: JSON.stringify({ item_id: recipe_id }),
      dataType: "json",
      success: function (response) {
        var recipeData = response.data;

        $("#ingredient-title").text("How to Make a " + recipeData.recipe_name);
        $("#ingredients-list").empty();

        $.each(recipeData.ingredients, function (key, value) {
          let ingredientElement = $('<div class="ingredient-item"></div>');
          let imageContainer = $(
            '<div class="ingredient-image-container"></div>'
          );
          let image = $('<img class="ingredient-image">')
            .attr("src", value.image)
            .attr("alt", key);
          let name = $('<p class="ingredient-name"></p>').text(key);

          let measurementText = "";
          if (value.amount) {
            measurementText = $(
              '<div class="measurement-required"></div>'
            ).text("Measurement required:");
          }

          let amount = $('<p class="ingredient-amount"></p>').text(
            value.amount || ""
          );
          let tooltip = createTooltip(value);

          imageContainer.append(image);
          ingredientElement.append(imageContainer).append(name).append(tooltip);

          if (measurementText) {
            ingredientElement.append(measurementText);
          }

          ingredientElement.append(amount);
          $("#ingredients-list").append(ingredientElement);

          ingredientElement.hover(
            function () {
              $(this).find(".ingredient-tooltip").fadeIn(300);
            },
            function () {
              $(this).find(".ingredient-tooltip").fadeOut(300);
            }
          );
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching recipe data:", error);
      },
    });
  }

  $("#move-to-ingred-quiz").click(function () {
    window.location.href = "/ingredients_quiz/" + recipe_id;
  });

  function createTooltip(ingredientData) {
    let tooltip = $('<div class="ingredient-tooltip"></div>');

    tooltip.text(ingredientData.info ? ingredientData.info : "Click for more");
    return tooltip;
  }
});
