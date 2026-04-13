//file: login.js
// used by login.html to log a user in

async function login(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("login-form"));
    const loginData = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Logged in successfully");

            if (result.role === "admin") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert(result.message || "Login failed");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
    }
}