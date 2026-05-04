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

  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

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

// CREATE COURSE TABLE
app.post("/api/admin/course/create", auth.ensureAdmin, async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS course (
        course_id INT PRIMARY KEY,
        course_code VARCHAR(20) NOT NULL,
        course_name VARCHAR(120) NOT NULL,
        d_id INT,
        CONSTRAINT fk_course_department
          FOREIGN KEY (d_id)
          REFERENCES department(department_id)
      );
    `);

    res.json({ success: true, message: "Course table created (if not exists)" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error creating course table" });
  }
});

// DISPLAY DATA IN COURSE TABLE (LIMITED ROWS)
app.get("/api/admin/course/display", auth.ensureAdmin, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const result = await pool.query(
      "SELECT * FROM course ORDER BY course_id LIMIT $1",
      [limit]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
});

// TRUNCATE COURSE TABLE
app.post("/api/admin/course/truncate", auth.ensureAdmin, async (req, res) => {
  try {
    await pool.query("TRUNCATE TABLE course RESTART IDENTITY CASCADE");
    res.json({ success: true, message: "Course table truncated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error truncating table" });
  }
});

// INSERT TEST ROW INTO COURSE TABLE
app.post("/api/admin/course/insert", auth.ensureAdmin, async (req, res) => {
  const { course_id, course_code, course_name, d_id } = req.body;

  if (!course_id || !course_code || !course_name) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  try {
    const query = `
      INSERT INTO course (course_id, course_code, course_name, d_id)
      VALUES ($1, $2, $3, $4)
    `;

    const values = [course_id, course_code, course_name, d_id];

    await pool.query(query, values);

    res.json({ success: true, message: "Course inserted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Insert failed" });
  }
});

// DROP COURSE TABLE
app.post("/api/admin/course/drop", auth.ensureAdmin, async (req, res) => {
  try {
    await pool.query("DROP TABLE IF EXISTS course CASCADE");
    res.json({ success: true, message: "Course table dropped" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error dropping table" });
  }
});

app.get("/api/search", async (req, res) => {
  const queryText = (req.query.q || req.query.query || "").trim();

  try {
    let result;

    if (!queryText) {
      result = await pool.query(
        // `SELECT review_id, department, course_id, instructor_first_name, instructor_last_name, reviewer_first_name, reviewer_last_name, creation_date, comment
        //  FROM review
        //  ORDER BY creation_date DESC
        //  LIMIT 20`
        `SELECT 
            review.review_id, 
            review.department, 
            review.course_id, 
            professor.first_name AS instructor_first_name,
            professor.last_name AS instructor_last_name,
            review.reviewer_first_name, 
            review.reviewer_last_name, 
            review.creation_date, 
            review.rating,
            review.comment, 
            course.course_code, 
            course.course_name
         FROM review 
         LEFT JOIN course ON review.course_id = course.course_id
         LEFT JOIN professor ON review.professor_id = professor.professor_id
         ORDER BY creation_date DESC
         LIMIT 20`
      );
    } else {
      const searchTerm = `%${queryText}%`;
      result = await pool.query(
        `SELECT
           r.review_id,
           r.rating,
           r.comment,
           r.creation_date,
           c.course_code,
           c.course_name,
           d.department_name,
           p.first_name AS instructor_first_name,
           p.last_name AS instructor_last_name
         FROM review r
          LEFT JOIN course c ON r.course_id = c.course_id
          LEFT JOIN professor p ON r.professor_id = p.professor_id
          LEFT JOIN department d ON c.d_id = d.department_id
         WHERE d.department_name ILIKE $1
            OR c.course_code ILIKE $1
            OR c.course_name ILIKE $1
            OR p.first_name ILIKE $1
            OR p.last_name ILIKE $1
            OR (p.first_name || ' ' || p.last_name) ILIKE $1
         ORDER BY r.creation_date DESC
         LIMIT 50`,
        [searchTerm]
      );
      // result = await pool.query(
      //   `SELECT
      //      r.review_id,
      //      r.rating,
      //      r.comment,
      //      r.creation_date,
      //      c.course_code,
      //      c.course_name,
      //      d.department_name,
      //      r.first_name AS instructor_first_name,
      //      r.last_name AS instructor_last_name
      //    FROM review r
      //    LEFT JOIN course c ON r.course_id = c.course_id
      //    LEFT JOIN department d ON c.d_id = d.department_id
      //    WHERE d.department_name ILIKE $1
      //       OR c.course_code ILIKE $1
      //       OR c.course_name ILIKE $1
      //       OR r.first_name ILIKE $1
      //       OR r.last_name ILIKE $1
      //       OR (r.first_name || ' ' || r.last_name) ILIKE $1
      //    ORDER BY r.creation_date DESC
      //    LIMIT 50`,
      //   [searchTerm]
      // );
    }

    res.json(result.rows);
  } catch (err) {
    console.log("Error searching reviews:", err);
    res.status(500).json({ success: false, message: "Error searching reviews" });
  }
});

// reviews route
app.post("/api/reviews", async (req, res) => {
  console.log("in POST /api/reviews");

  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  const {
    department,
    course_id,
    instructor_first_name,
    instructor_last_name,
    reviewer_first_name,
    reviewer_last_name,
    creation_date,
    rating,
    comment
  } = req.body;

  const user_id = req.session.user.id;

  if (
    !department ||
    !course_id ||
    !instructor_first_name ||
    !instructor_last_name ||
    !reviewer_first_name ||
    !reviewer_last_name ||
    !creation_date ||
    !rating ||
    !comment
  ) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const maxResult = await pool.query(
      "SELECT COALESCE(MAX(review_id), 0) as max_id FROM review"
    );

    const next_review_id = maxResult.rows[0].max_id + 1;

    const prequery = `
      SELECT professor_id
      FROM professor
      WHERE first_name ILIKE $1
        AND last_name ILIKE $2
      LIMIT 1

    `;
    
    const professorResult = await pool.query(prequery, [
      instructor_first_name,
      instructor_last_name
    ]);

    if (professorResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Professor not found" });
    }
    
    const professor_id = professorResult.rows[0].professor_id;

    const query = `
      INSERT INTO review (
        review_id,
        department,
        course_id,
        professor_id,
        reviewer_first_name,
        reviewer_last_name,
        creation_date,
        rating,
        comment,
        user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING review_id
    `;

    const values = [
      next_review_id,
      department,
      course_id,
      professor_id,
      reviewer_first_name,
      reviewer_last_name,
      creation_date,
      rating,
      comment,
      user_id
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: "Review created",
      review_id: result.rows[0].review_id
    });

  } catch (error) {
    console.log("Error creating review:", error);
    res.status(500).json({ success: false, message: "Error creating review" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
