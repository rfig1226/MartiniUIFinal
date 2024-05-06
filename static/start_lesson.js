$(document).ready(function () {
  // Get the recipe_id from the URL

  console.log("recipe id: " + recipe_id);

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
      },
      error: function (xhr, status, error) {
        console.error("Error fetching recipe data:", error);
      },
    });
  }

  // Call the function to fetch recipe data when the page loads
  fetchRecipeData(recipe_id);

  // Redirect to ingredients page when the button is clicked
  $(".move-to-ingredients-btn").click(function () {
    window.location.href = "/ingredients/" + recipe_id;
  });
});
