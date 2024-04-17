$(document).ready(function(){

$(".flavor-button").click(function() {
        let flavor = $(this).data("flavor").toLowerCase();
        let recipe_num;

        // Iterate over the lessons data to find the matching flavor profile
        for (let recipe_id in lessons) {
            if (lessons.hasOwnProperty(recipe_id)) {
                let recipe_data = lessons[recipe_id];
                if (recipe_data['flavor_profile'] === flavor) {
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
