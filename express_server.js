var express = require('express');
var app = express();
var PORT = 8080; //default port 8080

app.set("view engine", "ejs")

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

//route handler to render the form page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//route handler for /urls to pass the URL data to our template
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  console.log(req.body.longURL) ;  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//route handler for /urls/:shorURL to pass the shortURL data to our template
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//Generate Random ShortURL
function generateRandomString() {

}















// // when the path matches the string below, the function is executed
// app.get('/urls.json', (req, res) => {
//   // the respond STREAM from the request is read until its completion.
//   res.json(urlDatabase);
// });

// // when the path matches the string below, the function is executed
// app.get('/hello', (req, res) => {
//   // the respond is now a HTML page
//   res.send('<html><body>Hello <b>World</b></body></html>\n')
// });
