// Documentation: I used https://www.w3schools.com/js/js_htmldom_methods.asp to learn how to post the review
// via api to the db
async function requireLogin() {
    const response = await fetch("/api/session", {
        credentials: "include"
    });

    const data = await response.json();

    if (!data.loggedIn) {
        alert("You must be logged in to write a review.");
        window.location.href = "login.html";
    }
}

requireLogin();

document.getElementById("review-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const reviewData = {
        section_id: document.getElementById("section_id").value,
        rating: document.getElementById("rating").value,
        comment: document.getElementById("comment").value
    };
    
    const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(reviewData)
    });

    const data = await response.json();
    const message = document.getElementById("review-message");

    if (response.ok && data.success) {
        message.textContent = "Review submitted successfully!";
        document.getElementById("review-form").reset();
    } else {
        message.textContent = data.message || "Error submitting review.";
    }
});

async function displaySections(){
    try {
        const response = await fetch("/api/sections");
        const sections = await response.json();

        const options = document.getElementById("section_id");

        sections.forEach(section => {
            const option = document.createElement("option");
            
            option.value = section.section_id;
            option.textContent = `${section.course_code} - ${section.course_name} - ${section.instructor_first_name} ${section.instructor_last_name}`;

            options.appendChild(option);
        });


    } catch (error) {
        console.error("Error loading sections:", error);
    }
}

window.addEventListener("DOMContentLoaded", displaySections);