const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Routes
// Access to Homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});
// Access to new shortURL form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// Access to urls index
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// Add new URL to database and redirect to shortUrl info page
app.post("/urls", (req, res) => {
  const shortId = generateRandomString();
  urlDatabase[shortId] = req.body.longURL;
  res.redirect(`/urls/${shortId}`);
});
// Access to shortUrl info page
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});
// Redirect to longURL webpage
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});
// Update a current url from the database on the shortUrl info page then redirect to index
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});
// Delete a current url from the database
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// Set username cookie and redirect to index page
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

// Server listening
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Function to generate a random shortURL
const generateRandomString = function() {
  const allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 6; i > 0; i --) {
    randomString += allowedChars[Math.floor(Math.random() * allowedChars.length)];
  }
  return randomString;
};

