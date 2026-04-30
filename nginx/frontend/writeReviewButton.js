document.getElementById("write-review-btn").addEventListener("click", async function() {
    const response = await fetch("/api/session", {
        credentials: "include"
    });

    const data = await response.json();

    if (data.loggedIn) {
        window.location.href = "write-review.html";
    } else {
        alert("You must be logged in to write a review.");
        window.location.href = "login.html";
    }
});