// Global variable to store the answer key
let answerKey = {};
let correctChoicesCount = 0;
let incorrectChoicesCount = 0;

// Function to load the answer key from the server
function loadAnswerKey(recipe_id) {
    $.getJSON("/load_answer_key/" + recipe_id, function (data) {
        answerKey = data;
        // Once the answer key is loaded, start loading the first step
        loadStep(1);
    });
}

// Function to load each step of the quiz
function loadStep(stepIndex) {
    // Get the step information from the answer key
    let step = answerKey.steps["step" + stepIndex];

    // Update the body content
    $("#quiz-body").text(step.body);

    if (step) {
        // Clear previous step content
        $("#step-container").empty();

        if (step.type === "select") {
            selectChoices(step);
        } else if (step.type === "drag") {
            dragChoices(step);
        }

        // Add click event for submit button
        $("#submit-bttn").click(function () {
            // Check the selected choices against the answers
            checkAnswers(stepIndex);
            // Show next button
            $("#next-bttn").show();
            // Disable submit button after submission
            $(this).prop("disabled", true);
        });

        // Hide next button initially
        $("#next-bttn").hide();

        // Add click event for next button
        $("#next-bttn").click(function () {
            // Increment stepIndex and load the next step if it exists
            let nextStepIndex = stepIndex + 1;
            if (answerKey.steps["step" + nextStepIndex]) {
                loadStep(nextStepIndex);
                // Hide next button again
                $(this).hide();
            } else {
                // No more steps, quiz is finished
                $("#quiz-body").empty();
                showResults();
                // Hide next button
                $(this).hide();
            }
        });

    } else {
        // No more steps, quiz is finished
        $("#quiz-body").empty();
        showResults();
    }
}

function checkAnswers(stepIndex) {
    if (answerKey.steps["step" + stepIndex].type === "select") {
        let selectedChoices = $(".selected")
            .map(function () {
                return $(this).attr("src");
            })
            .get();
        let correctAnswersStep = answerKey.steps["step" + stepIndex].answers;

        // Remove outlines from all choices
        $(".choice-image").css("outline", "");
        $(".choice-image").removeClass("selected");

        // Reset counts for this step
        let stepCorrectChoices = 0;
        let stepIncorrectChoices = 0;

        // Compare selected choices with correct answers for this step
        selectedChoices.forEach(function (selectedChoice) {
            if (correctAnswersStep.includes(selectedChoice)) {
                // Correct choice
                stepCorrectChoices++;
                $(`.choice-image[src="${selectedChoice}"]`).css(
                    "outline",
                    "5px solid #374C23"
                );
            } else {
                // Incorrect choice
                stepIncorrectChoices++;
                $(`.choice-image[src="${selectedChoice}"]`).css(
                    "outline",
                    "5px solid red"
                );
            }
        });

        // Highlight correct choices that were not selected
        correctAnswersStep.forEach(function (correctChoice) {
            if (!selectedChoices.includes(correctChoice)) {
                $(`.choice-image[src="${correctChoice}"]`).css(
                    "outline",
                    "5px solid #374C23"
                );
            }
        });

        // Increment global counters
        correctChoicesCount += stepCorrectChoices;
        incorrectChoicesCount += stepIncorrectChoices;

        console.log("correct answers: " + stepCorrectChoices);
        console.log("incorrect answers: " + stepIncorrectChoices);
    }
}

// Function to calculate the user's score
function calculateResults() {
    let totalQuestions = 0; // Total number of correct and incorrect choices

    // Iterate through each step in the answer key to get total questions
    $.each(answerKey.steps, function (_, step) {
        totalQuestions += step.answers.length;
    });

    console.log(
        "Overall: " + correctChoicesCount + " " + incorrectChoicesCount
    );
    let overallScore = correctChoicesCount - incorrectChoicesCount * 0.25;

    // Calculate the score
    let score = (overallScore / totalQuestions) * 100;

    if (score < 0){
        score = 0;
    }

    return score.toFixed(2);
}

// Function to show results
function showResults() {
    $("#submit-bttn").hide();

    // Calculate the user's score
    let score = calculateResults();
    console.log("score:" + score);
    // Show the score
    $("#step-container").addClass("ing-quiz-results");
    $("#step-container").text("Your score: " + score + "%");

    if (score > 85) {
        $("#quiz-status").text("Congratulations! You're a Martini Master!");
    }
    else if (score > 70) {
        $("#quiz-status").text("You're well on your way to becoming a Martini Master!");
    }
    else if (score > 0) {
        $("#quiz-status").text("That's okay, let's try again!");
    }
    else
        $("#quiz-status").text("Let's review some more, then give it another shot!");

    let lessons_btn = $(
        "<div><button class='btn-custom learn-more-btn'>Learn More Recipes</button></div>"
    );

    $("#step-container").append(lessons_btn);
}

