//file: loginSatus.js -- used on frontpage.html (can be used elsewhere)
//
// script should be included and DEFERed on all pages requiring user to be logged-in for access
// requires an element named userStatus - replaces the text with either login or logout links

async function checkLoginStatus() {
    try {
        const response = await fetch("/api/session", {
            credentials: "include"
        });

        const data = await response.json();
        const userStatus = document.getElementById("user-status");

        if (!userStatus) return;

        if (data.loggedIn) {
            userStatus.innerHTML = `
                Logged in as: <strong>${data.user.username}</strong>
                | <a href="logout.html">Logout</a>
            `;
        } else {
            userStatus.innerHTML = `
                <a href="login.html">Login</a> |
                <a href="register.html">Register</a>
            `;
        }
    } catch (error) {
        console.error("Error while checking login status:", error);
    }
}

window.addEventListener("load", checkLoginStatus);
