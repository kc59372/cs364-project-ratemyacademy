async function displayReviews(){

    try {
        const response = await fetch("/api/search");
        const reviews = await response.json();

        const cardContainer = document.getElementById("display-reviews");
        cardContainer.innerHTML = reviews.map(renderReviewCard).join("");


    } catch (error) {
        console.error("Error loading reviews:", error);
    }

    
}

function renderReviewCard(review) {
  return `
    <div class="card">
      <div class="card-title">${escapeHtml(review.course_code || "Unknown Course")}</div>
      <div class="card-subtitle">${escapeHtml(review.course_name || "No course name")}</div>
      <div class="card-meta">
        <span>Department: ${escapeHtml(review.department || "Unknown")}</span>
        <span>Instructor: ${escapeHtml(review.instructor_first_name || "")} ${escapeHtml(review.instructor_last_name || "")}</span>
        <span>Date: ${escapeHtml(review.creation_date || "")}</span>
        <span>Rating: ${escapeHtml(review.rating != null ? review.rating : "N/A")}</span>
      </div>
      <div class="card-text">${escapeHtml(review.comment)}</div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

window.addEventListener("DOMContentLoaded", displayReviews);