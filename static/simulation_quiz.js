// Global variable to store the answer key
let answerKey = {};
let correctChoicesCount = 0;
let incorrectChoicesCount = 0;


// Function to load the answer key from the server
function loadAnswerKey(recipe_id) {
    $.getJSON("/load_answer_key/" + recipe_id, function(data) {
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

        // Create a container for choices on the left side
        let choicesContainer = $("<div>").addClass("choices-container");
        choicesContainer.addClass("col-md-8");

        step.choices.forEach(function (choice, index) {
            // Create image elements for each choice
            let img = $("<img>").attr("src", choice).addClass("choice-image").attr("id", "choice-" + index);
            choicesContainer.append(img);
        });
        $("#step-container").append(choicesContainer);

        // Add click event for choices
        $(".choice-image").click(function () {
            $(this).toggleClass("selected");
            // Enable submit button if at least one choice is selected
            $("#submit-bttn").prop('disabled', $(".selected").length === 0);
        });

        // Add click event for submit button
        $("#submit-bttn").click(function () {
            // Check the selected choices against the answers
            checkAnswers(stepIndex);
            // Show next button
            $("#next-bttn").show();
            // Disable submit button after submission
            $(this).prop('disabled', true);
        });

        // Hide next button initially
        $("#next-bttn").hide();

        // Add click event for next button
        $("#next-bttn").click(function() {
            // Increment stepIndex and load the next step if it exists
            let nextStepIndex = stepIndex + 1;
            if (answerKey.steps["step" + nextStepIndex]) {
                loadStep(nextStepIndex);
                // Hide next button again
                $(this).hide();
            } else {
                // No more steps, quiz is finished
                showResults();
                // Hide next button
                $(this).hide();
            }
        });
    }
    else {
        // No more steps, quiz is finished
        showResults();
    }
}

function checkAnswers(stepIndex) {
    let selectedChoices = $(".selected").map(function() {
        return $(this).attr("src");
    }).get();
    let correctAnswersStep = answerKey.steps["step" + stepIndex].answers;

    // Remove outlines from all choices
    $(".choice-image").css("outline", "");

    // Reset counts for this step
    let stepCorrectChoices = 0;
    let stepIncorrectChoices = 0;

    // Compare selected choices with correct answers for this step
    selectedChoices.forEach(function(selectedChoice) {
        if (correctAnswersStep.includes(selectedChoice)) {
            // Correct choice
            stepCorrectChoices++;
            $(`.choice-image[src="${selectedChoice}"]`).css("outline", "5px solid #374C23");
        } else {
            // Incorrect choice
            stepIncorrectChoices++;
            $(`.choice-image[src="${selectedChoice}"]`).css("outline", "5px solid red");
        }
    });

    // Highlight correct choices that were not selected
    correctAnswersStep.forEach(function(correctChoice) {
        if (!selectedChoices.includes(correctChoice)) {
            $(`.choice-image[src="${correctChoice}"]`).css("outline", "5px solid #374C23");
        }
    });

    // Increment global counters
    correctChoicesCount += stepCorrectChoices;
    incorrectChoicesCount += stepIncorrectChoices;

    console.log("correct answers: " + stepCorrectChoices);
    console.log("incorrect answers: " + stepIncorrectChoices);
}






// Function to calculate the user's score
function calculateResults() {
    let totalQuestions = 0; // Total number of correct and incorrect choices

    // Iterate through each step in the answer key to get total questions
    $.each(answerKey.steps, function(_, step) {
        totalQuestions += step.answers.length;
    });

    console.log("Overall: " + correctChoicesCount + " " + incorrectChoicesCount);
    let overallScore = correctChoicesCount - (incorrectChoicesCount * .5)

    // Calculate the score
    let score = (overallScore / totalQuestions) * 100;
    return score.toFixed(2);
}


// Function to show results
function showResults() {
    // Calculate the user's score
    let score = calculateResults();
    console.log("score:" + score);
    // Show the score
    $("#step-container").addClass("ing-quiz-results");
    $("#step-container").text("Your score: " + score + "%");
}

// Call the function to load the answer key when the page loads
$(document).ready(function() {
    console.log("recipe_id: " + recipe_id);
    loadAnswerKey(recipe_id);
});
