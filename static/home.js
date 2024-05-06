$(document).ready(function () {
  for (let recipe_id in lessons) {
    let recipe_data = lessons[recipe_id];
    let image = recipe_data["images"][0];
    let recipe_name = recipe_data["recipe_name"];
    console.log(recipe_name);
    let flavor_column = $(
      `<div class="row home-flavor-profile">
            <div class="col-md-5 home-flavor-profile-img">
                <img src=${image} alt="${recipe_name} Image" data-recipe-id="${recipe_id}" class="clickable">
            </div> 
            <div class="col-md-3 home-flavor-profile-title clickable" data-recipe-id="${recipe_id}">
                ${recipe_name}
            </div>
           </div>`
    );

    $(".home-recipe-items").append(flavor_column);
  }

  $(".home-recipe-items").on(
    "click",
    ".home-flavor-profile-img img, .home-flavor-profile-title",
    function () {
      let recipe_id = $(this).data("recipe-id");
      console.log(recipe_id);
      if (recipe_id || recipe_id === 0) {
        window.location.href = "/recipe_alone/" + recipe_id;
      } else {
        console.error("Recipe ID not found");
      }
    }
  );

  $("#start-button").click(function () {
    window.location.href = "/start";
  });
});
