//file: server.js
// USAFA CS 364 
// Lesson 27 Authentication example
 
const express = require("express");
const crypto = require('crypto');
const session = require("express-session");
const pool = require('./db');
const auth = require("./auth");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false} // would be set to true if using HTTPS
  })
);

// Route handler for GET /
app.get('/', (req, res) => {
  const currentTime = new Date().toString();
  res.send(`Current server time: ${currentTime}`);
});

// Route handler for GET /api/
app.get('/api/', (req, res) => {
  const currentTime = new Date().toString();
  res.send(`Current API time: ${currentTime}`);
});


// app.post("/api/register", auth.register);

const saltRounds = 10;


app.post("/api/register", async (req, res) => {

  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  const query = 'INSERT INTO users (username, email, hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING id';

  const values = [username, email, hash, salt, role];
  console.log("trying query with these values...");
  console.log(values);

  try {
    const result = await pool.query(query, values);
    console.log("user NOW registered ... going to respond");
    console.log(result);
    res.json({ success: true, message: `${role} account created`, username: `${username}` }); 
  } catch (error) {
    console.log("in catch block of server.js/register");
    console.log(error);
    res.json({ success: false, message: 'Username or email already exists.' });
  }
});


app.post("/api/login", auth.login);

app.get("/api/users", auth.ensureAdmin, async (req, res) => {
  console.log("in GET /users");
  const result = await pool.query("SELECT username, email, role FROM users");
  console.log(`GET /users rows: ${result.rows}`);
  res.json(result.rows);
});

app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

app.get("/api/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post("/api/reviews", async (req, res) => {
  console.log("in POST /api/reviews");
  
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  const { rating, comment, section_id } = req.body;
  const user_id = req.session.user.id;
  const creation_date = new Date().toLocaleDateString('en-US');

  if (!rating || !comment || !section_id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Get the next review_id
    const maxResult = await pool.query("SELECT COALESCE(MAX(review_id), 0) as max_id FROM review");
    const next_review_id = maxResult.rows[0].max_id + 1;

    const query = 'INSERT INTO review (review_id, rating, comment, creation_date, user_id, section_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING review_id';
    const values = [next_review_id, rating, comment, creation_date, user_id, section_id];

    const result = await pool.query(query, values);
    console.log("Review created:", result.rows[0]);
    res.json({ success: true, message: 'Review created', review_id: result.rows[0].review_id });
  } catch (error) {
    console.log("Error creating review:", error);
    res.status(500).json({ success: false, message: 'Error creating review' });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
