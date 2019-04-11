const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// var urlDatabase = {
//   "b2xVn2":  "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {"userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "funk"
  }
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

// Create a ShortURL for an URL
app.get("/urls/new", (req, res) => {

  if (req.cookies["user_id"]){
  let templateVars = {currentUser: users[req.cookies["user_id"]], userID: req.cookies["user_id"]}
  res.render("urls_new", templateVars);
} else {
  res.redirect("/login");
}
});

// Show all ShortURLs and LongURLs stored
app.get('/urls', (req, res) => {
  let templateVars = {currentUser: users[req.cookies["user_id"]], urls: urlDatabase, userID: req.cookies["user_id"] };
  res.render("urls_index", templateVars)
})

// Registration Page
app.get("/register", (req, res) => {
  res.render("urls_register");
})

// Login page
app.get("/login", (req, res) => {
  res.render("urls_login");
})

//ShortURL webpage
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {currentUser: users[req.cookies["user_id"]], shortURL: req.params.shortURL, longURL: urlDatabase, userID: req.cookies["user_id"] };
  res.render("urls_show", templateVars);
});

//Redirect to LongURL webpage
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  let templateVars = { username: req.cookies["username"], userID: req.cookies["user_id"]};
  res.redirect(longURL);
});

// Account Creation Info Storing
app.post("/register", (req, res) => {
  if (req.body.email == false || req.body.password == false){
    res.status(400).send("Please enter both email and password")
  } else if (searchUserInfo(req.body.email, "email") === true){
    res.status(400).send("Email already in use")
  } else {
  let uniqueID = generateRandomString();
  users[uniqueID] = {id: uniqueID, email: req.body.email, password: req.body.password};
  res.cookie('user_id', uniqueID);
  res.redirect("/urls");
}});

// Delete a ShortURL/LongURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const DeleteShortURL = req.params.shortURL
  delete urlDatabase[DeleteShortURL];
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
  const userEmail = req.body.email;
  const userPW = req.body.password;
  const checkedID = UserPWVerifier(userEmail, userPW);
  if (checkedID) {
    res.cookie('user_id', checkedID);
    res.redirect("/urls");
  } else {
    res.status(403).send("Are you sure you have the right info?! Try again")
  }
});

//Logout + Cookie Deletion + Redirect
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

// <---------------------------------------------> \\

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

//Seach any user info on User Database
function searchUserInfo(thingToSearch, type) {
  for (const currentUser in users){
    if (thingToSearch == users[currentUser][type]){
      return true;
    }
  }
}

//Check if PW and email match DB
function UserPWVerifier (email, pw){
  for (var user in users){
    if ( users[user]['email'] === email && users[user]['password'] === pw ){
      const CheckID = users[user]['id'];
      return CheckID;
    }
  }
  return false
}