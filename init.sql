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
    d_id INT,
    CONSTRAINT fk_professor_department
        FOREIGN KEY (d_id)
        REFERENCES department(department_id)
);

CREATE TABLE IF NOT EXISTS course (
    course_id INT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(120) NOT NULL,
    d_id INT,
    CONSTRAINT fk_course_department
        FOREIGN KEY (d_id)
        REFERENCES department(department_id)
);

CREATE TABLE IF NOT EXISTS section (
    section_id INT PRIMARY KEY,
    course_id INT,
    professor_id INT,
    CONSTRAINT fk_professor
        FOREIGN KEY (professor_id)
        REFERENCES professor(professor_id),
    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES course(course_id)
);

CREATE TABLE IF NOT EXISTS review (
    review_id INT PRIMARY KEY,
    department VARCHAR(80),
    course_id VARCHAR(20),
    instructor_first_name VARCHAR(20),
    instructor_last_name VARCHAR(30),
    reviewer_first_name VARCHAR(20),
    reviewer_last_name VARCHAR(30),
    creation_date DATE,
    comment VARCHAR(1000),
    user_id INT,
    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
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

INSERT INTO course VALUES
(1, 'Biology 330', 'Zoology', 1),
(2, 'Chem 233', 'Organic Chemistry I', 2),
(3, 'Math 142', 'Calculus II', 3),
(4, 'Physics 264', 'Modern Physics', 4),
(5, 'Aero Engr 342', 'Computational Aerodynamics', 5),
(6, 'Astr Engr 321', 'Intermediate Astrodynamics', 6),
(7, 'Civ Engr 361', 'Fundamental Hydraulics', 7),
(8, 'Comp Sci 330', 'Software Design and Development', 8),
(9, 'Comp Sci 364', 'Databases and Applications', 8),
(10, 'Cyber Sci 435', 'Cyber Operations', 8),
(11, 'ECE 281', 'Digital Design and Computer Architecture', 9),
(12, 'Mech Engr 312', 'Thermodynamics', 10),
(13, 'Sys Engr 311', 'Model Based Systems Engineering', 11),
(14, 'Arabic 131', 'Basic Arabic', 12),
(15, 'English 370', 'Special Topics in War and Literature', 13),
(16, 'History 300', 'World History', 14),
(17, 'Philos 320', 'Ethics and Technology', 15),
(18, 'Beh Sci 345', 'The Psychology of Learning', 16),
(19, 'Econ 201', 'Introduction to Economics', 17),
(20, 'Law 463', 'Law of War', 18),
(21, 'Mgt 341', 'Financial Accounting', 19),
(22, 'MSS 444', 'Space and Cyber Strategy for National Security', 20),
(23, 'Pol Sci 301', 'Political Theory', 21);

INSERT INTO users (username, email, hash, salt, role, first_name, last_name, squadron_number, class_year, account_created_date) VALUES
('hannah.davis', 'c27hannah.davis@afacademy.af.edu', 'hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1hash1', 'salt1salt1salt1salt1', 'user', 'Hannah', 'Davis', 18, 27, '03/11/2026'),
('will.lockhart', 'c27guy.lockhart@afacademy.af.edu', 'hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2hash2', 'salt2salt2salt2salt2', 'admin', 'Will', 'Lockhart', 16, 27, '03/11/2026'),
('kaci.mcbrayer', 'c27kaci.mcbrayer@afacademy.af.edu', 'hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3hash3', 'salt3salt3salt3salt3', 'user', 'Kaci', 'Mcbrayer', 11, 27, '03/11/2026');

INSERT INTO section VALUES
(1, 8, 8),
(2, 9, 9),
(3, 10, 10);

-- changed the inserts because changed the review structure to match the cards
INSERT INTO review (
    review_id,
    department,
    course_id,
    instructor_first_name,
    instructor_last_name,
    reviewer_first_name,
    reviewer_last_name,
    creation_date,
    comment,
    user_id
) VALUES
(1, 'Computer and Cyber Sciences', 'Comp Sci 330', 'Dennis', 'Bouvier', 'Hannah', 'Davis', '2026-03-11',
 'Very fun class, great teacher, even if he does say so himself. Readings are not long, only 6 pages max. Make sure you do them. Would definitely recommend as an elective for non Comp Sci majors wishing to expand their scope of programming languages.',
 1),

(2, 'Computer and Cyber Sciences', 'Comp Sci 364', 'Claire', 'Badger', 'Will', 'Lockhart', '2026-03-11',
 'Not done with the class, but so far so good. Instructor is great even though I have only had her infrequently as she was subbing. Do the readings.',
 2),

(3, 'Computer and Cyber Sciences', 'Cyber Sci 435', 'Jason', 'McGinthy', 'Kaci', 'Mcbrayer', '2026-03-11',
 'As I am writing this I have not taken this class or heard anything about it. Instructor is great though.',
 3);

SELECT * FROM users;
SELECT * FROM review;
