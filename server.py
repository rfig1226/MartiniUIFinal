from flask import Flask
from flask import render_template
from flask import Response, request, jsonify

import json

app = Flask(__name__)

# contains all lesson and quiz data, load up for routing
file_path = "lesson_data.json"

with open(file_path, "r") as file:
    # all lesson data in one variable
    lessons = json.load(file)


# ROUTES


@app.route("/")
def welcome():
    return render_template("home.html", lessons=lessons)


@app.route("/start")
def start():
    return render_template("start.html", lessons=lessons)


@app.route("/start/<recipe_id>")
def start_lesson(recipe_id):
    return render_template("start_lesson.html", recipe_id=recipe_id)


@app.route("/ingredients/<recipe_id>")
def ingredients(recipe_id):
    return render_template("ingredients.html", recipe_id=recipe_id)


@app.route("/ingredients_quiz/<recipe_id>")
def ingredients_quiz(recipe_id):
    return render_template("ingredients_quiz.html", recipe_id=recipe_id)


@app.route("/recipe/<recipe_id>")
def recipe(recipe_id):
    return render_template("recipe.html", recipe_id=recipe_id)


@app.route("/recipe_quiz/<recipe_id>")
def recipe_quiz(recipe_id):
    return render_template("recipe_quiz.html", recipe_id=recipe_id)


@app.route("/simulation_quiz/<recipe_id>")
def simulation_quiz(recipe_id):
    return render_template("simulation_quiz.html", recipe_id=recipe_id)


@app.route("/recipe_alone_start")
def recipe_alone_start():
    return render_template("recipe_alone_start.html", lessons=lessons)


@app.route("/recipe_alone/<recipe_id>")
def recipe_alone(recipe_id):
    return render_template("recipe_alone.html", recipe_id=recipe_id)

@app.route("/quiz_alone_start")
def quiz_alone_start():
    return render_template("quiz_alone_start.html", lessons=lessons)


# AJAX FUNCTIONS


# get all recipes at once, mostly for purpose of dynamically displaying all taste profile options on
# home page instead of hard coding
@app.route("/load_all", methods=["POST"])
def load_all():
    global lessons

    # send back the WHOLE array of data, so the client can redisplay it
    return jsonify(data=lessons)


# get a single flavor profile/recipe/lesson and all its data (including quiz data)
@app.route("/load_recipe", methods=["GET", "POST"])
def load_recipe():
    global items

    json_data = request.get_json()
    recipe_id = json_data["item_id"]

    recipe = lessons[recipe_id]

    return jsonify(data=recipe)


@app.route("/load_answer_key/<recipe_id>")
def load_answer_key(recipe_id):
    answer_key_path = "answer_key.json"  # Adjust the path as needed
    try:
        with open(answer_key_path, "r") as file:
            answer_key_data = json.load(file)

        answer_key = answer_key_data[recipe_id]

        return jsonify(answer_key)
    except FileNotFoundError:
        return (
            jsonify({"error": "Answer key not found for the specified recipe ID"}),
            404,
        )


if __name__ == "__main__":
    app.run(port=5500, debug=True)