// Call the function to load the answer key when the page loads
$(document).ready(function () {
    console.log("recipe_id: " + recipe_id);
    fetchRecipeData(recipe_id);
    loadAnswerKey(recipe_id);

    $(document).on("click", ".learn-more-btn", function () {
        window.location.href = "/start";
    });
});

function fetchRecipeData(recipe_id) {
    $.ajax({
        type: "POST",
        url: "/load_recipe",
        contentType: "application/json",
        data: JSON.stringify({item_id: recipe_id}),
        dataType: "json", // Ensure you're expecting a JSON response
        success: function (response) {
            // Update page content with the fetched data
            var recipe_data = response.data;

            $("#quiz-header").text(
                `How to Make a ${
                    recipe_data.flavor_profile.charAt(0).toUpperCase() +
                    recipe_data.flavor_profile.slice(1)
                } Martini: The ${recipe_data.recipe_name} Quiz!`
            );
        },
        error: function (xhr, status, error) {
            console.error("Error fetching recipe data:", error);
        },
    });
}

function selectChoices(step) {
    // Create a container for choices on the left side
    let choicesContainer = $("<div>").addClass("choices-container col-md-12");

    step.choices.forEach(function (choice, index) {
        // Create image elements for each choice
        let img = $("<img>")
            .attr("src", choice)
            .addClass("choice-image")
            .attr("id", "choice-" + index);
        choicesContainer.append(img);
    });

    // Append choices container
    $("#step-container").append(choicesContainer);

    // Add click event for choices
    $(".choice-image").click(function () {
        $(this).toggleClass("selected");
        // Enable submit button if at least one choice is selected
        $("#submit-bttn").prop("disabled", $(".selected").length === 0);
    });
}


function dragChoices(step) {
    $("#submit-bttn").prop("disabled", false);

    // Create container for choices and droppable area in the same row
    let containerRow = $("<div>").addClass("row");

    // Create choices container on the left side
    let choicesContainer = $("<div>").addClass("choices-container droppable-area col-md-8");

    step.choices.forEach(function (choice, index) {
        // Create image elements for each choice
        let img = $("<img>")
            .attr("src", choice)
            .addClass("choice-image draggable")
            .attr("id", "choice-" + index)
            .draggable({
                revert: true,
                zIndex: 999 // Set high z-index for dragged images
            });
        choicesContainer.append(img);
    });

    // Append choices container to row
    containerRow.append(choicesContainer);

    // Create droppable area with equipment image on the right side
    let droppableArea = $("<div>").addClass("droppable-area col-md-4").attr("id", "answer-side");
    droppableArea.append($("<img>").attr("src", step.equipment).addClass("equipment-image"));

    // Append droppable area to row
    containerRow.append(droppableArea);

    // Append row to step container
    $("#step-container").append(containerRow);

    // Make droppable areas accept draggable items
    $(".droppable-area, .choices-container").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            // Append dragged item to droppable area
            $(this).append(ui.draggable);
        }
    });

    // Add click event for submit button
    $("#submit-bttn").off().on("click", function () {
        // Check the dragged choices against the answers on the answer side only
        checkDraggedChoices(step);
        // Show next button
        $("#next-bttn").show();
        // Disable submit button after submission
        $(this).prop("disabled", true);
    });

    // Hide next button initially
    $("#next-bttn").hide();
}

function checkDraggedChoices(step) {
    let selectedChoices = $("#answer-side img.draggable").map(function () {
        return $(this).attr("src");
    }).get();
    let correctAnswersStep = step.answers;

    // Reset counts for this step
    let stepCorrectChoices = 0;
    let stepIncorrectChoices = 0;

    // Compare selected choices with correct answers for this step
    selectedChoices.forEach(function (selectedChoice) {
        if (correctAnswersStep.includes(selectedChoice)) {
            // Correct choice
            stepCorrectChoices++;
            $(`#answer-side img[src="${selectedChoice}"]`).css(
                "outline",
                "5px solid #374C23"
            );
        } else {
            // Incorrect choice
            stepIncorrectChoices++;
            $(`#answer-side img[src="${selectedChoice}"]`).css(
                "outline",
                "5px solid red"
            );
        }
    });

    // Highlight correct choices that were not selected on the choice side
    correctAnswersStep.forEach(function (correctChoice) {
        if (!selectedChoices.includes(correctChoice)) {
            stepIncorrectChoices++;
            $(".choices-container img[src='" + correctChoice + "']").css(
                "outline",
                "5px solid #374C23"
            );
        }
    });

    // Increment global counters
    correctChoicesCount += stepCorrectChoices;
    incorrectChoicesCount += stepIncorrectChoices;

    console.log("correct answers: " + stepCorrectChoices);
    console.log("incorrect answers: " + stepIncorrectChoices);
}

