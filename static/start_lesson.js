$(document).ready(function () {
  console.log("recipe id: " + recipe_id);

  function fetchRecipeData(recipe_id) {
    $.ajax({
      type: "POST",
      url: "/load_recipe",
      contentType: "application/json",
      data: JSON.stringify({ item_id: recipe_id }),
      success: function (response) {
        var recipeData = response.data;
        $(".section-title").text(
          "How to Make a " +
            recipeData.flavor_profile[0].toUpperCase() +
            recipeData.flavor_profile.slice(1) +
            " Martini"
        );
        $(".lesson-description-text").text(recipeData.description);
        $("#lesson-image").attr("src", recipeData["images"][0]);
        $(".lesson-recipe-name").text(`The ${recipeData.recipe_name}`);
        $(".lesson-recipe-preptime").text(`Prep Time: ${recipeData.prep_time}`);

        if (recipeData.did_you_know) {
          $("#did-you-know-section").html(
            `<h3>Did You Know?</h3><p>${recipeData.did_you_know}</p>`
          );
        } else {
          $("#did-you-know-section").html("");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching recipe data:", error);
      },
    });
  }

  fetchRecipeData(recipe_id);

  $(".move-to-ingredients-btn").click(function () {
    window.location.href = "/ingredients/" + recipe_id;
  });
});
