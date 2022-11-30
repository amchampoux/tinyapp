const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// URL Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Users Database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// Routes
// Access to Homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});
// Opens login form
app.get("/login", (req, res) => {
  let userId = req.cookies["id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[userId],
  };
  res.render("login_form", templateVars);
});


// Opens register form
app.get("/register", (req, res) => {
  let userId = req.cookies["id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[userId],
  };
  res.render("registration_form", templateVars);
});
// Add new user to database
app.post("/register", (req, res) => {
  const user = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password
  };
  // check if email or password is undefined (the client didn't provide a value)
  if (!user.email || !user.password) {
    return res.status(400).send('Please provide an email and a password');
  // check if user already in database
  } else if (getUserByEmail(req.body.email) !== null) {
    return res.status(400).send('You are already registered');
  } else {
  // add user to database, create a cookie, then redirect to urls index
    users[user.id] = user;
    req.cookies('id', user.id);
    res.redirect("/urls");
  }

  console.log(users);

});

// Access to new shortURL form
app.get("/urls/new", (req, res) => {
  let userId = req.cookies["id"];
  const templateVars = {
    user: users[userId]
  };
  res.render("urls_new", templateVars);
});
// Access to urls index
app.get("/urls", (req, res) => {
  let userId = req.cookies["id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[userId]
  };
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
  let userId = req.cookies["id"];
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[userId]
  };
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
// Set userId cookie and redirect to index page
app.post("/login", (req, res) => {
  res.cookie('id', users.user.id); /////////////////// will need to update and remove "users"
  res.redirect("/urls");
});
// Clear userId cookie logout user than redirect to index page
app.post("/logout", (req, res) => {
  res.clearCookie('id');
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

// Function to find a user in database
const getUserByEmail = function(email) {
  let user = null;
  Object.entries(users).forEach(function(item) {
    if (email === item[1].email) {
      user = item[1];
      return;
    }
  });
  return user;
};