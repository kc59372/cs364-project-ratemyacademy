-- taking the easy way: use the default database: postgres

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash CHAR(128) NOT NULL,
    salt CHAR(32) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
    first_name VARCHAR(20),
    last_name VARCHAR(30),
    squadron_number INT,
    class_year INT,
    account_created_date VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS department (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS professor (
    professor_id INT PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    d_id INT NOT NULL,
    CONSTRAINT fk_professor_department
        FOREIGN KEY (d_id)
        REFERENCES department(department_id)
);

CREATE TABLE IF NOT EXISTS course (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(120) NOT NULL,
    d_id INT NOT NULL,
    CONSTRAINT fk_course_department
        FOREIGN KEY (d_id)
        REFERENCES department(department_id)
);

CREATE TABLE IF NOT EXISTS section (
    section_id INT PRIMARY KEY,
    course_id INT NOT NULL,
    professor_id INT NOT NULL,
    CONSTRAINT fk_professor
        FOREIGN KEY (professor_id)
        REFERENCES professor(professor_id),
    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES course(course_id)
);

CREATE TABLE IF NOT EXISTS review (
    review_id SERIAL PRIMARY KEY,
    section_id INT NOT NULL,
    user_id INT NOT NULL,
    creation_date DATE DEFAULT CURRENT_DATE,
    rating INT CHECK (rating BETWEEN 1 AND 10),
    comment VARCHAR(1000),

    FOREIGN KEY (section_id) REFERENCES section(section_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO department VALUES
(1, 'Biology'),
(2, 'Chemistry'),
(3, 'Mathematical Sciences'),
(4, 'Physics and Meteorology'),
(5, 'Aeronautics'),
(6, 'Astronautics'),
(7, 'Civil and Environmental Engineering'),
(8, 'Computer and Cyber Sciences'),
(9, 'Electrical and Computer Engineering'),
(10, 'Mechanical Engineering'),
(11, 'Systems Engineering'),
(12, 'Languages and Cultures'),
(13, 'English and Fine Arts'),
(14, 'History'),
(15, 'Philosophy'),
(16, 'Behavioral Sciences and Leadership'),
(17, 'Economics and Geosciences'),
(18, 'Law'),
(19, 'Management'),
(20, 'Military and Strategic Studies'),
(21, 'Political Science');

INSERT INTO professor VALUES
(1, 'Katherine', 'Bates', 1),
(2, 'Todd', 'Davis', 2),
(3, 'Emily', 'Knight', 3),
(4, 'Kaz', 'Moffett', 4),
(5, 'Christopher', 'Coley', 5),
(6, 'Heather', 'Greatting-Dufaud', 6),
(7, 'Matthew', 'Buxkemper', 7),
(8, 'Dennis', 'Bouvier', 8),
(9, 'Claire', 'Badger', 8),
(10, 'Jason', 'McGinthy', 8),
(11, 'Stanley', 'Baek', 9),
(12, 'Ryan', 'Carr', 10),
(13, 'Cory', 'Cooper', 11),
(14, 'Jessica', 'Um', 12),
(15, 'Richard', 'Johnston', 13),
(16, 'Jorden', 'Pitt', 14),
(17, 'Rhonda', 'Smith', 15),
(18, 'Erika', 'King', 16),
(19, 'Andrew', 'Beguhl', 17),
(20, 'Taren', 'Wellman', 18),
(21, 'Anna', 'Broadbent', 19),
(22, 'Paul', 'Bezerra', 20),
(23, 'Gretchen', 'Gaskins', 21);

INSERT INTO course (course_code, course_name, d_id) VALUES
('Biology 330', 'Zoology', 1),
('Chem 233', 'Organic Chemistry I', 2),
('Math 142', 'Calculus II', 3),
('Physics 264', 'Modern Physics', 4),
('Aero Engr 342', 'Computational Aerodynamics', 5),
('Astr Engr 321', 'Intermediate Astrodynamics', 6),
('Civ Engr 361', 'Fundamental Hydraulics', 7),
('Comp Sci 330', 'Software Design and Development', 8),
('Comp Sci 364', 'Databases and Applications', 8),
('Cyber Sci 435', 'Cyber Operations', 8),
('ECE 281', 'Digital Design and Computer Architecture', 9),
('Mech Engr 312', 'Thermodynamics', 10),
('Sys Engr 311', 'Model Based Systems Engineering', 11),
('Arabic 131', 'Basic Arabic', 12),
('English 370', 'Special Topics in War and Literature', 13),
('History 300', 'World History', 14),
('Philos 320', 'Ethics and Technology', 15),
('Beh Sci 345', 'The Psychology of Learning', 16),
('Econ 201', 'Introduction to Economics', 17),
('Law 463', 'Law of War', 18),
('Mgt 341', 'Financial Accounting', 19),
('MSS 444', 'Space and Cyber Strategy for National Security', 20),
('Pol Sci 301', 'Political Theory', 21);

INSERT INTO users (username, email, hash, salt, role, first_name, last_name, squadron_number, class_year, account_created_date) VALUES
('hannah.davis', 'c27hannah.davis@afacademy.af.edu', 'hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1', 'salt1salt1salt1salt1', 'user', 'Hannah', 'Davis', 18, 27, '03/11/2026'),
('will.lockhart', 'c27guy.lockhart@afacademy.af.edu', 'hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2', 'salt2salt2salt2salt2', 'admin', 'Will', 'Lockhart', 16, 27, '03/11/2026'),
('kaci.mcbrayer', 'c27kaci.mcbrayer@afacademy.af.edu', 'hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3', 'salt3salt3salt3salt3', 'user', 'Kaci', 'Mcbrayer', 11, 27, '03/11/2026');

INSERT INTO section VALUES
(1, (SELECT course_id FROM course WHERE course_code = 'Biology 330'), 1),
(2, (SELECT course_id FROM course WHERE course_code = 'Chem 233'), 2),
(3, (SELECT course_id FROM course WHERE course_code = 'Math 142'), 3),
(4, (SELECT course_id FROM course WHERE course_code = 'Physics 264'), 4),
(5, (SELECT course_id FROM course WHERE course_code = 'Aero Engr 342'), 5),
(6, (SELECT course_id FROM course WHERE course_code = 'Astr Engr 321'), 6),
(7, (SELECT course_id FROM course WHERE course_code = 'Civ Engr 361'), 7),
(8, (SELECT course_id FROM course WHERE course_code = 'Comp Sci 330'), 8),
(9, (SELECT course_id FROM course WHERE course_code = 'Comp Sci 364'), 9),
(10, (SELECT course_id FROM course WHERE course_code = 'Cyber Sci 435'), 10),
(11, (SELECT course_id FROM course WHERE course_code = 'ECE 281'), 11),
(12, (SELECT course_id FROM course WHERE course_code = 'Mech Engr 312'), 12),
(13, (SELECT course_id FROM course WHERE course_code = 'Sys Engr 311'), 13),
(14, (SELECT course_id FROM course WHERE course_code = 'Arabic 131'), 14),
(15, (SELECT course_id FROM course WHERE course_code = 'English 370'), 15),
(16, (SELECT course_id FROM course WHERE course_code = 'History 300'), 16),
(17, (SELECT course_id FROM course WHERE course_code = 'Philos 320'), 17),
(18, (SELECT course_id FROM course WHERE course_code = 'Beh Sci 345'), 18),
(19, (SELECT course_id FROM course WHERE course_code = 'Econ 201'), 19),
(20, (SELECT course_id FROM course WHERE course_code = 'Law 463'), 20),
(21, (SELECT course_id FROM course WHERE course_code = 'Mgt 341'), 21),
(22, (SELECT course_id FROM course WHERE course_code = 'MSS 444'), 22),
(23, (SELECT course_id FROM course WHERE course_code = 'Pol Sci 301'), 23);

-- changed the inserts because changed the review structure to match the cards
INSERT INTO review (section_id, user_id, creation_date, rating, comment) VALUES
(8, 1, '2026-03-11', 10, 'Very fun class, great teacher, even if he does say so himself. Readings are not long, only 6 pages max. Make sure you do them. Would definitely recommend as an elective for non Comp Sci majors wishing to expand their scope of programming languages'),
(9, 2, '2026-03-11', 10, 'Not done with the class, but so far so good. Instructor is great even though I have only had her infrequently as she was subbing. Do the readings.'),
(10, 3, '2026-03-11', 10, 'As I am writing this I have not taken this class or heard anything about it. Instructor is great though.'),
(1, 2, '2026-03-12', 8, 'Interesting material and labs are engaging, but requires consistent studying to keep up.'),
(2, 3, '2026-03-12', 7, 'Challenging course with heavy memorization. Professor explains well but pace is fast.'),
(3, 1, '2026-03-12', 9, 'Well-structured and clear instruction. Homework is tough but prepares you well for exams.'),
(4, 2, '2026-03-12', 8, 'Concepts are difficult but rewarding. Lectures are solid if you stay focused.'),
(5, 3, '2026-03-12', 9, 'Very technical but extremely interesting. Great for anyone considering aero as a major.'),
(6, 1, '2026-03-12', 9, 'Challenging math but fascinating applications. Instructor is passionate and helpful.'),
(7, 2, '2026-03-12', 8, 'Practical and useful material. Workload is manageable with good time management.'),
(11, 3, '2026-03-12', 7, 'Labs can be time-consuming, but you learn a lot. Definitely not an easy A.'),
(12, 1, '2026-03-12', 8, 'Thermo is tough but rewarding. Expect to put in consistent effort.'),
(13, 2, '2026-03-12', 9, 'Very applicable to real-world problems. Group projects are meaningful.'),
(14, 3, '2026-03-12', 10, 'Fun and interactive class. Great environment for learning a new language.'),
(15, 1, '2026-03-12', 9, 'Engaging discussions and interesting readings. Workload is reasonable.'),
(16, 2, '2026-03-12', 8, 'Lots of reading but lectures tie everything together well.'),
(17, 3, '2026-03-12', 9, 'Makes you think critically. Discussions are the best part of the course.'),
(18, 1, '2026-03-12', 10, 'Very relevant and interesting. Material is easy to connect to real life.'),
(19, 2, '2026-03-12', 8, 'Good intro course. Concepts are straightforward if you keep up with lectures.'), 
(20, 3, '2026-03-12', 9, 'Super interesting content. Instructor brings real-world experience into class.'),
(21, 1, '2026-03-12', 8, 'Useful for future leadership roles. Group work is a big component.'),
(22, 2, '2026-03-12', 10, 'One of the most interesting classes offered. Great discussions on strategy.'),
(23, 3, '2026-03-12', 9, 'Thought-provoking material and strong classroom discussions.');
-- added ChatGPT generated example reviews to create representative database

SELECT * FROM users;
SELECT * FROM review;
