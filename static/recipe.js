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
      createSteps(recipeData);
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
    console.log(step_title);
    let step_element = $(`<div class="step-item" id="${step}">
            <div class="step-title">${step_title}</div>
            <div class="sub-steps" id="sub-${step}"></div>
            </div>`);

    let sub_steps = recipe_steps[step].step_details;
    $(".recipe-steps").append(step_element);

    for (let sub_step in sub_steps) {
      let sub_step_element = $(
        `<div class="sub-step-item">${sub_steps[sub_step]}</div>`
      );
      console.log(sub_step_element);
      $(`#sub-${step}`).append(sub_step_element);
    }

    if (step === "step1") {
      step_element.addClass("active");
    }
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
    }
  });

  $("#prev-step-btn").click(function () {
    var currentActive = $(".step-item.active");
    var prevStep = currentActive.prev(".step-item");

    if (prevStep.length) {
      currentActive.removeClass("active");
      prevStep.addClass("active");
    }
  });
});
