$(document).ready(function () {
  // Call the function to fetch recipe data when the page loads
  fetchRecipeData(recipe_id);

  var correctOrder = []; // Array to store the correct order of steps

  // Function to fetch recipe data and update page content
  function fetchRecipeData(recipe_id) {
    $.ajax({
      type: "POST",
      url: "/load_recipe",
      contentType: "application/json",
      data: JSON.stringify({ item_id: recipe_id }),
      success: function (response) {
        // Update page content with the fetched data
        var recipeData = response.data;
        // Extract step titles and store them in correctOrder
        correctOrder = Object.values(recipeData.steps).map((step) =>
          step.step_title.substring(8)
        );
        updatePage(recipeData);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching recipe data:", error);
      },
    });
  }

  function updatePage(recipeData) {
    // Clear existing steps
    $("#steps-list").empty();

    // Populate steps dynamically and make them draggable
    var steps = recipeData.steps;
    var stepIds = Object.keys(steps).sort(() => Math.random() - 0.5); // Shuffle step ids
    stepIds.forEach(function (stepId, index) {
      var step = steps[stepId];
      // Extract the desired part of the step title and remove the first 8 characters
      var shortenedTitle = step.step_title.substring(8); // Remove the first 8 characters
      var stepHtml =
        "<li id='step-" +
        index +
        "' class='ui-state-default' style='padding: 10px;'>" +
        shortenedTitle +
        "</li>";
      $("#steps-list").append(stepHtml);
    });

    // Make the steps list sortable
    $("#steps-list").sortable({
      placeholder: "ui-state-highlight",
      update: function (event, ui) {
        // Callback function to handle sorting updates
        var currentOrder = $("#steps-list").sortable("toArray"); // Get the current order of steps
      },
    });
    $("#steps-list").disableSelection();
  }

  // Function to check user's sorting and calculate score
  $("#check-answers").click(function () {
    var score = calculateScore(correctOrder);
    displayResult(score);
    $(this).hide(); // Hide "Check Answers" button after checking
    $("#reset").show(); // Show the reset button
    $("#simulation-btn").show();
  });

  $("#simulation-btn").click(function () {
    window.location.href = "/simulation_quiz/" + recipe_id;
  });

  // Function to reset the quiz
  $("#reset").click(function () {
    fetchRecipeData(recipe_id);
    $("#result").empty(); // Clear result display
    $(this).hide(); // Hide the reset button again
    $("#check-answers").show(); // Show the "Check Answers" button again
    $("#simulation-btn").hide(); // Hide the simulation button
  });

  function calculateScore(correctOrder) {
    // Get the current order of steps
    var currentOrder = $("#steps-list").sortable("toArray");

    // Initialize score
    var score = 0;

    // Iterate over the current order of steps
    for (var i = 0; i < currentOrder.length; i++) {
      // Get the current step ID and its corresponding correct step title
      var currentStepId = currentOrder[i];
      var currentStepTitle = $("#" + currentStepId).text();

      // Get the correct step title from the correctOrder array
      var correctStepTitle = correctOrder[i];

      console.log(
        "current step: " +
          currentStepTitle +
          "vs. correct step: " +
          correctStepTitle
      );

      // Check if the current step title matches the correct step title
      if (currentStepTitle === correctStepTitle) {
        score++; // Increment score if the step is correct
        $("#" + currentStepId).css("background-color", "#314D1C");
        $("#" + currentStepId).css("color", "white");
      } else {
        // Change box color to red for incorrect steps
        $("#" + currentStepId).css("background-color", "red");
        // Display correct step below the incorrect one
        $("#" + currentStepId).after(
          "<li style='color: red;'>Correct step: " + correctStepTitle + "</li>"
        );
      }
    }
    return score;
  }

  function displayResult(score) {
    var percentage = Math.round((score / correctOrder.length) * 100);
    $("#result").text(
      "Results: " + percentage + "% (" + score + "/" + correctOrder.length + ")"
    );
  }
});
