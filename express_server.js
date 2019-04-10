var express = require('express');
var app = express();
var PORT = 8080; //default port 8080
var cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

// Create a ShortURL for an URL
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"]}
  res.render("urls_new", templateVars);
});

// Show all ShortURLs and LongURLs stored
app.get('/urls', (req, res) => {
  let templateVars = {username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars)
})

// Delete a ShortURL/LongURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const DeleteShortURL = req.params.shortURL
  console.log(typeof DeleteShortURL) ;
  delete urlDatabase[DeleteShortURL];
  console.log(urlDatabase) ;
  res.redirect('/urls');
});

//Update the LongURL
app.post("/urls/:shortURL", (req, res) => {
  const updateShortURL = req.params.shortURL
  const newLongURL = req.body.longURL;
  for (var sURL in urlDatabase){
    if (sURL === updateShortURL){
      urlDatabase[sURL] = newLongURL;
    }};
  res.redirect('/urls');
    });

//Redirect to ShortURL webpage
app.post("/urls", (req, res) => {
  var URL = generateRandomString();
  urlDatabase[URL] = req.body.longURL;
  res.redirect('/urls/' + URL);
});

//Login + Redirect + COOKIES
app.post("/login", (req, res) => {
  const username = req.body.name;
  console.log(username) ;
  res.cookie('username', username);
  res.redirect("/urls");
})

//ShortURL webpage
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { username: req.cookies["username"], shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

//Redirect to LongURL webpage
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  let templateVars = { username: req.cookies["username"]};
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//Generate Random ShortURL
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}