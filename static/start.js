$(document).ready(function () {
  $(".flavor-button").click(function () {
    let flavor = $(this).data("flavor").toLowerCase();
    let recipe_num;
    console.log(lessons);
    // Iterate over the lessons data to find the matching flavor profile
    for (let recipe_id in lessons) {
      console.log(recipe_id);
      if (lessons.hasOwnProperty(recipe_id)) {
        let recipe_data = lessons[recipe_id];
        console.log("clicked");
        console.log(flavor);

        if (recipe_data["flavor_profile"] === flavor) {
          console.log("pulled:");
          console.log(recipe_data["flavor_profile"]);
          recipe_num = recipe_id;
          break;
        }
      }
    }
    // Redirect user to recipe page with the selected recipe number
    if (recipe_num) {
      window.location.href = "/start/" + recipe_num;
    } else {
      console.error("Recipe not found for flavor profile: " + flavor);
    }
  });
});
