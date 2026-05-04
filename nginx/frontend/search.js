const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");
const messageContainer = document.getElementById("search-message");

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("query") || urlParams.get("q") || "";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

async function performSearch(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    messageContainer.textContent = "Please enter a department, course code, or instructor name.";
    resultsContainer.innerHTML = "";
    return;
  }

  messageContainer.textContent = `Searching for "${trimmed}"...`;
  resultsContainer.innerHTML = "";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const reviews = await response.json();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      messageContainer.textContent = `No reviews found for "${trimmed}".`;
      return;
    }

    messageContainer.textContent = `Found ${reviews.length} review${reviews.length === 1 ? "" : "s"}.`;
    resultsContainer.innerHTML = reviews.map(renderReviewCard).join("");
  } catch (error) {
    console.error(error);
    messageContainer.textContent = "Search failed. Please try again later.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const q = input.value.trim();
  if (!q) {
    messageContainer.textContent = "Please enter a search term.";
    resultsContainer.innerHTML = "";
    return;
  }
  history.replaceState(null, "", `/search.html?query=${encodeURIComponent(q)}`);
  performSearch(q);
});

if (initialQuery) {
  input.value = initialQuery;
  performSearch(initialQuery);
}
