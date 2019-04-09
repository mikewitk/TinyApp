var express = require('express');
var app = express();
var PORT = 8080; //default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

// when the path matches the string below, the function is executed
app.get('/urls.json', (req, res) => {
  // the respond STREAM from the request is read until its completion.
  res.json(urlDatabase);
});

// when the path matches the string below, the function is executed
app.get('/hello', (req, res) => {
  // the respond is now a HTML page
  res.send('<html><body>Hello <b>World</b></body></html>\n')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});