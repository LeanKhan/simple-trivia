// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const fs = require("fs").promises;

console.log("Hello!");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const questions = require("./questions.json");

function grade(answers, questions) {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    //     compare the elements ans and stuff
    console.log("Ans => ", answers[i], "Q => ", questions[i].answer);
    score +=
      answers[i].toLowerCase() === questions[i].answer.toLowerCase() ? 1 : 0;
  }

  return score;
}

function getRandomQuestions(array, howmany) {
  let q = [];
  for (let i = 0; i < howmany; i++) {
    const rand = Math.round(Math.random() * (array.length - 1));

    q.push(array[rand]);

    array.splice(rand, 1);
  }

  return q;
}

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

// send the default array of dreams to the webpage
app.get("/all", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(questions);
});

app.get("/get-questions", async (request, response) => {
  // express helps us take JS objects and send them as JSON
  const howmany = 10;
  const qs = getRandomQuestions(questions, howmany);

  const json = { questions: qs, answers: [], score: 0, timestamp: "" };

  try {
    await fs.writeFile("database.json", JSON.stringify(json));
  } catch (err) {
    console.error(err);
    return response.status(400).send("Error fetching questions :/");
  }
  return response.json({ questions: qs, length: howmany });
});

// answer the questions...
app.post("/submit-solution", async (req, res) => {
  const answers = req.body.answers;
  let db;
  try {
    let temp = await fs.readFile("database.json", "utf-8");
    db = JSON.parse(temp);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error fetching questions :/");
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

// listen for requests :)
app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port");
});
