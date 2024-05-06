$(document).ready(function () {
  for (let recipe_id in lessons) {
    let recipe_data = lessons[recipe_id];
    let image = recipe_data["images"][0];
    let profile = recipe_data["flavor_profile"];
    profile = profile[0].toUpperCase() + profile.slice(1);
    let flavor_column = $(
      `<div class="col-md-4 flavor-profile-column">
        <div class="flavor-profile-img">
            <img src=${image} alt="${profile} Martini Image" data-recipe-id="${recipe_id}" class="clickable">
        </div> 
        <div class="flavor-profile-title clickable" data-recipe-id="${recipe_id}">
            ${profile} Martini
        </div>
       </div>`
    );

    $(".flavor-profiles").append(flavor_column);
  }

  $(".flavor-profiles").on(
    "click",
    ".flavor-profile-img img, .flavor-profile-title",
    function () {
      let recipe_id = $(this).data("recipe-id");
      console.log(recipe_id);
      if (recipe_id || recipe_id === 0) {
        window.location.href = "/start/" + recipe_id;
      } else {
        console.error("Recipe ID not found");
      }
    }
  );
});
