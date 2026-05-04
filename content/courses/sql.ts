const sqlContent: Record<number, string> = {

  1: `# Introduction to Databases

A database is an organized, structured collection of data stored and accessed electronically. Think of it like a digital filing system instead of paper files in cabinets, data is stored in tables that can be searched, sorted, and updated instantly. Databases power almost every application we use daily.

## 1. What is a Database?

A database is a collection of related data organized for efficient storage and retrieval. Every time you log into an app, check your bank balance, or order food online a database is working behind the scenes. Without databases, applications would have no permanent memory.

:::scenario
Amazon has millions of products. Every product name, price, stock count, and seller detail is stored in databases. When you search 'headphones', the database retrieves matching rows instantly from millions of records.
:::

- Stores data permanently and securely
- Allows multiple users to access data simultaneously
- Ensures data consistency and integrity
- Supports querying, filtering, and reporting

## 2. What is an RDBMS?

RDBMS stands for Relational Database Management System. It organizes data into tables (like spreadsheet grids) with rows and columns. The 'relational' part means tables can be linked to each other using keys. This avoids storing duplicate data and keeps the database efficient.

:::scenario
A hospital database has a 'Patients' table and a 'Doctors' table. Instead of repeating the doctor's name in every patient record, we store the doctor's ID and link the tables this is the relational model.
:::

- Data organized in tables (relations)
- Tables linked by Primary Keys and Foreign Keys
- Supports SQL for data manipulation
- Examples: MySQL, PostgreSQL, Oracle, SQL Server, SQLite

## 3. SQL vs NoSQL

SQL (Structured Query Language) databases are relational they use fixed schemas and tables. NoSQL databases are non-relational they store data as documents, key-value pairs, graphs, or wide columns. SQL is better for structured, consistent data; NoSQL is better for unstructured, large-scale, or rapidly changing data.

:::scenario
A bank uses SQL (MySQL/PostgreSQL) to store account transactions data must be consistent and structured. Instagram uses NoSQL (Cassandra) to store millions of posts per second flexible, high-speed writes are more important than rigid structure.
:::

- SQL: Fixed schema, ACID compliant, uses tables and rows
- NoSQL: Flexible schema, horizontal scaling, various data models
- SQL examples: MySQL, PostgreSQL, Oracle
- NoSQL examples: MongoDB (documents), Redis (key-value), Cassandra (wide-column), Neo4j
(graph)

## 4. Tables, Rows, and Columns

In a relational database, data is stored in tables. A table is like a spreadsheet. Each column defines a field (attribute) and each row is one record (entity). For example, a 'students' table has columns like id, name, age, and email and each student is stored as a row.

**Sample Students Table:**

| id | name | age | city |
| --- | --- | --- | --- |
| 1 | Alice | 22 | Mumbai |
| 2 | Bob | 24 | Delhi |
| 3 | Carol | 21 | Hyderabad |



## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | List 5 real-world applications you use daily (e.g., Zomato, PhonePe) and for each, identify what data they likely store in a database. | Easy | Research |
| 2 | Draw a simple table structure (on paper or digitally) for an 'Employees' table with at least 6 meaningful columns. Describe what each column stores. | Easy | Design |
| 3 | Compare MySQL and PostgreSQL: research and list 4 similarities and 4 differences between them. | Medium | Research |
| 4 | Explain with a real-world analogy why a bank would use SQL rather than NoSQL. Write at least 150 words. | Medium | Written |
| 5 | Create an ER diagram for a School system with 3 tables: Students, Teachers, and Courses. Show how they are related. | Hard | Design |
`,

  2: `# Database Installation & Setup

Before writing SQL, you need a working database environment. This topic covers installing MySQL and PostgreSQL, connecting via GUI tools (MySQL Workbench and pgAdmin), and using the command-line interface (CLI). Understanding your environment is essential before writing any queries.

## 1. Installing MySQL

MySQL is one of the world's most popular open-source relational databases, widely used in web applications. Download MySQL Community Server from mysql.com. During installation, you set a root password remember it, as this is the administrator account. MySQL runs as a background service on your computer.
- Download from: https://dev.mysql.com/downloads/
- Choose MySQL Community Server (free version)
- Set a root password during installation
- Default port: 3306
- MySQL Workbench is the official GUI tool (can be installed separately)
Verify MySQL installation via terminal:

\`\`\`bash
mysql --version
\`\`\`

Login to MySQL CLI:

\`\`\`bash
mysql -u root –p
-- Enter your password when prompted
\`\`\`

Basic commands after login:

\`\`\`sql
SHOW DATABASES; -- list all databases
USE school; -- switch to 'school' database
SHOW TABLES; -- list tables in current database
EXIT; -- logout
\`\`\`


## 2. Installing PostgreSQL

PostgreSQL (often called Postgres) is a powerful, enterprise-grade open-source database known for advanced features. Download from postgresql.org. During installation, you create a default superuser called 'postgres'. pgAdmin is the official GUI tool and installs alongside PostgreSQL.
- Download from: https://www.postgresql.org/download/
- Creates default superuser: 'postgres'
- Default port: 5432
- pgAdmin 4 is the GUI tool (usually installed with PostgreSQL)
- psql is the command-line tool
Verify PostgreSQL installation:

\`\`\`bash
psql --version
\`\`\`

Login to PostgreSQL CLI:

\`\`\`bash
psql -U postgres
\`\`\`

Basic psql commands:

\`\`\`bash
\\l -- list all databases
\\c school -- connect to 'school' database
\\dt -- list all tables
\\d students -- describe structure of 'students' table
\\q -- quit psql
\`\`\`


## 3. MySQL Workbench GUI Tool

MySQL Workbench is a visual tool that allows you to manage databases, write queries, view table structures, and design schemas all without memorizing every command. It is ideal for beginners because you can see your tables and data visually.

:::scenario
A data analyst at a retail company uses MySQL Workbench daily. She connects to the company's MySQL server, browses the 'sales' database, writes SELECT queries in the query editor, and exports results to Excel all without touching the command line.
:::

- Query editor with syntax highlighting
- Visual table and schema designer
- Import/export data (CSV, SQL files)
- Connection manager for multiple servers

## 4. Creating Your First Database

Once connected, you can create a database (also called a schema) which acts as a container for all your tables. Use CREATE DATABASE to create one and USE to switch to it in MySQL, or \\c in PostgreSQL. MySQL Create and select a database:

\`\`\`sql
CREATE DATABASE school_db;
USE school_db;
SHOW TABLES;
\`\`\`

PostgreSQL Create and connect:

\`\`\`sql
CREATE DATABASE school_db;
\\c school_db
Drop a database (careful!):
DROP DATABASE school_db; -- permanently deletes everything!
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Install MySQL on your machine. Connect using MySQL Workbench, create a database called 'practice_db', and take a screenshot of the successful connection. | Easy | Practical |
| 2 | Install PostgreSQL and connect using pgAdmin. Create a database called 'training_db'. Document each step with screenshots. | Easy | Practical |
| 3 | Using MySQL CLI, login and run SHOW DATABASES. List all default databases you see and explain the purpose of each (research online). | Medium | Research |
| 4 | Explore all the psql backslash commands (\\l, \\c, \\dt, \\d, \\q, \\du). Write a short description of what each does. | Medium | Exploration |
| 5 | Create 3 databases in MySQL: 'hospital_db', 'school_db', 'ecommerce_db'. Then drop 'ecommerce_db' and verify it's gone using SHOW DATABASES. | Hard | Practical |
`,

  3: `# Basic SQL Syntax

SQL (Structured Query Language) uses simple, English-like commands to interact with databases. The most fundamental query is SELECT, which retrieves data. Understanding the structure and order of SQL clauses is the foundation for everything that follows.

## 1. The SELECT Statement

SELECT is the most-used SQL command. It retrieves data from one or more tables. You specify which columns you want (or use * for all columns) and which table to pull from using FROM. SQL is not case-sensitive for keywords, but writing keywords in UPPERCASE is a best practice for readability.

:::scenario
An HR manager wants to see all employee names and their salaries. She runs: SELECT name, salary FROM employees; the database returns exactly those two columns for every employee instantly, even if the table has 10,000 rows.
:::

Select all columns:

\`\`\`sql
SELECT * FROM employees;
Select specific columns:
SELECT name, department, salary FROM employees;
\`\`\`


**Output:**

| name | department | salary |
| --- | --- | --- |
| Alice | IT | 60000 |
| Bob | Finance | 55000 |



## 2. The WHERE Clause

WHERE filters rows based on a condition. Only rows where the condition is TRUE are returned. You can

\`\`\`sql
use comparison operators:
\`\`\`

= (equals), != or <> (not equals),
> (greater than),
< (less than), >= (greater than or equal), <= (less than or equal).

:::scenario
A bank analyst needs to find all accounts with a balance below 1000 (low-balance alert). Query: SELECT account_number, customer_name, balance FROM accounts WHERE balance < 1000;
:::

Filter by exact value:

\`\`\`sql
SELECT * FROM employees WHERE department = 'IT';
\`\`\`

Filter by comparison:

\`\`\`sql
SELECT name, salary FROM employees WHERE salary >= 50000;
\`\`\`

Filter with not equals:

\`\`\`sql
SELECT * FROM employees WHERE status != 'inactive';
\`\`\`


## 3. ORDER BY Sorting Results

ORDER BY sorts the query results. ASC (ascending) is the default it sorts lowest to highest (A to Z, 0 to 9). DESC (descending) sorts highest to lowest (Z to A, 9 to 0). You can sort by multiple columns the second column is used as a tiebreaker when the first column has equal values.

:::scenario
An e-commerce platform wants to show products sorted from cheapest to most expensive. Query: SELECT product_name, price FROM products ORDER BY price ASC; customers see the budget options first.
:::

Sort by salary descending (highest first):

\`\`\`sql
SELECT name, salary FROM employees ORDER BY salary DESC;
\`\`\`

Sort alphabetically:

\`\`\`sql
SELECT * FROM students ORDER BY name ASC;
\`\`\`

Sort by multiple columns:

\`\`\`sql
-- First by department A-Z, then by salary high-low within each dept
SELECT name, department, salary FROM employees
ORDER BY department ASC, salary DESC;
\`\`\`


## 4. LIMIT Restricting Row Count

LIMIT (MySQL) or FETCH FIRST n ROWS ONLY (PostgreSQL standard) restricts how many rows are returned. This is essential for large tables you rarely want all millions of rows. LIMIT is also used with
ORDER BY for Top-N queries (e.g., top 10 best-selling products).

:::scenario
A news website shows the 5 most recent articles on the homepage. Query: SELECT title, published_date FROM articles ORDER BY published_date DESC LIMIT 5; always shows exactly the 5 newest articles.
:::

MySQL Get first 10 rows:

\`\`\`sql
SELECT * FROM products LIMIT 10;
\`\`\`

Top 5 highest salaries:

\`\`\`sql
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;
\`\`\`

PostgreSQL equivalent:

\`\`\`sql
SELECT * FROM products FETCH FIRST 10 ROWS ONLY;
LIMIT with OFFSET (skip rows):
-- Skip first 10, get next 5 (useful for pagination)
SELECT * FROM products LIMIT 5 OFFSET 10;
\`\`\`


## 5. SQL Statement Structure & Rules

SQL statements follow a specific clause order. Writing them in the wrong order causes errors. Key rules:
always end statements with a semicolon (;), keywords are case-insensitive but conventionally UPPERCASE, and string values must be in single quotes. Correct clause order:

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1
LIMIT n;
Complete real example:
SELECT name, department, salary
FROM employees
WHERE salary > 40000
ORDER BY salary DESC
LIMIT 10;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to retrieve name, email, and city from a 'customers' table for customers in 'Hyderabad', sorted by name alphabetically. | Easy | Query Writing |
| 2 | Write a query to get the top 10 highest-paid employees showing only name and salary. | Easy | Query Writing |
| 3 | Implement pagination: write 3 queries to get pages 1, 2, and 3 from a products table (10 products per page) using LIMIT and OFFSET. | Medium | Query Writing |
| 4 | Write a query to find orders where the total_amount is between 500 and 2000, sorted by order_date newest first, showing only the first 20 rows. | Medium | Query Writing |
| 5 | Explain in your own words why you should not use SELECT * in production applications. What are 3 potential problems with it? | Hard | Written |
`,

  4: `# Data Types in SQL

Every column in a database table must have a data type that defines what kind of data it can store. Choosing the correct data type is critical it affects storage space, performance, and data integrity. Using the wrong type (e.g., storing phone numbers as INT) causes errors and data loss.

## 1. Numeric Data Types

Numeric types store numbers. INT (or INTEGER) stores whole numbers without decimals perfect for IDs, ages, and counts. DECIMAL (or NUMERIC) stores exact decimal numbers and is essential for money/prices where precision matters. FLOAT and DOUBLE store approximate decimals and are used for scientific data.

:::scenario
An online store uses INT for product quantity (you can't have 2.5 items in stock) and DECIMAL(10,2) for price (e.g., 499.99 10 total digits, 2 after the decimal point). Using FLOAT for price would cause rounding errors like 499.9999999 instead of 500.00.
:::

Numeric type examples:
age INT -- 25, 30, 100 quantity INT -- 1, 50, 1000 price DECIMAL(10,2) -- 499.99, 1299.00 discount_pct DECIMAL(5,2) -- 12.50 (percentage) rating FLOAT -- 4.7, 3.14159 population BIGINT -- 1400000000 (large numbers)

## 2. String / Text Data Types

VARCHAR(n) stores variable-length strings up to n characters it only uses as much space as the actual data. CHAR(n) stores fixed-length strings always uses exactly n characters (padded with spaces if shorter). TEXT stores very long text with no length limit. VARCHAR is the most commonly used string type.

:::scenario
A user profile table: username VARCHAR(50) because usernames vary in length. gender CHAR(1) because it's always exactly 'M' or 'F'. bio TEXT because users can write any length of bio. Using CHAR for username wastes space a 5-character username 'Alice' would be padded to 50 characters.
:::

String type examples:
username VARCHAR(50) -- 'alice123', 'john_doe' country_code CHAR(2) -- 'IN', 'US', 'UK' (always 2 chars) email VARCHAR(255) -- 'alice@gmail.com' description TEXT -- long paragraphs, article body gender CHAR(1) -- 'M' or 'F'

## 3. Date and Time Data Types

DATE stores only the calendar date (YYYY-MM-DD). TIME stores only time (HH:MM:SS). DATETIME / TIMESTAMP stores both date and time. TIMESTAMP in PostgreSQL is highly flexible. Use DATE for birthdates or event dates, DATETIME/TIMESTAMP for when something was created or modified.

:::scenario
An e-commerce order table: order_date DATE to store which day the order was placed, created_at TIMESTAMP to store the exact second it was created (useful for auditing and time-zone-aware reporting).
:::

Date/time type examples:
dob DATE -- '1999-05-15' order_date DATE -- '2024-11-20' login_time TIME -- '09:30:00' created_at DATETIME -- '2024-11-20 09:30:00' (MySQL) updated_at TIMESTAMP -- auto-updates on row change

## 4. Boolean and Other Types

BOOLEAN stores TRUE or FALSE. In MySQL, it's stored as TINYINT(1) where 1=TRUE and 0=FALSE. PostgreSQL has a native BOOLEAN type. Useful for flags like is_active, is_verified, is_deleted. ENUM constrains a column to a specific list of allowed values.

:::scenario
A user management system: is_active BOOLEAN tracks whether the account is active or suspended. is_email_verified BOOLEAN tracks email confirmation. Using VARCHAR for these would allow invalid values like 'maybe' or 'yes' BOOLEAN ensures only valid true/false values.
:::

Boolean and ENUM examples:
is_active BOOLEAN -- TRUE or FALSE is_verified BOOLEAN -- TRUE or FALSE

\`\`\`sql
-- MySQL ENUM:
status ENUM('pending','active','cancelled') -- only these 3 values
\`\`\`

allowed gender ENUM('Male','Female','Other') Full realistic table definition:

\`\`\`sql
CREATE TABLE users (
id INT,
username VARCHAR(50),
email VARCHAR(255),
age INT,
balance DECIMAL(12,2),
bio TEXT,
dob DATE,
created_at DATETIME,
is_active BOOLEAN,
status ENUM('active','suspended','deleted')
);
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Design a complete table schema for a 'Hospital Patients' table with at least 8 columns, choosing appropriate data types for each. Justify each choice. | Easy | Design |
| 2 | What data type would you use for: Aadhaar number, phone number, percentage marks, date of admission, profile photo file path? Justify with reasons. | Medium | Written |
| 3 | Create a 'banking_transactions' table with appropriate data types for: transaction_id, account_number, transaction_type, amount, transaction_date, description, is_successful. | Medium | Query Writing |
| 4 | Explain why storing a phone number as INT is a bad idea. Give 3 specific reasons and what data type you would use instead. | Medium | Written |
| 5 | Research the difference between DATETIME and TIMESTAMP in MySQL. When would you use each? Write a scenario for each. | Hard | Research |
`,

  5: `# DDL Commands

DDL (Data Definition Language) commands define and manage the structure of a database the databases, tables, and their columns. DDL commands do not manipulate data; they shape the containers that hold data. Understanding DDL is fundamental before inserting any data.

## 1. CREATE Building Databases and Tables


\`\`\`sql
CREATE DATABASE creates a new database container. CREATE TABLE defines a new table with its
\`\`\`

columns and data types. You can also define constraints (NOT NULL, PRIMARY KEY, etc.) directly in the CREATE TABLE statement. CREATE is the starting point for any database project.

:::scenario
A startup is building a food delivery app. The developer first creates a database 'foodapp_db', then creates tables: 'restaurants', 'menus', 'orders', 'customers'. Each table is created once, then data is inserted into it.
:::

Create a database:

\`\`\`sql
CREATE DATABASE foodapp_db;
USE foodapp_db; -- MySQL: switch to it
Create a table:
CREATE TABLE customers (
id INT NOT NULL,
name VARCHAR(100) NOT NULL,
email VARCHAR(255),
phone VARCHAR(15),
city VARCHAR(50),
created_at DATETIME
);
Create with PRIMARY KEY and AUTO_INCREMENT:
CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY, -- MySQL
name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
category VARCHAR(50)
);
\`\`\`


## 2. ALTER Modifying Existing Tables


\`\`\`sql
ALTER TABLE lets you modify a table after it has been created add new columns, remove columns,
\`\`\`

change data types, or rename columns. This is common when business requirements change after the database is already in use. ALTER does not affect existing data (unless you drop a column).

:::scenario
A company's HR database originally didn't have a 'LinkedIn URL' column for employees. Six months later, management wants to track LinkedIn profiles. The DBA runs
:::


\`\`\`sql
ALTER TABLE employees ADD COLUMN linkedin_url VARCHAR(255); existing employee rows now
\`\`\`

have NULL in this column, no data is lost. Add a new column:

\`\`\`sql
ALTER TABLE employees ADD COLUMN linkedin_url VARCHAR(255);
ALTER TABLE customers ADD COLUMN loyalty_points INT DEFAULT 0;
Drop a column:
ALTER TABLE employees DROP COLUMN linkedin_url;
\`\`\`

Change column data type (MySQL):

\`\`\`sql
ALTER TABLE products MODIFY COLUMN price DECIMAL(12,2);
\`\`\`

Rename a column (PostgreSQL):

\`\`\`sql
ALTER TABLE employees RENAME COLUMN name TO full_name;
\`\`\`

Rename a table:

\`\`\`sql
-- MySQL:
RENAME TABLE old_name TO new_name;
-- PostgreSQL:
ALTER TABLE old_name RENAME TO new_name;
\`\`\`


## 3. DROP Permanently Deleting Structures


\`\`\`sql
DROP TABLE permanently deletes a table including all its data, constraints, and indexes it cannot be
\`\`\`

undone. DROP DATABASE deletes an entire database with all its tables. Always use DROP with extreme caution in production environments.

:::scenario
A developer accidentally runs DROP TABLE orders; in a production database millions of order records are gone permanently. This is why production databases have daily backups and access controls. Never run DROP without confirming you're on the right database.
:::

Drop a table:

\`\`\`sql
DROP TABLE temp_data; -- deletes table and all data
DROP TABLE IF EXISTS temp_data; -- safe version, no error if table doesn't
\`\`\`

exist Drop a database:

\`\`\`sql
DROP DATABASE test_db; -- DANGER: deletes everything inside!
\`\`\`


## 4. TRUNCATE Clearing All Data


\`\`\`sql
TRUNCATE TABLE removes all rows from a table but keeps the table structure (columns, data types,
\`\`\`

constraints) intact. It is faster than DELETE for clearing large tables because it doesn't log individual row deletions. Unlike DROP, you can still use the table after TRUNCATE.

:::scenario
A testing team needs to reset the database after each test run. Instead of dropping and recreating tables, they TRUNCATE them the structure is preserved so the application keeps working, but all test data is cleared instantly.
:::


\`\`\`sql
Truncate a table:
TRUNCATE TABLE test_orders; -- removes all rows, keeps structure
-- Compare with DROP:
DROP TABLE test_orders; -- removes rows AND structure
TRUNCATE TABLE test_orders; -- removes rows, keeps structure
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a database 'company_db' and inside it create 3 tables: employees, departments, and projects each with at least 5 columns and appropriate data types. | Easy | Practical |
| 2 | Add a 'manager_id INT' column to your employees table, then add an 'is_remote BOOLEAN DEFAULT FALSE' column. Verify the changes. | Easy | Practical |
| 3 | Explain the difference between DROP, DELETE, and TRUNCATE with a real-world scenario for when you would use each. Write at least 200 words. | Medium | Written |
| 4 | Write a script that creates a 'library' database with tables: books, authors, members, and borrowings. Use appropriate constraints. | Medium | Query Writing |
| 5 | Research: What is the difference between MODIFY COLUMN (MySQL) and ALTER COLUMN (PostgreSQL/SQL Server)? Write examples of changing a column from VARCHAR(50) to VARCHAR(200) in both databases. | Hard | Research |
`,

  6: `# DML Commands

DML (Data Manipulation Language) commands work with the actual data inside tables. Once tables are created with DDL, you use DML to insert new records, retrieve data, update existing records, and delete records. These are the commands used most frequently in day-to-day database work.

## 1. INSERT Adding New Records


\`\`\`sql
INSERT INTO adds one or more new rows to a table. You specify the table name, the column names
(recommended), and the VALUES to insert. If you skip column names, you must provide values for ALL
\`\`\`

columns in the exact order they were defined. Always specify column names to avoid errors when table structure changes.

:::scenario
A new employee joins a company. The HR system runs an INSERT query to add their details to the employees table. The database immediately makes the record available the employee can now log in, get payroll processed, and appear in reports.
:::

Insert a single row (with column names recommended):

\`\`\`sql
INSERT INTO employees (name, department, salary, city)
VALUES ('Priya Sharma', 'IT', 65000, 'Hyderabad');
Insert multiple rows at once:
INSERT INTO employees (name, department, salary, city) VALUES
('Rahul Verma', 'Finance', 55000, 'Mumbai'),
('Sneha Patil', 'IT', 70000, 'Pune'),
('Karan Mehta', 'HR', 45000, 'Delhi');
Insert without specifying columns (risky order must match):
-- Only do this if you know the exact column order!
INSERT INTO employees VALUES (NULL, 'Alice', 'Marketing', 50000, 'Bangalore',
NOW());
\`\`\`


## 2. UPDATE Modifying Existing Records

UPDATE modifies data in existing rows. You specify the table, which column(s) to change, the new value(s), and a WHERE condition to identify which rows to update. ALWAYS include a WHERE clause without it, UPDATE changes ALL rows in the table, which is almost never what you want.

:::scenario
An employee gets promoted and their salary increases from 60000 to
:::


## 75000. The HR system runs: UPDATE employees SET salary = 75000 WHERE employee_id = 1042;

only that one employee's record is updated. Update one column:

\`\`\`sql
UPDATE employees SET salary = 75000 WHERE id = 1042;
Update multiple columns:
UPDATE employees
SET department = 'Senior IT', salary = 80000
WHERE id = 1042;
Update all rows in a department (give 10% raise):
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'IT';
\`\`\`


## 3. DELETE Removing Records

DELETE removes rows from a table. Like UPDATE, always use a WHERE clause to target specific rows.
DELETE without WHERE removes ALL rows (same effect as TRUNCATE but slower). Unlike TRUNCATE, DELETE can be rolled back if wrapped in a transaction (we cover this in intermediate).

:::scenario
A user deletes their account on a platform. The system runs: DELETE FROM users WHERE user_id = 5521; only that user's record is removed. Their orders might be kept in the orders table (foreign key constraint decisions matter here).
:::

Delete a specific row:

\`\`\`sql
DELETE FROM customers WHERE id = 5521;
Delete with a condition:
-- Delete all inactive accounts older than 2 years
DELETE FROM users
WHERE is_active = FALSE AND created_at < '2022-01-01';
\`\`\`


## 4. The Danger of UPDATE and DELETE Without WHERE

One of the most common and most devastating mistakes in SQL is running UPDATE or DELETE without a WHERE clause. This modifies or deletes every single row in the table. In production databases, this can cause irreversible data loss. DANGEROUS updates ALL employees:

\`\`\`sql
UPDATE employees SET salary = 0; -- Wipes all salaries!
-- ALWAYS add WHERE:
UPDATE employees SET salary = 0 WHERE id = 99; -- Safe
\`\`\`

DANGEROUS deletes ALL customers:

\`\`\`sql
DELETE FROM customers; -- Wipes all customers!
-- ALWAYS add WHERE:
DELETE FROM customers WHERE id = 123; -- Safe
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Insert 5 records into a 'students' table with columns: id, name, age, city, and marks. Use realistic Indian names and cities. | Easy | Practical |
| 2 | Update the marks of the student with id=3 to 92, and change their city to 'Chennai'. | Easy | Practical |
| 3 | Write a query to give a 15% salary hike to all employees in the 'IT' department whose current salary is below 60000. | Medium | Query Writing |
| 4 | Write a DELETE query to remove all orders that were placed before January 1, 2022 and have status = 'cancelled'. | Medium | Query Writing |
| 5 | Safety exercise: Before running DELETE FROM orders WHERE status='pending', write the equivalent SELECT query you would run first to preview what will be deleted. Explain why this practice is important. | Hard | Written |
`,

  7: `# Filtering & Sorting

Filtering and sorting are what make SQL queries powerful and useful. The WHERE clause lets you extract exactly the data you need from millions of rows. Logical operators (AND, OR, NOT) combine multiple conditions. Special operators like BETWEEN, IN, and LIKE make filtering more expressive and readable.

## 1. Comparison Operators in WHERE

WHERE uses comparison operators to filter rows. Each operator tests a condition for each row if TRUE, the row is included in results. All comparison operators:
= equal: WHERE city = 'Hyderabad' != not equal: WHERE status != 'cancelled' <> not equal (alt): WHERE status <> 'cancelled'
> greater than: WHERE salary > 50000
< less than: WHERE age < 25 >= greater or equal: WHERE experience >= 3 <= less or equal: WHERE price <= 999

## 2. AND, OR, NOT Combining Conditions

AND requires ALL conditions to be true. OR requires AT LEAST ONE condition to be true. NOT negates a condition. Use parentheses to control the order of evaluation AND has higher precedence than OR, just like multiplication vs addition in math.

:::scenario
A recruitment platform filters candidates: must be in IT department AND have 3+ years experience AND (live in Mumbai OR Pune). Without correct parentheses, the logic could accidentally include all Pune residents regardless of department.
:::

AND all conditions must be true:

\`\`\`sql
SELECT * FROM employees
WHERE department = 'IT' AND experience >= 3 AND salary < 80000;
OR at least one must be true:
SELECT * FROM employees
WHERE city = 'Mumbai' OR city = 'Pune' OR city = 'Hyderabad';
\`\`\`

NOT negates a condition:

\`\`\`sql
SELECT * FROM employees
WHERE NOT department = 'HR';
\`\`\`

Parentheses control logic order:

\`\`\`sql
-- Find IT or Finance employees with salary > 60000:
SELECT * FROM employees
WHERE (department = 'IT' OR department = 'Finance')
AND salary > 60000;
\`\`\`


## 3. BETWEEN Range Filtering

BETWEEN filters rows within an inclusive range (includes both endpoints). It works with numbers, dates, and even strings. BETWEEN a AND b is equivalent to >= a AND <= b. You can negate it with NOT BETWEEN.

:::scenario
An e-commerce platform wants to show 'mid-range' laptops priced between 40,000 and 80,000 to a customer. Using BETWEEN gives a clean, readable query instead of using >= and <=.
:::

BETWEEN with numbers:

\`\`\`sql
SELECT * FROM products
WHERE price BETWEEN 40000 AND 80000;
BETWEEN with dates:
-- Orders placed in Q1 2024:
SELECT * FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
\`\`\`

NOT BETWEEN:

\`\`\`sql
SELECT * FROM products WHERE price NOT BETWEEN 100 AND 500;
\`\`\`


## 4. IN and NOT IN List Filtering

IN checks if a column value matches any value in a list. It is cleaner than multiple OR conditions. NOT IN excludes rows that match any value in the list. Be cautious with NOT IN when the list might contain NULL values this can produce unexpected results.

:::scenario
A logistics company needs to process orders from specific cities: Mumbai, Delhi, Chennai, Bangalore. Using IN is much cleaner than writing 4 OR conditions.
:::

IN match any value in list:

\`\`\`sql
SELECT * FROM customers
WHERE city IN ('Mumbai', 'Delhi', 'Chennai', 'Bangalore');
NOT IN exclude values:
SELECT * FROM employees
WHERE department NOT IN ('Admin', 'Housekeeping', 'Security');
\`\`\`

Equivalent without IN (less readable):
WHERE city = 'Mumbai' OR city = 'Delhi' OR city = 'Chennai' OR city = 'Bangalore'

## 5. LIKE Pattern Matching

LIKE is used with WHERE to search for patterns in text columns. % matches any sequence of characters (zero or more). _ (underscore) matches exactly one character. LIKE is case-insensitive in MySQL by default. Use ILIKE in PostgreSQL for case-insensitive matching.

:::scenario
A customer support team needs to find all customers whose email is from '@gmail.com'. Using LIKE '%@gmail.com' instantly filters all Gmail users from the customers table.
:::

LIKE pattern examples:

\`\`\`sql
-- Names starting with 'A':
WHERE name LIKE 'A%'
-- Names ending with 'kumar':
WHERE name LIKE '%kumar'
-- Names containing 'raj' anywhere:
WHERE name LIKE '%raj%'
-- Email from gmail.com:
WHERE email LIKE '%@gmail.com'
-- 6-character names (each _ = one char):
WHERE name LIKE '______'
-- Names where 2nd character is 'a':
WHERE name LIKE '_a%'
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to find all products with price between 500 and 2000, from category 'Electronics', sorted by price ascending. | Easy | Query Writing |
| 2 | From a 'students' table, find students NOT from ('Mumbai','Delhi','Pune') who scored above 75 marks. | Easy | Query Writing |
| 3 | Write a query to find all customers whose name starts with 'S' and lives in either Hyderabad or Bangalore. | Medium | Query Writing |
| 4 | Find all orders placed between January and March 2024 where total_amount is above 1000 and status is NOT 'cancelled'. Sort by order_date newest first. | Medium | Query Writing |
| 5 | Explain with examples why parentheses matter when combining AND and OR. Write 2 queries that look similar but produce completely different results due to parenthesis placement. | Hard | Written |
`,

  8: `# Aggregate Functions

Aggregate functions perform calculations on a set of rows and return a single summary value. They are the foundation of data analysis in SQL allowing you to count records, sum values, calculate averages, and find extremes. These are used constantly in reporting and business intelligence.

## 1. COUNT Counting Rows

COUNT(*) counts all rows including those with NULL values. COUNT(column_name) counts non-NULL values in that column. COUNT(DISTINCT column) counts unique non-NULL values. COUNT is the most commonly used aggregate function.

:::scenario
An HR dashboard shows: 'Total Employees: 342', 'Employees with LinkedIn profiles: 218'. These come from COUNT(*) and COUNT(linkedin_url) respectively COUNT(linkedin_url) automatically skips NULLs.
:::

Various COUNT uses:

\`\`\`sql
SELECT COUNT(*) AS total_employees FROM employees;
-- Result: 342
SELECT COUNT(email) AS employees_with_email FROM employees;
-- Result: 310 (32 have NULL email)
SELECT COUNT(DISTINCT city) AS unique_cities FROM employees;
-- Result: 18 (18 different cities)
\`\`\`


## 2. SUM, AVG Totals and Averages

SUM adds all numeric values in a column. AVG calculates the arithmetic mean (ignores NULLs). Both are essential for financial reporting total revenue, average order value, total payroll, etc.

:::scenario
A finance team runs monthly payroll reports: SUM(salary) gives total payroll cost. AVG(salary) helps compare to industry benchmarks. Both can be filtered with WHERE to get department-specific numbers.
:::

SUM and AVG examples:

\`\`\`sql
-- Total salary bill:
SELECT SUM(salary) AS total_payroll FROM employees;
-- Result: 24,350,000
-- Average salary:
SELECT AVG(salary) AS avg_salary FROM employees;
-- Result: 58,450.50
-- Total revenue this month:
SELECT SUM(total_amount) AS monthly_revenue
FROM orders
WHERE order_date >= '2024-11-01';
\`\`\`


## 3. MIN and MAX Extremes

MIN returns the smallest value in a column. MAX returns the largest. Both work on numbers, dates, and strings (alphabetically for strings). They help identify outliers the cheapest product, the latest hire date, the highest score.

:::scenario
A retail company uses: SELECT MIN(price), MAX(price) FROM products WHERE category='Phones'; to display the price range '₹8,999 to ₹1,49,999' on their website.
:::

MIN and MAX examples:

\`\`\`sql
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive
FROM products WHERE category = 'Phones';
-- Result: cheapest=8999, most_expensive=149999
-- Earliest and latest joining dates:
SELECT MIN(join_date) AS oldest_employee,
\`\`\`

MAX(join_date) AS newest_employee
FROM employees;

## 4. Combining Multiple Aggregate Functions

You can use multiple aggregate functions in a single SELECT statement. This is powerful for creating summary reports with a single query.

:::scenario
An e-commerce manager wants a quick daily dashboard: total orders, total revenue, average order value, smallest order, largest order all in one query.
:::

Complete sales dashboard query:
SELECT COUNT(*) AS total_orders, SUM(total_amount) AS total_revenue, ROUND(AVG(total_amount), 2) AS avg_order_value, MIN(total_amount) AS smallest_order, MAX(total_amount) AS largest_order
FROM orders
WHERE order_date = CURDATE();

**Sample output:**

| total_orders | total_revenue | avg_order_ value | smalle st_ord er | largest_ord er |
| --- | --- | --- | --- | --- |
| 247 | 1,842,350.00 | 7,457.29 | 199.00 | 89,999.00 |



## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a single query that returns: total number of employees, total payroll, average salary, minimum salary, and maximum salary from an employees table. | Easy | Query Writing |
| 2 | Find the total revenue generated in each quarter of 2024 from an orders table. Use SUM and date filtering. | Medium | Query Writing |
| 3 | Calculate the average marks, highest marks, and lowest marks for each subject from a 'student_scores' table with columns: student_id, subject, marks. | Medium | Query Writing |
| 4 | Write a query to count how many products in each price range: under 500, 500-2000, above 2000. (Hint: use 3 separate COUNT queries with WHERE, or research CASE WHEN.) | Hard | Query Writing |
| 5 | Explain why aggregate functions like SUM and AVG ignore NULL values. Is this the desired behavior in all cases? Give an example where it could cause misleading results. | Hard | Written |
`,

  9: `# GROUP BY & HAVING

GROUP BY is one of the most powerful features in SQL for data analysis. It groups rows with the same values into summary rows, allowing you to run aggregate functions per group. HAVING then filters those groups working like WHERE but for grouped/aggregated data.

## 1. GROUP BY Grouping Data

GROUP BY collapses multiple rows with the same value in a specified column into one summary row. Every column in your SELECT must either be in GROUP BY or inside an aggregate function otherwise SQL doesn't know which value to display for that column.

:::scenario
A sales manager wants a report: 'How many orders did each salesperson close this month?' The orders table has one row per order. GROUP BY salesperson_id collapses all orders per person into one row with a COUNT.
:::

Count employees per department:

\`\`\`sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
-- Output:
\`\`\`

department employee_count IT 45 Finance 28 HR 15 Sales 62 Total revenue per product category:

\`\`\`sql
SELECT category, SUM(amount) AS total_revenue, COUNT(*) AS orders
FROM orders
GROUP BY category
ORDER BY total_revenue DESC;
\`\`\`


## 2. HAVING Filtering Groups

HAVING filters groups after aggregation. Think of it as WHERE for groups. WHERE cannot use aggregate functions, so HAVING was introduced for this purpose. HAVING comes after GROUP BY in the query.

:::scenario
A business intelligence analyst wants to find only the departments where total payroll exceeds 5 million departments below this threshold should be excluded from the report. HAVING SUM(salary) > 5000000 filters after the grouping happens.
:::

HAVING only groups meeting a condition:

\`\`\`sql
-- Departments with more than 20 employees:
SELECT department, COUNT(*) AS emp_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 20;
-- Output:
\`\`\`

department emp_count IT 45 Sales 62
HAVING with AVG:

\`\`\`sql
-- Categories with avg product price above 1000:
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 1000;
\`\`\`


## 3. WHERE vs HAVING Critical Difference

WHERE filters rows BEFORE grouping (works on individual rows). HAVING filters groups AFTER aggregation (works on group summaries). You can use both in the same query WHERE reduces the data first, then GROUP BY groups it, then HAVING filters the groups.
WHERE + GROUP BY + HAVING together:

\`\`\`sql
-- Among active employees only (WHERE),
-- group by department,
-- show only departments with avg salary > 60000 (HAVING):
SELECT department,
\`\`\`

COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
WHERE status = 'active' -- filter rows first
GROUP BY department -- then group
HAVING AVG(salary) > 60000 -- filter groups
ORDER BY avg_salary DESC;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to show total sales amount per salesperson from an 'orders' table with columns: order_id, salesperson_name, amount, order_date. | Easy | Query Writing |
| 2 | Find all cities that have more than 50 customers from a 'customers' table. Show city name and customer count, sorted by count descending. | Easy | Query Writing |
| 3 | Show the top 5 product categories by total revenue. Include only orders placed in 2024 and only categories with total revenue above 100,000. | Medium | Query Writing |
| 4 | From a 'student_scores' table, find all subjects where the average score is below 60 (subjects that need attention). Show subject name and average score. | Medium | Query Writing |
| 5 | Write a GROUP BY query that shows each employee's department, their total sales, average sales, and number of sales but only for departments where the total sales exceed 500,000 and there are at least 5 sales records. | Hard | Query Writing |
`,

  10: `# NULL Handling

NULL in SQL represents missing, unknown, or inapplicable data. Understanding NULL is critical because it behaves differently from regular values comparing NULL with = always returns UNKNOWN (not TRUE or FALSE). Mishandling NULLs causes subtle bugs in queries and reports.

## 1. What is NULL?

NULL is not zero, not an empty string, and not 'false'. It means 'no value' or 'unknown'. A phone column being NULL means we don't know the phone number it's different from knowing the number is empty. NULL propagates in calculations: any arithmetic with NULL returns NULL.

:::scenario
A school records database: a student's 'guardian_phone' column is NULL because the student is an orphan the data is not missing by accident, it truly doesn't exist. The school's query for 'students without a guardian contact' uses IS NULL to find these students.
:::

NULL propagation in math:
SELECT 100 + NULL; -- Result: NULL (not 100!)
SELECT NULL = NULL; -- Result: NULL/UNKNOWN (not TRUE!)
SELECT NULL != NULL; -- Result: NULL/UNKNOWN (not FALSE!)

## 2. IS NULL and IS NOT NULL

The only correct way to check for NULL is IS NULL or IS NOT NULL. Using = NULL or != NULL always

\`\`\`sql
returns UNKNOWN resulting in no rows returned, which is a very common bug.
\`\`\`


:::scenario
An HR system wants to find employees who haven't been assigned to a department yet (department_id IS NULL). If the developer accidentally writes WHERE department_id = NULL, zero employees are returned the bug is silent and misleading.
:::

CORRECT way to check NULL:

\`\`\`sql
-- Find employees without a department:
SELECT name FROM employees WHERE department_id IS NULL;
-- Find employees WITH a department:
SELECT name FROM employees WHERE department_id IS NOT NULL;
\`\`\`

WRONG way (always returns 0 rows):

\`\`\`sql
SELECT name FROM employees WHERE department_id = NULL; -- WRONG!
SELECT name FROM employees WHERE department_id != NULL; -- WRONG!
\`\`\`


## 3. COALESCE Replacing NULLs

COALESCE(val1, val2, val3, ...) returns the first non-NULL value from its arguments. It is the standard SQL way to provide a default value when a column might be NULL. Extremely useful in reports where NULL would confuse end users.

:::scenario
A customer report shows the 'preferred contact number' for each customer. Some customers have a mobile number, some have only a landline, some have neither. COALESCE(mobile, landline, 'No contact') returns the best available option.
:::

COALESCE examples:

\`\`\`sql
-- Show 'N/A' instead of NULL for missing emails:
SELECT name, COALESCE(email, 'N/A') AS email_display
FROM customers;
-- Multiple fallbacks:
SELECT name, COALESCE(mobile, landline, 'No contact') AS contact
FROM customers;
-- Replace NULL bonus with 0 for salary calculations:
SELECT name, salary + COALESCE(bonus, 0) AS total_compensation
FROM employees;
\`\`\`


## 4. IFNULL and NULLIF

IFNULL(expr, fallback) is MySQL-specific returns fallback if expr is NULL, otherwise returns expr. NULLIF(val1, val2) returns NULL if val1 equals val2, otherwise returns val1. NULLIF is useful to avoid division-by-zero errors. IFNULL (MySQL specific):

\`\`\`sql
SELECT name, IFNULL(bonus, 0) AS bonus FROM employees;
-- If bonus is NULL, shows 0
\`\`\`

NULLIF avoid division by zero:

\`\`\`sql
-- Sales conversion rate (orders / visits):
SELECT
\`\`\`

orders, visits, orders / NULLIF(visits, 0) AS conversion_rate

\`\`\`sql
-- If visits = 0, NULLIF returns NULL instead of causing a division error
FROM campaign_stats;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | From an 'employees' table, write a query to find all employees who do not have a manager assigned (manager_id IS NULL). | Easy | Query Writing |
| 2 | Write a SELECT query that displays each customer's name and their discount. If discount is NULL, show 0 instead. Use COALESCE. | Easy | Query Writing |
| 3 | Use COALESCE to create a 'display_contact' column that shows mobile number if available, else landline, else 'Not Available' from a contacts table. | Medium | Query Writing |
| 4 | Calculate each employee's total compensation = salary + bonus. Use COALESCE to treat NULL bonus as 0. Show employees sorted by total compensation descending. | Medium | Query Writing |
| 5 | Explain the difference between NULL, empty string '', and 0 in a database. Give a real-world scenario for when each would legitimately appear in a 'phone_number' column. | Hard | Written |
`,

  11: `# String Functions

SQL provides a rich set of built-in functions to manipulate and transform text data. These are essential for data cleaning, formatting output for reports, and building search features. String functions are evaluated for each row in the result set.

## 1. CONCAT and LENGTH

CONCAT joins two or more strings together. LENGTH returns the number of characters in a string. These are foundational for formatting output. In PostgreSQL, you can also use the || operator for concatenation.

:::scenario
A report generator needs to display employee full names (combining first_name and last_name) and also flag names longer than 30 characters as 'long names' for a UI width issue.
:::

CONCAT and LENGTH:

\`\`\`sql
-- Combine first and last name:
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employees;
-- PostgreSQL alternative:
SELECT first_name || ' ' || last_name AS full_name FROM employees;
-- Find names longer than 20 characters:
SELECT name, LENGTH(name) AS name_length
FROM employees
WHERE LENGTH(name) > 20;
\`\`\`


## 2. UPPER, LOWER, TRIM

UPPER converts text to all uppercase. LOWER converts to all lowercase. TRIM removes leading and trailing spaces from a string. LTRIM removes only left (leading) spaces. RTRIM removes only right (trailing) spaces. These are commonly used for data normalization.

:::scenario
A login system stores emails. Users sometimes type 'ALICE@Gmail.COM' the system normalizes it to lowercase before comparing: WHERE LOWER(email) = LOWER('ALICE@Gmail.COM'). TRIM is used when importing CSV data that often has extra spaces.
:::

Case and trim functions:
SELECT UPPER('hello world'); -- 'HELLO WORLD'
SELECT LOWER('HELLO WORLD'); -- 'hello world'

\`\`\`sql
SELECT TRIM(' Hyderabad '); -- 'Hyderabad'
-- Normalize email for comparison:
SELECT * FROM users WHERE LOWER(email) = 'alice@gmail.com';
-- Clean up imported data:
UPDATE customers SET city = TRIM(city);
\`\`\`


## 3. SUBSTRING and REPLACE

SUBSTRING(str, start, length) extracts part of a string starting at position 'start' for 'length' characters. Position starts at 1 in SQL. REPLACE(str, find, replacement) replaces all occurrences of a substring with another string.

:::scenario
A telecom company stores phone numbers as '91-98765-43210'. The billing system needs just the 10-digit number without the country code. SUBSTRING(phone, 4, 10) extracts the last 10 digits.
:::

SUBSTRING and REPLACE:

\`\`\`sql
-- Extract first 3 characters of product code:
SELECT SUBSTRING(product_code, 1, 3) AS category_code FROM products;
-- 'ELEC001' becomes 'ELE'
-- Replace old domain in emails:
SELECT REPLACE(email, '@oldcompany.com', '@newcompany.com') AS new_email
FROM employees;
-- Extract area code from phone '040-12345678':
SELECT SUBSTRING(phone, 1, 3) AS area_code FROM offices;
\`\`\`


## 4. LIKE Pattern Matching in WHERE

LIKE is technically a comparison operator but is categorized here as it works with string patterns. % matches zero or more characters. _ matches exactly one character. Combine them for powerful search patterns.

:::scenario
A job portal's search feature allows users to search for job titles. Typing 'data' in the search box translates to: WHERE job_title LIKE '%data%' matching 'Data Analyst', 'Data Engineer', 'Senior Data Scientist', etc.
:::

LIKE pattern matching examples:

\`\`\`sql
-- Products starting with 'Apple':
SELECT * FROM products WHERE name LIKE 'Apple%';
-- Customers with Gmail:
SELECT * FROM customers WHERE email LIKE '%@gmail.com';
-- 6-letter city names:
SELECT * FROM cities WHERE name LIKE '______';
-- Phone numbers starting with 98:
SELECT * FROM contacts WHERE phone LIKE '98%';
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to display each employee's full name (combining first_name and last_name) and email in lowercase from an employees table. | Easy | Query Writing |
| 2 | Find all customers whose email address is from '@yahoo.com' OR '@gmail.com' using LIKE. | Easy | Query Writing |
| 3 | Write a data cleaning query: update the 'city' column in a customers table to remove leading/trailing spaces (TRIM) and convert to proper case (research: use CONCAT + UPPER + LOWER + SUBSTRING). | Hard | Query Writing |
| 4 | Extract the domain part from email addresses (the part after @) from a users table. Use SUBSTRING and LOCATE/POSITION to find the @ position. | Hard | Query Writing |
| 5 | Explain with examples the difference between LIKE 'A%', LIKE '%A', LIKE '%A%', and LIKE '_A%'. What would each match in a 'city' column? | Medium | Written |
`,

  12: `# Date & Time Functions

Date and time functions are critical in real-world databases. Almost every business application tracks when records were created, modified, or processed. SQL provides powerful functions to get the current date/time, calculate differences, extract parts (year, month, day), and format dates for display.

## 1. Getting Current Date and Time

NOW() returns the current date AND time. CURDATE() (MySQL) / CURRENT_DATE (PostgreSQL)

\`\`\`sql
returns only today's date. CURTIME() returns only the current time. These are used for inserting
\`\`\`

timestamps, calculating ages, and filtering recent records. Current date/time functions:
SELECT NOW(); -- '2024-11-20 14:35:22'
SELECT CURDATE(); -- '2024-11-20' (MySQL)

\`\`\`sql
SELECT CURRENT_DATE; -- '2024-11-20' (PostgreSQL)
-- Auto-timestamp on insert:
INSERT INTO orders (customer_id, amount, order_date)
VALUES (101, 1499.00, NOW());
-- Find today's orders:
SELECT * FROM orders WHERE DATE(order_date) = CURDATE();
\`\`\`


## 2. DATEDIFF Date Differences

DATEDIFF(date1, date2) in MySQL returns the number of days between two dates (date1 - date2). In PostgreSQL, you subtract dates directly: date1 - date2. This is used to calculate age, days overdue, subscription duration, etc.

:::scenario
A lending app calculates how many days a loan has been overdue: DATEDIFF(CURDATE(), due_date). If this returns more than 0, the loan is overdue. They then send automated SMS reminders to borrowers.
:::

DATEDIFF examples:

\`\`\`sql
-- Days since employee joined (MySQL):
SELECT name, DATEDIFF(CURDATE(), join_date) AS days_employed
FROM employees;
-- Days overdue on invoices:
SELECT invoice_id, DATEDIFF(CURDATE(), due_date) AS days_overdue
FROM invoices
WHERE due_date < CURDATE() AND payment_status = 'pending';
-- PostgreSQL equivalent:
SELECT name, CURRENT_DATE - join_date AS days_employed FROM employees;
\`\`\`


## 3. EXTRACT / DATE_FORMAT Extracting and Formatting

EXTRACT(part FROM date) pulls out a specific part of a date (YEAR, MONTH, DAY, HOUR, etc.). DATE_FORMAT(date, format) in MySQL formats a date for display. TO_CHAR(date, format) is the PostgreSQL equivalent.

:::scenario
A financial reporting system needs to group sales by month and year. EXTRACT(YEAR FROM order_date) and EXTRACT(MONTH FROM order_date) are used in GROUP BY to create monthly sales reports.
:::

EXTRACT examples:

\`\`\`sql
SELECT EXTRACT(YEAR FROM dob) AS birth_year FROM employees;
SELECT EXTRACT(MONTH FROM order_date) AS order_month FROM orders;
-- Monthly sales report:
SELECT EXTRACT(YEAR FROM order_date) AS yr,
\`\`\`

EXTRACT(MONTH FROM order_date) AS mo, SUM(amount) AS monthly_total
FROM orders
GROUP BY yr, mo
ORDER BY yr, mo; DATE_FORMAT (MySQL):

\`\`\`sql
SELECT DATE_FORMAT(order_date, '%d-%m-%Y') AS formatted_date FROM orders;
-- '20-11-2024'
SELECT DATE_FORMAT(NOW(), '%W, %M %d %Y') AS today;
-- 'Wednesday, November 20 2024'
\`\`\`


## 4. Date Arithmetic with INTERVAL

You can add or subtract time intervals from dates using INTERVAL. This is useful for finding records within the last N days, calculating expiry dates, or scheduling future events.

:::scenario
An e-commerce website shows 'New Arrivals' products added in the last 30 days. The query: WHERE created_at >= NOW() - INTERVAL 30 DAY automatically shows only recently added products without hardcoding any date.
:::

INTERVAL examples:

\`\`\`sql
-- Orders from the last 7 days:
SELECT * FROM orders
WHERE order_date >= NOW() - INTERVAL 7 DAY;
-- Subscriptions expiring in the next 30 days:
SELECT * FROM subscriptions
WHERE expiry_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 30 DAY;
-- Add 1 year to a date:
SELECT DATE_ADD('2024-01-15', INTERVAL 1 YEAR); -- '2025-01-15'
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to find all employees who have been with the company for more than 5 years (compare join_date to today). | Easy | Query Writing |
| 2 | Display all orders placed in the current month with their order_date formatted as 'DD-Month-YYYY' (e.g., '20-November-2024'). | Medium | Query Writing |
| 3 | Write a query to generate a monthly revenue report for 2024 show year, month, total orders, and total revenue, sorted by month. | Medium | Query Writing |
| 4 | Find all subscriptions that expire within the next 14 days (upcoming expiry alerts). Show customer name, subscription type, and expiry date. | Medium | Query Writing |
| 5 | Calculate the age of each employee in years from their date_of_birth. Display name, dob, and age in years (use DATEDIFF and divide by 365). | Hard | Query Writing |
`,

  13: `# Aliases

Aliases give temporary, readable names to columns or tables within a query. They do not change the actual database structure they only affect how results appear or how you reference objects within that query. Aliases make complex queries cleaner and output more user-friendly.

## 1. Column Aliases

Column aliases rename a column in the output using the AS keyword (AS is optional but recommended for clarity). They are essential when using calculated columns or aggregate functions the default column name for SUM(salary) would be 'SUM(salary)', which is ugly in reports.

:::scenario
A payroll system generates a monthly report. The raw query output would show 'salary * 12' and 'SUM(salary)' as column headers confusing to managers. Column aliases rename them to 'annual_salary' and 'total_payroll' for the report.
:::

Column alias examples:

\`\`\`sql
-- Rename calculated column:
SELECT salary * 12 AS annual_salary FROM employees;
-- Rename aggregate:
SELECT dept, COUNT(*) AS employee_count, AVG(salary) AS avg_salary
FROM employees GROUP BY dept;
-- Alias with spaces (use backticks in MySQL, quotes in PostgreSQL):
SELECT salary * 12 AS \`Annual Salary\` FROM employees; -- MySQL
SELECT salary * 12 AS "Annual Salary" FROM employees; -- PostgreSQL
-- AS is optional:
SELECT salary * 12 annual_salary FROM employees; -- Works too
\`\`\`


## 2. Table Aliases

Table aliases give a short nickname to a table in a query. They are especially useful in JOIN queries (covered in intermediate) where you reference multiple tables typing the full table name every time is tedious. Table aliases also enable self-joins (a table joining itself).

:::scenario
An employee table has a 'manager_id' column that references another employee's id. To find employee-manager pairs, the table is joined to itself (self-join). Aliases 'e' (employee) and 'm' (manager) make the query readable.
:::

Basic table alias:

\`\`\`sql
-- Without alias (verbose):
SELECT employees.name, employees.salary FROM employees WHERE employees.dept =
'IT';
-- With alias (clean):
SELECT e.name, e.salary FROM employees AS e WHERE e.dept = 'IT';
\`\`\`

Table alias in self-join (preview of joins):

\`\`\`sql
-- Find employees and their managers:
SELECT e.name AS employee, m.name AS manager
FROM employees AS e
JOIN employees AS m ON e.manager_id = m.id;
\`\`\`


## 3. Aliases in Different Clauses

Aliases defined in SELECT cannot be used in the WHERE clause WHERE is evaluated before SELECT. However, aliases CAN be used in ORDER BY and HAVING (in most databases). To use an alias in
WHERE, wrap the query in a subquery. Alias in ORDER BY (valid):

\`\`\`sql
SELECT name, salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC; -- Using alias in ORDER BY: VALID
\`\`\`

Alias in WHERE (INVALID common mistake):

\`\`\`sql
-- WRONG:
SELECT name, salary * 12 AS annual_salary
FROM employees
WHERE annual_salary > 600000; -- ERROR: alias not recognized in WHERE
-- CORRECT use original expression in WHERE:
SELECT name, salary * 12 AS annual_salary
FROM employees
WHERE salary * 12 > 600000;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query showing each employee's name, monthly salary as 'monthly_pay', and annual salary (×12) as 'yearly_ctc' from an employees table. | Easy | Query Writing |
| 2 | Use table aliases to write a query on two tables: orders (alias 'o') and customers (alias 'c'). Show customer name and their order count. | Medium | Query Writing |
| 3 | Create a query where a column alias is used in ORDER BY. Then try to use the same alias in WHERE and explain the error you get. | Medium | Practical |
| 4 | Write a query using CONCAT with an alias to produce a 'full_address' column combining house_no, street, city, and pincode from an addresses table. | Medium | Query Writing |
| 5 | Write a self-join query using table aliases to show each employee's name and their manager's name from an employees table where manager_id references the same table's id. | Hard | Query Writing |
`,

  14: `# DISTINCT & LIMIT

DISTINCT eliminates duplicate rows from query results, returning only unique values. LIMIT controls how many rows are returned, which is critical for performance with large datasets. These two features are among the most frequently used in everyday SQL queries.

## 1. DISTINCT Unique Values Only

DISTINCT removes duplicate rows from the result set. Without DISTINCT, if 50 customers are from Mumbai, 'Mumbai' appears 50 times. With DISTINCT, it appears once. When DISTINCT is applied to multiple columns, it returns unique combinations of all those columns.

:::scenario
A marketing team wants to know which cities they have customers in not how many per city. SELECT DISTINCT city FROM customers; returns a clean list: ['Mumbai', 'Delhi', 'Hyderabad', 'Pune'] even if thousands of customers are from the same city.
:::

DISTINCT single column:

\`\`\`sql
-- All unique cities where we have customers:
SELECT DISTINCT city FROM customers;
-- Without DISTINCT: Mumbai, Mumbai, Delhi, Mumbai, Delhi...
-- With DISTINCT: Mumbai, Delhi, Hyderabad, Pune
\`\`\`

DISTINCT multiple columns (unique combinations):

\`\`\`sql
-- Unique department + city combinations:
SELECT DISTINCT department, city FROM employees;
-- Returns: (IT, Mumbai), (IT, Pune), (HR, Delhi) unique pairs only
\`\`\`

COUNT DISTINCT:

\`\`\`sql
-- How many unique cities do we have customers in?
SELECT COUNT(DISTINCT city) AS unique_cities FROM customers;
-- Returns: 18
\`\`\`


## 2. LIMIT and OFFSET Pagination

LIMIT n returns only the first n rows. Combined with ORDER BY, it creates Top-N queries. OFFSET n skips the first n rows before returning results. LIMIT + OFFSET together implement pagination page 1, page 2, page 3 of results. PostgreSQL also supports FETCH FIRST n ROWS ONLY syntax.

:::scenario
A product listing page shows 12 products per page. Page 1: LIMIT 12 OFFSET 0. Page 2: LIMIT 12 OFFSET 12. Page 3: LIMIT 12 OFFSET 24. This way, loading 1 million products into memory at once is avoided.
:::

LIMIT simple usage:

\`\`\`sql
-- Top 5 most expensive products:
SELECT name, price FROM products ORDER BY price DESC LIMIT 5;
-- Latest 10 orders:
SELECT * FROM orders ORDER BY order_date DESC LIMIT 10;
LIMIT with OFFSET pagination:
-- Page 1 (rows 1-10):
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 0;
-- Page 2 (rows 11-20):
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 10;
-- Page 3 (rows 21-30):
SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;
-- Formula: OFFSET = (page_number - 1) * page_size
\`\`\`

PostgreSQL FETCH syntax:

\`\`\`sql
SELECT * FROM products ORDER BY price DESC FETCH FIRST 5 ROWS ONLY;
\`\`\`


## 3. Combining DISTINCT with Aggregates

DISTINCT inside aggregate functions like COUNT gives you the count of unique values. This is different from SELECT DISTINCT it counts unique values within an aggregate context.

:::scenario
An analytics dashboard shows: 'Total orders: 5,847' and 'Unique customers who ordered: 1,204'. The first uses COUNT(*), the second uses COUNT(DISTINCT customer_id) because one customer can place many orders.
:::

DISTINCT in aggregates:
SELECT COUNT(*) AS total_orders, COUNT(DISTINCT customer_id) AS unique_customers, COUNT(DISTINCT product_id) AS unique_products_sold
FROM orders
WHERE order_date >= '2024-01-01';

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query to find all unique product categories from a 'products' table. Count how many unique categories exist. | Easy | Query Writing |
| 2 | Implement pagination for a products table: write queries for page 1, page 2, and page 3 with 8 products per page, sorted by product name. | Medium | Query Writing |
| 3 | Write a query that returns both total orders AND unique customers who placed orders in 2024 in a single query. | Medium | Query Writing |
| 4 | From an 'employees' table, find the top 3 earners in each department. (Hint: research how to do this it's tricky without window functions but try with a subquery.) | Hard | Query Writing |
| 5 | Explain why LIMIT is important for performance in large databases. What could happen if you run SELECT * FROM logs; on a table with 500 million rows? | Medium | Written |
`,

  15: `# Basic Constraints

Constraints are rules applied to columns that enforce data integrity. They prevent invalid data from being inserted and ensure consistency across the database. Constraints are defined when creating a table and are enforced automatically by the database engine your application doesn't need to add extra validation code.

## 1. PRIMARY KEY Unique Identifier

A PRIMARY KEY uniquely identifies each row in a table. It must be: UNIQUE (no two rows can have the same PK) and NOT NULL (cannot be empty). Each table can have only one primary key. Typically an auto-incrementing integer ID column. It is the backbone of relational databases used to link tables together.

:::scenario
Every student in a university gets a unique student_id (e.g., 2024001). This is the PRIMARY KEY. Even if two students have the same name 'Rahul Sharma', their student_ids are different the system can always tell them apart.
:::

PRIMARY KEY examples:

\`\`\`sql
-- MySQL (AUTO_INCREMENT):
CREATE TABLE students (
student_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(255)
);
-- PostgreSQL (SERIAL):
CREATE TABLE students (
student_id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL
);
-- Composite primary key (two columns together form the PK):
CREATE TABLE enrollments (
student_id INT,
course_id INT,
PRIMARY KEY (student_id, course_id)
);
\`\`\`


## 2. NOT NULL Mandatory Fields

NOT NULL ensures a column always has a value it cannot be left empty. Use it for fields that are essential to the record's meaning. Without NOT NULL, columns default to accepting NULLs.

:::scenario
A bank account table: account_number NOT NULL (an account must have a number), customer_name NOT NULL, but nominee_name can be NULL (optional). If a developer forgets to include customer_name when inserting, the database rejects the INSERT protecting data quality.
:::

NOT NULL constraint:

\`\`\`sql
CREATE TABLE employees (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL, -- required
department VARCHAR(50) NOT NULL, -- required
salary DECIMAL(10,2) NOT NULL, -- required
phone VARCHAR(15), -- optional (allows NULL)
linkedin VARCHAR(255) -- optional (allows NULL)
);
-- This INSERT will FAIL (name is NOT NULL):
INSERT INTO employees (id, department, salary) VALUES (1, 'IT', 50000);
-- Error: Column 'name' cannot be null
\`\`\`


## 3. UNIQUE No Duplicates

UNIQUE ensures all values in a column are different. Unlike PRIMARY KEY, a table can have multiple UNIQUE columns, and UNIQUE columns CAN contain NULL (multiple NULLs are allowed in most databases, as NULL != NULL). Perfect for email addresses, phone numbers, usernames fields that must be unique but aren't the primary identifier.

:::scenario
A user registration system: email must be UNIQUE. If Alice already registered with 'alice@gmail.com' and Bob tries to register with the same email, the database automatically rejects it no duplicate accounts possible.
:::

UNIQUE constraint:

\`\`\`sql
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE, -- no duplicate usernames
email VARCHAR(255) NOT NULL UNIQUE, -- no duplicate emails
phone VARCHAR(15) UNIQUE -- unique but optional
);
-- This will FAIL if email already exists:
INSERT INTO users (username, email) VALUES ('alice2', 'alice@gmail.com');
-- Error: Duplicate entry 'alice@gmail.com' for key 'email'
\`\`\`


## 4. DEFAULT Automatic Values

DEFAULT sets an automatic value for a column when no value is provided during INSERT. Common uses: status defaults to 'active', created_at defaults to NOW(), is_active defaults to TRUE. This reduces
INSERT complexity and ensures sensible defaults.

:::scenario
An order management system: when a new order is created, its status should automatically be 'pending'. With DEFAULT 'pending', developers don't need to specify status in every INSERT it's automatically set correctly.
:::

DEFAULT constraint:

\`\`\`sql
CREATE TABLE orders (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
status VARCHAR(20) DEFAULT 'pending',
is_paid BOOLEAN DEFAULT FALSE,
created_at DATETIME DEFAULT NOW()
);
-- INSERT without specifying status, is_paid, created_at:
INSERT INTO orders (customer_id, amount) VALUES (101, 1499.00);
-- Row stored as:
\`\`\`

amount status id customer_id is_paid created_at 1 101 FALSE 2024-11-

### 1499.00 pending 20

14:35:00

## 5. Using Multiple Constraints Together

In real tables, columns often have multiple constraints combined. A well-designed table uses constraints to enforce business rules automatically, reducing the need for application-level validation code. Real-world table with multiple constraints:

\`\`\`sql
CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY,
sku VARCHAR(50) NOT NULL UNIQUE, -- unique product code
name VARCHAR(200) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_qty INT NOT NULL DEFAULT 0, -- default 0 stock
category VARCHAR(100) NOT NULL,
is_active BOOLEAN NOT NULL DEFAULT TRUE, -- active by default
created_at DATETIME DEFAULT NOW()
);
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a 'users' table with: auto-increment primary key, username (unique, not null), email (unique, not null), password (not null), created_at (default now), is_active (default true). | Easy | Practical |
| 2 | Try to insert two users with the same email into your users table. Document the exact error message and explain what it means. | Easy | Practical |
| 3 | Create an 'orders' table where status defaults to 'pending', payment_method defaults to 'COD', and created_at auto-timestamps. Insert 3 orders without specifying these default columns. Verify defaults were applied. | Medium | Practical |
| 4 | Design a 'courses' table for an online learning platform with appropriate constraints: every course must have a title, a unique course_code, a price that defaults to 0, and an is_published flag that defaults to false. | Medium | Design |
| 5 | Explain the complete difference between PRIMARY KEY, UNIQUE, and NOT NULL with a real-world hospital database example. Which constraint would you apply to: patient_id, aadhaar_number, patient_name, blood_group, and admission_date? | Hard | Written |
`,

  16: `# Joins

Joins combine rows from two or more tables based on a related column between them. This is the heart of relational databases instead of storing everything in one giant table (which causes redundancy), data is split into related tables and joined when needed. Mastering joins is essential for any real-world SQL work.

## 1. INNER JOIN Matching Rows Only

INNER JOIN returns only rows that have matching values in both tables. If a row in the left table has no match in the right table (or vice versa), it is excluded from the result. This is the most commonly used join type.

:::scenario
An e-commerce platform has two tables: 'orders' and 'customers'. An INNER JOIN returns only orders that have a matching customer. If an order has an invalid customer_id (orphaned record), it won't appear INNER JOIN automatically filters out unmatched rows.
:::

INNER JOIN syntax:

\`\`\`sql
SELECT c.name, c.email, o.order_id, o.amount
FROM customers AS c
INNER JOIN orders AS o ON c.id = o.customer_id
ORDER BY o.amount DESC;
\`\`\`


**Sample output:**

| name | email | order_id | amount |
|-------------|--------------------|----------|----------|
| Alice Sharma| alice@gmail.com | 1042 | 4599.00 |
| Bob Verma | bob@yahoo.com | 1038 | 1299.00 |

| name | city | order_id | amount |
|-------------|-----------|----------|--------|
| Alice | Mumbai | 1042 | 4599 |
| Bob | Delhi | NULL | NULL | <- never ordered
| Carol | Hyderabad | 1055 | 899 |



## 2. LEFT JOIN All Left + Matching Right

LEFT JOIN (also called LEFT OUTER JOIN) returns ALL rows from the left table, plus matching rows from the right table. If there is no match on the right, the right side columns show NULL. Use LEFT JOIN when you want to keep all records from the main table regardless of whether a related record exists.

:::scenario
A sales manager wants a list of ALL customers, including those who have never placed an order. An INNER JOIN would hide non-ordering customers. A LEFT JOIN shows everyone customers without orders show NULL in order columns.
:::

LEFT JOIN example:

\`\`\`sql
SELECT c.name, c.city, o.order_id, o.amount
FROM customers AS c
LEFT JOIN orders AS o ON c.id = o.customer_id;
-- Customers with no orders show NULL in order columns:
\`\`\`

| name | city | order_id | amount |
|-------------|-----------|----------|--------|
| Alice | Mumbai | 1042 | 4599 |
| Bob | Delhi | NULL | NULL | <- never ordered
| Carol | Hyderabad | 1055 | 899 |
Find customers who NEVER ordered:

\`\`\`sql
SELECT c.name, c.email
FROM customers AS c
LEFT JOIN orders AS o ON c.id = o.customer_id
WHERE o.order_id IS NULL;
\`\`\`


## 3. RIGHT JOIN All Right + Matching Left

RIGHT JOIN returns ALL rows from the right table plus matching rows from the left. It is the mirror of
LEFT JOIN. In practice, RIGHT JOIN is rarely used the same result can be achieved by swapping the table order in a LEFT JOIN. Most developers rewrite RIGHT JOINs as LEFT JOINs for consistency.
RIGHT JOIN example:

\`\`\`sql
-- All orders, even if customer record is missing:
SELECT c.name, o.order_id, o.amount
FROM customers AS c
RIGHT JOIN orders AS o ON c.id = o.customer_id;
\`\`\`

Equivalent LEFT JOIN (preferred style):

\`\`\`sql
SELECT c.name, o.order_id, o.amount
FROM orders AS o
LEFT JOIN customers AS c ON o.customer_id = c.id;
\`\`\`


## 4. FULL OUTER JOIN All Rows from Both Tables

FULL OUTER JOIN returns all rows from both tables. Where there is no match, NULLs fill the missing side. MySQL does NOT support FULL OUTER JOIN natively you simulate it with a LEFT JOIN UNION
RIGHT JOIN. PostgreSQL supports it directly.

:::scenario
An audit team wants a complete report: all customers (even without orders) AND all orders (even with invalid customer IDs). FULL OUTER JOIN surfaces data integrity issues orphaned orders or ghost customers.
:::

PostgreSQL FULL OUTER JOIN:

\`\`\`sql
SELECT c.name, o.order_id, o.amount
FROM customers AS c
FULL OUTER JOIN orders AS o ON c.id = o.customer_id;
\`\`\`

MySQL simulation using UNION:

\`\`\`sql
SELECT c.name, o.order_id FROM customers c LEFT JOIN orders o ON c.id =
\`\`\`

o.customer_id UNION

\`\`\`sql
SELECT c.name, o.order_id FROM customers c RIGHT JOIN orders o ON c.id =
o.customer_id;
\`\`\`


## 5. SELF JOIN A Table Joining Itself

A SELF JOIN joins a table to itself. This is used when rows in a table have a relationship with other rows in the same table. The classic example is an employee-manager hierarchy where manager_id references another row's employee_id in the same table.

:::scenario
An organizational chart tool needs to display 'Employee Reports To Manager' for every employee. Both employees and managers are in the same 'employees' table. A SELF JOIN using two aliases allows fetching both employee and manager names in one query.
:::

SELF JOIN employee and manager:
SELECT e.name AS employee, m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON e.manager_id = m.id;

\`\`\`sql
-- Output:
\`\`\`

| employee | manager |
|---------------|----------------|
| Priya Sharma | Rahul Verma |
| Bob Mehta | Rahul Verma |
| Rahul Verma | NULL | <- top-level manager

## 6. CROSS JOIN Cartesian Product

CROSS JOIN returns every combination of rows from two tables (Cartesian product). If table A has 5 rows and table B has 4 rows, CROSS JOIN returns 20 rows. Use carefully on large tables this creates massive result sets. Useful for generating all combinations (e.g., all size-colour combinations for a product).
CROSS JOIN example product variants:

\`\`\`sql
-- Generate all size × colour combinations:
SELECT s.size_name, c.colour_name
FROM sizes AS s
CROSS JOIN colours AS c;
-- If sizes has 4 rows (S,M,L,XL) and colours has 3 (Red,Blue,Green):
-- Result: 12 rows (all combinations)
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write an INNER JOIN query to display each order with the customer's name and email from an 'orders' and 'customers' table. | Easy | Query Writing |
| 2 | Find all customers who have never placed an order using LEFT JOIN and IS NULL technique. | Easy | Query Writing |
| 3 | Write a query to display each employee's name, their department name, and their manager's name by joining employees, departments, and using a SELF JOIN. | Medium | Query Writing |
| 4 | Generate a price list showing every product combined with every applicable tax rate using CROSS JOIN (products table × tax_rates table). | Medium | Query Writing |
| 5 | Write a report query using LEFT JOIN across 3 tables: students, enrollments, and courses showing all students, what courses they enrolled in (if any), and the course fee. | Hard | Query Writing |
`,

  17: `# Subqueries

A subquery is a query nested inside another query. It is enclosed in parentheses and can appear in
SELECT, FROM, WHERE, or HAVING clauses. Subqueries allow you to break complex problems into smaller, logical steps solving one question with the result of another. They are fundamental to intermediate SQL.

## 1. Subquery in WHERE Clause

The most common use of subqueries is inside WHERE to dynamically compute a filter value. Instead of hardcoding a number, the inner query calculates it. The inner query runs first and its result is passed to the outer query.

:::scenario
An HR manager wants to find employees who earn more than the company average but the average changes every time someone joins or leaves. A subquery computes the average dynamically: WHERE salary > (SELECT AVG(salary) FROM employees).
:::

Subquery in WHERE:

\`\`\`sql
-- Employees earning above average salary:
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
-- Most expensive products:
SELECT name, price FROM products
WHERE price = (SELECT MAX(price) FROM products);
\`\`\`


## 2. Subquery in FROM Clause (Derived Table)

A subquery in the FROM clause acts as a temporary table (also called derived table or inline view). You give it an alias and query it like a regular table. This is useful when you need to filter or aggregate on a computed result.

:::scenario
A sales analyst needs the average number of orders per customer, but only for customers who ordered more than 3 times. The inner query computes order counts per customer, the outer query then averages those counts with a filter.
:::

Derived table (subquery in FROM):

\`\`\`sql
SELECT dept, avg_salary
FROM (
SELECT department AS dept, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
) AS dept_averages
WHERE avg_salary > 60000;
\`\`\`


## 3. Subquery in SELECT Clause (Scalar Subquery)

A scalar subquery in SELECT returns exactly one value per row. It runs once for each row in the outer query. Use sparingly on large tables it can be slow, but is very readable for small lookups. Scalar subquery in SELECT:

\`\`\`sql
-- Show each employee's salary and the company average side by side:
SELECT
\`\`\`

name, salary, (SELECT AVG(salary) FROM employees) AS company_avg, salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg
FROM employees;

## 4. IN, NOT IN, EXISTS with Subqueries

IN with a subquery checks if a value matches any value in the subquery result set. NOT IN excludes those matches. EXISTS checks if the subquery returns any rows at all it is faster than IN for large datasets because it stops at the first match.

:::scenario
A marketing team wants to email customers who have ordered a specific product. Subquery: SELECT customer_id FROM orders WHERE product_id = 55 then the outer query finds those customers' contact details.
:::

IN with subquery:

\`\`\`sql
-- Customers who ordered product ID 55:
SELECT name, email FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE product_id = 55);
NOT IN with subquery:
-- Employees NOT in any project:
SELECT name FROM employees
WHERE id NOT IN (SELECT DISTINCT employee_id FROM project_assignments);
EXISTS (faster for large datasets):
SELECT name FROM customers c
WHERE EXISTS (
SELECT 1 FROM orders o
WHERE o.customer_id = c.id AND o.amount > 5000
);
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Find all products whose price is above the average price in their category. Use a correlated subquery. | Medium | Query Writing |
| 2 | Find customers who have placed at least one order above 5000 using EXISTS. | Easy | Query Writing |
| 3 | Using a derived table, find the top 3 departments by average salary. | Medium | Query Writing |
| 4 | Find employees who are NOT assigned to any project using NOT IN with a subquery. | Easy | Query Writing |
| 5 | Rewrite an IN subquery as an EXISTS subquery and explain the performance difference between the two approaches. | Hard | Written |
`,

  18: `# UNION & UNION ALL

UNION and UNION ALL combine result sets from two or more SELECT queries vertically (stacking rows). Unlike JOINs which combine horizontally (adding columns), UNION stacks rows from multiple queries into one result. The queries must have the same number of columns with compatible data types.

## 1. UNION Combining Without Duplicates

UNION combines results from two queries and automatically removes duplicate rows. It performs a DISTINCT internally, which makes it slightly slower than UNION ALL. Use UNION when you need unique results from multiple sources.

:::scenario
A retailer has two databases: 'current_customers' from the new system and 'legacy_customers' from the old system. To build a master mailing list without duplicates, UNION combines both tables and automatically removes customers who appear in both.
:::

UNION example:

\`\`\`sql
-- All cities from both customers and suppliers (no duplicates):
SELECT city FROM customers
UNION
SELECT city FROM suppliers
ORDER BY city;
UNION with different sources:
-- Combine active and archived orders into one report:
SELECT order_id, customer_name, amount, 'active' AS source
FROM active_orders
UNION
SELECT order_id, customer_name, amount, 'archived' AS source
FROM archived_orders
ORDER BY order_id;
\`\`\`


## 2. UNION ALL Combining With Duplicates

UNION ALL combines results from multiple queries but keeps ALL rows including duplicates. It is faster than UNION because it skips the deduplication step. Use UNION ALL when you know there are no duplicates or when duplicates are meaningful (e.g., counting total transactions from multiple tables).

:::scenario
A finance team has separate monthly transaction tables (jan_transactions, feb_transactions, etc.) for performance. To calculate total annual sales, they UNION ALL all 12 monthly tables duplicates are impossible since each table covers a different month.
:::

UNION ALL example:

\`\`\`sql
-- Total transactions from both payment gateways:
SELECT transaction_id, amount, 'PayTM' AS gateway
FROM paytm_transactions
UNION ALL
SELECT transaction_id, amount, 'RazorPay' AS gateway
FROM razorpay_transactions;
\`\`\`

Annual summary from monthly tables:

\`\`\`sql
SELECT 'Q1' AS quarter, SUM(amount) FROM sales WHERE month IN (1,2,3)
UNION ALL
SELECT 'Q2', SUM(amount) FROM sales WHERE month IN (4,5,6)
UNION ALL
SELECT 'Q3', SUM(amount) FROM sales WHERE month IN (7,8,9)
UNION ALL
SELECT 'Q4', SUM(amount) FROM sales WHERE month IN (10,11,12);
\`\`\`


## 3. UNION Rules and Ordering

Both SELECT statements in a UNION must have the same number of columns. Column data types must be compatible. Column names in the final result come from the first SELECT. ORDER BY applies to the entire UNION result (not individual queries) and is placed at the very end. Rules demonstration:

\`\`\`sql
-- Column count MUST match:
SELECT name, email FROM customers -- 2 columns
UNION
SELECT name, phone FROM suppliers; -- 2 columns: VALID
-- ORDER BY goes at the end (applies to whole result):
SELECT name, 'customer' AS type FROM customers
UNION
SELECT name, 'supplier' AS type FROM suppliers
ORDER BY name ASC;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Combine customer emails and supplier emails into a single contact list with no duplicates. Add a 'type' column showing 'customer' or 'supplier'. | Easy | Query Writing |
| 2 | You have sales data in 4 separate quarterly tables (q1_sales, q2_sales, q3_sales, q4_sales). Write a UNION ALL query to get the full year's data. | Easy | Query Writing |
| 3 | Explain with an example why using UNION instead of UNION ALL on 4 large monthly tables could give wrong totals in a revenue report. | Medium | Written |
| 4 | Write a query using UNION to get a list of all unique product names from both an 'online_products' and 'store_products' table. Then count how many are unique to each source. | Medium | Query Writing |
| 5 | Build a 'unified activity feed' by combining records from 3 different action tables (logins, purchases, reviews) with a common schema: user_id, action_type, action_date. Sort by date descending. | Hard | Query Writing |
`,

  19: `# Foreign Keys & Referential Integrity

A Foreign Key (FK) is a column that creates a link between two tables by referencing the Primary Key of another table. Foreign keys enforce referential integrity ensuring that relationships between records remain valid. They prevent orphaned records and accidental data corruption.

## 1. What is a Foreign Key?

A foreign key in one table (child) references a primary key in another table (parent). The FK column in the child table can only contain values that already exist in the parent table's PK column or NULL (if the column is nullable). This guarantees that every order belongs to a real customer, every employee is in a real department, etc.

:::scenario
An order management system: orders.customer_id is a FK referencing customers.id. If you try to insert an order with customer_id = 9999 but no customer with id = 9999 exists, the database REJECTS the insert. This prevents ghost orders orders with no traceable customer.
:::

Creating a foreign key:

\`\`\`sql
-- Parent table:
CREATE TABLE customers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL
);
-- Child table with FK:
CREATE TABLE orders (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
amount DECIMAL(10,2),
FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

Adding FK to existing table:

\`\`\`sql
ALTER TABLE orders
\`\`\`

ADD CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES customers(id);

## 2. CASCADE Actions

CASCADE defines what happens to child rows when a parent row is updated or deleted. ON DELETE CASCADE automatically deletes child rows when the parent is deleted. ON UPDATE CASCADE propagates changes to the FK column. ON DELETE SET NULL sets FK to NULL when parent is deleted. ON DELETE RESTRICT (default) prevents deletion if child rows exist.

:::scenario
A blog platform: deleting a user account should delete all their posts and comments too. ON DELETE CASCADE on posts.user_id and comments.user_id handles this automatically no need for the application to manually delete related records.
:::

CASCADE options:

\`\`\`sql
CREATE TABLE posts (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
title VARCHAR(200),
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE -- delete posts when user is deleted
ON UPDATE CASCADE -- update FK if user's id changes
);
-- SET NULL: keep order history but unlink deleted customer:
FOREIGN KEY (customer_id) REFERENCES customers(id)
ON DELETE SET NULL
-- RESTRICT: prevent deleting a customer who has orders:
FOREIGN KEY (customer_id) REFERENCES customers(id)
ON DELETE RESTRICT
\`\`\`


## 3. Multi-Table Relationships

Real databases have multiple FK relationships creating a network of linked tables. A many-to-many relationship requires a junction/bridge table with two foreign keys (one to each parent table). For example, students can enroll in many courses, and courses can have many students the 'enrollments' table bridges them. Many-to-many with junction table:

\`\`\`sql
CREATE TABLE students (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL
);
CREATE TABLE courses (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(200) NOT NULL
);
-- Junction table (many-to-many):
CREATE TABLE enrollments (
student_id INT NOT NULL,
course_id INT NOT NULL,
enrolled_on DATE,
PRIMARY KEY (student_id, course_id),
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a database schema for a school: tables for students, teachers, subjects, and a junction table for student_subject_enrollments with appropriate FK constraints. | Medium | Design |
| 2 | Add a FK with ON DELETE CASCADE from orders to customers. Test it by deleting a customer and verifying their orders were also deleted. | Easy | Practical |
| 3 | Explain with a real-world scenario (e.g., hospital) when you would use ON DELETE RESTRICT vs ON DELETE SET NULL. What are the business implications of each choice? | Medium | Written |
| 4 | Design a many-to-many schema for a movie streaming platform: movies can have multiple genres, genres can apply to multiple movies. | Medium | Design |
| 5 | Write a query using JOINs to show all students and their enrolled courses from a students-enrollments-courses schema. Include students with no enrollments. | Hard | Query Writing |
`,

  20: `# Indexes

An index is a data structure that speeds up data retrieval in a table. Without an index, every query does a full table scan reading every row. With an index, the database can jump directly to matching rows. Indexes dramatically improve query performance on large tables but come with tradeoffs: they use disk space and slow down INSERT/UPDATE/DELETE.

## 1. How Indexes Work

Think of a database index like the index at the back of a textbook. Without it, you'd read every page to find a topic. With it, you look up the topic alphabetically, find the page number, and jump straight there. The most common index type is B-Tree (Balanced Tree) it stores sorted values with pointers to the actual row locations.

:::scenario
A users table with 10 million rows. Without an index on email: SELECT * FROM users WHERE email = 'alice@gmail.com' scans all 10 million rows (takes seconds). With an index on email: the database finds 'alice@gmail.com' in the B-Tree in microseconds and jumps directly to that row.
:::

Creating indexes:

\`\`\`sql
-- Single column index:
CREATE INDEX idx_email ON users(email);
-- Composite index (multiple columns):
CREATE INDEX idx_dept_salary ON employees(department, salary);
-- Unique index (also enforces uniqueness):
CREATE UNIQUE INDEX idx_unique_email ON users(email);
-- Drop an index:
DROP INDEX idx_email ON users; -- MySQL
DROP INDEX idx_email; -- PostgreSQL
\`\`\`


## 2. Types of Indexes

B-Tree indexes are the default and work for equality (=), range (<, >, BETWEEN), and ORDER BY queries. Hash indexes (PostgreSQL) are faster for exact equality but don't support range queries. Full-text indexes enable text search. Primary keys and UNIQUE constraints automatically create indexes. Checking existing indexes:

\`\`\`sql
-- MySQL:
SHOW INDEXES FROM employees;
-- PostgreSQL:
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'employees';
\`\`\`

Composite index usage column order matters:

\`\`\`sql
-- Index on (department, salary):
CREATE INDEX idx_dept_sal ON employees(department, salary);
-- USES index (department is leftmost column):
WHERE department = 'IT'
WHERE department = 'IT' AND salary > 50000
-- DOES NOT use index (department column skipped):
WHERE salary > 50000
\`\`\`


## 3. When to Use Indexes

Add indexes on columns frequently used in WHERE, JOIN ON, and ORDER BY. However, do not over-index each index slows down INSERT, UPDATE, DELETE because the index must also be updated. Small tables rarely need indexes. Columns with very few distinct values (like gender) are poor candidates for standard indexes. Good index candidates:

\`\`\`sql
-- High cardinality (many unique values): GOOD
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_phone ON customers(phone);
CREATE INDEX idx_order_date ON orders(order_date);
-- FK columns (always index these for JOIN performance):
CREATE INDEX idx_customer_id ON orders(customer_id);
\`\`\`

Using EXPLAIN to check if index is used:

\`\`\`sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 101;
-- Look for 'ref' or 'range' in type column (good)
-- 'ALL' means full table scan (index not used)
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | On a large 'orders' table, identify which 3 columns would benefit most from indexes (think about what queries run frequently) and create those indexes. | Easy | Practical |
| 2 | Run EXPLAIN on a SELECT query before and after adding an index. Document the difference in the execution plan output. | Medium | Practical |
| 3 | Create a composite index on (customer_id, order_date) for an orders table. Explain in which query patterns this index would and would not be used. | Medium | Written |
| 4 | Discuss the tradeoffs of indexes: list 4 scenarios where indexes help and 2 scenarios where too many indexes cause problems. | Medium | Written |
| 5 | Design an indexing strategy for a large e-commerce database with tables: products, orders, customers, and reviews. Justify each index with the query it optimizes. | Hard | Design |
`,

  21: `# Views

A View is a saved SQL query stored in the database with a name, which you can query like a regular table. Views don't store data themselves they are virtual tables. They simplify complex queries, provide a security layer (hiding sensitive columns), and make the database easier to use for non-technical users.

## 1. Creating and Using Views


\`\`\`sql
CREATE VIEW defines a named query. Once created, you query a view just like a table using SELECT.
\`\`\`

The view re-executes its underlying query each time it is accessed (unlike materialized views which cache results). Views can also be used in JOINs, subqueries, and other views.

:::scenario
A retail company's sales analysts need daily sales data but should not access the raw orders table directly (it contains sensitive payment info). The DBA creates a view 'v_daily_sales' that shows only order_id, product, quantity, and date analysts query the view safely.
:::

Create a view:

\`\`\`sql
CREATE VIEW v_employee_summary AS
SELECT
\`\`\`

e.id, e.name, d.dept_name, e.salary, e.join_date
FROM employees e
JOIN departments d ON e.dept_id = d.id;

\`\`\`sql
-- Query the view like a table:
SELECT * FROM v_employee_summary WHERE dept_name = 'IT';
SELECT name, salary FROM v_employee_summary ORDER BY salary DESC LIMIT 10;
\`\`\`


## 2. Modifying and Dropping Views


\`\`\`sql
CREATE OR REPLACE VIEW updates an existing view's definition without dropping it first. DROP VIEW
\`\`\`

removes the view (not the underlying data). ALTER VIEW (PostgreSQL) can rename or modify a view. Modifying and dropping views:

\`\`\`sql
-- Replace an existing view:
CREATE OR REPLACE VIEW v_employee_summary AS
SELECT e.id, e.name, d.dept_name, e.salary
FROM employees e JOIN departments d ON e.dept_id = d.id
WHERE e.status = 'active'; -- added filter
-- Drop a view:
DROP VIEW v_employee_summary;
DROP VIEW IF EXISTS v_employee_summary; -- safe version
\`\`\`


## 3. Updatable Views and Use Cases

Simple views (single table, no aggregates, no DISTINCT, no GROUP BY) can be updatable you can run INSERT, UPDATE, DELETE on them and it affects the underlying table. Complex views are read-only. Key use cases: security (hide sensitive columns), simplification (hide complex JOINs), consistency (standard report definitions). Security view hide salary:

\`\`\`sql
-- Only expose non-sensitive columns to junior staff:
CREATE VIEW v_emp_public AS
SELECT id, name, department, city
FROM employees;
-- salary, bank_account, etc. are NOT in this view
\`\`\`

Simplification view complex join saved as view:

\`\`\`sql
CREATE VIEW v_order_details AS
SELECT o.id, c.name AS customer, p.name AS product,
\`\`\`

o.quantity, o.amount, o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;

\`\`\`sql
-- Now analysts use simple queries:
SELECT customer, SUM(amount) FROM v_order_details
GROUP BY customer ORDER BY SUM(amount) DESC;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a view 'v_active_employees' that shows only active employees with their department name (from a join), hiding salary information. | Easy | Practical |
| 2 | Create a view 'v_monthly_sales' that joins orders, customers, and products to show customer name, product, amount, and month. Then query it to get top customers of last month. | Medium | Practical |
| 3 | Explain 3 real-world scenarios where views improve database security. Give specific examples of what columns should be hidden for different user roles. | Medium | Written |
| 4 | Create a view that shows students with their average score and grade (A/B/C based on average). Update the view using CREATE OR REPLACE to add a rank column. | Medium | Practical |
| 5 | Investigate: can you INSERT a new row through a view in MySQL? Test it on a simple single-table view. Document what works and what doesn't. | Hard | Research |
`,

  22: `# Stored Procedures

A Stored Procedure is a named block of precompiled SQL code stored in the database that can be called by name. Think of it as a function for your database. Procedures can accept input parameters, execute complex logic (including loops, conditionals, and multiple queries), and are used for encapsulating business logic, batch processing, and reducing network overhead.

## 1. Creating and Calling Procedures


\`\`\`sql
CREATE PROCEDURE defines a stored procedure. CALL executes it. The DELIMITER command in
\`\`\`

MySQL changes the statement terminator temporarily so the procedure body (which contains semicolons) doesn't get executed prematurely. In PostgreSQL, procedures use PL/pgSQL syntax.

:::scenario
An e-commerce platform processes end-of-day reports: calculating totals, archiving old orders, updating product stock levels, and sending summary data to a reporting table. All this logic is wrapped in a stored procedure sp_eod_processing that runs every night one CALL triggers everything.
:::

MySQL stored procedure:

\`\`\`sql
DELIMITER //
CREATE PROCEDURE sp_get_dept_employees(IN dept_name VARCHAR(50))
BEGIN
SELECT id, name, salary, join_date
FROM employees
WHERE department = dept_name
ORDER BY salary DESC;
END //
DELIMITER ;
-- Call the procedure:
CALL sp_get_dept_employees('IT');
CALL sp_get_dept_employees('Finance');
\`\`\`


## 2. IN, OUT, and INOUT Parameters

IN parameters pass values into a procedure (read-only inside). OUT parameters return values back to the caller (write-only inside). INOUT parameters both receive and return values. OUT parameters are how procedures return computed results to the calling application. Procedure with OUT parameter:

\`\`\`sql
DELIMITER //
CREATE PROCEDURE sp_get_employee_count(
\`\`\`

IN dept_name VARCHAR(50), OUT emp_count INT )

\`\`\`sql
BEGIN
SELECT COUNT(*) INTO emp_count
FROM employees
WHERE department = dept_name;
END //
DELIMITER ;
-- Call with OUT variable:
CALL sp_get_employee_count('IT', @count);
SELECT @count AS it_employee_count;
\`\`\`


## 3. Conditional Logic and Variables

Stored procedures support IF/ELSEIF/ELSE conditional logic and CASE statements. You can declare variables with DECLARE. This allows complex business logic to run entirely inside the database. Procedure with IF logic:

\`\`\`sql
DELIMITER //
CREATE PROCEDURE sp_apply_discount(
\`\`\`

IN order_id INT, IN customer_id INT )

\`\`\`sql
BEGIN
DECLARE order_total DECIMAL(10,2);
DECLARE discount_pct DECIMAL(5,2) DEFAULT 0;
SELECT amount INTO order_total FROM orders WHERE id = order_id;
IF order_total > 10000 THEN
SET discount_pct = 15.0;
\`\`\`

ELSEIF order_total > 5000 THEN SET discount_pct = 10.0; ELSEIF order_total > 1000 THEN SET discount_pct = 5.0;

\`\`\`sql
END IF;
UPDATE orders
SET discount = discount_pct,
final_amount = amount * (1 - discount_pct/100)
WHERE id = order_id;
END //
DELIMITER ;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a stored procedure sp_search_products that takes a category name as IN parameter and returns all products in that category sorted by price. | Easy | Practical |
| 2 | Create a procedure sp_monthly_sales_report with IN parameters for year and month, that returns total orders, total revenue, and average order value for that period. | Medium | Practical |
| 3 | Create a procedure with IF/ELSEIF logic that categorizes employees as 'Junior' (salary<40000), 'Mid' (40000-80000), or 'Senior' (>80000) and updates a 'grade' column. | Medium | Practical |
| 4 | Create a procedure with an OUT parameter that returns the count of low-stock products (quantity < 10) from a products table. | Medium | Practical |
| 5 | Compare stored procedures vs application-level code for implementing complex business logic. List 4 pros and 3 cons of using stored procedures. | Hard | Written |
`,

  23: `# User Defined Functions

User Defined Functions (UDFs) are custom functions created in SQL that can be called within queries, just like built-in functions (SUM, LENGTH, etc.). Unlike stored procedures, functions always return a value and can be used inline in SELECT, WHERE, or any expression. They are ideal for encapsulating reusable calculations.

## 1. Creating Scalar Functions

A scalar function returns a single value. You define the return type, parameters, and the computation logic. Once created, call it in any SQL query just like a built-in function.

:::scenario
A HR system frequently calculates years of experience from a join date. Instead of writing DATEDIFF(CURDATE(), join_date)/365 everywhere, a function fn_years_experience(join_date) is created and reused across dozens of queries and reports.
:::

MySQL scalar function:

\`\`\`sql
DELIMITER //
CREATE FUNCTION fn_years_experience(join_date DATE)
RETURNS INT
\`\`\`

DETERMINISTIC

\`\`\`sql
BEGIN
RETURN FLOOR(DATEDIFF(CURDATE(), join_date) / 365);
END //
DELIMITER ;
-- Use in a query:
SELECT name, join_date, fn_years_experience(join_date) AS years_exp
FROM employees;
-- Use in WHERE:
SELECT name FROM employees
WHERE fn_years_experience(join_date) >= 5;
\`\`\`


## 2. Functions with Conditional Logic

Functions can contain IF/ELSE or CASE logic to compute context-dependent values. This is useful for grading, categorization, tax calculations, and pricing rules. Function with CASE logic:

\`\`\`sql
DELIMITER //
CREATE FUNCTION fn_grade(score DECIMAL(5,2))
RETURNS VARCHAR(2)
\`\`\`

DETERMINISTIC

\`\`\`sql
BEGIN
DECLARE grade VARCHAR(2);
IF score >= 90 THEN SET grade = 'A+';
ELSEIF score >= 80 THEN SET grade = 'A';
ELSEIF score >= 70 THEN SET grade = 'B';
ELSEIF score >= 60 THEN SET grade = 'C';
ELSE SET grade = 'F';
END IF;
RETURN grade;
END //
DELIMITER ;
-- Use in report:
SELECT name, score, fn_grade(score) AS grade
FROM student_scores;
\`\`\`


## 3. Functions vs Stored Procedures

Functions MUST return a value and can be used inline in queries. Procedures can return multiple values (via OUT params) but cannot be used inline. Functions cannot perform DML (INSERT/UPDATE/DELETE) in most databases. Procedures can perform any SQL operation. Use functions for reusable calculations; use procedures for complex workflows. Key differences:

\`\`\`sql
-- Function: called inline in SELECT
SELECT name, fn_tax(salary) AS tax FROM employees;
-- Procedure: called with CALL, not inline
CALL sp_process_payroll(2024, 11);
-- Function: must return exactly one value
-- Procedure: can return 0 or more values via OUT params
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a function fn_full_name(first_name, last_name) that returns the full name with proper capitalization. Use it in a SELECT query. | Easy | Practical |
| 2 | Create a function fn_age_category(dob) that returns 'Young' (<25), 'Mid-age' (25-50), or 'Senior' (>50). Apply it to an employees table. | Medium | Practical |
| 3 | Create a function fn_gst_amount(price, gst_rate) that calculates the GST amount. Then create a SELECT query showing product price, GST, and final price. | Medium | Practical |
| 4 | Create a function fn_days_until_expiry(expiry_date) that returns days remaining. Use it to find all products expiring in less than 30 days. | Medium | Practical |
| 5 | Write a comparison of using a UDF vs CASE WHEN for grade calculation. When would you choose a UDF over inline CASE WHEN? List 3 scenarios for each. | Hard | Written |
`,

  24: `# Triggers

A Trigger is a special stored procedure that automatically executes in response to a specific database event INSERT, UPDATE, or DELETE on a table. Triggers fire automatically without being called explicitly. They are used for audit logging, data validation, automatic calculations, and enforcing complex business rules.

## 1. BEFORE and AFTER Triggers

BEFORE triggers fire before the database operation is executed useful for validation or modifying data before it is saved. AFTER triggers fire after the operation useful for audit logs, cascading updates to other tables, or notifications.

:::scenario
An inventory system uses an AFTER UPDATE trigger on the 'orders' table: whenever an order's status changes to 'shipped', the trigger automatically updates the 'inventory' table to reduce stock quantity no application code needed.
:::

AFTER INSERT trigger audit log:

\`\`\`sql
CREATE TABLE employee_audit (
id INT AUTO_INCREMENT PRIMARY KEY,
employee_id INT,
action VARCHAR(20),
action_time DATETIME DEFAULT NOW()
);
DELIMITER //
CREATE TRIGGER trg_employee_after_insert
\`\`\`

AFTER INSERT ON employees FOR EACH ROW

\`\`\`sql
BEGIN
INSERT INTO employee_audit (employee_id, action)
VALUES (NEW.id, 'INSERT');
END //
DELIMITER ;
\`\`\`


## 2. NEW and OLD References

Inside a trigger, NEW refers to the new row values (available in INSERT and UPDATE). OLD refers to the old row values before modification (available in UPDATE and DELETE). For BEFORE triggers, you can modify NEW values to change what gets saved. BEFORE UPDATE auto-set updated_at:

\`\`\`sql
DELIMITER //
CREATE TRIGGER trg_set_updated_at
\`\`\`

BEFORE UPDATE ON employees FOR EACH ROW

\`\`\`sql
BEGIN
SET NEW.updated_at = NOW();
END //
DELIMITER ;
\`\`\`

AFTER UPDATE track salary changes:

\`\`\`sql
DELIMITER //
CREATE TRIGGER trg_salary_change_log
\`\`\`

AFTER UPDATE ON employees FOR EACH ROW

\`\`\`sql
BEGIN
IF OLD.salary != NEW.salary THEN
INSERT INTO salary_history(emp_id, old_salary, new_salary, changed_at)
VALUES (NEW.id, OLD.salary, NEW.salary, NOW());
END IF;
END //
DELIMITER ;
\`\`\`


## 3. BEFORE INSERT Validation Trigger

BEFORE triggers can validate data and raise an error to reject invalid inserts. Use SIGNAL SQLSTATE in MySQL to raise custom errors. This enforces business rules at the database level even if the application has a bug, the database won't accept bad data. Validation trigger:

\`\`\`sql
DELIMITER //
CREATE TRIGGER trg_validate_salary
\`\`\`

BEFORE INSERT ON employees FOR EACH ROW

\`\`\`sql
BEGIN
IF NEW.salary < 0 THEN
\`\`\`

SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary cannot be negative';

\`\`\`sql
END IF;
IF NEW.salary > 10000000 THEN
\`\`\`

SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary exceeds maximum allowed';

\`\`\`sql
END IF;
END //
DELIMITER ;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create an AFTER INSERT trigger on an 'orders' table that logs every new order into an 'order_audit' table with the order_id, customer_id, and timestamp. | Easy | Practical |
| 2 | Create a BEFORE UPDATE trigger on 'employees' that automatically sets the 'updated_at' column to NOW() whenever any column is updated. | Easy | Practical |
| 3 | Create an AFTER UPDATE trigger that records salary changes in a 'salary_history' table only when the salary actually changes, including old and new values. | Medium | Practical |
| 4 | Create a BEFORE INSERT trigger on a 'products' table that rejects any product with a negative price or empty name using SIGNAL. | Medium | Practical |
| 5 | Design a complete audit trail system using triggers for an 'employees' table. Track all INSERT, UPDATE, and DELETE operations in a single 'employees_audit' table with action type, changed values, and timestamp. | Hard | Design |
`,

  25: `# Transactions & ACID

A transaction is a sequence of SQL operations treated as a single unit of work either ALL operations succeed together, or NONE of them do. Transactions are essential in banking, e-commerce, and any system where partial updates would corrupt data. ACID properties define the guarantees a transaction provides.

## 1. ACID Properties Explained

ACID stands for four properties every reliable transaction must have: Atomicity (all or nothing), Consistency (data remains valid before and after), Isolation (concurrent transactions don't interfere), and Durability (committed data survives crashes). These properties together ensure database reliability.

:::scenario
Online bank transfer: deduct 5000 from Account A AND add 5000 to Account B. Without transactions, if the deduction succeeds but the addition crashes, money disappears. With ACID transactions, either both happen or neither does.
:::

ACID breakdown:

\`\`\`sql
-- Atomicity: Both deduction AND addition happen, or neither does
-- Consistency: Total money before = total money after
-- Isolation: Two concurrent transfers don't see each other's partial state
-- Durability: Once committed, the transfer survives a server crash
\`\`\`


## 2. BEGIN, COMMIT, ROLLBACK

BEGIN (or START TRANSACTION) starts a transaction. COMMIT permanently saves all changes.
ROLLBACK undoes all changes back to the beginning of the transaction. SAVEPOINT creates a checkpoint within a transaction ROLLBACK TO SAVEPOINT undoes changes back to that checkpoint only. Bank transfer with transaction:

\`\`\`sql
START TRANSACTION;
-- Step 1: Deduct from sender
UPDATE accounts SET balance = balance - 5000 WHERE id = 101;
-- Step 2: Add to receiver
UPDATE accounts SET balance = balance + 5000 WHERE id = 202;
-- If both succeed, commit:
COMMIT;
-- If anything goes wrong, rollback:
-- ROLLBACK;
SAVEPOINT example:
START TRANSACTION;
INSERT INTO orders (customer_id, amount) VALUES (1, 1500);
SAVEPOINT sp_after_order;
INSERT INTO payments (order_id, amount) VALUES (LAST_INSERT_ID(), 1500);
-- If payment fails, rollback to after order:
ROLLBACK TO SAVEPOINT sp_after_order;
-- Order stays, payment is undone
COMMIT;
\`\`\`


## 3. Autocommit and Transaction Modes

By default, MySQL runs in autocommit mode every single SQL statement is automatically committed. To group multiple statements into one transaction, use START TRANSACTION explicitly or turn off autocommit. PostgreSQL defaults to transaction mode (BEGIN/COMMIT wraps all statements). Autocommit control:

\`\`\`sql
-- Check autocommit (MySQL):
SELECT @@autocommit; -- 1 = enabled, 0 = disabled
-- Disable autocommit (MySQL):
SET autocommit = 0;
-- Explicit transaction (works in both MySQL and PostgreSQL):
BEGIN; -- or START TRANSACTION;
UPDATE inventory SET qty = qty - 1 WHERE product_id = 55;
INSERT INTO sales_log (product_id, qty_sold) VALUES (55, 1);
COMMIT;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a transaction for a bank transfer that deducts money from one account and adds to another. Add error handling so it rolls back if balance goes negative. | Easy | Practical |
| 2 | Demonstrate SAVEPOINT: write a transaction that inserts an order and attempts payment. Use SAVEPOINT so if payment fails, only the payment is rolled back while the order remains. | Medium | Practical |
| 3 | Explain each ACID property with a specific scenario from a hospital patient management system. | Medium | Written |
| 4 | Write a multi-step inventory transaction: when a sale is made, deduct from stock, create a sales record, and update the revenue table. Wrap in a single transaction. | Medium | Practical |
| 5 | Research: What is a deadlock in databases? How does it happen? How do MySQL and PostgreSQL handle deadlocks? Write a scenario where deadlock could occur. | Hard | Research |
`,

  26: `# Window Functions

Window functions perform calculations across a set of rows related to the current row without collapsing them into a single result like GROUP BY does. They are among the most powerful features in SQL for analytics, rankings, running totals, and comparing rows. They were introduced in SQL:2003 and are supported in both MySQL 8+ and PostgreSQL.

## 1. OVER() Clause The Foundation

All window functions use the OVER() clause to define the 'window' (set of rows) the function operates on. PARTITION BY divides rows into groups (like GROUP BY but without collapsing rows). ORDER BY within OVER defines the sequence for running calculations.

:::scenario
A sales report needs each salesperson's individual monthly sales AND the total sales for the whole company in the same row impossible with GROUP BY (which collapses to one row per group). Window functions achieve this elegantly.
:::

SUM as window function:
SELECT name, department, salary, SUM(salary) OVER() AS company_total, SUM(salary) OVER(PARTITION BY department) AS dept_total, ROUND(salary * 100.0 / SUM(salary) OVER(PARTITION BY department), 2) AS pct_of_dept
FROM employees;

\`\`\`sql
-- Output (each row kept, context added):
\`\`\`

| name | dept | salary | company_total | dept_total | pct_of_dept |
|-------|---------|--------|---------------|------------|-------------|
| Alice | IT | 70000 | 500000 | 200000 | 35.00 |
| Bob | IT | 65000 | 500000 | 200000 | 32.50 |
| Carol | Finance | 80000 | 500000 | 150000 | 53.33 |

## 2. ROW_NUMBER, RANK, DENSE_RANK

These functions assign rankings to rows. ROW_NUMBER assigns unique sequential integers (no ties). RANK assigns the same rank for ties but skips numbers after ties (1,1,3). DENSE_RANK assigns the same rank for ties without skipping (1,1,2).

:::scenario
An HR system ranks employees by salary within each department. Using DENSE_RANK: two employees with the same salary both get rank 1, and the next employee gets rank 2 no rank is skipped. Useful for 'top 3 earners per department' reports.
:::

Ranking functions comparison:
SELECT name, department, salary, ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) AS row_num, RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS rank_num, DENSE_RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dense_rank
FROM employees;

\`\`\`sql
-- When two salaries are equal (70000, 70000, 65000):
-- ROW_NUMBER: 1, 2, 3 (unique always)
-- RANK: 1, 1, 3 (tie gets same, gap after)
-- DENSE_RANK: 1, 1, 2 (tie gets same, no gap)
\`\`\`

Top N per group using ROW_NUMBER:

\`\`\`sql
-- Top 2 earners per department:
SELECT name, department, salary FROM (
SELECT name, department, salary,
\`\`\`

ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) AS rn
FROM employees ) ranked
WHERE rn <= 2;

## 3. LAG and LEAD Accessing Adjacent Rows

LAG(column, n) accesses the value from n rows BEFORE the current row. LEAD(column, n) accesses the value from n rows AFTER. These are invaluable for month-over-month comparisons, detecting trends, and calculating differences without self-joins.

:::scenario
An analytics team tracks monthly revenue. Using LAG, they calculate growth: current month's revenue minus last month's revenue in a single query. No need to join the table to itself.
:::

LAG for month-over-month comparison:
SELECT month, revenue, LAG(revenue, 1) OVER(ORDER BY month) AS prev_month_revenue, revenue - LAG(revenue, 1) OVER(ORDER BY month) AS growth
FROM monthly_sales
ORDER BY month;

\`\`\`sql
-- Output:
\`\`\`

| month | revenue | prev_month | growth |
|---------|---------|------------|--------|
| 2024-01 | 100000 | NULL | NULL |
| 2024-02 | 120000 | 100000 | 20000 |
| 2024-03 | 115000 | 120000 | -5000 |

## 4. Running Totals with SUM OVER ORDER BY

A running total (cumulative sum) adds up values row by row. With window functions, this is achieved by combining SUM with OVER(ORDER BY). The ORDER BY inside OVER defines the sequence, and the default frame includes all rows from the beginning up to the current row. Running total:
SELECT order_date, daily_sales, SUM(daily_sales) OVER(ORDER BY order_date) AS running_total
FROM daily_sales_summary
ORDER BY order_date;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query showing each employee's salary, their department's average salary, and how much they differ from the department average using window functions. | Easy | Query Writing |
| 2 | Find the top 3 highest-paid employees in each department using ROW_NUMBER() in a subquery. | Medium | Query Writing |
| 3 | Calculate month-over-month revenue growth using LAG. Show month, revenue, previous month revenue, and percentage change. | Medium | Query Writing |
| 4 | Create a sales leaderboard: rank all salespersons by total sales using RANK and DENSE_RANK. Show both ranks and explain the difference in output. | Medium | Practical |
| 5 | Write a query using LEAD to find employees whose salary in the next review period (next row ordered by review_date) decreased compared to current salary. | Hard | Query Writing |
`,

  27: `# CTEs (Common Table Expressions)

A CTE (Common Table Expression) is a named temporary result set defined using the WITH clause, valid only for the duration of the query. CTEs make complex queries more readable by breaking them into logical named steps. They can reference themselves (recursive CTEs) for hierarchical data like org charts and category trees.

## 1. Basic CTE Syntax

The WITH clause names a subquery so it can be referenced by name in the main query. Unlike subqueries repeated in multiple places, a CTE is defined once and can be referenced multiple times. CTEs dramatically improve readability of complex queries.

:::scenario
A business analyst writes a complex query: first get monthly sales, then calculate running totals, then add rankings. Without CTEs this is a nested mess. With CTEs, each step is a named block reading like a recipe: step 1 is monthly_sales, step 2 is ranked_sales, step 3 is the final output.
:::

Basic CTE:

\`\`\`sql
WITH high_earners AS (
SELECT name, department, salary
FROM employees
WHERE salary > 80000
)
SELECT department, COUNT(*) AS count, AVG(salary) AS avg_sal
FROM high_earners
GROUP BY department;
\`\`\`

Multiple CTEs chained:
WITH dept_totals AS (

\`\`\`sql
SELECT department, SUM(salary) AS total_salary
FROM employees
GROUP BY department
),
\`\`\`

dept_ranks AS (
SELECT department, total_salary, RANK() OVER(ORDER BY total_salary DESC) AS rank_num
FROM dept_totals )

\`\`\`sql
SELECT * FROM dept_ranks WHERE rank_num <= 3;
\`\`\`


## 2. Recursive CTEs Hierarchical Data

A recursive CTE references itself to process hierarchical data. It has two parts: an anchor (base case) and a recursive member (which builds on the previous result). Recursive CTEs are used for organizational hierarchies, category trees, bill-of-materials, and graph traversal.

:::scenario
A company org chart is stored in an employees table where each employee has a manager_id. A recursive CTE starting from the CEO can traverse down all levels of the hierarchy finding all direct and indirect reports of any manager.
:::

Recursive CTE org chart traversal:
WITH RECURSIVE org_chart AS (

\`\`\`sql
-- Anchor: start with the CEO (no manager)
SELECT id, name, manager_id, 0 AS level
FROM employees
WHERE manager_id IS NULL
UNION ALL
-- Recursive: get each employee's direct reports
SELECT e.id, e.name, e.manager_id, oc.level + 1
FROM employees AS e
JOIN org_chart AS oc ON e.manager_id = oc.id
)
SELECT REPEAT(' ', level) || name AS org_chart, level
FROM org_chart
ORDER BY level, name;
\`\`\`


## 3. CTE vs Subquery vs View

CTEs, subqueries, and views all create temporary named result sets, but differ in scope and use. A CTE exists only for one query. A subquery is inline and anonymous. A view is permanent and stored in the database. Use CTEs for query readability; views for reusability across multiple queries. Same logic as CTE vs subquery:

\`\`\`sql
-- Subquery style (harder to read):
SELECT dept, avg_sal FROM (
SELECT department AS dept, AVG(salary) AS avg_sal FROM employees GROUP BY
\`\`\`

department ) AS dept_avg WHERE avg_sal > 60000;

\`\`\`sql
-- CTE style (readable):
WITH dept_avg AS (
SELECT department AS dept, AVG(salary) AS avg_sal
FROM employees GROUP BY department
)
SELECT dept, avg_sal FROM dept_avg WHERE avg_sal > 60000;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Rewrite a complex nested subquery from a previous topic as a CTE to improve readability. | Easy | Query Writing |
| 2 | Write a CTE that first gets each customer's total order amount, then ranks them by total spending, then returns only the top 10. | Medium | Query Writing |
| 3 | Use multiple chained CTEs to: (1) calculate monthly sales, (2) calculate running totals, (3) calculate month-over-month growth as separate named steps. | Medium | Query Writing |
| 4 | Write a recursive CTE to traverse an employee hierarchy table starting from a given manager's id, returning all employees under that manager at all levels. | Hard | Query Writing |
| 5 | Build a recursive CTE for a product category tree (categories with parent_category_id) that outputs the full path from root to each leaf: 'Electronics > Phones > Smartphones'. | Hard | Query Writing |
`,

  28: `# CASE Statements

The CASE statement adds conditional logic to SQL queries similar to IF/ELSE in programming languages. CASE can appear in SELECT, WHERE, ORDER BY, GROUP BY, and even UPDATE statements. It transforms raw data into human-readable labels, creates custom groupings, and enables complex conditional aggregations.

## 1. Simple CASE and Searched CASE

Simple CASE compares a single expression to multiple values (like a switch statement). Searched CASE evaluates separate boolean conditions for each WHEN clause (like an if/elseif chain). Searched CASE is more flexible and more commonly used.

:::scenario
A payroll report needs to show employee grades: Executive (>200K), Senior (100K-200K), Mid (50K-100K), Junior (<50K). Instead of multiple queries, a single CASE in SELECT handles all categorization inline.
:::

Searched CASE in SELECT:
SELECT name, salary, CASE WHEN salary >= 200000 THEN 'Executive' WHEN salary >= 100000 THEN 'Senior' WHEN salary >= 50000 THEN 'Mid-Level' ELSE 'Junior' END AS salary_grade
FROM employees; Simple CASE (value matching):
SELECT order_id, CASE status WHEN 'P' THEN 'Pending' WHEN 'S' THEN 'Shipped' WHEN 'D' THEN 'Delivered' WHEN 'C' THEN 'Cancelled' ELSE 'Unknown' END AS order_status
FROM orders;

## 2. CASE with Aggregates Pivot Tables

One of the most powerful uses of CASE is inside aggregate functions to create pivot tables turning row values into columns. This is how SQL transforms a vertical data layout into a horizontal one without a PIVOT function.

:::scenario
A sales report needs monthly totals as columns: Jan_Sales, Feb_Sales, Mar_Sales. The data is stored as rows (one row per month). CASE + SUM pivots the rows into columns dynamically.
:::

Pivot table using CASE + SUM:
SELECT product, SUM(CASE WHEN month = 1 THEN sales ELSE 0 END) AS Jan_Sales, SUM(CASE WHEN month = 2 THEN sales ELSE 0 END) AS Feb_Sales, SUM(CASE WHEN month = 3 THEN sales ELSE 0 END) AS Mar_Sales, SUM(sales) AS Total_Sales
FROM monthly_product_sales
WHERE year = 2024
GROUP BY product;

## 3. CASE in ORDER BY and WHERE

CASE in ORDER BY enables custom sort orders beyond simple ASC/DESC. For example, sort status by business priority ('urgent' first, then 'normal', then 'low'). CASE in WHERE enables conditional filtering logic. CASE in ORDER BY for custom sort:

\`\`\`sql
SELECT order_id, priority, customer
FROM orders
ORDER BY
CASE priority
WHEN 'critical' THEN 1
WHEN 'high' THEN 2
WHEN 'medium' THEN 3
WHEN 'low' THEN 4
ELSE 5
END ASC;
CASE in UPDATE:
-- Apply different discounts based on order amount:
UPDATE orders
SET discount =
\`\`\`

CASE WHEN amount > 10000 THEN 0.15 WHEN amount > 5000 THEN 0.10 WHEN amount > 1000 THEN 0.05 ELSE 0.00 END;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a query that shows each student's name, score, and grade (A/B/C/D/F) using CASE. Display the distribution of grades as a summary. | Easy | Query Writing |
| 2 | Write an UPDATE using CASE that categorizes all products into price_tier column: 'Budget' (<500), 'Mid-range' (500-2000), 'Premium' (2000-10000), 'Luxury' (>10000). | Easy | Query Writing |
| 3 | Build a pivot table showing total sales for each product across 4 quarters of 2024 as separate columns (Q1, Q2, Q3, Q4) using CASE + SUM. | Hard | Query Writing |
| 4 | Write a query to count orders in each status category separately in one row: pending_count, processing_count, completed_count, cancelled_count. | Medium | Query Writing |
| 5 | Use CASE in ORDER BY to sort support tickets with priority: Critical → High → Medium → Low → Closed, then by created_date within each priority. | Medium | Query Writing |
`,

  29: `# Normalization

Normalization is the process of organizing a relational database to reduce data redundancy and improve data integrity. It involves decomposing large tables into smaller, related tables. Normalization is guided by Normal Forms (1NF, 2NF, 3NF, BCNF). A poorly normalized database leads to update anomalies, insertion anomalies, and deletion anomalies.

## 1. Why Normalization Matters Anomalies

Without normalization, databases suffer from update anomaly (changing one fact requires updating many rows), insertion anomaly (can't add data without other unrelated data), and deletion anomaly (deleting one piece of data accidentally deletes related facts). Normalization eliminates these problems.

:::scenario
A single un-normalized table stores: order_id, customer_name, customer_email, product_name, product_price, quantity. If the customer changes their email, you must update it in EVERY row of every order they've placed. Miss one row and your data is inconsistent. Normalization puts customer info in a separate customers table update once, reflected everywhere.
:::

Un-normalized table (problems):

\`\`\`sql
-- ONE flat table - BAD DESIGN:
\`\`\`

orders_flat:
| order_id | cust_name | cust_email | product | price | qty |
|----------|-----------|-------------------|-------------|-------|-----|
| 1 | Alice | alice@old.com | Laptop | 50000 | 1 |
| 2 | Alice | alice@new.com | Mouse | 500 | 2 |

\`\`\`sql
-- Alice's email is inconsistent! Update anomaly.
\`\`\`


## 2. First Normal Form (1NF)

1NF requires: each column contains atomic (indivisible) values no multiple values in one cell. Each row is unique (has a primary key). No repeating groups or arrays in columns. Violating 1NF: storing 'Maths,Science,English' in a single subjects column. 1NF violation and fix:

\`\`\`sql
-- VIOLATES 1NF (multiple values in subjects column):
\`\`\`

| student_id | name | subjects |
|------------|-------|-----------------------|
| 1 | Alice | Maths,Science,English |

\`\`\`sql
-- 1NF COMPLIANT (one value per cell, separate rows):
\`\`\`

| student_id | name | subject |
|------------|-------|---------|
| 1 | Alice | Maths |
| 1 | Alice | Science |
| 1 | Alice | English |

## 3. Second Normal Form (2NF)

2NF requires: the table is in 1NF AND every non-key column is fully dependent on the ENTIRE primary key (not just part of it). 2NF only matters when there's a composite primary key. Partial dependency = a non-key column depends on only part of the composite key. 2NF violation and fix:

\`\`\`sql
-- VIOLATES 2NF (product_name depends only on product_id, not full PK):
\`\`\`

order_items: PK = (order_id, product_id)
| order_id | product_id | product_name | quantity |
|----------|------------|--------------|----------|
| 1 | 55 | Laptop | 1 |

\`\`\`sql
-- FIX: Separate products table:
\`\`\`

products: id, name, price order_items: order_id, product_id(FK), quantity

## 4. Third Normal Form (3NF)

3NF requires: the table is in 2NF AND there are no transitive dependencies non-key columns must depend only on the primary key, not on other non-key columns. 3NF violation and fix:

\`\`\`sql
-- VIOLATES 3NF (zip_code → city is a transitive dependency):
\`\`\`

employees: id, name, zip_code, city

\`\`\`sql
-- city depends on zip_code, not on employee id!
-- FIX: Separate zip_codes table:
\`\`\`

zip_codes: zip_code(PK), city, state employees: id, name, zip_code(FK)

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Given a flat table: (order_id, customer_name, customer_city, product_name, product_category, quantity, price) normalize it to 3NF. Draw the resulting tables. | Medium | Design |
| 2 | Identify all 1NF violations in a 'student_records' table that has: student_id, name, subjects (comma-separated), phone_numbers (multiple). Fix them. | Easy | Design |
| 3 | Explain with the bank account example how deletion anomaly can cause data loss in an un-normalized table. | Easy | Written |
| 4 | Take an existing un-normalized e-commerce database you designed earlier and apply 1NF, 2NF, and 3NF step by step, documenting each change. | Hard | Design |
| 5 | Research BCNF (Boyce-Codd Normal Form). How does it differ from 3NF? Provide an example where a table is in 3NF but not BCNF. | Hard | Research |
`,

  30: `# ER Diagrams & Schema Design

An Entity-Relationship (ER) diagram is a visual blueprint of a database. It shows entities (tables), their attributes (columns), and relationships between entities. Schema design is the process of translating business requirements into a well-structured database. Good schema design prevents problems that are very costly to fix later.

## 1. Entities, Attributes, and Relationships

An Entity represents a real-world object or concept stored in the database (e.g., Customer, Product, Order). An Attribute is a property of an entity (Customer: name, email, phone). A Relationship defines how entities are connected. Relationships have cardinality: one-to-one (1:1), one-to-many (1:N), or many-to-many (M:N).

:::scenario
A hospital system has entities: Patient, Doctor, Ward, and Appointment. The relationship between Patient and Doctor through Appointment is many-to-many (one patient sees many doctors; one doctor treats many patients). This must be represented with an Appointments junction table.
:::

Cardinality types:
1:1 -- One user has one profile (User → Profile) 1:N -- One customer has many orders (Customer → Orders) M:N -- Students enroll in many courses; courses have many students

## 2. Translating ER to SQL Tables

Each entity becomes a table. Each attribute becomes a column. 1:N relationships are implemented with a FK in the 'many' side. M:N relationships require a junction/bridge table with FKs to both parent tables. 1:1 relationships can use a FK in either table (often the 'weaker' entity). E-commerce schema example:

\`\`\`sql
-- Entities: Customer, Product, Order, OrderItem (junction for Order-Product)
CREATE TABLE customers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(200) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock INT DEFAULT 0
);
CREATE TABLE orders (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
order_date DATETIME DEFAULT NOW(),
FOREIGN KEY (customer_id) REFERENCES customers(id)
);
CREATE TABLE order_items (
order_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL,
unit_price DECIMAL(10,2) NOT NULL,
PRIMARY KEY (order_id, product_id),
FOREIGN KEY (order_id) REFERENCES orders(id),
FOREIGN KEY (product_id) REFERENCES products(id)
);
\`\`\`


## 3. Schema Design Best Practices

Good schema design follows key principles: always define a primary key, use appropriate data types, apply NOT NULL to required fields, use FK constraints for relationships, name tables and columns consistently (snake_case or camelCase pick one), avoid storing calculated values, and think about query patterns when designing indexes. Naming conventions:

\`\`\`sql
-- Table names: plural, snake_case
\`\`\`

customers, orders, order_items, product_categories

\`\`\`sql
-- Primary keys: id or table_name_id
\`\`\`

customers.id or customers.customer_id

\`\`\`sql
-- Foreign keys: referenced_table_id
\`\`\`

orders.customer_id (references customers.id) order_items.order_id (references orders.id)

\`\`\`sql
-- Timestamps: created_at, updated_at
-- Boolean: is_active, has_paid, is_verified
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Draw and implement the full SQL schema for a hospital management system with: patients, doctors, wards, appointments, and prescriptions. | Medium | Design |
| 2 | Design an ER diagram for a social media platform with: users, posts, comments, likes, and followers. Identify all cardinalities. | Medium | Design |
| 3 | Given a business requirement: 'A library lets members borrow multiple books; each book can be borrowed by multiple members over time' design the full schema with FKs. | Medium | Design |
| 4 | Review a poorly designed flat table and redesign it: (product_id, product_name, category_name, vendor_name, vendor_email, vendor_phone, warehouse_name, warehouse_city). | Hard | Design |
| 5 | Create a complete SQL script for an airline reservation system: planes, routes, flights, passengers, and bookings. Include all constraints, FKs, and indexes. | Hard | Practical |
`,

  31: `# Import & Export Data

Real databases constantly receive and send data. Importing data from CSV files, Excel exports, or other databases is a routine task. Exporting data for analysis, reporting, or migration is equally common. Both MySQL and PostgreSQL have built-in commands for bulk data operations.

## 1. Importing CSV Data

CSV (Comma-Separated Values) is the most common format for data exchange. MySQL uses LOAD DATA INFILE to import CSVs directly into tables. PostgreSQL uses the COPY command. Both are extremely fast much faster than inserting row by row with INSERT statements.

:::scenario
A retail company receives a weekly supplier inventory update as a CSV file with 50,000 product records. Using LOAD DATA INFILE, all 50,000 rows are loaded into the staging table in seconds doing it with individual INSERT statements would take hours.
:::

MySQL LOAD DATA INFILE:

\`\`\`sql
LOAD DATA INFILE '/tmp/employees.csv'
INTO TABLE employees
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS -- skip header row
(name, department, salary, join_date);
\`\`\`

PostgreSQL COPY command:
COPY employees(name, department, salary, join_date)
FROM '/tmp/employees.csv'
WITH (FORMAT CSV, HEADER TRUE, DELIMITER ',');

## 2. Exporting Data

Exporting query results to CSV is useful for sharing with Excel users, running external analysis, or generating reports. MySQL uses SELECT ... INTO OUTFILE. PostgreSQL uses COPY TO. Both tools (Workbench, pgAdmin) also support GUI-based export. MySQL export to CSV:

\`\`\`sql
SELECT id, name, salary, department
FROM employees
WHERE status = 'active'
INTO OUTFILE '/tmp/active_employees.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\\n';
\`\`\`

PostgreSQL COPY TO:
COPY (SELECT id, name, salary FROM employees WHERE status='active') TO '/tmp/active_employees.csv'
WITH (FORMAT CSV, HEADER TRUE);

## 3. Database Dump and Restore


mysqldump and pg_dump create full SQL dump files containing CREATE TABLE statements and
INSERT data used for backups and migrations. pg_restore / mysql < dump.sql restores them. MySQL dump and restore:

\`\`\`sql
-- Create backup:
mysqldump -u root -p school_db > school_db_backup.sql
-- Restore from backup:
mysql -u root -p school_db < school_db_backup.sql
-- Dump specific table:
mysqldump -u root -p school_db students > students_backup.sql
\`\`\`

PostgreSQL dump and restore:

\`\`\`sql
-- Create backup:
pg_dump -U postgres school_db > school_db_backup.sql
-- Restore:
psql -U postgres school_db < school_db_backup.sql
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a CSV file with 10 employee records. Import it into a MySQL employees table using LOAD DATA INFILE. Verify the import. | Easy | Practical |
| 2 | Export the active employees to a CSV file using SELECT INTO OUTFILE (MySQL) or COPY TO (PostgreSQL). Open it in Excel to verify. | Easy | Practical |
| 3 | Create a full backup of a database using mysqldump. Drop the database. Restore it from the backup. Verify all tables and data are intact. | Medium | Practical |
| 4 | Import a large dataset (find a free CSV dataset online with 10,000+ rows). Compare the time to import using LOAD DATA vs inserting row by row with a loop. | Hard | Practical |
| 5 | Write a data migration script: export data from a 'legacy_customers' table, transform the format (e.g., split full_name into first_name/last_name), and import into the new 'customers' table. | Hard | Practical |
`,

  32: `# DCL Commands

DCL (Data Control Language) manages access and permissions in a database. GRANT gives users specific permissions. REVOKE removes them. In a production database, no one should have unrestricted access different roles (developer, analyst, app user, DBA) get different permissions. Proper access control is critical for security and compliance.

## 1. User Management CREATE and DROP USER

Before granting permissions, create user accounts. Each user account is identified by username@host the host specifies from where the user can connect. 'localhost' means only from the same machine. '%' means from any host. Create and manage users (MySQL):

\`\`\`sql
-- Create a new user (local access only):
CREATE USER 'analyst'@'localhost' IDENTIFIED BY 'SecurePass123!';
-- Create user from any host:
CREATE USER 'app_user'@'%' IDENTIFIED BY 'AppPass456!';
-- Change password:
ALTER USER 'analyst'@'localhost' IDENTIFIED BY 'NewPass789!';
-- Drop user:
DROP USER 'analyst'@'localhost';
\`\`\`

PostgreSQL user management:
CREATE USER analyst WITH PASSWORD 'SecurePass123!';

\`\`\`sql
ALTER USER analyst WITH PASSWORD 'NewPass456!';
DROP USER analyst;
\`\`\`


## 2. GRANT Giving Permissions

GRANT gives users specific privileges on databases, tables, or columns. Privileges include: SELECT,
INSERT, UPDATE, DELETE, CREATE, DROP, EXECUTE, ALL PRIVILEGES. Granting minimal necessary permissions is the principle of least privilege a core security principle.

:::scenario
A company's data analyst should only be able to read data (SELECT) never modify it. The reporting app user needs SELECT and INSERT (to log report runs). The DBA gets ALL PRIVILEGES. Granting only what's needed limits damage if credentials are compromised.
:::

GRANT examples:

\`\`\`sql
-- Read-only access to entire database:
GRANT SELECT ON school_db.* TO 'analyst'@'localhost';
-- Read and write access to specific table:
GRANT SELECT, INSERT, UPDATE ON school_db.orders TO 'app_user'@'%';
-- Full access to one database:
GRANT ALL PRIVILEGES ON school_db.* TO 'developer'@'localhost';
-- Column-level grant (read only specific columns):
GRANT SELECT (name, department) ON school_db.employees TO 'hr_viewer'@'%';
-- Apply changes (MySQL):
FLUSH PRIVILEGES;
\`\`\`


## 3. REVOKE Removing Permissions

REVOKE removes previously granted permissions. The syntax mirrors GRANT. After revoking permissions, FLUSH PRIVILEGES in MySQL applies the changes. In PostgreSQL, changes take effect immediately.
REVOKE examples:

\`\`\`sql
-- Remove INSERT permission from analyst:
REVOKE INSERT ON school_db.orders FROM 'analyst'@'localhost';
-- Remove all permissions:
REVOKE ALL PRIVILEGES ON school_db.* FROM 'old_user'@'%';
-- View current grants for a user (MySQL):
SHOW GRANTS FOR 'analyst'@'localhost';
-- PostgreSQL equivalent:
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE grantee = 'analyst';
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create 3 users: 'analyst' (SELECT only), 'app_user' (SELECT + INSERT + UPDATE), 'admin_user' (ALL PRIVILEGES) on a test database. Verify each user's grants. | Easy | Practical |
| 2 | Test permissions: login as 'analyst' and try to run DELETE. Document the error. Then as 'app_user' try INSERT it should work. | Easy | Practical |
| 3 | Design a permission matrix for a hospital database: define what permissions each role (receptionist, nurse, doctor, billing, DBA) should have on each table. | Medium | Design |
| 4 | Revoke INSERT permission from app_user. Verify by attempting an INSERT (should fail). Then re-grant it and confirm it works again. | Medium | Practical |
| 5 | Research: What is role-based access control (RBAC) in PostgreSQL? How does CREATE ROLE and GRANT role TO user work? Compare to MySQL's user model. | Hard | Research |
`,

  33: `# MySQL vs PostgreSQL Differences

MySQL and PostgreSQL are both excellent open-source relational databases, but they have meaningful differences in features, syntax, and philosophy. Understanding these differences helps you choose the right tool and write compatible code. PostgreSQL is generally more feature-rich and standards-compliant; MySQL is traditionally simpler and faster for web applications.

## 1. Key Syntax Differences

Several common operations have different syntax between MySQL and PostgreSQL. Knowing these differences prevents frustration when switching between databases. Syntax comparison table:

| Feature | MySQL | PostgreSQL |
|---|---|---|
| Auto-increment PK | INT AUTO_INCREMENT PRIMARY KEY | SERIAL PRIMARY KEY |
| String concatenation | CONCAT(a, b) | a || b (or CONCAT) |
| Current date+time | NOW() | NOW() or CURRENT_TIMESTAMP |
| Current date only | CURDATE() | CURRENT_DATE |
| Limit rows | LIMIT n | LIMIT n or FETCH FIRST n ROWS |
| Show databases | SHOW DATABASES; | \\\\l (psql) or SELECT ... |
| Show tables | SHOW TABLES; | \\\\dt (psql) |
| Full outer join | Simulate with UNION | FULL OUTER JOIN (native) |
| String quotes | Single OR double quotes | Single quotes only |
| Case-sensitive strings | Case-insensitive by default | Case-sensitive by default |
| Boolean type | TINYINT(1) 0 or 1 | Native BOOLEAN (true/false) |

## 2. Data Type Differences

PostgreSQL has more data types than MySQL, especially for complex data. PostgreSQL natively supports JSON/JSONB (binary JSON), arrays, UUID, geometric types, and custom types. MySQL added JSON support in version 5.7 but it is less powerful than PostgreSQL's JSONB. Data type differences:

\`\`\`sql
-- UUID (universally unique identifier):
-- PostgreSQL: native UUID type
CREATE TABLE users (id UUID DEFAULT gen_random_uuid() PRIMARY KEY);
-- MySQL: use VARCHAR(36) for UUID
CREATE TABLE users (id VARCHAR(36) PRIMARY KEY);
-- Arrays (PostgreSQL only):
CREATE TABLE products (id INT, tags TEXT[]);
INSERT INTO products VALUES (1, '{electronics, phone, apple}');
-- JSONB (PostgreSQL) binary JSON, indexed, queried:
CREATE TABLE configs (id INT, settings JSONB);
SELECT settings->>'theme' FROM configs WHERE id = 1;
\`\`\`


## 3. Feature Differences

PostgreSQL supports materialized views (cached views), table inheritance, more advanced window functions, and stricter SQL standard compliance. MySQL is known for ease of setup, wide hosting support, and speed in simple read-heavy workloads. MySQL powers most of the web (WordPress, Drupal); PostgreSQL powers financial, geospatial, and complex analytical systems. Materialized view (PostgreSQL only):

\`\`\`sql
-- PostgreSQL materialized view (caches results):
CREATE MATERIALIZED VIEW mv_sales_summary AS
SELECT product_id, SUM(amount) AS total FROM orders GROUP BY product_id;
-- Refresh the cached data:
REFRESH MATERIALIZED VIEW mv_sales_summary;
-- MySQL has no native materialized view (use summary tables + triggers instead)
\`\`\`

Choosing MySQL vs PostgreSQL:

\`\`\`sql
Use MySQL when:
\`\`\`

- Simple web application (WordPress, Drupal, basic CRUD)
- Maximum compatibility with shared hosting
- Read-heavy workload with simple queries

\`\`\`sql
Use PostgreSQL when:
\`\`\`

- Complex queries, analytics, and reporting
- Need for JSON, arrays, custom types
- Strict ACID compliance requirements
- Geospatial data (PostGIS extension)
- Financial systems requiring precision

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write the same 5 queries (create table, insert, select with date function, auto-increment insert, show structure) in both MySQL and PostgreSQL syntax side by side. | Easy | Practical |
| 2 | In PostgreSQL, create a table with a JSONB column. Insert 3 records with JSON data. Write a query to filter by a JSON property value. | Medium | Practical |
| 3 | Create a materialized view in PostgreSQL for a slow-running monthly sales report. Demonstrate REFRESH MATERIALIZED VIEW. Explain when to use it. | Medium | Practical |
| 4 | Research and write a decision guide: 'When should I choose MySQL vs PostgreSQL?' Cover 5 technical factors and 3 business factors. | Medium | Written |
| 5 | Create the same schema (users, orders, products) in both MySQL and PostgreSQL. Note every syntax difference. Write a migration guide to move from MySQL to PostgreSQL. | Hard | Research |
`,

  34: `# Query Optimization

Query optimization is the art and science of making SQL queries run faster on large datasets. A poorly written query on a table with 100 million rows can take minutes; an optimized version takes milliseconds. Understanding how the database engine executes queries — and using EXPLAIN/EXPLAIN ANALYZE to diagnose problems — is a core skill for any serious SQL practitioner.

## 1. How the Query Optimizer Works

The database query optimizer is an internal engine component that analyzes your SQL and decides the most efficient execution plan. It considers: available indexes, table statistics, estimated row counts, join order, and available memory. The optimizer generates multiple possible plans and picks the one with the lowest estimated cost. Understanding this helps you write queries the optimizer can execute efficiently.

:::scenario
A query joining 3 tables can be executed in 6 different join orders (3! = 6). The optimizer evaluates each, estimates the cost of each based on table sizes and indexes, and picks the cheapest. Rewriting the query or adding an index can dramatically change which plan is chosen.
:::

EXPLAIN — view execution plan (MySQL):

\`\`\`sql
EXPLAIN SELECT e.name, d.dept_name, e.salary
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 80000;
-- Key columns to examine:
-- type: ALL (full scan, BAD) | ref/range/index (good)
-- key: which index was used (NULL = no index)
-- rows: estimated rows scanned
-- Extra: 'Using filesort', 'Using temporary' = warning signs
EXPLAIN ANALYZE — actual execution (PostgreSQL):
EXPLAIN ANALYZE SELECT e.name, d.dept_name
FROM employees e JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 80000;
-- Shows: estimated vs ACTUAL rows, loops, timing
-- Key: Seq Scan (bad on large tables) vs Index Scan (good)
\`\`\`


## 2. Reading EXPLAIN Output

EXPLAIN output reveals how the database actually processes your query. The 'type' column in MySQL is the most critical — from best to worst: system > const > eq_ref > ref > range > index > ALL. 'ALL' means a full table scan — every row is read — which is disastrous on large tables. 'Using filesort' means an in-memory sort that couldn't use an index.

:::scenario
A reporting query that previously returned results in 2 seconds starts taking 45 seconds after the data grows. Running EXPLAIN reveals type=ALL on the orders table with 8 million rows. Adding a composite index on (order_date, status) changes type from ALL to range — query drops back to under 1 second.
:::

EXPLAIN output comparison:

\`\`\`sql
-- BEFORE index (BAD):
\`\`\`

id | type | key | rows | Extra 1 | ALL | NULL | 8,000,000 | Using where

\`\`\`sql
-- AFTER adding index on (order_date, status) (GOOD):
\`\`\`

id | type | key | rows | Extra 1 | range | idx_date_status | 1420 | Using index condition Slow query log (MySQL) — find expensive queries:

\`\`\`sql
-- Enable slow query log:
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- log queries > 1 second
-- View slow query log file:
SHOW VARIABLES LIKE 'slow_query_log_file';
\`\`\`


## 3. Query Rewriting for Performance

Often the same logical result can be achieved with different SQL patterns — some much faster than others. Key rewrites: avoid SELECT *, use EXISTS instead of IN for large subqueries, avoid functions on indexed columns in WHERE, push filters as early as possible (filter before join, not after), and avoid correlated subqueries that run once per row. Avoid functions on indexed columns in WHERE:

\`\`\`sql
-- BAD: function prevents index use
WHERE YEAR(order_date) = 2024
-- GOOD: range query uses index
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
\`\`\`

Avoid correlated subquery — use JOIN instead:

\`\`\`sql
-- BAD: correlated subquery runs once per row (slow)
SELECT name FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);
-- GOOD: pre-compute averages with JOIN
SELECT e.name FROM employees e
JOIN (SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id) d
ON e.dept_id = d.dept_id AND e.salary > d.avg_sal;
SELECT * vs specific columns:
-- BAD: fetches all columns including TEXT/BLOB (wastes memory/network)
SELECT * FROM products WHERE category = 'Electronics';
-- GOOD: fetch only what you need
SELECT id, name, price FROM products WHERE category = 'Electronics';
\`\`\`


## 4. Query Plan Hints and Optimizer Controls

Sometimes the optimizer makes a suboptimal choice. MySQL allows hints like FORCE INDEX, USE INDEX, IGNORE INDEX to override index selection. PostgreSQL allows SET enable_seqscan = off to force index scans during testing. Use hints sparingly — they can become stale as data grows. Index hints (MySQL):

\`\`\`sql
-- Force use of specific index:
SELECT * FROM orders FORCE INDEX (idx_customer_date)
WHERE customer_id = 101 AND order_date > '2024-01-01';
-- Hint the optimizer to ignore an index:
SELECT * FROM orders IGNORE INDEX (idx_status)
WHERE status = 'pending';
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Run EXPLAIN on 5 different queries on a large table (with and without indexes). Document what changes in the execution plan output after adding each index. | Medium | Practical |
| 2 | Enable MySQL slow query log. Run 10 queries of varying complexity. Identify the 2 slowest and optimize them. Document before/after EXPLAIN output. | Hard | Practical |
| 3 | Rewrite 3 queries that use functions in WHERE clauses (YEAR(), MONTH(), UPPER()) to equivalent range queries that can use indexes. | Medium | Query Writing |
| 4 | Convert a correlated subquery that finds employees earning above their department average into a JOIN-based query. Compare execution plans. | Medium | Query Writing |
| 5 | Research: What is the difference between a hash join, merge join, and nested loop join? Under what conditions does PostgreSQL choose each? Write examples. | Hard | Research |
`,

  35: `# Advanced Indexing

Beyond basic single-column indexes, advanced indexing strategies can make the difference between a query taking 10 seconds versus 10 milliseconds on large production databases. Composite indexes, covering indexes, partial indexes (PostgreSQL), and proper index maintenance are essential skills for database performance engineering.

## 1. Composite Indexes — Column Order Matters

A composite index covers multiple columns. The leftmost prefix rule is critical: the index is usable only if the query includes the leftmost column(s) of the index. Think of it like a phone book sorted by (last_name, first_name) — you can look up by last name alone, or by last + first name, but not by first name alone.

:::scenario
An e-commerce platform has an orders table. The most common query filters by customer_id AND order_date. A composite index on (customer_id, order_date) is 10x faster than separate indexes because the database finds the customer's rows first (narrow set), then applies the date filter within that narrow set.
:::

Composite index — leftmost prefix rule:

\`\`\`sql
CREATE INDEX idx_cust_date_status ON orders(customer_id, order_date, status);
-- USES index (starts with customer_id):
WHERE customer_id = 101
WHERE customer_id = 101 AND order_date > '2024-01-01'
WHERE customer_id = 101 AND order_date > '2024-01-01' AND status = 'shipped'
-- DOES NOT use index (skips customer_id):
WHERE order_date > '2024-01-01'
WHERE status = 'shipped'
\`\`\`


## 2. Covering Indexes

A covering index includes ALL columns needed by a query — the database can satisfy the query entirely from the index without accessing the actual table rows at all. This eliminates expensive random I/O lookups and is one of the most powerful performance techniques for read-heavy workloads.

:::scenario
A reporting query: SELECT customer_id, order_date, amount FROM orders WHERE customer_id = 101. A covering index on (customer_id, order_date, amount) means the query is answered entirely from the index — the orders table rows are never touched. EXPLAIN shows 'Using index' — the best possible outcome.
:::

Covering index example:

\`\`\`sql
-- Query fetches these 3 columns:
SELECT customer_id, order_date, amount
FROM orders WHERE customer_id = 101;
-- Covering index includes all 3 columns:
CREATE INDEX idx_covering ON orders(customer_id, order_date, amount);
-- EXPLAIN shows 'Using index' -- table never accessed!
\`\`\`


## 3. Partial Indexes (PostgreSQL)

A partial index is an index built on only a subset of table rows — defined by a WHERE condition. This makes indexes smaller and faster. Most useful when queries consistently filter on a column with a specific value (e.g., only active records, only unprocessed orders).

:::scenario
An orders table has 50 million rows but only 100,000 are in 'pending' status — the ones your application queries constantly. A partial index on pending orders is 500x smaller than a full index on status, fits entirely in memory, and is blazing fast.
:::

Partial index (PostgreSQL):

\`\`\`sql
-- Only index pending orders (much smaller, faster):
CREATE INDEX idx_pending_orders ON orders(customer_id, created_at)
WHERE status = 'pending';
-- This index is used ONLY for queries that include WHERE status='pending':
SELECT * FROM orders
WHERE status = 'pending' AND customer_id = 101; -- uses partial index
SELECT * FROM orders WHERE customer_id = 101; -- does NOT use partial index
\`\`\`


## 4. Index Maintenance and Statistics

Indexes need maintenance. Over time, heavy INSERT/UPDATE/DELETE activity causes index fragmentation — the index becomes disorganized and slower. Updating statistics tells the optimizer the current data distribution so it makes better plan choices. Unused indexes should be dropped — they slow down writes with no benefit. Index maintenance commands:

\`\`\`sql
-- MySQL: Analyze table to update statistics:
ANALYZE TABLE orders;
-- MySQL: Rebuild fragmented indexes:
OPTIMIZE TABLE orders;
-- PostgreSQL: Rebuild index without locking:
REINDEX INDEX CONCURRENTLY idx_customer_id;
-- PostgreSQL: Update statistics:
ANALYZE orders;
-- Find unused indexes (PostgreSQL):
SELECT indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'public';
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a composite index on (department, salary) for an employees table. Test 4 different WHERE clause combinations and identify which ones use the index via EXPLAIN. | Medium | Practical |
| 2 | Design a covering index for this specific query: SELECT order_id, customer_id, total_amount, status FROM orders WHERE status='completed' AND order_date >= '2024-01-01'. Verify with EXPLAIN. | Medium | Practical |
| 3 | In PostgreSQL, create a partial index for a messages table indexing only unread messages (is_read = FALSE). Measure query performance before and after. | Medium | Practical |
| 4 | Find all unused indexes in a PostgreSQL database using pg_stat_user_indexes. Drop the unused ones and document your reasoning. | Hard | Practical |
| 5 | Benchmark: Create a table with 1 million rows. Run 5 queries without indexes (record time). Add optimal indexes. Re-run same queries. Document percentage improvement for each. | Hard | Research |
`,

  36: `# Partitioning

Table partitioning divides a large table into smaller, more manageable physical segments (partitions) while appearing as a single table to the application. Partitioning is a major performance and manageability tool for tables with hundreds of millions of rows — common in data warehouses, logging systems, and time-series databases.

## 1. Why Partition? Partition Pruning

Without partitioning, a query on a 500-million-row table must scan all partitions. With partitioning and a matching WHERE clause, the database performs partition pruning — only scanning the relevant partitions. A query for 'orders in Q1 2024' scans only the Q1 partition (maybe 5 million rows) instead of the entire 500-million-row table.

:::scenario
A telecom company stores call detail records — 2 billion rows spanning 5 years. Querying last month's calls on a non-partitioned table takes 8 minutes. After partitioning by month, each partition holds ~33 million rows, and last month's query takes 12 seconds — a 40x improvement.
:::

Partition pruning — how the DB uses partitions:

\`\`\`sql
-- With RANGE partition by year:
-- Query: WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31'
-- Partition pruning: only scans partition_2024, not 2021/2022/2023
EXPLAIN SELECT * FROM orders_partitioned
WHERE order_date BETWEEN '2024-01-01' AND '2024-03-31';
-- Shows: partitions=p_2024 (only one partition scanned)
\`\`\`


## 2. RANGE Partitioning

RANGE partitioning assigns rows to partitions based on a column value falling within a defined range. Most commonly used with dates — partition by year, quarter, or month. Excellent for time-series data where old data is rarely queried and can be archived or dropped by dropping the partition. RANGE partition by year (MySQL):

\`\`\`sql
CREATE TABLE orders (
id INT NOT NULL,
customer_id INT NOT NULL,
amount DECIMAL(10,2),
order_date DATE NOT NULL
)
PARTITION BY RANGE (YEAR(order_date)) (
\`\`\`

PARTITION p_2021 VALUES LESS THAN (2022), PARTITION p_2022 VALUES LESS THAN (2023), PARTITION p_2023 VALUES LESS THAN (2024), PARTITION p_2024 VALUES LESS THAN (2025), PARTITION p_future VALUES LESS THAN MAXVALUE );

\`\`\`sql
-- Drop old partition instantly (no DELETE needed):
ALTER TABLE orders DROP PARTITION p_2021;
\`\`\`


## 3. LIST and HASH Partitioning

LIST partitioning assigns rows based on matching specific values in a list — useful for categorical data like region or country. HASH partitioning distributes rows evenly across a fixed number of partitions based on a hash of a column value — useful for even distribution when no natural range exists. LIST partitioning by region:

\`\`\`sql
CREATE TABLE customers (
id INT NOT NULL,
name VARCHAR(100),
region VARCHAR(20) NOT NULL
)
PARTITION BY LIST COLUMNS(region) (
\`\`\`

PARTITION p_north VALUES IN ('Delhi','Chandigarh','Amritsar'), PARTITION p_south VALUES IN ('Chennai','Bangalore','Hyderabad'), PARTITION p_west VALUES IN ('Mumbai','Pune','Ahmedabad'), PARTITION p_east VALUES IN ('Kolkata','Bhubaneswar','Patna') ); HASH partitioning for even distribution:

\`\`\`sql
CREATE TABLE user_sessions (
session_id VARCHAR(36) NOT NULL,
user_id INT NOT NULL,
created_at DATETIME
)
PARTITION BY HASH(user_id)
\`\`\`

PARTITIONS 8; -- distributes rows evenly across 8 partitions

## 4. Partition Management

Partitions can be added, dropped, split, or merged without affecting the rest of the table. Dropping a partition is near-instantaneous — much faster than DELETE for archiving old data. This is a major operational advantage for large time-series tables. Partition management commands:

\`\`\`sql
-- Add a new partition for 2025:
ALTER TABLE orders
\`\`\`

REORGANIZE PARTITION p_future INTO ( PARTITION p_2025 VALUES LESS THAN (2026), PARTITION p_future VALUES LESS THAN MAXVALUE );

\`\`\`sql
-- View all partitions and their row counts:
SELECT partition_name, table_rows
FROM information_schema.partitions
WHERE table_name = 'orders';
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a 'sales_log' table partitioned by RANGE on sale_year (2020-2025 + future). Insert sample data across different years. Verify partition pruning with EXPLAIN. | Medium | Practical |
| 2 | Create a customers table partitioned by LIST on region (North/South/East/West). Insert customers for each region. Verify only relevant partition is scanned. | Medium | Practical |
| 3 | Simulate archiving: on a range-partitioned orders table, drop the partition for 2021. Verify the data is gone and remaining data is intact. | Easy | Practical |
| 4 | Add a new yearly partition to an existing partitioned table. Document the REORGANIZE PARTITION command and verify with information_schema.partitions. | Medium | Practical |
| 5 | Research: What is sub-partitioning (composite partitioning) in MySQL? Give a real-world scenario where partitioning by RANGE(year) + HASH(customer_id) would be beneficial. | Hard | Research |
`,

  37: `# Replication

Database replication copies data from one database server (primary/master) to one or more other servers (replicas/slaves) in near real-time. Replication enables high availability, read scaling, geographic distribution, and disaster recovery. It is a foundational concept for any production database system handling real traffic.

## 1. How Replication Works — Binlog

MySQL replication uses the binary log (binlog) — a file that records every data-changing SQL statement or row change on the primary. Replicas connect to the primary, receive binlog events, and apply them in the same order. This keeps the replica in sync. There is typically a small replication lag — the replica is slightly behind the primary.

:::scenario
A high-traffic news website has 1 primary MySQL server handling all writes (article creation, comment submission) and 4 replica servers handling reads (article display, search). This distributes read load across 5 servers — 5x the read capacity — while all writes go to the single primary.
:::

MySQL replication setup (primary side):

\`\`\`sql
-- In my.cnf (primary server):
\`\`\`

[mysqld] server-id = 1 -- unique server ID log_bin = mysql-bin -- enable binary logging binlog_format = ROW -- log actual row changes (most reliable)

\`\`\`sql
-- Create replication user:
CREATE USER 'replicator'@'%' IDENTIFIED BY 'ReplPass123!';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
-- Get primary status (note File and Position):
SHOW MASTER STATUS;
\`\`\`

Replica configuration:

\`\`\`sql
-- In my.cnf (replica server):
\`\`\`

[mysqld] server-id = 2 -- different ID from primary

\`\`\`sql
-- Configure replica to follow primary:
\`\`\`

CHANGE MASTER TO MASTER_HOST = '192.168.1.100', MASTER_USER = 'replicator', MASTER_PASSWORD = 'ReplPass123!', MASTER_LOG_FILE = 'mysql-bin.000001', MASTER_LOG_POS = 154; START SLAVE;

\`\`\`sql
SHOW SLAVE STATUS\\G -- check Seconds_Behind_Master
\`\`\`


## 2. Replication Topologies

Primary-Replica (Master-Slave) is the most common setup: one primary accepts writes, multiple replicas handle reads. Primary-Primary (Multi-Master) allows writes on two servers simultaneously — complex to manage due to conflict resolution. Cascading replication chains replicas: primary → replica1 → replica2 (replica1 acts as both replica and primary). Topologies overview:
PRIMARY-REPLICA (most common):
[Primary] ──→ [Replica1] (read traffic) ──→ [Replica2] (read traffic) ──→ [Replica3] (backup/reporting) PRIMARY-PRIMARY:
[Primary1] ←──→ [Primary2] (both accept writes — conflict risk) CASCADING:
[Primary] → [Replica1] → [Replica2] → [Replica3]

## 3. PostgreSQL Streaming Replication

PostgreSQL uses streaming replication where the replica receives a continuous stream of WAL (Write-Ahead Log) records from the primary. It supports synchronous (primary waits for replica to confirm before committing) and asynchronous (primary doesn't wait — faster but tiny data loss risk on failover) modes. PostgreSQL streaming replication config:

\`\`\`sql
-- postgresql.conf (primary):
wal_level = replica
max_wal_senders = 5
wal_keep_size = 1GB
-- pg_hba.conf (primary — allow replica to connect):
\`\`\`

host replication replicator 192.168.1.200/32 md5

\`\`\`sql
-- Start replica (base backup then follow primary):
pg_basebackup -h 192.168.1.100 -U replicator -D /var/lib/postgresql/data -P --wal-
method=stream
-- recovery.conf (replica — PostgreSQL < 12):
standby_mode = 'on'
primary_conninfo = 'host=192.168.1.100 user=replicator'
\`\`\`


## 4. Monitoring Replication Lag

Replication lag is the delay between a write on the primary and it appearing on the replica. High lag means stale reads on replicas. Monitoring lag is critical — if a replica falls too far behind, it may not be useful as a failover target. Applications that read from replicas must tolerate some lag. Monitor replication lag:

\`\`\`sql
-- MySQL — check replica lag:
SHOW SLAVE STATUS\\G
-- Key: Seconds_Behind_Master: 0 = in sync, >5 = concern, >60 = problem
-- PostgreSQL — check lag from primary:
SELECT
\`\`\`

client_addr, state, sent_lsn, replay_lsn, (sent_lsn - replay_lsn) AS lag_bytes
FROM pg_stat_replication;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Set up MySQL primary-replica replication between two local MySQL instances (use Docker or VMs). Verify by inserting on primary and reading from replica. | Hard | Practical |
| 2 | Write a monitoring script or query that checks replication lag and alerts if Seconds_Behind_Master exceeds 30 seconds. | Medium | Practical |
| 3 | Explain a real-world scenario (e.g., e-commerce) where you would use: (1) primary-replica for reads, (2) a dedicated replica for reporting, (3) a replica for backup. Write an architecture document. | Medium | Written |
| 4 | Research: What is GTID (Global Transaction ID) replication in MySQL? How does it differ from binlog position-based replication? What problem does it solve? | Hard | Research |
| 5 | Research: How does automatic failover work with MySQL InnoDB Cluster or PostgreSQL Patroni? What happens when the primary goes down? | Hard | Research |
`,

  38: `# Sharding

Sharding is a database architecture pattern that horizontally partitions data across multiple independent database servers (shards). Unlike replication (which copies the same data to multiple servers), sharding splits the data — each shard holds a unique subset. Sharding is used by the world's largest applications — Facebook, Twitter, Uber — to scale beyond what a single database server can handle.

## 1. Vertical vs Horizontal Scaling

Vertical scaling adds more CPU/RAM/disk to one server — has a physical ceiling. Horizontal scaling (sharding) adds more servers, each holding a portion of the data — theoretically unlimited. Sharding is a horizontal scaling strategy for write-heavy workloads that exceed what a single server can handle.

:::scenario
WhatsApp delivers 100 billion messages per day. No single database server can store or process that volume. Messages are sharded by user_id — User #1-10M is on Shard 1, User #10M-20M is on Shard 2, etc. Each shard is an independent MySQL or Cassandra cluster.
:::

Comparison:
VERTICAL SCALING (Scale Up):
One server: 32 cores → 64 cores → 128 cores Limit: Most powerful server today ≈ 224 cores, 24TB RAM Cost: Exponentially expensive at top end HORIZONTAL SCALING (Sharding):
10 commodity servers → 100 servers → 1000 servers Limit: Practically unlimited Cost: Linear scaling with commodity hardware

## 2. Sharding Strategies

Range sharding assigns rows based on value ranges (user_id 1-1M to shard 1, 1M-2M to shard 2). Hash sharding applies a hash function to a key and uses the modulus to determine the shard — distributes evenly. Directory sharding uses a lookup table mapping each key to its shard — most flexible but the lookup table becomes a bottleneck. Sharding strategies:

\`\`\`sql
-- Range sharding:
\`\`\`

Shard 1: user_id 1 to 1,000,000 Shard 2: user_id 1,000,001 to 2,000,000 Pro: Range queries efficient Con: Uneven data if users are not uniform

\`\`\`sql
-- Hash sharding:
shard_id = hash(user_id) % num_shards
user_id=12345: hash(12345)%4 = 2 → Shard 2
\`\`\`

Pro: Even distribution Con: Range queries require all shards

\`\`\`sql
-- Directory/lookup sharding:
\`\`\`

shard_map: {user_id → shard_id} stored in a central lookup table Pro: Flexible, can rebalance Con: Lookup table is a single point of failure

## 3. Sharding Challenges

Sharding introduces significant complexity. Cross-shard joins are impossible — data from two shards cannot be joined in a single SQL query. Cross-shard transactions require distributed transaction protocols. Resharding (adding more shards when data grows) requires migrating large amounts of data. Schema changes must be applied to every shard individually. Application-level sharding logic:

\`\`\`sql
-- Application determines shard for a given user_id:
\`\`\`

function getShardConnection(user_id):
shard_id = user_id % NUM_SHARDS

\`\`\`sql
return db_connections[shard_id]
-- Insert to correct shard:
conn = getShardConnection(user_id=12345)
\`\`\`

conn.execute('INSERT INTO messages (user_id, content) VALUES (12345, ...)')

\`\`\`sql
-- Cross-shard query (requires scatter-gather):
-- Send query to ALL shards, collect and merge results in application
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Design a sharding strategy for a messaging app with 500 million users. Choose a shard key, sharding method, and number of shards. Justify your choices. | Medium | Design |
| 2 | Simulate application-level sharding: create 4 MySQL databases (shard_0 to shard_3). Write a Python/Node script that routes inserts and selects to the correct shard based on user_id % 4. | Hard | Practical |
| 3 | Explain the 'hot shard' problem in range sharding with a real-world example. How would you detect and fix it? | Medium | Written |
| 4 | Compare sharding vs table partitioning. List 5 differences. When would you use sharding vs when would partitioning be sufficient? | Medium | Written |
| 5 | Research: How does YouTube or Instagram shard their databases? Find public engineering blog posts documenting their database architecture. | Hard | Research |
`,

  39: `# Concurrency & Locking

In a production database, hundreds or thousands of transactions run simultaneously. Concurrency control mechanisms — locks — prevent transactions from interfering with each other and corrupting data. Understanding locking, lock types, deadlocks, and optimistic vs pessimistic concurrency is essential for building reliable, high-performance database applications.

## 1. Types of Locks

Row-level locks lock individual rows — other rows in the same table remain accessible. Table-level locks lock the entire table — high contention. Shared locks (read locks) allow multiple transactions to read simultaneously. Exclusive locks (write locks) block all other access. InnoDB (MySQL's default engine) uses row-level locking — much better for concurrency than table-level.

:::scenario
An airline booking system: two users try to book the last seat simultaneously. Row-level exclusive locking ensures the first transaction to lock the seat row wins. The second transaction waits for the lock to release, then sees the seat is now taken and returns 'Sold Out' — no double-booking.
:::

Explicit locking in MySQL:

\`\`\`sql
-- Shared lock (other reads allowed, writes blocked):
SELECT * FROM seats WHERE flight_id = 101 AND seat = '12A'
LOCK IN SHARE MODE;
-- Exclusive lock (all other access blocked):
SELECT * FROM seats WHERE id = 55
FOR UPDATE;
-- PostgreSQL equivalent:
SELECT * FROM seats WHERE id = 55 FOR UPDATE;
\`\`\`


## 2. Deadlocks — Detection and Prevention

A deadlock occurs when two transactions each hold a lock the other needs, creating a circular wait. Neither can proceed. The database detects deadlocks automatically and kills one transaction (the 'victim') to break the cycle, returning an error to that transaction's application. Applications should retry on deadlock errors. Classic deadlock scenario:

\`\`\`sql
-- Transaction A (Session 1):
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- locks row 1
-- (now waits for row 2)
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- Transaction B (Session 2) -- runs at same time:
BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 2; -- locks row 2
-- (now waits for row 1)
UPDATE accounts SET balance = balance + 50 WHERE id = 1;
-- DEADLOCK: A waits for row 2 (held by B), B waits for row 1 (held by A)
\`\`\`

Deadlock prevention strategies:

\`\`\`sql
-- 1. Access rows in consistent order (always update id=1 before id=2):
\`\`\`

Always lock rows in ascending ID order:
lower_id first, then higher_id

\`\`\`sql
-- 2. Use shorter transactions (hold locks for less time)
-- 3. Use SELECT ... FOR UPDATE at start to grab all needed locks at once
-- Check deadlock info (MySQL):
SHOW ENGINE INNODB STATUS; -- shows last deadlock details
\`\`\`


## 3. Optimistic vs Pessimistic Locking

Pessimistic locking assumes conflicts are common — locks rows immediately when read (SELECT FOR
UPDATE). Optimistic locking assumes conflicts are rare — doesn't lock on read, but checks for changes before committing (using a version counter or timestamp). Optimistic locking is better for high-read, low-conflict scenarios; pessimistic for high-conflict scenarios. Pessimistic locking:

\`\`\`sql
-- Lock the row immediately on read:
BEGIN;
SELECT * FROM products WHERE id = 55 FOR UPDATE;
-- Now update safely -- no one else can change this row:
UPDATE products SET stock = stock - 1 WHERE id = 55;
COMMIT;
\`\`\`

Optimistic locking (version-based):

\`\`\`sql
-- Table has a 'version' column:
-- Read with version:
SELECT id, stock, version FROM products WHERE id = 55;
-- Returns: stock=10, version=7
-- Update only if version hasn't changed:
UPDATE products
SET stock = stock - 1, version = version + 1
WHERE id = 55 AND version = 7;
-- If 0 rows affected: another transaction changed it first -- retry!
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Simulate a deadlock using two terminal sessions. Run the classic Account A → Account B scenario in opposite orders simultaneously. Document the deadlock error message. | Medium | Practical |
| 2 | Implement optimistic locking for a product inventory system. Add a version column to the products table. Write an UPDATE that checks the version. Simulate a conflict. | Hard | Practical |
| 3 | Use SELECT ... FOR UPDATE to implement safe seat booking logic. Ensure two concurrent attempts to book the last seat result in exactly one success and one failure. | Hard | Practical |
| 4 | Run SHOW ENGINE INNODB STATUS after triggering a deadlock. Parse the output and explain what it tells you about which transactions were involved and what locks they held. | Medium | Practical |
| 5 | Design the locking strategy for a ticket booking system (like BookMyShow). When should you use pessimistic locking vs optimistic locking? Justify with scenarios. | Hard | Design |
`,

  40: `# Isolation Levels

Transaction isolation levels define how much a transaction is isolated from changes made by other concurrent transactions. There is a fundamental tradeoff between data consistency and performance — higher isolation = more data safety but more contention and lower throughput. SQL standard defines four isolation levels, each preventing different types of concurrency anomalies.

## 1. Concurrency Anomalies

Before understanding isolation levels, understand what problems they prevent: Dirty Read — reading uncommitted data from another transaction that may roll back. Non-Repeatable Read — reading the same row twice within a transaction and getting different values because another transaction committed a change in between. Phantom Read — re-running a range query and getting different rows because another transaction inserted/deleted rows. Concurrency anomaly examples:

\`\`\`sql
-- DIRTY READ:
\`\`\`

T1: UPDATE salary SET amount = 90000 WHERE id=1; (not committed) T2: SELECT amount FROM salary WHERE id=1; → reads 90000 (dirty!) T1: ROLLBACK; → 90000 was never real

\`\`\`sql
-- NON-REPEATABLE READ:
\`\`\`

T1: SELECT price FROM products WHERE id=55; → 500 T2: UPDATE products SET price=600 WHERE id=55; COMMIT; T1: SELECT price FROM products WHERE id=55; → 600 (changed!)

\`\`\`sql
-- PHANTOM READ:
\`\`\`

T1: SELECT COUNT(*) FROM orders WHERE date='2024-01-01'; → 100 T2: INSERT INTO orders (date,...) VALUES ('2024-01-01',...); COMMIT; T1: SELECT COUNT(*) FROM orders WHERE date='2024-01-01'; → 101 (phantom!)

## 2. The Four Isolation Levels

READ UNCOMMITTED allows dirty reads — the lowest isolation, highest performance. READ COMMITTED prevents dirty reads (only reads committed data) — PostgreSQL default. REPEATABLE READ prevents dirty reads AND non-repeatable reads — MySQL InnoDB default. SERIALIZABLE prevents all anomalies including phantom reads — highest isolation, lowest throughput.

:::scenario
A financial reporting system requires SERIALIZABLE isolation to ensure a multi-step balance calculation is consistent. An analytics dashboard is fine with READ COMMITTED since slight staleness in aggregate data is acceptable. A real-time bidding system uses READ COMMITTED for speed.
:::

Isolation levels comparison:
Level | Dirty | Non-Rep | Phantom | Performance ─────────────────────┼───────┼─────────┼─────────┼──────────── READ UNCOMMITTED | YES | YES | YES | Highest READ COMMITTED | No | YES | YES | High REPEATABLE READ | No | No | YES* | Medium SERIALIZABLE | No | No | No | Lowest
* MySQL InnoDB REPEATABLE READ also prevents phantoms (MVCC)
Setting isolation level:

\`\`\`sql
-- MySQL — set for current session:
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- MySQL — set for next transaction only:
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN; -- applies to this transaction
-- PostgreSQL:
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Check current level (MySQL):
SELECT @@transaction_isolation;
\`\`\`


## 3. MVCC — Multi-Version Concurrency Control

InnoDB (MySQL) and PostgreSQL use MVCC to implement isolation levels without heavy locking. Instead of locking rows for reads, MVCC keeps multiple versions of rows. Readers see a consistent snapshot of data as of their transaction start time, without blocking writers. Writers create new versions without overwriting old ones. This dramatically improves concurrent read/write performance. MVCC concept:

\`\`\`sql
-- Row versions stored internally:
\`\`\`

Row(id=1): [version1: salary=50000, ts=100] [version2: salary=60000, ts=200]

\`\`\`sql
-- T1 starts at ts=150, sees version1 (salary=50000)
-- T2 starts at ts=250, sees version2 (salary=60000)
-- Both transactions proceed without blocking each other
-- Old versions are eventually cleaned up by VACUUM (PostgreSQL) or purge (MySQL)
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Demonstrate a dirty read using READ UNCOMMITTED in two MySQL sessions. Show the uncommitted data read in session 2. Then roll back in session 1 to prove it was never real. | Medium | Practical |
| 2 | Demonstrate a non-repeatable read using READ COMMITTED. Show the same row returning different values within one transaction while another commits a change. | Medium | Practical |
| 3 | Set SERIALIZABLE isolation and run two concurrent transactions that would have conflicted. Document how MySQL or PostgreSQL serializes them. | Hard | Practical |
| 4 | Build a test scenario for an e-commerce checkout. Determine which isolation level is appropriate and justify the tradeoffs between safety and performance. | Medium | Written |
| 5 | Research: How does PostgreSQL's MVCC garbage collection (VACUUM) work? What is table bloat and how does it affect performance over time? | Hard | Research |
`,

  41: `# Advanced Window Functions

Building on intermediate window function knowledge, advanced window functions include NTILE for bucketing, CUME_DIST and PERCENT_RANK for distribution analysis, FIRST_VALUE/LAST_VALUE for boundary values, and window frame clauses (ROWS BETWEEN / RANGE BETWEEN) for precise control over which rows the function operates on. These are extensively used in data analytics and business intelligence.

## 1. NTILE — Dividing into Buckets

NTILE(n) divides rows into n roughly equal groups (buckets/tiles) and assigns each row a bucket number. Common use: quartile analysis (NTILE(4)), decile analysis (NTILE(10)), top 10% identification. When rows don't divide evenly, larger buckets come first.

:::scenario
A sales performance review divides all salespeople into quartiles by revenue: Q1 (top 25%), Q2 (next 25%), Q3 (next 25%), Q4 (bottom 25%). Salespeople in Q4 get extra training; Q1 gets bonuses. NTILE(4) over revenue handles this automatically.
:::

NTILE examples:

\`\`\`sql
-- Sales quartiles:
SELECT
\`\`\`

name, total_sales, NTILE(4) OVER(ORDER BY total_sales DESC) AS quartile
FROM salespeople;

\`\`\`sql
-- Label quartiles:
SELECT name, total_sales,
CASE NTILE(4) OVER(ORDER BY total_sales DESC)
WHEN 1 THEN 'Top 25%'
WHEN 2 THEN 'Upper-mid 25%'
WHEN 3 THEN 'Lower-mid 25%'
WHEN 4 THEN 'Bottom 25%'
END AS performance_tier
FROM salespeople;
\`\`\`


## 2. CUME_DIST and PERCENT_RANK

CUME_DIST (cumulative distribution) returns the proportion of rows with values <= current row's value — ranges from 0 to 1. PERCENT_RANK returns the relative rank as a percentage — (rank - 1) / (total rows - 1). Both help understand data distribution and identify outliers. CUME_DIST and PERCENT_RANK:
SELECT name, salary, ROUND(CUME_DIST() OVER(ORDER BY salary) * 100, 1) AS percentile, ROUND(PERCENT_RANK() OVER(ORDER BY salary) * 100, 1) AS percent_rank
FROM employees
ORDER BY salary;

\`\`\`sql
-- Employee with CUME_DIST=0.85 earns more than 85% of colleagues
-- PERCENT_RANK=0.75 means 75% of other employees earn less
\`\`\`


## 3. Window Frame Clauses — ROWS BETWEEN

The frame clause (ROWS BETWEEN or RANGE BETWEEN) specifies which rows within the partition are included in the window function's calculation relative to the current row. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW gives running totals. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW gives 3-row moving average.

:::scenario
A financial analyst needs a 7-day moving average of stock prices to smooth out daily volatility. ROWS BETWEEN 6 PRECEDING AND CURRENT ROW gives exactly a 7-day window: current day + 6 previous days. This is impossible to express with GROUP BY — only window frames achieve it.
:::

Frame clause examples:

\`\`\`sql
-- Running total (default frame):
\`\`\`

SUM(amount) OVER(ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

\`\`\`sql
-- 7-day moving average:
\`\`\`

AVG(close_price) OVER(
ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW ) AS moving_avg_7day

\`\`\`sql
-- 3-row moving sum (current + 1 before + 1 after):
\`\`\`

SUM(sales) OVER(
ORDER BY week ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING ) AS rolling_3week Complete moving average query:
SELECT trade_date, close_price, AVG(close_price) OVER(
ORDER BY trade_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW ) AS ma_7day, AVG(close_price) OVER(
ORDER BY trade_date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW ) AS ma_30day
FROM stock_prices
WHERE symbol = 'INFY'
ORDER BY trade_date;

## 4. FIRST_VALUE, LAST_VALUE, NTH_VALUE

FIRST_VALUE returns the first value in the window frame. LAST_VALUE returns the last value. NTH_VALUE returns the nth value. These are used for comparison — showing each row alongside the best/worst value in its group. FIRST_VALUE and LAST_VALUE:
SELECT name, department, salary, FIRST_VALUE(salary) OVER( PARTITION BY department ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING ) AS dept_max_salary, LAST_VALUE(salary) OVER( PARTITION BY department ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING ) AS dept_min_salary, salary - LAST_VALUE(salary) OVER( PARTITION BY department ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING ) AS above_min
FROM employees;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Segment all employees into performance deciles (NTILE(10)) by salary. Show name, salary, and decile. Label decile 1 as 'Top 10%' and decile 10 as 'Bottom 10%'. | Easy | Query Writing |
| 2 | Write a query showing each employee's salary percentile (CUME_DIST) within their department. Format as 'Top X%' where X = 100 * (1 - CUME_DIST). | Medium | Query Writing |
| 3 | Calculate a 30-day moving average of daily orders and a 7-day moving average. Show both alongside actual daily counts for trend analysis. | Medium | Query Writing |
| 4 | Build a sales comparison report showing each salesperson's monthly sales alongside the best monthly sales in their region (FIRST_VALUE) and their difference from the top. | Medium | Query Writing |
| 5 | Write a stock analysis query: for each day, show: price, 7-day MA, 30-day MA, and a 'Signal' (CASE: 'Buy' when 7-day MA crosses above 30-day MA, 'Sell' when it crosses below). | Hard | Query Writing |
`,

  42: `# JSON Support

Modern databases support storing and querying JSON (JavaScript Object Notation) data natively. This bridges the gap between relational and document-oriented databases. PostgreSQL's JSONB type is particularly powerful — it stores JSON in binary format, supports GIN indexing, and enables complex JSON queries. MySQL has supported JSON since version 5.7.

## 1. JSON vs JSONB in PostgreSQL

JSON stores data as text (preserves whitespace, key order). JSONB stores data in binary format (deduplicated keys, no whitespace, no order guaranteed). JSONB is almost always preferred: it is faster to query, supports indexing (GIN), and uses the same storage as a pre-parsed object. Use JSON only if you need exact input preservation.

:::scenario
An e-commerce platform stores product attributes as JSON — different product categories have different attributes (phones have RAM/storage, clothing has size/material). Using JSONB allows a single 'attributes' column to handle all categories without creating hundreds of nullable columns.
:::

Creating JSONB columns:

\`\`\`sql
CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL,
category VARCHAR(50),
attributes JSONB -- flexible product-specific data
);
INSERT INTO products (name, category, attributes) VALUES
('iPhone 15', 'phones', '{"ram": "6GB", "storage": "256GB", "color": "black"}'),
('T-Shirt L', 'clothing', '{"size": "L", "material": "cotton", "color":
"white"}');
\`\`\`


## 2. Querying JSON in PostgreSQL

The -> operator returns a JSON value as JSON. The ->> operator returns as text. #> and #>> navigate nested paths. @> checks JSON containment. The ? operator checks key existence. These operators combined with regular WHERE clauses make JSON querying very expressive. JSON operators:

\`\`\`sql
-- Extract value as JSON:
SELECT attributes -> 'ram' FROM products WHERE category = 'phones';
-- Returns: "6GB" (JSON string)
-- Extract value as text:
SELECT attributes ->> 'ram' FROM products WHERE category = 'phones';
-- Returns: 6GB (plain text)
-- Filter by JSON value:
SELECT name FROM products WHERE attributes ->> 'color' = 'black';
-- Nested JSON navigation:
-- attributes = {"specs": {"display": {"size": "6.1 inch"}}}
SELECT attributes #>> '{specs,display,size}' FROM products;
-- Check if key exists:
SELECT * FROM products WHERE attributes ? 'ram';
-- Containment check:
SELECT * FROM products WHERE attributes @> '{"color": "black"}'::jsonb;
\`\`\`


## 3. JSON Indexing with GIN

JSONB supports GIN (Generalized Inverted Index) indexing — this makes containment (@>) and key existence (?) queries extremely fast even on tables with millions of rows. Without a GIN index, every JSON query does a full table scan. GIN index on JSONB:

\`\`\`sql
-- Full GIN index (supports @>, ?, ?|, ?&):
CREATE INDEX idx_product_attrs ON products USING GIN(attributes);
-- Now this query uses the index:
SELECT name FROM products WHERE attributes @> '{"color": "black"}';
-- Partial GIN index on specific path:
CREATE INDEX idx_product_color ON products USING GIN((attributes -> 'color'));
-- Extract and index a specific JSON field as a regular index:
CREATE INDEX idx_phone_ram ON products ((attributes ->> 'ram'))
WHERE category = 'phones';
\`\`\`


## 4. JSON Functions — Building and Transforming

Both MySQL and PostgreSQL provide functions to build JSON from relational data (JSON_OBJECT, JSON_ARRAY, json_build_object) and to expand JSON arrays into rows (JSON_TABLE in MySQL, jsonb_array_elements in PostgreSQL). This enables powerful ETL and reporting operations. PostgreSQL — build JSON from query:

\`\`\`sql
-- Build JSON object per row:
SELECT json_build_object('id', id, 'name', name, 'salary', salary)
FROM employees;
-- Aggregate all employees as JSON array:
SELECT json_agg(json_build_object('name', name, 'dept', department))
FROM employees
GROUP BY department;
Expand JSON array into rows:
-- Table: orders with items JSON array
-- {"items": [{"sku":"A1","qty":2},{"sku":"B2","qty":1}]}
SELECT
\`\`\`

o.id AS order_id, item ->> 'sku' AS sku, item ->> 'qty' AS qty
FROM orders o, jsonb_array_elements(o.items -> 'items') AS item;

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a 'user_preferences' table with a JSONB column. Store at least 5 users with different preference structures. Query users who prefer dark mode. | Easy | Practical |
| 2 | Create a products table with JSONB attributes. Add a GIN index. Compare EXPLAIN output for a containment query before and after the GIN index. | Medium | Practical |
| 3 | Write a query to expand order line items stored as a JSONB array into individual rows, joining with the products table to get product names and prices. | Hard | Query Writing |
| 4 | Build an aggregation report: for each product category, use json_agg to return all product names in that category as a JSON array in a single column. | Medium | Query Writing |
| 5 | Research: When does storing data as JSONB hurt rather than help? List 5 anti-patterns and the relational alternative for each. | Hard | Written |
`,

  43: `# Full-Text Search

Full-text search enables natural language search within text columns — finding rows where a column contains a word or phrase, ranked by relevance. It is far more powerful than LIKE '%keyword%' which is slow and inflexible. MySQL uses MATCH...AGAINST with FULLTEXT indexes. PostgreSQL uses tsvector/tsquery with GIN indexes.

## 1. Why Full-Text Search vs LIKE

LIKE '%keyword%' cannot use a regular B-Tree index — it always does a full table scan. Full-text search pre-processes text into searchable tokens (stemming, stop words removal), builds an inverted index, and ranks results by relevance. It handles multi-word queries, typo tolerance (with extensions), and language-aware stemming (e.g., 'running' matches 'run'). LIKE vs full-text search:

\`\`\`sql
-- LIKE: slow, no ranking, no stemming:
SELECT * FROM articles WHERE content LIKE '%database optimization%';
-- Full table scan on 10M rows = slow
-- Full-text search (MySQL): fast, ranked:
SELECT *, MATCH(title, content) AGAINST('database optimization') AS score
FROM articles
WHERE MATCH(title, content) AGAINST('database optimization')
ORDER BY score DESC;
\`\`\`


## 2. MySQL FULLTEXT Search

MySQL supports FULLTEXT indexes on VARCHAR and TEXT columns. MATCH...AGAINST performs the search in natural language mode (default), boolean mode (supports +/- operators), or query expansion mode (broadens search). FULLTEXT indexes are created with CREATE FULLTEXT INDEX.

:::scenario
A job portal needs to search job descriptions for keywords. MATCH(description) AGAINST('+python +django -java' IN BOOLEAN MODE) finds jobs requiring Python AND Django but NOT Java — impossible to express efficiently with LIKE.
:::

MySQL FULLTEXT index and search:

\`\`\`sql
-- Create FULLTEXT index:
CREATE FULLTEXT INDEX ft_articles ON articles(title, content);
-- Natural language mode (relevance ranked):
SELECT title, MATCH(title,content) AGAINST('machine learning') AS relevance
FROM articles
WHERE MATCH(title,content) AGAINST('machine learning')
ORDER BY relevance DESC
LIMIT 10;
-- Boolean mode (support operators):
SELECT title FROM articles
WHERE MATCH(title,content)
AGAINST('+python +machine learning -java' IN BOOLEAN MODE);
\`\`\`


## 3. PostgreSQL Full-Text Search

PostgreSQL uses tsvector (text search vector — a pre-processed, tokenized document) and tsquery (a search query with operators). The @@ operator matches a tsvector against a tsquery. to_tsvector() converts text to searchable form; to_tsquery() parses a search expression. GIN indexes on tsvectors enable fast search. PostgreSQL full-text search:

\`\`\`sql
-- Convert text to tsvector (tokenized):
SELECT to_tsvector('english', 'The quick brown fox jumps over the lazy dog');
-- Returns: 'brown':3 'dog':9 'fox':4 'jump':5 'lazi':8 'quick':2
-- Search query:
SELECT title FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'database &
optimization');
-- With ranking:
SELECT title,
ts_rank(to_tsvector('english', content), to_tsquery('database')) AS rank
FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('database')
ORDER BY rank DESC LIMIT 10;
\`\`\`

Add tsvector column + GIN index for performance:

\`\`\`sql
-- Add stored tsvector column:
ALTER TABLE articles ADD COLUMN ts_content TSVECTOR;
UPDATE articles SET ts_content = to_tsvector('english', title || ' ' || content);
-- Create GIN index:
CREATE INDEX idx_ts_content ON articles USING GIN(ts_content);
-- Trigger to auto-update tsvector on insert/update:
CREATE TRIGGER tsvector_update BEFORE INSERT OR UPDATE ON articles
\`\`\`

FOR EACH ROW EXECUTE FUNCTION tsvector_update_trigger(ts_content, 'pg_catalog.english', title, content);

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a FULLTEXT index on an articles table. Run natural language searches for 3 different terms. Show relevance scores. | Easy | Practical |
| 2 | Use MySQL FULLTEXT boolean mode to search for articles that must contain 'SQL' and 'performance' but exclude 'NoSQL'. Show 10 results. | Medium | Query Writing |
| 3 | In PostgreSQL, add a tsvector column to a blog_posts table. Add a GIN index and a trigger to auto-update. Verify search performance with EXPLAIN. | Hard | Practical |
| 4 | Build a weighted full-text search (PostgreSQL): title matches should rank higher than body matches. Use setweight() to give title words weight A and body words weight B. | Hard | Query Writing |
| 5 | Compare full-text search vs LIKE pattern matching on a table with 1 million rows. Measure query time for each. Calculate and document the speedup factor. | Hard | Research |
`,

  44: `# Stored Procedures & PL/pgSQL (Advanced)

PL/pgSQL is PostgreSQL's procedural language for writing stored procedures and functions with full programming constructs. Advanced stored procedures handle exception management, complex cursor-based row-by-row processing, dynamic SQL generation, and recursive logic. This level covers patterns used in production systems: ETL pipelines, financial batch processing, and complex multi-step workflows.

## 1. Exception Handling

Production stored procedures must handle errors gracefully. In MySQL, handlers catch specific SQL states. In PostgreSQL's PL/pgSQL, EXCEPTION blocks catch errors, allowing procedures to log, retry, or fail gracefully without crashing the entire batch.

:::scenario
A financial batch procedure processes 10,000 transactions. Without exception handling, one bad transaction crashes the entire batch. With EXCEPTION handling, the procedure catches the error, logs it to an error_log table, marks the transaction as 'failed', and continues processing the remaining 9,999 transactions.
:::

MySQL — exception handler:

\`\`\`sql
DELIMITER //
CREATE PROCEDURE sp_batch_insert()
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
ROLLBACK;
INSERT INTO error_log (msg, logged_at)
VALUES ('Batch insert failed', NOW());
END;
START TRANSACTION;
INSERT INTO orders SELECT * FROM staging_orders;
COMMIT;
END //
DELIMITER ;
\`\`\`

PostgreSQL PL/pgSQL exception handling:

\`\`\`sql
CREATE OR REPLACE PROCEDURE sp_process_payment(p_order_id INT)
LANGUAGE plpgsql AS $$
DECLARE
v_amount DECIMAL(10,2);
v_errmsg TEXT;
BEGIN
SELECT amount INTO v_amount FROM orders WHERE id = p_order_id;
UPDATE accounts SET balance = balance - v_amount
WHERE order_id = p_order_id;
EXCEPTION
WHEN insufficient_privilege THEN
RAISE NOTICE 'Permission denied for order %', p_order_id;
WHEN OTHERS THEN
GET STACKED DIAGNOSTICS v_errmsg = MESSAGE_TEXT;
INSERT INTO payment_errors (order_id, error, occurred_at)
VALUES (p_order_id, v_errmsg, NOW());
RAISE; -- re-raise after logging
END;
$$;
\`\`\`


## 2. Cursors — Row-by-Row Processing

A cursor iterates over a result set one row at a time — necessary when each row requires individual, complex processing that cannot be expressed as a set-based operation. Cursors are slower than set-based operations and should only be used when set-based logic is impossible.

:::scenario
A bank's interest calculation: each account has a different interest rate, tier, balance history, and compounding rule. The calculation for each account is too complex for a single UPDATE — a cursor processes each account individually, computes the exact interest, and inserts a transaction record.
:::

PostgreSQL cursor example:

\`\`\`sql
CREATE OR REPLACE PROCEDURE sp_apply_interest()
LANGUAGE plpgsql AS $$
DECLARE
\`\`\`

cur_accounts CURSOR FOR

\`\`\`sql
SELECT id, balance, interest_rate FROM accounts WHERE type = 'savings';
v_id INT;
v_balance DECIMAL(12,2);
v_rate DECIMAL(5,4);
v_interest DECIMAL(12,2);
BEGIN
OPEN cur_accounts;
LOOP
FETCH cur_accounts INTO v_id, v_balance, v_rate;
EXIT WHEN NOT FOUND; -- no more rows
v_interest := v_balance * v_rate / 12;
UPDATE accounts SET balance = balance + v_interest WHERE id = v_id;
INSERT INTO interest_log (account_id, amount, applied_at)
VALUES (v_id, v_interest, NOW());
END LOOP;
CLOSE cur_accounts;
END;
$$;
\`\`\`


## 3. Dynamic SQL — EXECUTE

Dynamic SQL constructs and executes SQL statements as strings at runtime. This enables procedures that adapt based on parameters — building different queries based on input. Essential for meta-programming, generic utility procedures, and table-independent reporting tools. Dynamic SQL with EXECUTE:

\`\`\`sql
-- MySQL dynamic SQL:
DELIMITER //
CREATE PROCEDURE sp_query_table(IN tbl_name VARCHAR(100), IN col_name VARCHAR(100))
BEGIN
SET @sql = CONCAT('SELECT ', col_name, ' FROM ', tbl_name, ' LIMIT 10');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
END //
DELIMITER ;
-- PostgreSQL EXECUTE:
CREATE OR REPLACE FUNCTION fn_count_rows(tbl_name TEXT) RETURNS BIGINT AS $$
DECLARE
row_count BIGINT;
BEGIN
EXECUTE 'SELECT COUNT(*) FROM ' || quote_ident(tbl_name) INTO row_count;
RETURN row_count;
END;
$$ LANGUAGE plpgsql;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Write a MySQL stored procedure that processes orders with exception handling. If any order fails validation, log it to an error_log table and continue to the next order. | Medium | Practical |
| 2 | Write a PostgreSQL PL/pgSQL procedure using a cursor to calculate and apply monthly compound interest to all savings accounts. | Hard | Practical |
| 3 | Write a PostgreSQL function using dynamic SQL that accepts any table name and returns the count of rows, column count, and table size. | Hard | Practical |
| 4 | Implement a retry mechanism: write a procedure that attempts a payment operation up to 3 times with a 1-second wait between retries on deadlock error. | Hard | Practical |
| 5 | Convert a cursor-based salary update procedure to a set-based equivalent. Compare performance on 100,000 rows. Document why set-based is faster. | Hard | Research |
`,

  45: `# Materialized Views

A materialized view is like a regular view, but its results are physically stored on disk like a table. Instead of re-executing the underlying complex query every time, the materialized view returns pre-computed results instantly. They are essential for performance in data warehousing, reporting, and dashboards where complex aggregate queries run frequently on large datasets. Supported natively in PostgreSQL.

## 1. Creating Materialized Views


\`\`\`sql
CREATE MATERIALIZED VIEW stores the query result as physical data. The first creation executes the
\`\`\`

query and stores results. Subsequent reads are instant — they hit the stored data, not the source tables. The tradeoff: data may be stale until refreshed.

:::scenario
A BI dashboard shows 'Daily Sales Summary by Region' — a query that JOINs 8 tables and processes 50 million rows, taking 45 seconds. Wrapped in a materialized view and refreshed nightly, the dashboard loads in 50 milliseconds from the pre-computed summary.
:::


\`\`\`sql
Create materialized view:
CREATE MATERIALIZED VIEW mv_sales_summary AS
SELECT
\`\`\`

DATE_TRUNC('month', o.order_date) AS month, c.region, p.category, COUNT(o.id) AS order_count, SUM(o.amount) AS total_revenue, AVG(o.amount) AS avg_order_value
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
GROUP BY 1, 2, 3;

\`\`\`sql
-- Query the materialized view (instant):
SELECT * FROM mv_sales_summary WHERE region = 'South' ORDER BY month;
\`\`\`


## 2. Refreshing Materialized Views


\`\`\`sql
REFRESH MATERIALIZED VIEW re-executes the underlying query and updates the stored data.
\`\`\`

Without CONCURRENTLY, it locks the view during refresh (readers blocked). REFRESH CONCURRENTLY allows reads during refresh but requires a unique index on the view. Schedule refreshes using pg_cron, cron jobs, or triggers. Refresh strategies:

\`\`\`sql
-- Full refresh (blocks reads):
REFRESH MATERIALIZED VIEW mv_sales_summary;
-- Concurrent refresh (reads allowed during refresh):
-- Requires a UNIQUE index on the materialized view first:
CREATE UNIQUE INDEX ON mv_sales_summary(month, region, category);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_summary;
-- Automated refresh with pg_cron (refresh every night at 2 AM):
SELECT cron.schedule('refresh-mv', '0 2 * * *',
'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_sales_summary');
\`\`\`


## 3. Materialized Views vs Summary Tables

MySQL lacks native materialized views. The alternative is a summary table maintained by triggers or scheduled jobs. A trigger-based approach updates the summary table on every
INSERT/UPDATE/DELETE — always current but adds write overhead. A scheduled job refreshes the table periodically — slightly stale but no write overhead. MySQL summary table + trigger approach:

\`\`\`sql
-- Summary table:
CREATE TABLE daily_sales_summary (
sale_date DATE PRIMARY KEY,
order_count INT DEFAULT 0,
total_rev DECIMAL(12,2) DEFAULT 0
);
-- Trigger to maintain summary on new order:
DELIMITER //
CREATE TRIGGER trg_update_daily_summary
\`\`\`

AFTER INSERT ON orders FOR EACH ROW

\`\`\`sql
BEGIN
INSERT INTO daily_sales_summary (sale_date, order_count, total_rev)
VALUES (DATE(NEW.order_date), 1, NEW.amount)
ON DUPLICATE KEY UPDATE
order_count = order_count + 1,
total_rev = total_rev + NEW.amount;
END //
DELIMITER ;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a materialized view that pre-computes monthly revenue by product category from an orders table. Compare query time vs querying source tables directly. | Easy | Practical |
| 2 | Add a unique index to your materialized view. Implement REFRESH CONCURRENTLY. Verify reads are not blocked during refresh using two sessions. | Medium | Practical |
| 3 | In MySQL, build a summary table for daily website traffic stats. Create an AFTER INSERT trigger on a 'page_views' table to maintain the summary automatically. | Medium | Practical |
| 4 | Design a refresh strategy for a materialized view used by an executive dashboard. The source data updates every 15 minutes. Balance freshness vs refresh cost. | Medium | Design |
| 5 | Build a complete reporting architecture: 3 materialized views at different aggregation levels (daily, monthly, yearly) refreshed on a cascade schedule. | Hard | Design |
`,

  46: `# Connection Pooling

Every database connection requires server resources: memory, file descriptors, authentication overhead. Opening a new connection per request is expensive — it can take 20-100ms just to establish the connection. Connection pooling maintains a pool of pre-opened connections that are reused across requests, dramatically reducing latency and allowing databases to serve far more concurrent users.

## 1. Why Connection Pooling Matters

Without pooling, a web application with 1,000 concurrent users would try to open 1,000 database connections simultaneously. MySQL's default max_connections is 151 — the excess connections are rejected. With a connection pool of 20 connections shared across 1,000 users, requests queue briefly but succeed. The pool handles the mismatch between application concurrency and database capacity.

:::scenario
An e-commerce platform receives 5,000 requests per second during a sale. Each request needs a DB query. Without pooling: attempting 5,000 simultaneous connections crashes the database. With PgBouncer using 50 pooled connections: requests share the pool, average wait is 1ms, the database handles the load gracefully.
:::

Connection lifecycle without pooling:
Request → Open TCP connection → Authenticate → Execute query → Close connection Time: 20-100ms just for connection setup + auth Request → Borrow connection from pool → Execute query → Return to pool Time: <1ms for pool checkout (connection already open and authenticated)

## 2. PgBouncer — PostgreSQL Connection Pooler

PgBouncer is a lightweight connection pooler for PostgreSQL. It sits between the application and PostgreSQL, maintaining a pool of server connections and multiplexing client connections. Three pooling modes: Session pooling (connection held for entire session), Transaction pooling (connection returned after each transaction — most efficient), Statement pooling (returned after each statement). PgBouncer configuration (pgbouncer.ini):
[databases] mydb = host=127.0.0.1 port=5432 dbname=production [pgbouncer] listen_port = 6432 -- PgBouncer listens on this port listen_addr = * auth_type = md5 pool_mode = transaction -- most efficient mode max_client_conn = 1000 -- max client connections to PgBouncer default_pool_size = 25 -- connections to PostgreSQL per database min_pool_size = 5 reserve_pool_size = 5 server_idle_timeout = 600

\`\`\`sql
-- Application connects to port 6432 instead of 5432:
psql -h localhost -p 6432 -U myuser mydb
\`\`\`

Monitor PgBouncer:

\`\`\`sql
-- Connect to PgBouncer admin console:
psql -h localhost -p 6432 pgbouncer
-- Show pool stats:
SHOW POOLS;
-- cl_active: clients using a server connection
-- cl_waiting: clients waiting for a connection
-- sv_idle: idle server connections in pool
SHOW STATS; -- queries per second, bytes, wait times
\`\`\`


## 3. ProxySQL — MySQL Connection Pooler

ProxySQL is a high-performance proxy/pooler for MySQL that also enables read/write splitting (routing SELECTs to replicas, writes to primary), query routing based on rules, query rewriting, and connection multiplexing. It is the standard tool for production MySQL deployments. ProxySQL read/write splitting config:

\`\`\`sql
-- In ProxySQL admin interface:
-- Add MySQL servers:
INSERT INTO mysql_servers (hostgroup_id, hostname, port) VALUES
(1, 'primary-host', 3306), -- hostgroup 1 = write group
(2, 'replica1-host', 3306), -- hostgroup 2 = read group
(2, 'replica2-host', 3306);
-- Routing rules:
INSERT INTO mysql_query_rules (rule_id, match_pattern, destination_hostgroup)
VALUES
(1, '^SELECT', 2), -- SELECTs go to replicas (hostgroup 2)
(2, '.', 1); -- everything else to primary (hostgroup 1)
LOAD MYSQL SERVERS TO RUNTIME;
SAVE MYSQL SERVERS TO DISK;
\`\`\`


## 4. Application-Level Pooling

Most application frameworks include built-in connection pools. SQLAlchemy (Python), HikariCP (Java), node-postgres (Node.js) all manage connection pools. Key settings: pool size (max connections), connection timeout, idle timeout, max lifetime. These should be tuned based on your database's max_connections and expected concurrency. Python SQLAlchemy pool config:
from sqlalchemy import create_engine engine = create_engine( 'postgresql://user:pass@localhost/mydb', pool_size=10, # maintain 10 connections max_overflow=20, # allow up to 20 extra under load pool_timeout=30, # wait up to 30s for connection pool_recycle=3600, # recycle connections after 1 hour pool_pre_ping=True # test connection before use ) MySQL pool settings (my.cnf):
[mysqld] max_connections = 200 -- max simultaneous connections wait_timeout = 600 -- close idle connections after 10 min interactive_timeout = 600

## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Install PgBouncer. Configure it to pool connections to a test PostgreSQL database. Connect your application through PgBouncer port. Monitor SHOW POOLS output under load. | Hard | Practical |
| 2 | Simulate connection pool exhaustion: configure a small pool size (5) and send 50 concurrent requests. Observe what happens to requests that exceed pool size. | Medium | Practical |
| 3 | Configure SQLAlchemy or node-postgres connection pool with appropriate settings for a web app expecting 500 concurrent users and a DB with max_connections=100. | Medium | Design |
| 4 | Research: What is 'connection multiplexing' in PgBouncer transaction mode? How can 5 server connections handle 1000 client connections? | Medium | Research |
| 5 | Design a complete connection architecture for a high-traffic application: primary MySQL, 3 read replicas, ProxySQL for routing/pooling. Document the flow for a read request and a write request. | Hard | Design |
`,

  47: `# Backup & Recovery

Data loss is catastrophic and often irreversible. A robust backup and recovery strategy is not optional — it is a core responsibility of anyone managing a production database. This topic covers full backups, incremental backups, point-in-time recovery (PITR), hot vs cold backups, and backup verification — because a backup you have never tested may not work when you need it most.

## 1. Backup Types

Full backup captures the entire database. Incremental backup captures only changes since the last backup — faster and smaller. Differential backup captures changes since the last FULL backup. Logical backup exports SQL statements (portable, slow to restore). Physical backup copies data files directly (fast restore, version-specific). Hot backup occurs while database is running. Cold backup requires database shutdown. Backup strategy comparison:
FULL BACKUP: Complete snapshot of all data + Complete, simple to restore
- Large size, slow to create
INCREMENTAL: Only changes since last backup + Fast, small
- Restore requires: full + all incrementals in sequence
DIFFERENTIAL: Changes since last FULL backup + Restore requires only: full + latest differential
- Grows over time until next full backup
Typical strategy: Full backup weekly + daily incrementals

## 2. MySQL Backup Tools


\`\`\`bash
mysqldump creates logical SQL backups — portable, human-readable, easy to restore subsets. MySQL
\`\`\`

Enterprise Backup and Percona XtraBackup create physical hot backups — much faster to restore for large databases. Binary log backup enables point-in-time recovery.

:::scenario
A database gets corrupted at 3:47 PM on Tuesday. With weekly full backup + daily binary log backups, you can restore the full backup (Monday night) and then replay binary logs up to 3:46 PM on Tuesday — losing only 1 minute of data. This is Point-in-Time Recovery (PITR).
:::


\`\`\`bash
mysqldump backup and restore:
-- Full database backup:
mysqldump -u root -p --all-databases --single-transaction \\
--routines --triggers --events > full_backup_$(date +%Y%m%d).sql
-- Single database backup:
mysqldump -u root -p production_db > prod_backup_$(date +%Y%m%d).sql
-- Restore from backup:
mysql -u root -p production_db < prod_backup_20241120.sql
-- Enable binary log for PITR:
-- In my.cnf: log_bin = /var/log/mysql/mysql-bin.log
\`\`\`

Point-in-time recovery with binary log:

\`\`\`sql
-- Restore full backup first:
mysql -u root -p < full_backup_20241118.sql
-- Apply binary logs from Monday to Tuesday 3:46 PM:
\`\`\`

mysqlbinlog --start-datetime='2024-11-18 23:00:00' \\

\`\`\`sql
--stop-datetime='2024-11-19 15:46:00' \\
\`\`\`

/var/log/mysql/mysql-bin.* | mysql -u root -p

## 3. PostgreSQL Backup — pg_dump and WAL


\`\`\`bash
pg_dump creates logical backups. pg_basebackup creates physical backups for streaming replication
\`\`\`

setup or PITR. WAL (Write-Ahead Log) archiving captures all changes since the base backup, enabling point-in-time recovery. pg_restore restores custom-format pg_dump files with parallelism support. PostgreSQL backup commands:

\`\`\`sql
-- Logical backup (entire cluster):
\`\`\`

pg_dumpall -U postgres > full_cluster_backup.sql

\`\`\`sql
-- Single database, custom format (parallel restore):
pg_dump -U postgres -Fc -j 4 production_db > prod_$(date +%Y%m%d).dump
-- Restore custom format (parallel, faster):
pg_restore -U postgres -d production_db -j 4 prod_20241120.dump
-- Physical base backup for PITR:
pg_basebackup -U postgres -D /backups/base -Ft -z -P
-- postgresql.conf for WAL archiving:
archive_mode = on
archive_command = 'cp %p /archive/%f' -- copy WAL to archive dir
\`\`\`


## 4. Backup Verification and Testing

The most dangerous backup is one that has never been tested. Backup files can be corrupted. Database versions may have changed. Never assume a backup works — test it regularly on a staging server. A recovery test should verify: restore completes without errors, data is consistent, application works with restored data. Backup verification checklist:
Monthly backup test procedure:

## 1. Take latest backup


## 2. Restore to isolated staging environment


## 3. Run consistency checks:

MySQL: CHECK TABLE tablename; PostgreSQL: SELECT * FROM pg_catalog.pg_tables WHERE schemaname='public';

\`\`\`sql
VACUUM ANALYZE;
\`\`\`


## 4. Run application smoke tests against restored DB


## 5. Compare row counts with production


## 6. Document: restore time, data freshness, any issues


\`\`\`sql
-- MySQL table consistency check:
CHECK TABLE orders, customers, products;
-- PostgreSQL: check for corruption:
SELECT pg_check_catalog();
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Set up a complete backup script that runs mysqldump with -- single-transaction, compresses the output, and appends the date to the filename. Test it. | Easy | Practical |
| 2 | Enable MySQL binary logging. Make several data changes. Simulate data loss by dropping a table. Restore from backup + binary logs to recover the dropped data. | Hard | Practical |
| 3 | In PostgreSQL, configure WAL archiving. Take a base backup. Make changes. Restore the base backup and use WAL to recover to a specific point in time. | Hard | Practical |
| 4 | Design a comprehensive backup strategy for a production e-commerce database that must have: RPO (Recovery Point Objective) of 15 minutes and RTO (Recovery Time Objective) of 1 hour. | Hard | Design |
| 5 | Write and execute a backup verification procedure: restore to staging, compare row counts with production, run consistency checks, document the recovery time. | Hard | Practical |
`,

  48: `# Security & Hardening

Database security is multi-layered: preventing unauthorized access, protecting data in transit and at rest, defending against SQL injection, auditing who does what, and minimizing attack surface. A single security misconfiguration can expose millions of records. Security hardening is not a one-time task — it is an ongoing practice.

## 1. SSL/TLS Encrypted Connections

By default, database connections are unencrypted — anyone on the network can intercept credentials and data. SSL/TLS encrypts the connection between application and database. Critical for any database accessible over a network, especially in cloud environments.

:::scenario
An application connects to a cloud-hosted MySQL database. Without SSL, a man-in-the-middle attack on the network can capture the database password and all query results. With SSL enforced, all traffic is encrypted — captured packets are useless without the private key.
:::

MySQL SSL configuration:

\`\`\`sql
-- Require SSL for all connections (my.cnf):
\`\`\`

[mysqld] require_secure_transport = ON

\`\`\`sql
-- Create user that MUST use SSL:
CREATE USER 'secure_user'@'%' REQUIRE SSL;
-- Verify SSL is active in session:
SHOW STATUS LIKE 'Ssl_cipher';
-- Non-empty result = SSL active
\`\`\`

PostgreSQL SSL setup (postgresql.conf):
ssl = on ssl_cert_file = 'server.crt' ssl_key_file = 'server.key'

\`\`\`sql
-- pg_hba.conf — require SSL for external connections:
\`\`\`

hostssl all all 0.0.0.0/0 md5

\`\`\`sql
-- Application connection string with SSL:
\`\`\`

postgresql://user:pass@host/db?sslmode=require

## 2. SQL Injection Prevention

SQL injection is the most dangerous web application vulnerability — attackers inject malicious SQL via user input. Defense: always use parameterized queries (prepared statements) — never concatenate user input into SQL strings. Parameterized queries treat input as data, not code — the injected SQL is never executed. SQL injection — vulnerable code:

\`\`\`sql
-- DANGEROUS: string concatenation (vulnerable):
user_input = "'; DROP TABLE users; --"
query = "SELECT * FROM users WHERE name = '" + user_input + "'"
-- Executes: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
-- users table is DELETED!
\`\`\`

Parameterized queries (safe):

\`\`\`sql
-- Python with parameterized query:
\`\`\`

cursor.execute('SELECT * FROM users WHERE name = %s', (user_input,))

\`\`\`sql
-- user_input is passed as data, not code -- injection is impossible
-- Node.js with mysql2:
\`\`\`

connection.execute('SELECT * FROM users WHERE name = ?', [user_input])

\`\`\`sql
-- Java PreparedStatement:
PreparedStatement ps = conn.prepareStatement('SELECT * FROM users WHERE name = ?');
ps.setString(1, userInput);
\`\`\`


## 3. Role-Based Access Control (RBAC)

RBAC groups permissions into roles, then assigns roles to users. Instead of granting individual permissions to each user, grant permissions to roles (read_only, app_writer, analyst, admin) and assign users to roles. This is more manageable and less error-prone than per-user permission management. PostgreSQL RBAC:

\`\`\`sql
-- Create roles:
CREATE ROLE read_only;
CREATE ROLE app_writer;
CREATE ROLE analyst;
-- Grant permissions to roles:
GRANT SELECT ON ALL TABLES IN SCHEMA public TO read_only;
GRANT SELECT, INSERT, UPDATE ON orders, customers TO app_writer;
GRANT SELECT ON ALL TABLES IN SCHEMA reporting TO analyst;
-- Assign roles to users:
GRANT read_only TO alice;
GRANT app_writer TO backend_service;
GRANT analyst TO data_team;
\`\`\`


## 4. Database Hardening Checklist

Hardening reduces the attack surface. Key steps: remove anonymous users, remove test databases, change default ports, disable remote root login, enable audit logging, restrict bind-address, remove unused features, keep software updated. MySQL hardening steps:

\`\`\`sql
-- Run MySQL secure installation wizard:
\`\`\`

mysql_secure_installation

\`\`\`sql
-- Remove anonymous users:
DELETE FROM mysql.user WHERE User='';
-- Disable remote root login:
DELETE FROM mysql.user WHERE User='root' AND Host != 'localhost';
-- Bind to localhost only (my.cnf):
\`\`\`

bind-address = 127.0.0.1

\`\`\`sql
-- Enable general audit log (my.cnf):
general_log = ON
general_log_file = /var/log/mysql/general.log
FLUSH PRIVILEGES;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Enable SSL on a MySQL instance. Create a user that REQUIRES SSL. Verify that connections without SSL are rejected. | Hard | Practical |
| 2 | Demonstrate SQL injection on a vulnerable query string, then fix it with a parameterized query. Show both the attack working and then being prevented. | Medium | Practical |
| 3 | Run mysql_secure_installation and document every step. List all the security settings it configures and why each matters. | Easy | Practical |
| 4 | Design a complete RBAC model for a hospital database with 5 different user roles (receptionist, nurse, doctor, billing, DBA). Define exact permissions per role per table. | Medium | Design |
| 5 | Research OWASP's SQL Injection prevention cheat sheet. List the top 5 defense techniques with code examples in your preferred programming language. | Hard | Research |
`,

  49: `# PostgreSQL Extensions

PostgreSQL's extension system is one of its greatest strengths — it allows adding powerful new capabilities without modifying the core. Extensions are installable modules that add new data types, functions, operators, and index types. PostGIS adds world-class geospatial capabilities. pg_stat_statements identifies slow queries. uuid-ossp generates UUIDs. pgcrypto adds encryption functions.

## 1. Managing Extensions

Extensions are installed with CREATE EXTENSION. They must be available on the server (installed via OS package manager). Some require superuser privileges. List installed extensions with SELECT *
FROM pg_extension. Upgrade with ALTER EXTENSION ... UPDATE. Extension management:

\`\`\`sql
-- Install an extension:
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS postgis;
-- List all installed extensions:
SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE installed_version IS NOT NULL;
-- Remove an extension:
DROP EXTENSION IF EXISTS uuid-ossp;
\`\`\`


## 2. pg_stat_statements — Query Performance Analysis

pg_stat_statements is the most important extension for performance tuning. It tracks execution statistics for every SQL query: total time, calls, rows, mean time, I/O. This lets you identify the top N slowest queries by total time, mean time, or call frequency — the essential first step in performance optimization.

:::scenario
A DBA notices the database is slow but doesn't know which queries are the culprit. pg_stat_statements shows that one specific query runs 50,000 times per hour and has a mean execution time of 200ms — that one query is consuming 2.8 hours of CPU per hour. Optimizing it saves the database.
:::

pg_stat_statements queries:

\`\`\`sql
-- Enable in postgresql.conf:
shared_preload_libraries = 'pg_stat_statements'
\`\`\`

pg_stat_statements.track = all

\`\`\`sql
-- Create extension:
CREATE EXTENSION pg_stat_statements;
-- Top 10 slowest queries by total time:
SELECT
LEFT(query, 80) AS query_preview,
\`\`\`

calls, ROUND(total_exec_time::numeric, 2) AS total_ms, ROUND(mean_exec_time::numeric, 2) AS mean_ms, rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

\`\`\`sql
-- Reset statistics:
SELECT pg_stat_statements_reset();
\`\`\`


## 3. PostGIS — Geospatial Extension

PostGIS adds geospatial data types (geometry, geography) and hundreds of spatial functions to PostgreSQL. It enables storing and querying location data: find restaurants within 500m, calculate distances between cities, check if a point is inside a polygon. PostgreSQL + PostGIS is the gold standard for open-source geospatial databases.

:::scenario
A food delivery app (like Zomato) needs to find all restaurants within 5km of a user's location. PostGIS ST_DWithin query with a spatial index returns results in milliseconds from a table of 100,000 restaurants — far faster than calculating distances in application code.
:::

PostGIS geospatial queries:

\`\`\`sql
CREATE EXTENSION postgis;
-- Add location column to restaurants:
ALTER TABLE restaurants ADD COLUMN location GEOMETRY(POINT, 4326);
-- Insert a restaurant with lat/lon:
UPDATE restaurants SET location = ST_SetSRID(ST_MakePoint(78.4867, 17.3850), 4326)
WHERE id = 1; -- Hyderabad
-- Find restaurants within 5km of user (geography type, meters):
SELECT name, ST_Distance(location::geography,
\`\`\`

ST_SetSRID(ST_MakePoint(78.4744, 17.3753), 4326)::geography) AS dist_meters
FROM restaurants
WHERE ST_DWithin( location::geography, ST_SetSRID(ST_MakePoint(78.4744, 17.3753), 4326)::geography, 5000 -- 5000 meters = 5km )
ORDER BY dist_meters; Spatial index for performance:

\`\`\`sql
-- GiST index on geometry column (essential for spatial queries):
CREATE INDEX idx_restaurant_location ON restaurants USING GIST(location);
\`\`\`


## 4. pgcrypto and uuid-ossp

pgcrypto provides cryptographic functions: password hashing (crypt/gen_salt), symmetric encryption (pgp_sym_encrypt), and digest functions. uuid-ossp generates universally unique identifiers (UUIDs) for

\`\`\`sql
use as primary keys — avoids ID enumeration attacks and works well in distributed systems.
\`\`\`

pgcrypto — password hashing:

\`\`\`sql
CREATE EXTENSION pgcrypto;
-- Hash password with bcrypt:
INSERT INTO users (email, password_hash)
VALUES ('alice@gmail.com', crypt('userpassword', gen_salt('bf', 10)));
-- Verify password on login:
SELECT email FROM users
WHERE email = 'alice@gmail.com'
AND password_hash = crypt('userpassword', password_hash);
\`\`\`

uuid-ossp — UUID primary keys:

\`\`\`sql
CREATE EXTENSION uuid-ossp;
CREATE TABLE sessions (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
user_id INT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
-- UUID PKs: unguessable, distributed-safe, no sequence conflicts
INSERT INTO sessions (user_id) VALUES (101);
-- id: 'a3f9e2c1-7b4d-4e8f-a1b2-3c4d5e6f7a8b'
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Install pg_stat_statements. Run a mix of queries. Identify the top 5 queries by total execution time. Optimize at least one by adding an index. | Medium | Practical |
| 2 | Install PostGIS. Create a restaurants table with location column. Insert 20 restaurants with lat/lon around Hyderabad. Query: find all restaurants within 3km of HITEC City. | Hard | Practical |
| 3 | Use pgcrypto to implement secure password storage: hash on registration, verify on login. Write INSERT and SELECT queries. Verify that the plain password is never stored. | Medium | Practical |
| 4 | Switch a table from INT AUTO_INCREMENT primary key to UUID (uuid-ossp). Document the migration steps, tradeoffs in storage and index performance. | Medium | Practical |
| 5 | Research the top 5 PostgreSQL extensions used in production by major companies. For each, explain what problem it solves and a real use case. | Hard | Research |
`,

  50: `# Database Design Patterns

Database design patterns are proven solutions to recurring data modeling problems. Knowing these patterns helps you design databases that are scalable, maintainable, and correctly represent complex business domains. This topic covers star schema for analytics, EAV for flexible attributes, audit tables for change tracking, soft deletes, and temporal data patterns.

## 1. Star Schema — Data Warehouse Design

The star schema is the standard design for data warehouses and OLAP (Online Analytical Processing) systems. It has one central fact table (containing measurable events — sales, orders, transactions) surrounded by dimension tables (providing context — date, customer, product, location). Queries are simple JOIN-based aggregations. Optimized for read-heavy analytical queries, not write-heavy transactional systems.

:::scenario
Flipkart's analytics warehouse: fact_orders table records every order event. Dimensions: dim_customer, dim_product, dim_date, dim_location. A monthly sales by region report is a simple fact JOIN dimensions with GROUP BY — no complex sub-queries needed. The star structure makes business intelligence tools easy to use.
:::

Star schema implementation:

\`\`\`sql
-- Dimension tables:
CREATE TABLE dim_date (date_key INT PRIMARY KEY, full_date DATE,
day_of_week VARCHAR(10), month_name VARCHAR(15), quarter INT, year INT);
CREATE TABLE dim_customer (cust_key INT PRIMARY KEY, cust_id INT,
name VARCHAR(100), city VARCHAR(50), segment VARCHAR(30));
CREATE TABLE dim_product (prod_key INT PRIMARY KEY, product_id INT,
name VARCHAR(200), category VARCHAR(50), brand VARCHAR(50));
-- Fact table (references dimension keys):
CREATE TABLE fact_sales (
sale_id SERIAL PRIMARY KEY,
date_key INT REFERENCES dim_date(date_key),
cust_key INT REFERENCES dim_customer(cust_key),
prod_key INT REFERENCES dim_product(prod_key),
quantity INT,
unit_price DECIMAL(10,2),
total_amount DECIMAL(12,2)
);
-- Analytical query (simple even for complex reports):
SELECT d.month_name, c.segment, p.category, SUM(f.total_amount) AS revenue
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_customer c ON f.cust_key = c.cust_key
JOIN dim_product p ON f.prod_key = p.prod_key
WHERE d.year = 2024
GROUP BY 1, 2, 3 ORDER BY revenue DESC;
\`\`\`


## 2. EAV — Entity-Attribute-Value Pattern

EAV stores dynamic attributes as rows (entity_id, attribute_name, attribute_value) instead of columns. This allows adding new attributes without ALTER TABLE. However, EAV is widely criticized: queries are complex, no data type enforcement, poor performance for multi-attribute queries. Use only when attribute flexibility is truly required and the downsides are acceptable. EAV pattern:

\`\`\`sql
CREATE TABLE product_attributes (
product_id INT NOT NULL,
attr_name VARCHAR(100) NOT NULL,
attr_value VARCHAR(500),
PRIMARY KEY (product_id, attr_name)
);
INSERT INTO product_attributes VALUES
(1, 'ram', '8GB'),
(1, 'storage', '256GB'),
(1, 'color', 'black');
-- Querying EAV is awkward (pivot with multiple self-joins):
SELECT p.name,
\`\`\`

MAX(CASE WHEN pa.attr_name='ram' THEN pa.attr_value END) AS ram, MAX(CASE WHEN pa.attr_name='storage' THEN pa.attr_value END) AS storage
FROM products p JOIN product_attributes pa ON p.id = pa.product_id
GROUP BY p.name;

\`\`\`sql
-- Modern alternative: use JSONB column instead of EAV!
\`\`\`


## 3. Audit Tables and Soft Deletes

Audit tables record the history of every change to important data — who changed what, when, and what the old value was. Soft deletes mark records as deleted (is_deleted=TRUE, deleted_at=NOW()) instead of physically removing them — allowing recovery, audit trails, and historical analysis. Audit table pattern:

\`\`\`sql
CREATE TABLE employees_audit (
audit_id SERIAL PRIMARY KEY,
employee_id INT,
action VARCHAR(10), -- INSERT/UPDATE/DELETE
old_salary DECIMAL(10,2),
new_salary DECIMAL(10,2),
changed_by VARCHAR(100) DEFAULT current_user,
changed_at TIMESTAMP DEFAULT NOW()
);
-- Trigger to populate audit table:
CREATE OR REPLACE FUNCTION audit_employee_changes()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
IF TG_OP = 'UPDATE' AND OLD.salary != NEW.salary THEN
INSERT INTO employees_audit(employee_id, action, old_salary, new_salary)
VALUES (NEW.id, 'UPDATE', OLD.salary, NEW.salary);
ELSIF TG_OP = 'DELETE' THEN
INSERT INTO employees_audit(employee_id, action, old_salary)
VALUES (OLD.id, 'DELETE', OLD.salary);
END IF;
RETURN NEW;
END; $$;
\`\`\`

Soft delete pattern:

\`\`\`sql
ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;
-- Soft delete (mark, don't remove):
UPDATE users SET is_deleted = TRUE, deleted_at = NOW() WHERE id = 42;
-- Active records only (add to all queries):
SELECT * FROM users WHERE is_deleted = FALSE;
-- Use partial index for performance:
CREATE INDEX idx_active_users ON users(email) WHERE is_deleted = FALSE;
\`\`\`


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Design and implement a star schema for a retail analytics warehouse with at least 4 dimension tables. Write 3 analytical queries demonstrating its power. | Hard | Design |
| 2 | Implement soft delete on a customers table. Write the UPDATE to soft-delete, queries that exclude deleted records, and a recovery procedure to undelete. | Easy | Practical |
| 3 | Build a complete audit system for an employees table using PostgreSQL triggers. Record all salary changes, department transfers, and deletions with user and timestamp. | Medium | Practical |
| 4 | Implement EAV for a product catalog with heterogeneous attributes. Then refactor it using JSONB. Compare query complexity and performance. | Hard | Practical |
| 5 | Design a temporal database pattern: store full history of all record states (not just current). Implement using valid_from / valid_to columns and queries to see data 'as of' any past date. | Hard | Design |
`,

  51: `# Cloud Databases

Modern production databases increasingly run on managed cloud services rather than self-managed servers. Cloud databases handle infrastructure, patching, backups, failover, and scaling automatically — letting teams focus on applications rather than database operations. Understanding the major cloud database offerings, their tradeoffs, and when to use managed vs self-managed is essential knowledge for modern data engineering.

## 1. AWS RDS and Aurora

Amazon RDS (Relational Database Service) is a managed service supporting MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server. AWS handles: hardware provisioning, OS patching, database software updates, backups, failover, and monitoring. Aurora is AWS's cloud-native relational database — compatible with MySQL and PostgreSQL but with 3x MySQL performance and 5x PostgreSQL throughput, plus distributed storage.

:::scenario
A startup migrates from a self-managed MySQL server to RDS MySQL. They eliminate: 6 hours/week of DBA time for patching and backup management, 2 hours/year of downtime for maintenance windows. RDS Multi-AZ provides automatic failover in 60 seconds if the primary instance fails.
:::

Key RDS concepts:
RDS INSTANCE TYPES:
db.t3.micro -- development/testing (2 vCPU, 1GB RAM) db.r6g.large -- production (2 vCPU, 16GB RAM, memory-optimized) db.m6g.4xlarge -- high-performance (16 vCPU, 64GB RAM) KEY FEATURES:
Multi-AZ: Automatic failover to standby in 60 seconds Read Replicas: Up to 15 Aurora replicas, 5 RDS replicas Automated Backups: 1-35 day retention, PITR to any second Performance Insights: Visual query performance monitoring Enhanced Monitoring: 1-second OS-level metrics AURORA ADVANTAGES OVER RDS:
Storage: Auto-scales 10GB → 128TB Replication: <10ms replica lag vs seconds for RDS Failover: 30 seconds vs 60-120 seconds Aurora Serverless: Auto-scales compute, pay per use

## 2. Google Cloud SQL and Cloud Spanner

Cloud SQL is Google's managed MySQL and PostgreSQL service — similar to AWS RDS. Cloud Spanner is Google's globally distributed relational database — offers SQL semantics with horizontal scaling and global ACID transactions. Spanner is used by Google's own products at planetary scale. It's appropriate when you need both relational consistency AND global scale. Cloud services comparison:

| Service | Provider | Type | Use Case |
|---|---|---|---|
| RDS | AWS | Managed SQL | General purpose apps |
| Aurora | AWS | Cloud-native | High performance, scale |
| Cloud SQL | GCP | Managed SQL | General purpose apps |
| Cloud Spanner | GCP | Global SQL | Multi-region consistency |
| Azure Database | Azure | Managed SQL | Azure ecosystem apps |
| PlanetScale | 3rd party | MySQL-compat | Serverless, branching |
| Neon | 3rd party | PostgreSQL | Serverless, branching |
| Supabase | 3rd party | PostgreSQL | Open-source BaaS |

## 3. Managed vs Self-Managed — Decision Framework

Managed databases cost more per resource unit but save significant DBA time and reduce operational risk. Self-managed gives maximum control and lowest cost at scale but requires skilled DBAs and operational overhead. Most startups and mid-size companies should use managed databases. Large companies at scale often run both. Decision framework:
CHOOSE MANAGED (RDS/Cloud SQL) WHEN:
✓ Small-to-medium team without dedicated DBA ✓ Availability and failover must be automatic ✓ Want automated backups and PITR ✓ Need to scale quickly ✓ Cost of DBA time > cost premium of managed service CHOOSE SELF-MANAGED WHEN:
✓ Very large scale (1000s of servers) where cost matters ✓ Need custom configurations not supported by managed ✓ Regulatory requirement to control all infrastructure ✓ Have dedicated DBA team ✓ Need cutting-edge versions before managed supports them Migration to cloud database (checklist):
Pre-migration:

## 1. Audit schema and data types (cloud may differ slightly)


## 2. Identify unsupported features (e.g., some stored procs)


## 3. Estimate data size and migration time


## 4. Plan for minimal downtime strategy

Migration approaches:
A. Dump/restore (simple, has downtime) B. AWS DMS (Data Migration Service) for near-zero downtime C. Logical replication from on-prem to cloud then cutover Post-migration:

## 1. Validate row counts and data integrity


## 2. Performance test with production-like load


## 3. Monitor for 72 hours before decommissioning old DB


## Assignment Tasks

| # | Assignment Task | Difficulty | Type |
|---|---|---|---|
| 1 | Create a free-tier RDS MySQL or Cloud SQL PostgreSQL instance. Connect to it, create a database, and run a series of queries. Document the setup process. | Medium | Practical |
| 2 | Enable Performance Insights on your RDS instance. Run a mix of fast and slow queries. Use Performance Insights UI to identify the top SQL statements by load. | Medium | Practical |
| 3 | Design a migration plan for moving a 100GB MySQL database from an on-premises server to AWS RDS with less than 5 minutes downtime. Document each step. | Hard | Design |
| 4 | Compare the monthly cost of: (1) self-managed MySQL on EC2, (2) RDS MySQL, (3) Aurora MySQL for a medium workload (db.r6g.large equivalent). Use the AWS pricing calculator. | Medium | Research |
| 5 | Research: What is AWS Aurora Global Database? How does it enable multi-region reads and disaster recovery? What is the typical replication lag between regions? | Hard | Research |
`,

};

export default sqlContent;
