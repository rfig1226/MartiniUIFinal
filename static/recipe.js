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

      $(".recipe-header").text(
        `How to Make a ${
          recipe_data.flavor_profile.charAt(0).toUpperCase() +
          recipe_data.flavor_profile.slice(1)
        } Martini: The ${recipe_data.recipe_name}`
      );

      createSteps(recipe_data);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching recipe data:", error);
    },
  });
}

function createSteps(recipe_data) {
  let recipe_steps = recipe_data.steps;
  console.log(recipe_steps);

  for (let step in recipe_steps) {
    console.log(step);
    let step_title = recipe_steps[step].step_title;
    let step_video = recipe_steps[step].step_video;
    console.log(step_title);
    let step_element = $(`<div class="step-item" id="${step}">
            <div class="step-title">${step_title}</div>
            <div class="step-video-container">
                <div class="step-video">${step_video}</div>
            </div>
            <div class="sub-steps" id="sub-${step}"></div>
            </div>`);

    let sub_steps = recipe_steps[step].step_details;
    $(".recipe-steps").append(step_element);

    for (let sub_step in sub_steps) {
      let sub_step_element = $(
        `<div class="sub-step-item">
            <div class="sub-step-num">${parseInt(sub_step) + 1}.</div> 
            <div class="sub-step-description">${sub_steps[sub_step]}</div>
        </div>`
      );
      console.log(sub_step_element);
      $(`#sub-${step}`).append(sub_step_element);
    }

    if (step === "step1") {
      step_element.addClass("active");
    }
  }

  if ($(".step-item.active").is(":first-child")) {
    $("#prev-step-btn").prop("disabled", true);
  }
}

$(document).ready(function () {
  fetchRecipeData(recipe_id);

  $("#next-step-btn").click(function () {
    var currentActive = $(".step-item.active");
    var nextStep = currentActive.next(".step-item");

    if (nextStep.length) {
      currentActive.removeClass("active");
      nextStep.addClass("active");
      // Always enable the 'Previous Step' button when moving from the first step
      $("#prev-step-btn").prop("disabled", false);
    }

    // Automatically append the button if it's the last step
    if (!nextStep.next(".step-item").length) {
      $(this).text("Test Your Knowledge"); // Change the button text to "Go to Quiz"
      $(this)
        .off("click")
        .click(function () {
          // Remove previous click handlers and add new one
          window.location.href = "/recipe_quiz/" + recipe_id; // Redirect to the quiz page
        });
    }
  });

  $("#prev-step-btn").click(function () {
    var currentActive = $(".step-item.active");
    var prevStep = currentActive.prev(".step-item");
    $("#next-step-btn").text("Next Step");

    if (prevStep.length) {
      currentActive.removeClass("active");
      prevStep.addClass("active");
      $("#next-step-btn").prop("disabled", false);
    }

    if (prevStep.is(":first-child")) {
      $("#prev-step-btn").prop("disabled", true);
    }

    // Remove the quiz button if not on the last step anymore
    if (!prevStep.is(":last-child")) {
      // Check if it's no longer the last step
      $("#go-recipe-quiz-btn").remove();
    }
  });
});
