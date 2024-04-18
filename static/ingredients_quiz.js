$(document).ready(function () {
  // Get the recipe_id from the URL
  console.log("recipe id: " + recipe_id);

  // Call the function to fetch recipe data when the page loads
  fetchRecipeData(recipe_id);
  let totalCount = 0;
  let matchCount = 0;

  // Function to fetch recipe data and update page content
  function fetchRecipeData(recipe_id) {
    $.ajax({
      type: "POST",
      url: "/load_recipe",
      contentType: "application/json",
      data: JSON.stringify({ item_id: recipe_id }),
      dataType: "json", // Ensure you're expecting a JSON response
      success: function (response) {
        // Update page content with the fetched data
        var recipeData = response.data;
        updatePage(recipeData);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching recipe data:", error);
      },
    });
  }

  function updatePage(recipeData) {
    $("#ingredient-title").text("How to Make a " + recipeData.recipe_name);
    $(".measurements").empty();
    $(".ingredient-target").empty();

    // Add ingredients to the list
    $.each(recipeData.ingredients, function (key, value) {
      if ("amount" in value) {
        let measurement = $(
          `<div class="row drag-measurement">${value.amount}</div>`
        );
        let ingredientTarget = $(
          `<div class="row drop-ingredient">${key}</div>`
        );

        $(".measurements").append(measurement);
        $(".ingredient-target").append(ingredientTarget);
      }
    });

    $(".drag-measurement").draggable({
      revert: "invalid",
    });

    $(".drop-ingredient").droppable({
      drop: function (event, ui) {
        var draggable = ui.draggable;
        var droppable = $(this);
        var draggableText = draggable.text().trim();
        var droppableText = droppable.text().trim();

        ui.draggable.addClass("dropped");

        draggable.css("background-color", "#314D1C");
        draggable.css("color", "white");

        // Append the draggable to the droppable
        draggable.appendTo(droppable).css({
          top: 0,
          left: 0,
          width: "100%", // Match the width of droppable
          height: "100%", // Match the height of droppable
        });

        ui.draggable.draggable("disable");

        // Check if the values are the same

        let isCorrect =
          draggableText === recipeData.ingredients[droppableText].amount;
        if (isCorrect) {
          matchCount++;
        }
        droppable.data("correct", isCorrect);
        droppable.data("drop-name", droppableText);
        droppable.data(
          "drop-measure",
          recipeData.ingredients[droppableText].amount
        );
        totalCount++;

        var allDropped =
          $(".drag-measurement.dropped").length ===
          $(".drag-measurement").length;

        // If all draggables are dropped, enable the submit button
        $("#submit-quiz").prop("disabled", !allDropped);
      },
    });
  }

  // Redirect to ingredients page when the button is clicked
  $("#submit-quiz").click(function () {
    $(".ing-quiz-results").text("Results: " + matchCount + "/" + totalCount);
    let goRecipeButton = $(
      "<button class='button button-text' id='go-recipe-button'>Learn Recipe</button>"
    );
    $(".ing-quiz-footer").append(goRecipeButton);

    $(".drop-ingredient").each(function () {
      var droppable = $(this);
      var isCorrect = droppable.data("correct");
      var ingredient = droppable.data("drop-name");
      var measure = droppable.data("drop-measure");

      var full_ing = `<br>${ingredient}: ${measure}`;
      droppable.css("background-color", isCorrect ? "#4CAF50" : "#F44336");
      var text = (isCorrect ? "Correct!" : "Incorrect!") + full_ing;
      droppable.html(text);
    });
  });

  $(document).on("click", "#go-recipe-button", function () {
    window.location.href = "/recipe/" + recipe_id;
  });
});
