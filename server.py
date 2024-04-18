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


@app.route("/recipe_quiz/<item_id>")
def recipe_quiz(recipe_id):
    return render_template("recipe_quiz.html", recipe_id=recipe_id)


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


if __name__ == "__main__":
    app.run(port=5500, debug=True)
