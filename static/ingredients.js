$(document).ready(function(){
    // Fetch and display recipe data when the page loads
    fetchRecipeData(recipe_id);
  
    function fetchRecipeData(recipe_id) {
        $.ajax({
            type: "POST",
            url: "/load_recipe",
            contentType: "application/json",
            data: JSON.stringify({ item_id: recipe_id }),
            dataType: "json",
            success: function(response) {
                var recipeData = response.data;
  
                // Update the page content
                $("#ingredient-title").text("How to Make a " + recipeData.recipe_name);
                $("#ingredients-list").empty();
  
                // Dynamically populate ingredients
                $.each(recipeData.ingredients, function(key, value) {
                    let ingredientElement = $('<div class="ingredient-item"></div>');
                    let imageContainer = $('<div class="ingredient-image-container"></div>');
                    let image = $('<img class="ingredient-image">').attr('src', value.image).attr('alt', key);
                    let name = $('<p class="ingredient-name"></p>').text(key);
                    let amount = $('<p class="ingredient-amount"></p>').text(value.amount || '');
                    let tooltip = createTooltip(value); // Create a tooltip for the ingredient
                
                    imageContainer.append(image);
                    ingredientElement.append(imageContainer).append(name).append(tooltip);
                    ingredientElement.append(imageContainer).append(name).append(amount);
                    $('#ingredients-list').append(ingredientElement);


                    // Event handlers for tooltip
                    ingredientElement.hover(
                        function() { $(this).find('.ingredient-tooltip').fadeIn(300); },
                        function() { $(this).find('.ingredient-tooltip').fadeOut(300); }
                    );
                });
            },
            error: function(xhr, status, error) {
                console.error("Error fetching recipe data:", error);
            }
        });
    }
    // Redirect to ingredients page when the button is clicked
    $("#move-to-ingred-quiz").click(function () {
        window.location.href = "/ingredients_quiz/" + recipe_id;
    });
  
    // Create a tooltip element
    function createTooltip(ingredientData) {
        let tooltip = $('<div class="ingredient-tooltip"></div>');
        // Add ingredient details to the tooltip. For example, the amount.
        tooltip.text(ingredientData.info ? ingredientData.info : 'Click for more'); // You can also add other details as needed
        return tooltip;
    }
  });
  