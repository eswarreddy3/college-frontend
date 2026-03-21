// SQL course — scenario-based lessons (indexed by lesson order, 1-based)
// Every lesson tells the story of building CareerEzi's database layer.
// Pattern mirrors the Python course: :::scenario, :::insight, :::tip, :::mistake, :::challenge

const sqlContent: Record<number, string> = {

  // ─────────────────────────────────────────────────────────────────────────
  // BASICS — Lessons 1–4
  // ─────────────────────────────────────────────────────────────────────────

  // ───────────────────────────────────────────────────────────────────────
  1: `:::scenario
Week 2. You survived Python basics. Now the CTO, Vikram, calls you into the server room.

"The heart of CareerEzi isn't the code — it's the data. Every student profile, every course, every leaderboard rank, every placement record — it all lives in MySQL." He pulls up a terminal. "You write the queries, the backend does the heavy lifting. Let's see what you've got."

He types one line:

\`\`\`sql
SELECT * FROM students;
\`\`\`

A table floods the screen. 4,200 students from 17 colleges. Your job is to make sense of all of it.
:::

# What is SQL?

SQL (Structured Query Language) is the language databases understand. While Python is how you *build* the app, SQL is how you *talk to the data* it stores.

Every action in CareerEzi eventually becomes a SQL query:
- Student logs in → \`SELECT * FROM users WHERE email = ?\`
- Leaderboard loads → \`SELECT name, points FROM users ORDER BY points DESC\`
- Admin checks stats → \`SELECT COUNT(*) FROM users WHERE college_id = ?\`

SQL is not a general-purpose language — it does one thing and does it exceptionally well: **query structured data**.

## Your First Table: students

Here's what CareerEzi's \`students\` table looks like:

| id | name | branch | cgpa | points | streak | placed |
|----|------|--------|------|--------|--------|--------|
| 1  | Arjun Sharma | CSE | 8.75 | 1250 | 7 | false |
| 2  | Priya Mehta | ECE | 9.10 | 980 | 5 | false |
| 3  | Kiran Rao | ME | 7.40 | 760 | 2 | true |
| 4  | Sneha Patel | CSE | 8.90 | 1100 | 6 | false |

Each **row** is one student. Each **column** is one attribute.

## SELECT — Read Data

\`SELECT\` is the most used SQL command. It reads data from a table:

\`\`\`sql
-- Get everything
SELECT * FROM students;

-- Get specific columns only
SELECT name, branch, points FROM students;

-- Give columns a friendly alias
SELECT name AS student_name,
       points AS total_points
FROM students;
\`\`\`

\`\`\`output
student_name   | total_points
---------------|-------------
Arjun Sharma   | 1250
Priya Mehta    | 980
Kiran Rao      | 760
Sneha Patel    | 1100
\`\`\`

## The Order of SQL Clauses

Every SQL query is written in this fixed order:

\`\`\`
SELECT   ← what columns to show
FROM     ← which table
WHERE    ← filter rows (optional)
GROUP BY ← group rows (optional)
HAVING   ← filter groups (optional)
ORDER BY ← sort results (optional)
LIMIT    ← limit rows returned (optional)
\`\`\`

You don't need all clauses — but the ones you use must be in this order.

:::insight
SQL was invented at IBM in the 1970s by Edgar F. Codd and Donald Chamberlin. It's been the standard for 50+ years because relational databases are incredibly good at storing structured data consistently. Every major tech company — Google, Amazon, Meta — still relies on SQL databases for critical data.
:::

:::tip
\`SELECT *\` is convenient for exploring, but in production code always name your columns explicitly: \`SELECT id, name, points\`. It's clearer, faster (less data transferred), and your query won't break if someone adds a new column to the table.
:::

:::mistake
\`\`\`sql
-- ❌ Common mistake: SQL keywords are case-insensitive but data is not
SELECT * FROM Students;   -- works (table names are usually case-insensitive)
WHERE name = 'arjun';     -- might not work if name is stored as 'Arjun'
\`\`\`
Always match the exact case of your stored data in WHERE conditions.
:::

:::challenge
**Mission 1: Your First CareerEzi Query**

Vikram asks you to pull a report: show only the \`name\`, \`branch\`, and \`cgpa\` columns for all students. Label \`cgpa\` as \`gpa\` in the output.

Write the query.

Expected output shape:
\`\`\`output
name          | branch | gpa
--------------|--------|-----
Arjun Sharma  | CSE    | 8.75
Priya Mehta   | ECE    | 9.10
Kiran Rao     | ME     | 7.40
Sneha Patel   | CSE    | 8.90
\`\`\`
:::`,

  // ───────────────────────────────────────────────────────────────────────
  2: `:::scenario
Day 3. Priya drops by your desk.

"We have a placement drive next week. Infosys wants only CSE and ECE students with a CGPA above 7.5. Can you pull that list from the database?"

You open the terminal. SELECT gets all rows — but you need to filter. Time to learn WHERE.
:::

# Filtering with WHERE

\`WHERE\` lets you pick only the rows you need. Without it, queries return everything.

\`\`\`sql
-- Only CSE students
SELECT name, branch, cgpa
FROM students
WHERE branch = 'CSE';
\`\`\`

\`\`\`output
name          | branch | cgpa
--------------|--------|-----
Arjun Sharma  | CSE    | 8.75
Sneha Patel   | CSE    | 8.90
\`\`\`

## Comparison Operators

\`\`\`sql
WHERE cgpa > 8.0          -- greater than
WHERE cgpa >= 7.5         -- greater than or equal
WHERE points < 1000       -- less than
WHERE points <= 1000      -- less than or equal
WHERE branch = 'CSE'      -- equal
WHERE branch != 'ME'      -- not equal (also: <>)
\`\`\`

## AND / OR / NOT

Combine multiple conditions:

\`\`\`sql
-- CSE students with CGPA above 7.5 (Infosys drive)
SELECT name, branch, cgpa
FROM students
WHERE branch = 'CSE'
  AND cgpa >= 7.5;

-- CSE or ECE students
SELECT name, branch
FROM students
WHERE branch = 'CSE'
   OR branch = 'ECE';

-- Everyone except ME branch
SELECT name, branch
FROM students
WHERE NOT branch = 'ME';
\`\`\`

:::tip
Use parentheses when mixing AND and OR — AND has higher precedence than OR:

\`\`\`sql
-- ❌ Ambiguous — means: CSE, OR (ECE with cgpa > 8)
WHERE branch = 'CSE' OR branch = 'ECE' AND cgpa > 8

-- ✅ Clear
WHERE (branch = 'CSE' OR branch = 'ECE') AND cgpa > 8
\`\`\`
:::

## BETWEEN — Range Check

\`\`\`sql
-- Students with CGPA between 7.5 and 9.0 (inclusive)
SELECT name, cgpa
FROM students
WHERE cgpa BETWEEN 7.5 AND 9.0;

-- Points in a range
WHERE points BETWEEN 800 AND 1200;
\`\`\`

## IN — Match a List

Instead of multiple ORs:

\`\`\`sql
-- ❌ Verbose
WHERE branch = 'CSE' OR branch = 'ECE' OR branch = 'IT'

-- ✅ Clean
WHERE branch IN ('CSE', 'ECE', 'IT')

-- Exclude from a list
WHERE branch NOT IN ('ME', 'CE', 'EEE')
\`\`\`

## LIKE — Pattern Matching

Match text patterns using wildcards:
- \`%\` = any sequence of characters (including none)
- \`_\` = exactly one character

\`\`\`sql
-- Emails from VIT
WHERE email LIKE '%@vit.ac.in'

-- Names starting with 'A'
WHERE name LIKE 'A%'

-- Names with exactly 5 characters
WHERE name LIKE '_____'

-- Contains "kumar" anywhere
WHERE name LIKE '%kumar%'
\`\`\`

## IS NULL / IS NOT NULL

NULL means "no value stored" — not zero, not empty string.

\`\`\`sql
-- Students who haven't set their LinkedIn
SELECT name FROM students
WHERE linkedin IS NULL;

-- Students with complete profiles
SELECT name FROM students
WHERE linkedin IS NOT NULL
  AND github IS NOT NULL;
\`\`\`

:::mistake
\`\`\`sql
-- ❌ This NEVER works — NULL is not equal to anything
WHERE linkedin = NULL

-- ✅ Always use IS NULL / IS NOT NULL
WHERE linkedin IS NULL
\`\`\`
NULL is not a value — it's the *absence* of a value. You can't compare it with = .
:::

:::insight
In CareerEzi's database, we never store empty strings ("") for optional fields — we store NULL. This distinction matters: \`COUNT(linkedin)\` counts only non-NULL values, while \`COUNT(*)\` counts all rows. An empty string \`""\` would be counted by both.
:::

:::challenge
**Mission 2: Placement Drive Filter**

Priya needs the list for Infosys. Pull all students where:
- Branch is CSE or ECE
- CGPA is 7.5 or above
- LinkedIn profile is filled in (not null)

Show their \`name\`, \`branch\`, \`cgpa\`, and \`linkedin\`.

Write the query.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  3: `:::scenario
The leaderboard feature is live — but students are complaining: "The order is wrong." You check the query Priya wrote last week:

\`\`\`sql
SELECT name, points FROM students;
\`\`\`

No sorting. The database returns rows in the order they were inserted, not by points. You need to fix it — and while you're at it, add pagination so it doesn't load 4,000 rows at once.
:::

# Sorting and Shaping Results

## ORDER BY — Sort Your Results

\`\`\`sql
-- Leaderboard: highest points first
SELECT name, points, streak
FROM students
ORDER BY points DESC;
\`\`\`

\`\`\`output
name          | points | streak
--------------|--------|-------
Arjun Sharma  | 1250   | 7
Sneha Patel   | 1100   | 6
Priya Mehta   | 980    | 5
Kiran Rao     | 760    | 2
\`\`\`

\`ASC\` (ascending, default) or \`DESC\` (descending):

\`\`\`sql
-- Alphabetical by name
ORDER BY name ASC

-- Sort by branch, then by points within each branch
ORDER BY branch ASC, points DESC
\`\`\`

## LIMIT — Control How Many Rows

\`\`\`sql
-- Top 3 students on the leaderboard
SELECT name, points
FROM students
ORDER BY points DESC
LIMIT 3;
\`\`\`

\`\`\`output
name          | points
--------------|-------
Arjun Sharma  | 1250
Sneha Patel   | 1100
Priya Mehta   | 980
\`\`\`

## OFFSET — Pagination

\`OFFSET\` skips rows. Combined with \`LIMIT\`, it implements pagination:

\`\`\`sql
-- Page 1: first 10 results (OFFSET 0)
SELECT name, points FROM students
ORDER BY points DESC
LIMIT 10 OFFSET 0;

-- Page 2: next 10 (skip first 10)
SELECT name, points FROM students
ORDER BY points DESC
LIMIT 10 OFFSET 10;

-- Page 3: skip first 20
LIMIT 10 OFFSET 20;
\`\`\`

**Formula:** \`OFFSET = (page_number - 1) × page_size\`

## DISTINCT — Remove Duplicates

Get unique values only:

\`\`\`sql
-- All unique branches
SELECT DISTINCT branch FROM students;
\`\`\`

\`\`\`output
branch
------
CSE
ECE
ME
\`\`\`

\`\`\`sql
-- Unique branch + placement status combinations
SELECT DISTINCT branch, placed FROM students;
\`\`\`

## Putting It Together: The Leaderboard Query

\`\`\`sql
-- College leaderboard: top 50 students, paginated
SELECT
    name,
    branch,
    points,
    streak
FROM students
WHERE college_id = 5            -- filter to this college
ORDER BY points DESC,           -- primary sort: points
         streak DESC            -- tiebreaker: streak
LIMIT 50 OFFSET 0;              -- page 1
\`\`\`

:::insight
Without \`ORDER BY\`, SQL databases make **no guarantee** about the order of results. The same query can return rows in different orders on different runs. If your feature depends on a specific order, always add \`ORDER BY\`. The leaderboard rendering in CareerEzi broke because someone assumed database insertion order = display order. It doesn't.
:::

:::tip
Always pair \`LIMIT\` with \`ORDER BY\`. A \`LIMIT 10\` without \`ORDER BY\` gives you 10 *arbitrary* rows — which could change with every query. Deterministic results require deterministic ordering.
:::

:::mistake
\`\`\`sql
-- ❌ Wrong page formula
LIMIT 10 OFFSET 10   -- this is page 2, not page 1

-- ✅ Correct formula: OFFSET = (page - 1) * limit
-- Page 1: LIMIT 10 OFFSET 0
-- Page 2: LIMIT 10 OFFSET 10
-- Page 3: LIMIT 10 OFFSET 20
\`\`\`
:::

:::challenge
**Mission 3: Fix the Leaderboard**

Fix the leaderboard query for college_id = 3. Requirements:
- Show \`name\`, \`branch\`, \`points\`, \`streak\`
- Top scorers first; break ties by streak (higher streak wins)
- Only 10 per page; this is page 2 (students 11–20)
- Exclude unplaced students (placed = false) from the leaderboard

Write the complete query.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  4: `:::scenario
Bug report in the issue tracker: "Student dashboard crashes for some users."

You trace it. The crash happens when the app tries to display a student's streak — but some students have NULL streak values because they registered before the streak feature was added.

\`\`\`
TypeError: Cannot read properties of null (reading 'toString')
\`\`\`

The fix isn't in Python. The fix is in SQL — handle NULL gracefully before it ever reaches the app.
:::

# NULL Handling and CASE

## NULL Recap

NULL means "unknown" or "not provided". It's not zero, not empty string, not false.

\`\`\`sql
-- Wrong: WHERE streak = NULL never matches anything
-- Right:
WHERE streak IS NULL
WHERE streak IS NOT NULL
\`\`\`

## COALESCE — Default Value for NULL

\`COALESCE(value, fallback)\` returns the first non-NULL argument:

\`\`\`sql
-- Replace NULL streak with 0
SELECT name, COALESCE(streak, 0) AS streak
FROM students;
\`\`\`

\`\`\`output
name          | streak
--------------|-------
Arjun Sharma  | 7
Priya Mehta   | 5
Kiran Rao     | 0    ← was NULL, now shows 0
Sneha Patel   | 6
\`\`\`

\`\`\`sql
-- Multiple fallbacks — returns first non-NULL
SELECT name,
       COALESCE(linkedin, github, 'No social links') AS social
FROM students;
\`\`\`

## NULLIF — Make a Value NULL

\`NULLIF(a, b)\` returns NULL if a equals b, otherwise returns a.

\`\`\`sql
-- Treat 0 points as NULL (for division safety)
SELECT name,
       points / NULLIF(lessons_completed, 0) AS points_per_lesson
FROM students;
-- Without NULLIF, dividing by 0 would crash the query
\`\`\`

## CASE — Conditional Logic in SQL

\`CASE\` is SQL's if/else. Use it to compute new values on the fly:

\`\`\`sql
-- Assign grade based on CGPA
SELECT name,
       cgpa,
       CASE
           WHEN cgpa >= 9.0 THEN 'A+'
           WHEN cgpa >= 8.0 THEN 'A'
           WHEN cgpa >= 7.0 THEN 'B'
           WHEN cgpa >= 6.0 THEN 'C'
           ELSE                  'F'
       END AS grade
FROM students;
\`\`\`

\`\`\`output
name          | cgpa | grade
--------------|------|------
Arjun Sharma  | 8.75 | A
Priya Mehta   | 9.10 | A+
Kiran Rao     | 7.40 | B
Sneha Patel   | 8.90 | A
\`\`\`

## CASE with Aggregates

\`\`\`sql
-- Count placed vs unplaced students per branch
SELECT
    branch,
    COUNT(*) AS total,
    SUM(CASE WHEN placed = 1 THEN 1 ELSE 0 END) AS placed_count,
    SUM(CASE WHEN placed = 0 THEN 1 ELSE 0 END) AS unplaced_count
FROM students
GROUP BY branch;
\`\`\`

## Real Fix: Dashboard Query

\`\`\`sql
-- Dashboard: safe, no NULLs reach the app
SELECT
    id,
    name,
    COALESCE(points, 0)           AS points,
    COALESCE(streak, 0)           AS streak,
    COALESCE(linkedin, '')        AS linkedin,
    COALESCE(github, '')          AS github,
    CASE
        WHEN cgpa >= 8.5 THEN 'High'
        WHEN cgpa >= 7.0 THEN 'Medium'
        ELSE 'Needs attention'
    END AS performance_tier
FROM students
WHERE id = 1001;
\`\`\`

:::insight
NULL propagates through arithmetic: \`NULL + 5 = NULL\`, \`NULL * 100 = NULL\`. This is why the dashboard crashed — the app received NULL for streak and tried to call methods on it. The database can silently give you NULLs; always handle them before they reach your application logic.
:::

:::tip
Use \`COALESCE\` in any query where the result goes to the frontend. It makes your queries "null-safe" — the app always gets a real value to work with, never NULL.
:::

:::mistake
\`\`\`sql
-- ❌ CASE without ELSE — returns NULL for unmatched rows
CASE WHEN cgpa >= 9.0 THEN 'A+' END

-- ✅ Always add ELSE as a safety net
CASE WHEN cgpa >= 9.0 THEN 'A+' ELSE 'Below A+' END
\`\`\`
:::

:::challenge
**Mission 4: Safe Dashboard Query**

Fix the student dashboard query for student id = 1042. Requirements:
- Replace NULL \`streak\` with 0
- Replace NULL \`linkedin\` and \`github\` with empty string
- Add a \`badge\` column: 'Gold' if points >= 1200, 'Silver' if >= 800, else 'Bronze'
- Show: \`name\`, \`points\`, \`streak\`, \`linkedin\`, \`github\`, \`badge\`

Write the query.
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMEDIATE — Lessons 5–8
  // ─────────────────────────────────────────────────────────────────────────

  // ───────────────────────────────────────────────────────────────────────
  5: `:::scenario
The college admin dashboard is blank. You built the student table view last week, but now the admin wants *statistics* — not individual rows.

"How many students are active this week? What's the average CGPA? Who has the highest streak?"

These aren't row-level answers. They need single numbers that summarize thousands of rows. Time for **aggregate functions**.
:::

# Aggregate Functions

Aggregate functions collapse many rows into a single value.

## COUNT

\`\`\`sql
-- Total students
SELECT COUNT(*) AS total_students FROM students;

-- Only count students with LinkedIn filled in
SELECT COUNT(linkedin) AS with_linkedin FROM students;
-- COUNT(column) skips NULLs; COUNT(*) counts every row
\`\`\`

\`\`\`output
total_students
--------------
4200
\`\`\`

\`\`\`sql
-- Count distinct branches
SELECT COUNT(DISTINCT branch) AS branch_count FROM students;
\`\`\`

## SUM, AVG, MAX, MIN

\`\`\`sql
-- Points statistics
SELECT
    SUM(points)           AS total_points_awarded,
    AVG(points)           AS average_points,
    MAX(points)           AS highest_points,
    MIN(points)           AS lowest_points
FROM students
WHERE college_id = 5;
\`\`\`

\`\`\`output
total_points_awarded | average_points | highest_points | lowest_points
---------------------|----------------|----------------|---------------
524800               | 892.4          | 1580           | 120
\`\`\`

## Combining with WHERE

WHERE filters *before* aggregation:

\`\`\`sql
-- Active students only (activity in last 7 days)
SELECT
    COUNT(*) AS active_students,
    AVG(points) AS avg_points
FROM students
WHERE last_active >= CURDATE() - INTERVAL 7 DAY;

-- Placement rate for CSE branch
SELECT
    COUNT(*) AS total,
    SUM(placed) AS placed_count,
    ROUND(100.0 * SUM(placed) / COUNT(*), 1) AS placement_rate_pct
FROM students
WHERE branch = 'CSE';
\`\`\`

\`\`\`output
total | placed_count | placement_rate_pct
------|--------------|-------------------
450   | 312          | 69.3
\`\`\`

## The Complete Admin Dashboard Query

\`\`\`sql
SELECT
    COUNT(*)                                    AS total_students,
    SUM(CASE WHEN last_active >= CURDATE() - INTERVAL 7 DAY
             THEN 1 ELSE 0 END)                 AS active_this_week,
    ROUND(AVG(streak), 1)                       AS avg_streak,
    ROUND(AVG(points), 0)                       AS avg_points,
    MAX(points)                                 AS top_score,
    SUM(placed)                                 AS total_placed,
    ROUND(100.0 * SUM(placed) / COUNT(*), 1)    AS placement_rate
FROM students
WHERE college_id = 5;
\`\`\`

:::insight
\`AVG\` ignores NULL values automatically. If 10 students have streak values and 5 have NULL, \`AVG(streak)\` divides by 10, not 15. This can skew your averages. To include NULL as 0, use \`AVG(COALESCE(streak, 0))\`.
:::

:::tip
Always use \`ROUND(AVG(...), 2)\` for display. Databases can return \`AVG(cgpa) = 8.749999999999998\` due to floating-point arithmetic. Round at the database level, not in the application.
:::

:::mistake
\`\`\`sql
-- ❌ You can't SELECT a normal column alongside an aggregate without GROUP BY
SELECT name, AVG(points) FROM students;
-- Error: 'name' must appear in GROUP BY or be an aggregate function

-- ✅ Either aggregate everything:
SELECT AVG(points) FROM students;

-- ✅ Or use GROUP BY (next lesson):
SELECT branch, AVG(points) FROM students GROUP BY branch;
\`\`\`
:::

:::challenge
**Mission 5: Admin Dashboard Stats**

Build the stats row for college_id = 3:
- \`total_students\` — total count
- \`active_this_week\` — active in last 7 days (last_active column)
- \`avg_cgpa\` — rounded to 2 decimal places
- \`top_streak\` — highest streak
- \`placed_students\` — total placed

Write the single query that returns all 5 numbers in one row.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  6: `:::scenario
The analytics page is half-built. It shows platform-wide numbers — but the college admin wants a breakdown: "Show me average points *per branch*, not just the total."

You have aggregates. You have WHERE. What you're missing is the ability to run aggregates on *groups* of rows. Time for GROUP BY.
:::

# GROUP BY and HAVING

## GROUP BY — Aggregate per Group

\`GROUP BY\` splits rows into groups, then applies aggregates to each group independently:

\`\`\`sql
-- Average points per branch
SELECT
    branch,
    COUNT(*)        AS students,
    ROUND(AVG(points), 0) AS avg_points,
    MAX(points)     AS top_score
FROM students
WHERE college_id = 5
GROUP BY branch
ORDER BY avg_points DESC;
\`\`\`

\`\`\`output
branch | students | avg_points | top_score
-------|----------|------------|----------
CSE    | 180      | 1045       | 1580
ECE    | 120      | 892        | 1320
IT     | 95       | 845        | 1210
ME     | 75       | 720        | 1050
\`\`\`

## Multiple GROUP BY Columns

\`\`\`sql
-- Breakdown by branch AND placement status
SELECT
    branch,
    placed,
    COUNT(*) AS count
FROM students
WHERE college_id = 5
GROUP BY branch, placed
ORDER BY branch, placed;
\`\`\`

\`\`\`output
branch | placed | count
-------|--------|------
CSE    | 0      | 95
CSE    | 1      | 85
ECE    | 0      | 70
ECE    | 1      | 50
\`\`\`

## HAVING — Filter Groups

\`HAVING\` filters *after* grouping (like WHERE but for groups):

\`\`\`sql
-- Only branches with more than 50 students
SELECT branch, COUNT(*) AS students
FROM students
WHERE college_id = 5
GROUP BY branch
HAVING COUNT(*) > 50
ORDER BY students DESC;
\`\`\`

\`\`\`sql
-- Branches with high average points (competitive branches)
SELECT branch, ROUND(AVG(points), 0) AS avg_pts
FROM students
GROUP BY branch
HAVING AVG(points) > 900;
\`\`\`

## WHERE vs HAVING

| | WHERE | HAVING |
|--|-------|--------|
| Filters | Individual rows | Groups |
| Runs | Before GROUP BY | After GROUP BY |
| Can use aggregates | No | Yes |
| Performance | Faster (fewer rows to group) | Slower |

\`\`\`sql
-- WHERE filters BEFORE grouping (students with cgpa > 7)
-- HAVING filters AFTER grouping (branches where avg > 900)
SELECT branch, ROUND(AVG(points), 0) AS avg_pts
FROM students
WHERE cgpa > 7.0              -- filter rows first
GROUP BY branch
HAVING AVG(points) > 900      -- then filter groups
ORDER BY avg_pts DESC;
\`\`\`

## Grouping by Expression

\`\`\`sql
-- Group by pass-out year (extracted from graduation_year column)
SELECT
    graduation_year AS batch,
    COUNT(*) AS students,
    SUM(placed) AS placed
FROM students
GROUP BY graduation_year
ORDER BY graduation_year;
\`\`\`

:::insight
SQL processes clauses in this order, regardless of how you write them:
\`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT\`
This is why you can't use a SELECT alias in WHERE — WHERE runs before SELECT. But you CAN use it in ORDER BY, which runs after SELECT.
:::

:::tip
Whenever you add a non-aggregate column to SELECT, add it to GROUP BY too. If your SELECT has: \`SELECT branch, year, AVG(points)\`, your GROUP BY must have \`GROUP BY branch, year\`. Every non-aggregate column in SELECT must appear in GROUP BY.
:::

:::mistake
\`\`\`sql
-- ❌ HAVING for row filtering (inefficient)
SELECT branch, COUNT(*) FROM students
GROUP BY branch
HAVING branch = 'CSE'   -- filters AFTER grouping all branches

-- ✅ Use WHERE for row-level filters (faster — avoids grouping unnecessary rows)
SELECT branch, COUNT(*) FROM students
WHERE branch = 'CSE'
GROUP BY branch
\`\`\`
:::

:::challenge
**Mission 6: Branch Analytics**

Build the analytics breakdown for college_id = 5:
- Show \`branch\`, student \`count\`, \`avg_points\` (rounded), \`placed_count\`
- Only include branches with at least 30 students
- Show a \`placement_rate\` column as a percentage (1 decimal)
- Order by placement_rate descending

Write the query.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  7: `:::scenario
Sprint review. The student dashboard needs a big upgrade.

"Right now we only show students their own data. We need to show: which college they're in, which courses they've completed, their rank among peers."

You open the database schema. The data isn't all in one table — students are in \`users\`, college info is in \`colleges\`, course completions are in \`user_lesson_progress\`. To build this dashboard, you need to **join** tables together.
:::

# JOINs — Combining Tables

A JOIN combines rows from two tables based on a matching condition (usually a foreign key).

## Sample Tables

**users** (students)
| id | name | college_id | points |
|----|------|-----------|--------|
| 1  | Arjun | 5 | 1250 |
| 2  | Priya | 5 | 980  |
| 3  | Kiran | 7 | 760  |

**colleges**
| id | name | location |
|----|------|---------|
| 5  | VIT Vellore | Vellore |
| 7  | NIT Trichy  | Trichy  |
| 9  | BITS Pilani | Pilani  |

## INNER JOIN — Only Matching Rows

Returns rows where the condition matches in *both* tables:

\`\`\`sql
SELECT
    u.name,
    u.points,
    c.name AS college,
    c.location
FROM users u
INNER JOIN colleges c ON u.college_id = c.id;
\`\`\`

\`\`\`output
name    | points | college     | location
--------|--------|-------------|----------
Arjun   | 1250   | VIT Vellore | Vellore
Priya   | 980    | VIT Vellore | Vellore
Kiran   | 760    | NIT Trichy  | Trichy
\`\`\`

Students with no matching college (orphaned records) are excluded.

## LEFT JOIN — All Rows from Left Table

Returns all left-table rows, even with no match on the right (NULLs fill in):

\`\`\`sql
-- All students, with college info if available
SELECT
    u.name,
    c.name AS college
FROM users u
LEFT JOIN colleges c ON u.college_id = c.id;
\`\`\`

Students with no college_id get NULL for the college name — but they still appear in results.

## Joining Multiple Tables

\`\`\`sql
-- Student dashboard: user + college + lesson progress count
SELECT
    u.name,
    u.points,
    u.streak,
    c.name    AS college,
    c.location,
    COUNT(ulp.lesson_id) AS lessons_completed
FROM users u
INNER JOIN colleges c             ON u.college_id = c.id
LEFT  JOIN user_lesson_progress ulp ON ulp.user_id   = u.id
WHERE u.id = 1
GROUP BY u.id, u.name, u.points, u.streak, c.name, c.location;
\`\`\`

\`\`\`output
name   | points | streak | college     | location | lessons_completed
-------|--------|--------|-------------|----------|------------------
Arjun  | 1250   | 7      | VIT Vellore | Vellore  | 28
\`\`\`

## Self JOIN — A Table Joining Itself

\`\`\`sql
-- Find students who have more points than Arjun (id=1)
SELECT
    b.name      AS student,
    b.points    AS their_points,
    a.points    AS arjun_points
FROM users a
INNER JOIN users b ON b.points > a.points
WHERE a.id = 1
ORDER BY b.points DESC;
\`\`\`

## The Leaderboard with Rank (preview)

\`\`\`sql
-- Leaderboard with college name
SELECT
    u.name,
    u.branch,
    u.points,
    u.streak,
    c.name AS college
FROM users u
INNER JOIN colleges c ON u.college_id = c.id
WHERE u.college_id = 5
  AND u.role = 'student'
ORDER BY u.points DESC
LIMIT 50;
\`\`\`

:::insight
SQL table aliases (the \`u\` and \`c\` in \`FROM users u\`) are not just shorthand — in self-joins, they're essential because you need to refer to the same table with two different identities. Convention: use single-letter or abbreviated aliases (\`u\` for users, \`c\` for colleges, \`ulp\` for user_lesson_progress).
:::

:::tip
Always alias your columns when joining: \`c.name AS college_name\` instead of just \`name\`. When two tables have a column with the same name (like \`id\`, \`name\`), unaliased columns become ambiguous and the query will error.
:::

:::mistake
\`\`\`sql
-- ❌ Cartesian product — missing ON clause (every row × every row!)
SELECT * FROM users, colleges;
-- Returns users_count × colleges_count rows — for 4200 users × 50 colleges = 210,000 rows!

-- ✅ Always use JOIN with ON
SELECT * FROM users u INNER JOIN colleges c ON u.college_id = c.id;
\`\`\`
A missing JOIN condition is one of the most common SQL performance disasters. Always check your JOIN conditions.
:::

:::challenge
**Mission 7: Student Dashboard Query**

Build the full student dashboard query for user id = 1042:
- From \`users\` table: name, branch, points, streak, cgpa
- From \`colleges\` table: college name, location
- Count of completed lessons from \`user_lesson_progress\`
- Also include course completion: join \`courses\` and count distinct \`course_id\`s in progress

Return one row with all this data.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  8: `:::scenario
New feature request from the product team: "Show students how their performance compares to the class average."

- "Your CGPA (8.75) is above the college average (8.12)"
- "You rank #3 in your branch"

None of this can come from a simple JOIN. You need a query that first computes the average, then compares individual students to it. That means one query nested inside another — a **subquery**.
:::

# Subqueries

A subquery is a complete SQL query nested inside another query. It runs first, and its result is used by the outer query.

## Scalar Subquery — Returns One Value

\`\`\`sql
-- Students above the platform-wide average CGPA
SELECT name, cgpa
FROM students
WHERE cgpa > (SELECT AVG(cgpa) FROM students)
ORDER BY cgpa DESC;
\`\`\`

The inner \`(SELECT AVG(cgpa) FROM students)\` runs first → returns \`8.12\`. Then the outer query filters students with cgpa > 8.12.

\`\`\`sql
-- How does Arjun compare to his college average?
SELECT
    name,
    cgpa,
    (SELECT ROUND(AVG(cgpa), 2)
     FROM students
     WHERE college_id = s.college_id) AS college_avg,
    cgpa - (SELECT ROUND(AVG(cgpa), 2)
            FROM students
            WHERE college_id = s.college_id) AS above_avg_by
FROM students s
WHERE id = 1;
\`\`\`

\`\`\`output
name   | cgpa | college_avg | above_avg_by
-------|------|-------------|-------------
Arjun  | 8.75 | 8.12        | 0.63
\`\`\`

## IN Subquery — Matches a List

\`\`\`sql
-- Students enrolled in a specific course
SELECT name, branch
FROM students
WHERE id IN (
    SELECT DISTINCT user_id
    FROM user_lesson_progress ulp
    JOIN lessons l ON ulp.lesson_id = l.id
    WHERE l.course_id = 'python'
);

-- Students NOT yet started any course
SELECT name
FROM students
WHERE id NOT IN (
    SELECT DISTINCT user_id FROM user_lesson_progress
);
\`\`\`

## EXISTS — Check for Existence

More efficient than IN for large datasets:

\`\`\`sql
-- Students who have submitted at least one coding problem
SELECT name
FROM students s
WHERE EXISTS (
    SELECT 1
    FROM coding_submissions cs
    WHERE cs.user_id = s.id
      AND cs.status = 'accepted'
);
\`\`\`

\`EXISTS\` stops searching as soon as it finds one matching row — faster than \`IN\` when the subquery is large.

## Correlated Subquery — References Outer Query

Runs once per row of the outer query:

\`\`\`sql
-- Each student's rank in their branch (number of students with MORE points)
SELECT
    name,
    branch,
    points,
    (SELECT COUNT(*) + 1
     FROM students s2
     WHERE s2.branch = s1.branch
       AND s2.points > s1.points) AS branch_rank
FROM students s1
WHERE college_id = 5
ORDER BY branch, branch_rank;
\`\`\`

\`\`\`output
name          | branch | points | branch_rank
--------------|--------|--------|------------
Sneha Patel   | CSE    | 1100   | 1
Arjun Sharma  | CSE    | 1000   | 2
Priya Mehta   | ECE    | 980    | 1
\`\`\`

## Subquery in FROM — Derived Table

Treat a subquery result as a temporary table:

\`\`\`sql
-- Branches where the top scorer has > 1400 points
SELECT branch, max_points
FROM (
    SELECT branch, MAX(points) AS max_points
    FROM students
    WHERE college_id = 5
    GROUP BY branch
) AS branch_stats
WHERE max_points > 1400;
\`\`\`

:::insight
Correlated subqueries run once per row — for a table with 4,200 students, the correlated subquery in the rank example runs 4,200 times. For small tables this is fine. For large tables, **window functions** (coming in the Advanced section) are far more efficient for the same computation.
:::

:::tip
When your subquery returns multiple rows but you use it where only one value is expected (after \`=\`, \`>\`, etc.), SQL throws an error. Use \`IN\` instead of \`=\` when the subquery might return multiple rows, or add \`LIMIT 1\` if you only want the first.
:::

:::mistake
\`\`\`sql
-- ❌ NOT IN with NULLs silently returns no rows
SELECT name FROM students
WHERE id NOT IN (SELECT user_id FROM banned_users);
-- If ANY user_id in banned_users is NULL, this returns NOTHING

-- ✅ Use NOT EXISTS instead (handles NULLs correctly)
SELECT name FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM banned_users b WHERE b.user_id = s.id
);
\`\`\`
This is one of SQL's most dangerous traps.
:::

:::challenge
**Mission 8: Performance Comparison**

Build the "how you compare" card for user id = 1042:
- Show their \`name\`, \`branch\`, \`points\`, \`cgpa\`
- Add \`college_avg_points\` — average points of their college
- Add \`branch_rank\` — how many students in their branch have more points (so rank 1 = top)
- Add a \`status\` column: 'Above Average' if points > college_avg_points, else 'Below Average'

Write the query (hint: scalar subqueries in SELECT clause).
:::`,

  // ─────────────────────────────────────────────────────────────────────────
  // ADVANCED — Lessons 9–12
  // ─────────────────────────────────────────────────────────────────────────

  // ───────────────────────────────────────────────────────────────────────
  9: `:::scenario
You've been reading data for weeks. Today, Vikram finally gives you write access to the database.

"The college onboarding flow is broken — new students aren't being added correctly. The points system isn't updating when they complete lessons. And we need to clean up inactive accounts from 2022."

Reading data is querying. Changing data is DML — Data Manipulation Language. One wrong query here and real student data is gone. Permanently.
:::

# INSERT, UPDATE, DELETE

## INSERT — Add New Rows

\`\`\`sql
-- Add a single student
INSERT INTO users (name, email, role, college_id, branch, cgpa)
VALUES ('Vikram Nair', 'vikram@nitk.ac.in', 'student', 7, 'CSE', 8.40);
\`\`\`

\`\`\`sql
-- Add multiple students at once (batch insert — much faster)
INSERT INTO users (name, email, role, college_id, branch, cgpa)
VALUES
    ('Riya Shah',   'riya@manipal.edu',  'student', 4, 'IT',  8.10),
    ('Arun Kumar',  'arun@srm.edu.in',   'student', 6, 'ECE', 7.85),
    ('Meera Nair',  'meera@vit.ac.in',   'student', 5, 'CSE', 9.05);
\`\`\`

\`\`\`sql
-- Insert from another table (archive inactive users)
INSERT INTO users_archive (id, name, email, college_id, created_at)
SELECT id, name, email, college_id, created_at
FROM users
WHERE last_active < '2023-01-01'
  AND role = 'student';
\`\`\`

## UPDATE — Modify Existing Rows

\`\`\`sql
-- Award 50 points to a student who completed a lesson
UPDATE users
SET points = points + 50,
    streak = streak + 1,
    last_active = NOW()
WHERE id = 1001;
\`\`\`

\`\`\`sql
-- Update multiple students: reset streaks for inactive users
UPDATE users
SET streak = 0
WHERE last_active < CURDATE() - INTERVAL 1 DAY
  AND role = 'student';
\`\`\`

\`\`\`sql
-- Update based on another table (JOIN in UPDATE)
UPDATE users u
JOIN colleges c ON u.college_id = c.id
SET u.is_active = FALSE
WHERE c.is_active = FALSE;  -- deactivate users of deactivated colleges
\`\`\`

## DELETE — Remove Rows

\`\`\`sql
-- Delete one specific record
DELETE FROM sessions
WHERE token = 'expired-token-xyz';

-- Delete old activity logs (keep last 90 days)
DELETE FROM activity_logs
WHERE created_at < NOW() - INTERVAL 90 DAY;

-- Delete with subquery
DELETE FROM user_lesson_progress
WHERE user_id IN (
    SELECT id FROM users WHERE is_active = FALSE
);
\`\`\`

## TRUNCATE vs DELETE

\`\`\`sql
TRUNCATE TABLE temp_import;  -- fast, removes ALL rows, can't be rolled back, resets auto_increment
DELETE FROM temp_import;     -- slower, logged, can use WHERE, respects foreign keys
\`\`\`

:::insight
Every UPDATE and DELETE without a WHERE clause affects **every row in the table**. At CareerEzi, accidentally running \`DELETE FROM user_lesson_progress;\` without a WHERE would wipe every student's progress record — thousands of rows, instantly gone. Most production databases have auditing enabled to detect exactly this.
:::

:::tip
The golden rule of production SQL writes:
1. **Write the WHERE clause first** before the UPDATE/DELETE keywords
2. **Run a SELECT with the same WHERE** to preview which rows will be affected
3. **Use a transaction** so you can rollback if anything looks wrong
\`\`\`sql
START TRANSACTION;
DELETE FROM users WHERE last_active < '2022-01-01';
-- Check: SELECT COUNT(*) FROM users;  ← looks right?
ROLLBACK;  -- or COMMIT;
\`\`\`
:::

:::mistake
\`\`\`sql
-- ❌ The most dangerous query in any database
UPDATE users SET role = 'super_admin';
-- No WHERE — just made EVERY user a super admin

-- ❌ Second most dangerous
DELETE FROM users;
-- No WHERE — deleted every user account

-- ✅ Always verify your WHERE before executing writes
SELECT COUNT(*) FROM users WHERE last_active < '2022-01-01';
-- Verify count looks right, THEN run the DELETE
\`\`\`
:::

:::challenge
**Mission 9: The Lesson Completion Handler**

When a student completes a lesson, CareerEzi needs to:
1. Insert a row in \`user_lesson_progress\` (user_id=1042, lesson_id=37, points_earned=10)
2. Update the student's \`points\` (add 10) and \`last_active\` (set to NOW())
3. Delete any existing \`temp_lesson_state\` rows for this user+lesson combination

Write the 3 SQL statements that handle a lesson completion event.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  10: `:::scenario
The leaderboard has a bug. When two students have the same points, they both show "Rank 1" — and the next student jumps to Rank 3. Students are complaining.

You try to fix it with a correlated subquery but it's too slow — 4,200 students means the subquery runs 4,200 times and the leaderboard takes 8 seconds to load.

Vikram pulls you aside. "You need window functions. They're the most powerful feature in SQL that most developers never learn."
:::

# Window Functions

Window functions compute values across a *window* (partition) of rows without collapsing them into one row — unlike GROUP BY.

\`\`\`sql
aggregate_function() OVER (
    PARTITION BY column   -- split into groups (optional)
    ORDER BY column       -- order within each group
)
\`\`\`

## ROW_NUMBER, RANK, DENSE_RANK

\`\`\`sql
SELECT
    name,
    branch,
    points,
    ROW_NUMBER()  OVER (ORDER BY points DESC) AS row_num,
    RANK()        OVER (ORDER BY points DESC) AS rank,
    DENSE_RANK()  OVER (ORDER BY points DESC) AS dense_rank
FROM students
WHERE college_id = 5
ORDER BY points DESC;
\`\`\`

\`\`\`output
name          | points | row_num | rank | dense_rank
--------------|--------|---------|------|------------
Arjun Sharma  | 1250   | 1       | 1    | 1
Sneha Patel   | 1100   | 2       | 2    | 2
Meera Iyer    | 980    | 3       | 3    | 3
Priya Mehta   | 980    | 4       | 3    | 3    ← same points as Meera
Kiran Rao     | 760    | 5       | 5    | 4    ← RANK skips 4, DENSE_RANK doesn't
\`\`\`

**Differences:**
- \`ROW_NUMBER\`: unique sequential number — no ties
- \`RANK\`: ties get same number, then skips (1,1,3)
- \`DENSE_RANK\`: ties get same number, no skip (1,1,2) ← **use this for leaderboards**

## PARTITION BY — Rank Within Groups

\`\`\`sql
-- Rank within each branch
SELECT
    name,
    branch,
    points,
    DENSE_RANK() OVER (
        PARTITION BY branch
        ORDER BY points DESC
    ) AS branch_rank
FROM students
WHERE college_id = 5
ORDER BY branch, branch_rank;
\`\`\`

\`\`\`output
name          | branch | points | branch_rank
--------------|--------|--------|------------
Sneha Patel   | CSE    | 1100   | 1
Arjun Sharma  | CSE    | 1000   | 2
Priya Mehta   | ECE    | 980    | 1    ← rank resets per branch
Vikram Nair   | ECE    | 850    | 2
\`\`\`

## Running Totals with SUM OVER

\`\`\`sql
-- Running total of points awarded over time
SELECT
    completed_at::date AS date,
    points_earned,
    SUM(points_earned) OVER (
        ORDER BY completed_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM user_lesson_progress
WHERE user_id = 1;
\`\`\`

## LAG / LEAD — Access Adjacent Rows

\`\`\`sql
-- Show each student's points and the previous student's points
SELECT
    name,
    points,
    LAG(points, 1)  OVER (ORDER BY points DESC) AS prev_student_points,
    LEAD(points, 1) OVER (ORDER BY points DESC) AS next_student_points,
    points - LEAD(points, 1) OVER (ORDER BY points DESC) AS gap_to_next
FROM students
WHERE college_id = 5
ORDER BY points DESC;
\`\`\`

\`\`\`output
name          | points | prev_pts | next_pts | gap_to_next
--------------|--------|----------|----------|------------
Arjun Sharma  | 1250   | NULL     | 1100     | 150
Sneha Patel   | 1100   | 1250     | 980      | 120
Priya Mehta   | 980    | 1100     | 760      | 220
Kiran Rao     | 760    | 980      | NULL     | NULL
\`\`\`

:::insight
Window functions were added to SQL in 2003 but most developers discover them 5-10 years into their career. They're the difference between a query that takes 8 seconds (correlated subquery, runs N times) and one that takes 80ms (window function, single pass). At CareerEzi, switching the leaderboard from subqueries to DENSE_RANK() reduced query time from 8s to 40ms.
:::

:::tip
Window functions can't be used directly in WHERE clauses (they run after WHERE). Wrap them in a subquery or CTE to filter on the result:
\`\`\`sql
-- ❌ Error: WHERE can't reference window function
WHERE DENSE_RANK() OVER (...) <= 10

-- ✅ Wrap in subquery
SELECT * FROM (
    SELECT *, DENSE_RANK() OVER (ORDER BY points DESC) AS rnk
    FROM students
) ranked
WHERE rnk <= 10;
\`\`\`
:::

:::challenge
**Mission 10: Fix the Leaderboard**

Build the corrected leaderboard for college_id = 5:
- Show \`name\`, \`branch\`, \`points\`, \`streak\`
- Add a \`college_rank\` using DENSE_RANK across the whole college
- Add a \`branch_rank\` using DENSE_RANK within each branch
- Also show \`gap_to_leader\` (difference between their points and rank 1's points) using LAG or a scalar subquery
- Only show top 20 by college_rank

Write the query.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  11: `:::scenario
The placement analytics feature is getting complex. The product manager wants a report:

"For each college, show us: total students, how many are in the top 20% of points, and the average CGPA of that top 20%."

You start writing — and within 3 lines it's already unreadable. Nested subquery inside a subquery inside another subquery. Vikram walks over and sees the mess.

"Use a CTE. One step at a time."
:::

# CTEs — Common Table Expressions

A CTE is a **named, temporary result set** defined at the top of your query with \`WITH\`. It makes complex queries readable by breaking them into steps.

## Basic CTE

\`\`\`sql
WITH high_scorers AS (
    SELECT id, name, college_id, points, cgpa
    FROM students
    WHERE points >= 1000
)
SELECT college_id, COUNT(*) AS count, AVG(cgpa) AS avg_cgpa
FROM high_scorers
GROUP BY college_id;
\`\`\`

The CTE \`high_scorers\` is defined once and used in the main query — like a temporary view that exists only for this query.

## Multiple CTEs

\`\`\`sql
-- The placement analytics report, step by step
WITH
-- Step 1: score threshold for "top 20%" per college
college_thresholds AS (
    SELECT college_id,
           PERCENTILE_CONT(0.80) WITHIN GROUP (ORDER BY points) AS threshold
    FROM students
    GROUP BY college_id
),

-- Step 2: students in top 20%
top_students AS (
    SELECT s.id, s.name, s.college_id, s.points, s.cgpa
    FROM students s
    JOIN college_thresholds ct ON s.college_id = ct.college_id
    WHERE s.points >= ct.threshold
),

-- Step 3: aggregate per college
college_stats AS (
    SELECT
        college_id,
        COUNT(*) AS top_20_pct_count,
        ROUND(AVG(cgpa), 2) AS top_20_pct_avg_cgpa
    FROM top_students
    GROUP BY college_id
)

-- Final: join with college names
SELECT
    c.name AS college,
    cs.top_20_pct_count,
    cs.top_20_pct_avg_cgpa
FROM college_stats cs
JOIN colleges c ON cs.college_id = c.id
ORDER BY cs.top_20_pct_count DESC;
\`\`\`

This is the same logic that would've been 3 layers of nested subqueries — now it reads like a step-by-step recipe.

## CTE vs Subquery

| | CTE | Subquery |
|--|-----|---------|
| Reusability | Can be referenced multiple times | Must be repeated |
| Readability | Excellent — named, top-down | Poor when nested |
| Performance | Usually same | Usually same |
| Recursive | Yes (powerful!) | No |

## Recursive CTE

Useful for hierarchical data (org charts, category trees):

\`\`\`sql
-- Find all managers in the org hierarchy above user 42
WITH RECURSIVE manager_chain AS (
    -- Base case: start with the target employee
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE id = 42

    UNION ALL

    -- Recursive case: join to parent
    SELECT e.id, e.name, e.manager_id, mc.level + 1
    FROM employees e
    INNER JOIN manager_chain mc ON e.id = mc.manager_id
    WHERE mc.manager_id IS NOT NULL
)
SELECT * FROM manager_chain ORDER BY level;
\`\`\`

## Real CareerEzi Use: Course Completion Path

\`\`\`sql
-- For a student, show all courses and their completion %
WITH course_totals AS (
    SELECT course_id, COUNT(*) AS total_lessons
    FROM lessons
    WHERE is_active = 1
    GROUP BY course_id
),
student_progress AS (
    SELECT l.course_id, COUNT(*) AS completed
    FROM user_lesson_progress ulp
    JOIN lessons l ON ulp.lesson_id = l.id
    WHERE ulp.user_id = 1001
    GROUP BY l.course_id
)
SELECT
    c.title,
    COALESCE(sp.completed, 0)   AS completed,
    ct.total_lessons             AS total,
    ROUND(100.0 * COALESCE(sp.completed, 0) / ct.total_lessons, 0) AS pct
FROM courses c
JOIN course_totals ct   ON c.id = ct.course_id
LEFT JOIN student_progress sp ON c.id = sp.course_id
ORDER BY pct DESC;
\`\`\`

:::insight
CTEs can be referenced multiple times within the same query — unlike subqueries, which must be repeated. If you find yourself copy-pasting the same subquery twice, that's your cue to extract it into a CTE.
:::

:::tip
Name your CTEs by *what they represent*, not *how they compute it*:
- ✅ \`eligible_students\`, \`top_performers\`, \`inactive_accounts\`
- ❌ \`query1\`, \`filtered_data\`, \`temp\`

A well-named CTE reads like documentation.
:::

:::challenge
**Mission 11: The Full Analytics Report**

Using CTEs, build this report for college_id = 5:
1. CTE \`branch_stats\`: per branch — student count, avg_points, avg_cgpa
2. CTE \`top_branch\`: the branch with the highest avg_points
3. Final query: show all branch stats + a \`is_top\` column (1 if this is the top branch, 0 otherwise)

Write the full query with CTEs.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  12: `:::scenario
It's launch week. 50 colleges go live simultaneously. 12,000 students log in. The leaderboard starts taking 6 seconds. The dashboard takes 4 seconds. Users are dropping off.

You \`ssh\` into the database server. \`SHOW PROCESSLIST;\` — dozens of queries running simultaneously, all doing full-table scans.

Vikram walks in. "The queries are right. The indexes are wrong. That's your next 4 hours."
:::

# Indexes and Performance

## What is an Index?

An index is a separate data structure that lets the database find rows *without scanning every row* in the table.

Think of it like a book index: instead of reading every page to find "SQL", you jump straight to page 247.

Without index: **Full table scan** — checks every row. O(n).
With index: **Index scan** — jumps directly to matching rows. O(log n).

## Creating Indexes

\`\`\`sql
-- Index on a single column (most common)
CREATE INDEX idx_users_college ON users(college_id);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index (multiple columns — order matters!)
CREATE INDEX idx_users_college_points ON users(college_id, points);

-- Drop an index
DROP INDEX idx_users_college ON users;
\`\`\`

## When to Create Indexes

\`\`\`sql
-- ✅ Add index when this query is slow:
SELECT * FROM users WHERE college_id = 5;          -- → index on college_id
SELECT * FROM users WHERE email = 'arjun@vit.ac.in'; -- → UNIQUE index on email (already exists via PK or UNIQUE constraint)
SELECT * FROM users ORDER BY points DESC LIMIT 50;   -- → index on points
\`\`\`

**Index candidates:**
- Columns in \`WHERE\` clauses
- Columns in \`JOIN ... ON\` conditions (foreign keys)
- Columns in \`ORDER BY\` for large tables

**Don't index:**
- Small tables (full scan is faster — index has overhead)
- Columns with very few unique values (\`gender\`, \`role\`, \`is_active\` — rarely worth it)
- Tables with very high write rates (every INSERT/UPDATE/DELETE must update the index)

## EXPLAIN — See How Your Query Runs

\`\`\`sql
EXPLAIN SELECT name, points
FROM users
WHERE college_id = 5
ORDER BY points DESC
LIMIT 10;
\`\`\`

\`\`\`output
id | type  | table | key                        | rows  | Extra
---|-------|-------|----------------------------|-------|--------
1  | ref   | users | idx_users_college_points   | 4200  | Using index
\`\`\`

Key columns:
- **type**: \`ALL\` = bad (full scan). \`ref\` / \`range\` / \`const\` = good (uses index)
- **key**: which index is being used (NULL = no index)
- **rows**: estimated rows scanned (lower is better)

## The CareerEzi Slow Queries — Fixed

\`\`\`sql
-- Before: full scan on users for every leaderboard load
-- EXPLAIN showed: type=ALL, rows=45000

-- Fix: composite index for the leaderboard query
CREATE INDEX idx_leaderboard ON users(college_id, role, points DESC);

-- Before: feed queries scanning all posts
-- Fix: index on college_id + created_at for pagination
CREATE INDEX idx_posts_college_date ON posts(college_id, created_at DESC);

-- Before: MCQ attempt lookup scanning entire attempts table
-- Fix: composite index
CREATE INDEX idx_mcq_attempts_user ON mcq_attempts(user_id, question_id);
\`\`\`

## Common Query Anti-Patterns

\`\`\`sql
-- ❌ Function on indexed column — disables index
WHERE YEAR(created_at) = 2024

-- ✅ Use range instead
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'

-- ❌ Leading wildcard — can't use index
WHERE name LIKE '%arjun%'

-- ✅ Prefix search — can use index
WHERE name LIKE 'arjun%'

-- ❌ OR on different columns — usually can't use one index
WHERE college_id = 5 OR email = 'arjun@vit.ac.in'

-- ✅ UNION instead
SELECT * FROM users WHERE college_id = 5
UNION
SELECT * FROM users WHERE email = 'arjun@vit.ac.in'
\`\`\`

:::insight
After adding indexes, CareerEzi's leaderboard went from 6 seconds to 40ms — a 150x speedup. The query didn't change at all. Indexes are one of the highest-leverage optimizations in database performance. Most production performance problems are missing or wrong indexes, not poorly written queries.
:::

:::tip
After you create an index, always run \`EXPLAIN\` again to verify the database is actually using it. Sometimes the query optimizer decides a full scan is faster (for very small tables or very low selectivity columns). Don't assume — verify.
:::

:::mistake
\`\`\`sql
-- ❌ Over-indexing — creating indexes on everything
CREATE INDEX idx1 ON users(name);
CREATE INDEX idx2 ON users(branch);
CREATE INDEX idx3 ON users(streak);
CREATE INDEX idx4 ON users(cgpa);
-- Every INSERT into users now updates 4 extra index structures
-- Write performance degrades significantly

-- ✅ Only index columns you actually query frequently
-- Profile first, index second
\`\`\`
:::

:::challenge
**Mission 12: The Performance Audit**

Run EXPLAIN on this leaderboard query and identify the problem:

\`\`\`sql
SELECT name, points, streak
FROM users
WHERE college_id = 5
  AND role = 'student'
  AND YEAR(created_at) >= 2023
ORDER BY points DESC
LIMIT 50;
\`\`\`

1. What is the anti-pattern in the WHERE clause?
2. Rewrite it to allow index usage
3. Write the \`CREATE INDEX\` statement that would best optimize this query

(Hint: think composite index — what columns are in WHERE + ORDER BY?)
:::`,

}

export default sqlContent
