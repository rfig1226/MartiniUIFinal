let answerKey = {};
let correctChoicesCount = 0;
let incorrectChoicesCount = 0;

function loadAnswerKey(recipe_id) {
  $.getJSON("/load_answer_key/" + recipe_id, function (data) {
    answerKey = data;
    loadStep(1);
  });
}

function loadStep(stepIndex) {
  let step = answerKey.steps["step" + stepIndex];

  $("#quiz-body").text(step.body);

  if (step) {
    $("#step-container").empty();

    if (step.type === "select") {
      selectChoices(step);
    } else if (step.type === "drag") {
      dragChoices(step);
    }

    $("#submit-bttn").click(function () {
      checkAnswers(stepIndex);

      $("#next-bttn").show();

      $(this).prop("disabled", true);
    });

    $("#next-bttn").hide();

    $("#next-bttn").click(function () {
      let nextStepIndex = stepIndex + 1;
      if (answerKey.steps["step" + nextStepIndex]) {
        loadStep(nextStepIndex);

        $(this).hide();
      } else {
        $("#quiz-body").empty();
        showResults();

        $(this).hide();
      }
    });
  } else {
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

    $(".choice-image").css("outline", "");
    $(".choice-image").removeClass("selected");

    let stepCorrectChoices = 0;
    let stepIncorrectChoices = 0;

    selectedChoices.forEach(function (selectedChoice) {
      if (correctAnswersStep.includes(selectedChoice)) {
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

    correctAnswersStep.forEach(function (correctChoice) {
      if (!selectedChoices.includes(correctChoice)) {
        $(`.choice-image[src="${correctChoice}"]`).css(
          "outline",
          "5px solid #374C23"
        );
      }
    });

    correctChoicesCount += stepCorrectChoices;
    incorrectChoicesCount += stepIncorrectChoices;

    console.log("correct answers: " + stepCorrectChoices);
    console.log("incorrect answers: " + stepIncorrectChoices);
  }
}

function calculateResults() {
  let totalQuestions = 0;

  $.each(answerKey.steps, function (_, step) {
    totalQuestions += step.answers.length;
  });

  console.log("Overall: " + correctChoicesCount + " " + incorrectChoicesCount);
  let overallScore = correctChoicesCount - incorrectChoicesCount * 0.25;

  let score = (overallScore / totalQuestions) * 100;

  if (score < 0) {
    score = 0;
  }

  return score.toFixed(2);
}

function showResults() {
  $("#submit-bttn").hide();

  let score = calculateResults();
  console.log("score:" + score);

  $("#step-container").empty();
  $("#quiz-results").text("Your score: " + score + "%");

  if (score > 85) {
    $("#quiz-results").append(
      $("<img>", {
        id: "mastery",
        class: "quiz-gif",
        src: "https://reactiongifs.me/cdn-cgi/imagedelivery/S36QsAbHn6yI9seDZ7V8aA/f25f4cf6-87a4-49a3-9625-b68e32c26700/w=500",
      })
    );
    $("#quiz-status").text("Congratulations! You're a Martini Master!");
  } else if (score > 70) {
    $("#quiz-results").append(
      $("<img>", {
        id: "celebratory",
        class: "quiz-gif",
        src: "https://www.icegif.com/wp-content/uploads/2022/07/icegif-159.gif",
      })
    );
    $("#quiz-status").text(
      "You're well on your way to becoming a Martini Master!"
    );
  } else if (score > 0) {
    $("#quiz-results").append(
      $("<img>", {
        id: "whoops",
        class: "quiz-gif",
        src: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWtyZjd2Mm9wemFnaWgxMHQzNTd6N2swZHU0ejBlZHVvMmJlbWx1NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j9SlCd2tXnh4zF8UsU/giphy.gif",
      })
    );
    $("#quiz-status").text("That's okay, let's try again!");
  } else {
    $("#quiz-results").append(
      $("<img>", {
        id: "try_again",
        class: "quiz-gif",
        src: "https://gifdb.com/images/high/megan-mullaly-drinking-alcohol-dod1stdphxjlfjuq.webp",
      })
    );
    $("#quiz-status").text(
      "Let's review some more, then give it another shot!"
    );
  }

  let lessons_btn = $(
    "<div><button class='btn-custom learn-more-btn'>Learn More Recipes</button></div>"
  );

  $("#quiz-status").append(lessons_btn);
}

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
    data: JSON.stringify({ item_id: recipe_id }),
    dataType: "json",
    success: function (response) {
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
  let choicesContainer = $("<div>").addClass("choices-container col-md-12");

  step.choices.forEach(function (choice, index) {
    let img = $("<img>")
      .attr("src", choice)
      .addClass("choice-image")
      .attr("id", "choice-" + index);
    choicesContainer.append(img);
  });

  $("#step-container").append(choicesContainer);

  $(".choice-image").click(function () {
    $(this).toggleClass("selected");

    $("#submit-bttn").prop("disabled", $(".selected").length === 0);
  });
}

function dragChoices(step) {
  $("#submit-bttn").prop("disabled", false);

  let containerRow = $("<div>").addClass("row");

  let choicesContainer = $("<div>").addClass(
    "choices-container droppable-area col-md-8"
  );

  step.choices.forEach(function (choice, index) {
    let img = $("<img>")
      .attr("src", choice)
      .addClass("choice-image draggable")
      .attr("id", "choice-" + index)
      .draggable({
        revert: true,
        zIndex: 999,
      });
    choicesContainer.append(img);
  });

  containerRow.append(choicesContainer);

  let droppableArea = $("<div>")
    .addClass("droppable-area col-md-4")
    .attr("id", "answer-side");
  droppableArea.append(
    $("<img>").attr("src", step.equipment).addClass("equipment-image")
  );

  containerRow.append(droppableArea);

  $("#step-container").append(containerRow);

  $(".droppable-area, .choices-container").droppable({
    accept: ".draggable",
    drop: function (event, ui) {
      $(this).append(ui.draggable);
    },
  });

  $("#submit-bttn")
    .off()
    .on("click", function () {
      checkDraggedChoices(step);

      $("#next-bttn").show();

      $(this).prop("disabled", true);
    });

  $("#next-bttn").hide();
}

function checkDraggedChoices(step) {
  let selectedChoices = $("#answer-side img.draggable")
    .map(function () {
      return $(this).attr("src");
    })
    .get();
  let correctAnswersStep = step.answers;

  let stepCorrectChoices = 0;
  let stepIncorrectChoices = 0;

  selectedChoices.forEach(function (selectedChoice) {
    if (correctAnswersStep.includes(selectedChoice)) {
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

  correctAnswersStep.forEach(function (correctChoice) {
    if (!selectedChoices.includes(correctChoice)) {
      stepIncorrectChoices++;
      $(".choices-container img[src='" + correctChoice + "']").css(
        "outline",
        "5px solid #374C23"
      );
    }
  });

  correctChoicesCount += stepCorrectChoices;
  incorrectChoicesCount += stepIncorrectChoices;

  console.log("correct answers: " + stepCorrectChoices);
  console.log("incorrect answers: " + stepIncorrectChoices);
}
