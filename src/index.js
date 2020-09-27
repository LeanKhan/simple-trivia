// Emmanuel Segun-Lean

const express = require("express");
const fs = require("fs").promises;
const app = express();

console.log("Hello! Welcome to my Simple Trivia API :) Thank you Jesus!");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This JSON file is the question bank
const questions = require("./questions.json");

/**
 * Score the questions.
 *
 * answers: The array of answers ['A','B','C','A'...]
 * questions: The questions that are being answered
 */
function grade(answers, questions) {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    //     compare the elements ans and stuff
    score += answers[i]
      ? answers[i].toLowerCase() === questions[i].answer.toLowerCase()
        ? 1
        : 0
      : 0;
  }

  return score;
}

/**
 * Get random Questions.
 * array: the array of questions
 * howmany: the number of random questions you want
 */
function getRandomQuestions(array, howmany) {
  let q = [];
  for (let i = 0; i < howmany; i++) {
    const rand = Math.round(Math.random() * (array.length - 1));

    q.push(array[rand]);

    array.splice(rand, 1);
  }

  return q;
}

/** The home page */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/** Get the random questions */
app.get("/get-questions", async (req, res) => {
  const howmany = 10;
  const qs = getRandomQuestions(questions, howmany);

  // The shape of how data is saved in 'database.json'
  const json = { questions: qs, answers: [], score: 0, timestamp: "" };

  try {
    await fs.writeFile("database.json", JSON.stringify(json));
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error fetching questions :/");
  }
  return res.json({ questions: qs, length: howmany });
});

/** Endpoint to answer the questions you generated */
/**
 * Body: An array of the letter choices: { "answers": ['A','B','C','A'...] }
 */
app.post("/submit-solution", async (req, res) => {
  const answers = req.body.answers;

  let db;
  try {
    let temp = await fs.readFile("database.json", "utf-8");
    db = JSON.parse(temp);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error grading solutions :/");
  }

  const score = grade(answers, db.questions);
  const timestamp = new Date();

  db.answers = answers;
  db.score = score;
  db.timestamp = timestamp;

  try {
    await fs.writeFile("database.json", JSON.stringify(db));
  } catch (err) {
    return res.status(400).send("Error fetching questions :/");
  }

  return res.json({
    score_in_percentage: `${score * 10}%`,
    score_in_digits: score * 10
  });
});

// start server & listen for requests :)
app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port %s", process.env.PORT || 3000);
});
