$(document).ready(function(){
  // Get the recipe_id from the URL
  console.log("recipe id: " + recipe_id);

  // Function to fetch recipe data and update page content
  function fetchRecipeData(recipe_id) {
      $.ajax({
          type: "POST",
          url: "/load_recipe",
          contentType: "application/json",
          data: JSON.stringify({ item_id: recipe_id }),
          dataType: "json", // Ensure you're expecting a JSON response
          success: function(response) {
              // Update page content with the fetched data
              var recipeData = response.data;
              $("#ingredient-title").text("How to Make a " + recipeData.recipe_name);
              $("#ingredient-subtext").text("You will need:");

              // Clear existing ingredients
              $("#ingredients-list").empty();

              // Add ingredients to the list
              $.each(recipeData.ingredients, function(key, value) {
                  let ingredientElement = $('<div class="ingredient-item"></div>');
                  let imageContainer = $('<div class="ingredient-image-container"></div>');
                  let image = $('<img class="ingredient-image">').attr('src', value.image).attr('alt', key);
                  let name = $('<p class="ingredient-name"></p>').text(key);
                  let tooltip = createTooltip(value); // Create a tooltip for the ingredient

                  imageContainer.append(image);
                  ingredientElement.append(imageContainer).append(name).append(tooltip);
                  $('#ingredients-list').append(ingredientElement);

                  // Event handlers to show/hide the tooltip
                  ingredientElement.hover(
                      function() { // Mouse enter
                          $(this).find('.ingredient-tooltip').fadeIn(300);
                      },
                      function() { // Mouse leave
                          $(this).find('.ingredient-tooltip').fadeOut(300);
                      }
                  );
              });
          },
          error: function(xhr, status, error) {
              console.error("Error fetching recipe data:", error);
          }
      });
  }

  // Call the function to fetch recipe data when the page loads
  fetchRecipeData(recipe_id);

  // Redirect to ingredients page when the button is clicked
  $("#move-to-ingred-quiz").click(function () {
      window.location.href = "/ingredients_quiz/" + recipe_id;
  });

  // Function to create a tooltip element
  function createTooltip(ingredientData) {
      let tooltip = $('<div class="ingredient-tooltip"></div>');
      // Add ingredient details to the tooltip. For example, the amount.
      tooltip.text(ingredientData.info ? ingredientData.info : 'Click for more'); // You can also add other details as needed
      return tooltip;
  }
});
