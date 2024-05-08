$(document).ready(function () {
    for (let recipe_id in lessons) {
        let recipe_data = lessons[recipe_id];
        let image = recipe_data["images"][0];
        let recipe_name = recipe_data["recipe_name"];
        let flavor_column = $(
            `<div class="col-md-4 flavor-profile-column">
          <div class="flavor-profile-img">
              <img src=${image} alt="${recipe_name} Image" data-recipe-id="${recipe_id}" class="clickable">
          </div> 
          <div class="flavor-profile-title clickable" data-recipe-id="${recipe_id}">
              ${recipe_name}
          </div>
         </div>`
        );

        $(".recipe-options-container").append(flavor_column);
    }

    $(".recipe-options-container").on(
        "click",
        ".flavor-profile-img img, .flavor-profile-title",
        function () {
            let recipe_id = $(this).data("recipe-id");
            if (recipe_id || recipe_id === 0) {
                window.location.href = "/simulation_quiz/" + recipe_id;
                console.log(recipe_id);
            } else {
                console.error("Recipe ID not found");
            }
        }
    );
});
