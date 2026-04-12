//file: auth.js
// USAFA CS 364
// Lesson 27 authentication example
// client side authentication

document.getElementById("loginForm").onsubmit = async function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  if (response.ok) window.location.href = "dashboard.html";
};

