//file: dashboard.js
// used by dashboard.html to fetch users from the database
// and udpate HTML table with user data
async function fetchUsers() {
const response = await fetch("/api/users", { credentials: "include" });
const users = await response.json();
if (response.ok) {
// get HTML table (going to modify this)
// for each user in result,
// create table row and append to table in DOM
} else {
alert("Unauthorized access! ");
window.location.href = "/frontpage.html";
}
}