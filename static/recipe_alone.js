function fetchRecipeData(recipe_id) {
  $.ajax({
    type: "POST",
    url: "/load_recipe",
    contentType: "application/json",
    data: JSON.stringify({ item_id: recipe_id }),
    dataType: "json",
    success: function (response) {
      var recipe_data = response.data;

      $(".recipe-alone-title").text(
        `${
          recipe_data.recipe_name.charAt(0).toUpperCase() +
          recipe_data.recipe_name.slice(1)
        } Recipe`
      );

      createRecipe(recipe_data);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching recipe data:", error);
    },
  });
}

function createRecipe(recipe_data) {
  let images = recipe_data.images;
  let recipe_name = recipe_data.recipe_name;
  let image_columns = $(
    `<div class="col-md-4"><img src="${images[0]}" alt="${recipe_name}"></div>
    <div class="col-md-4"><img src="${images[1]}" alt="${recipe_name}"></div>
    <div class="col-md-4"><img src="${images[2]}" alt="${recipe_name}"></div>`
  );
  $(".recipe-alone-images").append(image_columns);

  $(".recipe-description").text(recipe_data.description);
  $(".recipe-prep-time").text(`Prep Time: ${recipe_data.prep_time}`);

  $(".recipe-alone-ingredients").html(
    "<div class='recipe-alone-section-title'>Ingredients</div>"
  );

  let ingred_list = $("<ul class='ingredient-list'></ul>");
  for (let ingred in recipe_data.ingredients) {
    let ingred_data = recipe_data.ingredients[ingred];
    let amount_text = ingred_data.amount ? `: ${ingred_data.amount}` : "";
    let ingred_element = `
        <li class="recipe-alone-ing-single">
            ${ingred}${amount_text}
        </li>
        `;
    ingred_list.append(ingred_element);
  }
  $(".recipe-alone-ingredients").append(ingred_list);

  $(".recipe-alone-steps").html(
    "<div class='recipe-alone-section-title'>Steps</div>"
  );
  for (let step_key in recipe_data.steps) {
    let step = recipe_data.steps[step_key];
    let step_div = $(`
        <div class="row recipe-alone-step-single">
            <div class="col-md-12">
                <strong class="recipe-alone-step-title">${
                  step.step_title
                }</strong>
                <ul class="step-details">
                    ${step.step_details
                      .map((detail) => `<li>${detail}</li>`)
                      .join("")}
                </ul>
            </div>
        </div>
    `);
    $(".recipe-alone-steps").append(step_div);
  }
}

$(document).ready(function () {
  fetchRecipeData(recipe_id);
});
