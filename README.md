#### Simple Trivia API - Emmanuel Segun-Lean

## Docs

There are two endpoints:

- `/get-questions`

This returns 10 random questions from the question bank

- `/submit-solution`

This checks the submitted answers against the last generated questions

## Process

The two main goals were to create an API to return 10 random questions and another to score the answers submitted to it with the score as a response.

The "database" I chose to use was a JSON file: `database.json`, the generated questions, answers and score are stored here. The data is replaced everytime the get-questions endpoint is called and the questions are answered. JSON is easy and light and I wanted to keep it very simple and light because I felt there was no need for a full blown SQL database in this case.

## Challenges

One of the challenging parts was getting the random questions.
