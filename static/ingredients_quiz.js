$(document).ready(function () {
  fetchRecipeData(recipe_id);
  let totalCount = 0;
  let matchCount = 0;

  function fetchRecipeData(recipe_id) {
    $.ajax({
      type: "POST",
      url: "/load_recipe",
      contentType: "application/json",
      data: JSON.stringify({ item_id: recipe_id }),
      dataType: "json",
      success: function (response) {
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
      start: function (event, ui) {
        $(this).css({
          "background-color": "#284e13",
          color: "white",
        });
      },
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

        draggable.appendTo(droppable).css({
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        });

        ui.draggable.draggable("disable");

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

        $("#submit-quiz").prop("disabled", !allDropped);
      },
    });
  }

  function resetQuiz() {
    $(".drag-measurement").each(function () {
      $(this)
        .appendTo(".measurements")
        .css({
          "background-color": "#DCE9D5",
          color: "#284e13",
          width: "",
          height: "",
          top: "",
          left: "",
        })
        .removeClass("dropped")
        .draggable("enable");
    });

    $(".ing-quiz-results").empty();
    matchCount = 0;
    totalCount = 0;
    $("#submit-quiz").prop("disabled", true);
  }

  $("#reset-ing-quiz-btn").click(resetQuiz);

  $("#submit-quiz").click(function () {
    var percentage = Math.round((matchCount / totalCount) * 100);
    $(".ing-quiz-results").text(
      "Results: " + percentage + "% (" + matchCount + "/" + totalCount + ")"
    );
    let goRecipeButton = $(
      "<button class='btn-custom' id='go-recipe-button'>Learn Recipe</button>"
    );
    $(".ing-quiz-btn-container").append(goRecipeButton);
    $(this).hide();
    $("#reset-ing-quiz-btn").hide();

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
