async function loadCourses(limit) {
    try {
        const response = await fetch("/api/admin/course/display?limit=" + limit);
        const courses = await response.json();

        const tableBody = document.getElementById("course-table-body");
        tableBody.innerHTML = ""; // clear existing rows

        courses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.course_id}</td>
                <td>${course.course_code}</td>
                <td>${course.course_name}</td>
                <td>${course.d_id}</td>
            `;

            tableBody.appendChild(row);
            
            const rows = tableBody.querySelectorAll("tr");

            rows.forEach((row, index) => {
                row.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f2f2f2";
            });
        });

    } catch (error) {
        console.error("Error loading courses:", error);
    }
}

async function insertCourse(event) {
    event.preventDefault();

    let form = document.getElementById("insert-course");
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }
    let jsonData = JSON.stringify(formData);

    const response = await fetch("/api/admin/course/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: jsonData
    });

    const result = await response.json();

    if (response.ok) {
        alert(result.message);
        loadCourses();
    } else {
        alert(result.message);
    }
}

async function displayRows(event) {
    event.preventDefault();

    let form = document.getElementById("row-limit");
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }

    loadCourses(formData.row_limit);
}

async function truncateTable(event) {
    event.preventDefault();
    const response = await fetch("/api/admin/course/truncate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const courses = await response.json();
    loadCourses(10);
}

// Run when page loads
window.onload = () => loadCourses(10);