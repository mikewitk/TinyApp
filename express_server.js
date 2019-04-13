const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["This TyniApp is a monster"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {};

const users = {};

app.get('/', (req, res) => {
  if (req.session.user_id){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Create a ShortURL for a URL
app.get("/urls/new", (req, res) => {
  if (req.session.user_id){
    let templateVars = {users: users, userID: req.session.user_id}
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

// Show all ShortURLs and LongURLs stored
app.get('/urls', (req, res) => {
  if (req.session.user_id){
    let templateVars = {currentUser: req.session.user_id, users: users, userID: req.session.user_id, urls: urlDatabase };
    res.render("urls_index", templateVars);
  } else {
    res.status(400).send("To have access to your TinyApp URLs please log in at: localhost:80/login");
  }
});

// Registration Page
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_register");
}});

// Login page
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.render("urls_login");
}});

//ShortURL webpage
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {users: users, urlDatabase: urlDatabase, userID: req.session.user_id, URLkey: req.params.shortURL };
  res.render("urls_show", templateVars);
});

//Redirect to LongURL webpage
app.get("/u/:shortURL", (req, res) => {
  res.redirect(`http://${urlDatabase[req.params.shortURL]['longURL']}`);
});

// Account Creation Info Storing
app.post("/register", (req, res) => {
  if (req.body.email == false || req.body.password == false){
    res.status(400).send("Please enter both email and password")
  } else if (searchUserInfo(req.body.email, "email") === true){
    res.status(400).send("Email already in use")
  } else {
    let uniqueID = generateRandomString();
    let hashedPW = bcrypt.hashSync(req.body.password, 10);
    users[uniqueID] = {id: uniqueID, email: req.body.email, password: hashedPW};
    req.session.user_id = uniqueID;
    res.redirect("/urls");
  }
});

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
  const newUserID = req.session.user_id;
  for (var keys in urlDatabase){
    if (keys === updateShortURL){
      urlDatabase[keys]['longURL'] = newLongURL;
    }};
  res.redirect('/urls');
    });

//Redirect to ShortURL webpage
app.post("/urls", (req, res) => {
  const uniqueID = generateRandomString();
  tempObj = {};
  tempObj['longURL'] = req.body.longURL;
  tempObj['userID'] = req.session.user_id;
  urlDatabase[uniqueID] = tempObj;
  res.redirect('/urls/' + uniqueID);
});

//Login + Redirect + COOKIES
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPW = req.body.password;
  const checkedID = UserPWVerifier(userEmail, userPW);
  if (checkedID) {
    req.session.user_id = checkedID;
    res.redirect("/urls");
  } else {
    res.status(403).send("Are you sure you have the right info?! Try again")
  }
});

//Logout + Cookie Deletion + Redirect
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// <---------------------------------------------> \\

app.listen(PORT, () => {
  console.log(`TinyApp webpage is up using port: ${PORT}`);
});

//Generate Random ShortURL
function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

//Seach any user info on User Database
function searchUserInfo(thingToSearch, type) {
  for (const currentUser in users){
    if (thingToSearch == users[currentUser][type]){
      return true;
    }
  }
};

//Check if PW and email match DB
function UserPWVerifier (email, pw){
  for (var user in users){
    let comparingPW = users[user]['password'];
    if ( (users[user]['email'] === email) && (bcrypt.compareSync(pw, comparingPW)) ){
      const CheckID = users[user]['id'];
      return CheckID;
    }
  }
  return false
};

// Generate object with user LongURLs and UserID
function findUserURL (ID) {
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL]["userID"] === ID) {
      let newObject = urlDatabase[shortURL];
    }
  }
};