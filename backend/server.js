const express = require("express");

const app = express();

// for using post rather than get in searches
// Documentation: https://www.geeksforgeeks.org/web-tech/express-js-app-post-function/
app.use(express.static("frontend"));
app.use(express.urlencoded({ extended: true }));

app.post("/search", (req, res) => {
   const query = req.body.query;

   res.send(query);
});

app.get("/api/session", (req, res) => {
if (req.session.user) {
res.json({ loggedIn: true, user: req.session.user });
} else {
res.json({ loggedIn: false });
}
});

app.post("/api/register", async (req, res) => {
const { username, email, password, role } = req.body;
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
const query = 'INSERT INTO users (username, email, hash, salt, role) VALUES ($1, $2, $3, $4, $5) RETURNING
}); // error checking follows

app.listen(3000, () => {
   console.log("Node server running");
});
