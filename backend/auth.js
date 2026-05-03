//file: auth.js
// USAFA CS 364 
// Lesson 27 Authentication example
// Server-side authentication 
 
const crypto = require("crypto");
const db = require("./db");

const hashLength = 64;
const numHashIterations = 1000; 
// The iteration count 1000 is very low by modern standards. 
// In real systems, values like 100,000 are more common to better resist brute-force attacks.

const saltLength = 16;


async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  console.log(`auth login username ${username}`);
  console.log(`auth login password ${password}`);
  const user = (await db.query("SELECT * FROM users WHERE username = $1", [username])).rows[0];
  if (!user) return res.status(401).json({ message: "Login failure" });

  const hash = crypto.pbkdf2Sync(password, user.salt, numHashIterations, hashLength, "sha512").toString("hex");
  if (hash !== user.hash) return res.status(401).json({ message: "Login failure"});

  console.log(`making session: ${user.username}, ${user.role}`);
  req.session.user = {id: user.id, username: user.username, role: user.role };
  res.json({
    message: "Logged in",
    role: user.role,
    username: user.username
  });
}

async function register(req, res) {
  console.log("server.js: register ");
  const { username, email, password, role } = req.body;

  console.log(`server.js: register username: ${username}`);
  console.log(`server.js: register email: ${email}`);
  console.log(`server.js: register password: ${password}`);
  console.log(`server.js: register role: ${role}`);

  const salt = crypto.randomBytes(saltLength).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, numHashIterations, hashLength, "sha512").toString("hex");

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
}

function ensureAdmin(req, res, next) {
  console.log("checking authroization ... ");
  console.log(`${req.session.user}`);
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

//module.exports = { register, login, ensureAdmin };
module.exports = { login, ensureAdmin };

