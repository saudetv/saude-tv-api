const express = require('express');
const bodyParser = require('body-parser');

// Our function which adds two numbers and returns the result
const addNumbers = (firstNumber, secondNumber) => {
  //   check that input is a number
  if (typeof (Number(firstNumber)) !== 'number' || typeof (Number(secondNumber)) !== 'number') {
    return 'Values should be integer or numbers'
  }
  return Number(firstNumber) + Number(secondNumber);
}

// Destructure our bodyParser methods
const { urlencoded, json } = bodyParser;
const port = process.env.PORT || 8080;
// intialize our express app
const app = express();

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(json());
app.use(urlencoded({ extended: false }));

// end point to add numbers
app.post('/api/add', (req, res) => {
  const { firstNumber, secondNumber } = req.body;
  const result = addNumbers(firstNumber, secondNumber);
  return res.status(200).send({
    result
  });
});
// app entry point
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to our glorious app',
}));
// Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

app.listen(port, (err) => {
  if (!err) {
    console.log(`App started on port ${port}`);
  } else {
    console.log(err);
  }
});

module.exports = app;