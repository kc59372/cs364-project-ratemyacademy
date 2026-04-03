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

app.listen(3000, () => {
   console.log("Node server running");
});
