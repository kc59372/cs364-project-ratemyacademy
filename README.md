# Rate My Academy
A database-driven web application that helps USAFA cadets evaluate courses and professors through peer reviews.

## Contributors
- Hannah Davis
- Will Lockhart
- Kaci McBrayer

## Tech Stack
- Frontend: HTML/CSS/JS  
- Backend: Node 
- Database: SQL

## Features
- Search by course, professor, or department  
- Submit and view ratings  
- Simple user profiles   

## Goal
Deliver a fully functional system with a user-friendly interface and real-world data.

## Documentation Statements
We used several online resources to guide the development of this project. References from W3Schools, including their CSS Grid documentation (https://www.w3schools.com/cssref/pr_grid.php), HTML forms guide (https://www.w3schools.com/html/html_forms.asp), and JavaScript event listener tutorial (https://www.w3schools.com/js/js_htmldom_eventlistener.asp), were used to support the implementation of layout styling, form creation, and interactive functionality. A Stack Overflow discussion (https://stackoverflow.com/questions/30295872/html-layout-with-only-part-of-the-page-scrolling) provided insight into structuring the page so that only certain elements would scroll, while GeeksforGeeks resources were used to format the login form (https://www.geeksforgeeks.org/html/html-login-form/) and to implement a JavaScript function that converts form input values into a JSON object (https://www.geeksforgeeks.org/javascript/how-to-convert-html-form-field-values-to-json-object-using-javascript/).

In addition, AI tools including ChatGPT and GitHub Copilot were used as supplemental learning and development aids throughout the project. ChatGPT was primarily used to help debug issues and clarify concepts related to frontend–backend interaction, such as JavaScript loading behavior, browser caching, session and authentication flow, API data fetching, and dynamically populating HTML tables. It also provided guidance on connecting frontend forms to backend routes, displaying a user-selected number of course rows, and implementing features like table truncation. GitHub Copilot was used mainly for CSS-related suggestions to improve the visual professionalism of the interface and assist with troubleshooting styling issues. All AI usage was limited to explanation, guidance, and refinement, and was used in accordance with class guidelines to support our understanding and implementation of the project.

I used ChatGPT as a supplemental debugging and design aid while working on displaying database reviews as cards, updating the /api/search query to match schema changes, and troubleshooting the write-review flow after normalizing review data with course_id and professor_id. I used the tool to help reason through SQL joins, frontend fetch/rendering behavior, browser DevTools payload inspection, and route/schema mismatches; I made the implementation decisions and code changes myself and used the AI assistance to clarify errors and verify my understanding.
