// Python course — scenario-based lessons (indexed by lesson order, 1-based)
// Every lesson tells the story of building the CareerEzi platform itself.

const pythonContent: Record<number, string> = {

  // ───────────────────────────────────────────────────────────────────────
  1: `:::scenario
You just got the offer letter. You're joining a fast-growing EdTech startup as a backend intern. The product? A college placement platform — CareerEzi.

Day 1. Your team lead, Priya, walks over.
"Our first feature: when a student logs in for the first time, print a personalized welcome message. Simple script. Can you do it?"

She walks away. You stare at the blank file. Time to write your first Python program.
:::

# What is Python?

Python is a **high-level programming language** designed to be readable — almost like English. No semicolons, no complex boilerplate. Just clean, expressive code.

Here's what you're about to build:

\`\`\`python
name = "Arjun Sharma"
college = "VIT Vellore"
branch = "CSE"

print(f"Welcome to CareerEzi, {name}!")
print(f"College: {college}  |  Branch: {branch}")
print("Let's get you placed. 🚀")
\`\`\`

\`\`\`output
Welcome to CareerEzi, Arjun Sharma!
College: VIT Vellore  |  Branch: CSE
Let's get you placed. 🚀
\`\`\`

That's Python. Clean, instant, powerful.

## Why Python Dominates the Industry

Python is the **#1 most-used language** in the world — and for good reason:

- **Web Backends** — Instagram, Pinterest, Dropbox all run on Python (Django/FastAPI)
- **AI & Machine Learning** — Every major AI model (ChatGPT, Gemini) is trained with Python
- **Data Science** — Pandas, NumPy, Matplotlib are the industry standard
- **Automation & Scripting** — Test bots, web scrapers, report generators
- **Finance & Quant** — Goldman Sachs, JPMorgan use Python for trading systems

:::insight
Python's creator, Guido van Rossum, had one design principle: **"Code is read more often than it is written."** That's why Python looks so clean compared to Java or C++. Readability is a feature, not an accident.
:::

## Your Very First Program

Open any text editor. Create a file called \`hello.py\`. Type this:

\`\`\`python
print("Hello, World!")
\`\`\`

Open your terminal and run:

\`\`\`bash
python hello.py
\`\`\`

\`\`\`output
Hello, World!
\`\`\`

No compilation. No build step. Python runs instantly. That's the magic.

## How Python Executes Your Code

Python is **interpreted** — it reads and runs your code **line by line, top to bottom**:

\`\`\`python
print("📋 Server starting...")       # runs first
print("🔄 Loading student data...")  # runs second
print("✅ Ready!")                   # runs third
\`\`\`

Compare this to Java or C++ that need a separate compile step before anything runs. With Python: write → run. Done.

## Comments — Talk to Your Future Self

\`\`\`python
# This is a comment — Python completely ignores this line
print("This runs!")   # You can also comment at the end of a line

# Write WHY, not just WHAT:
# BAD:  # set x to 3
# GOOD: # max retries before giving up and logging the error
max_retries = 3
\`\`\`

Good comments explain the *reason*, not the *action*. Your teammates (and future you) will thank you.

:::tip
**PEP 8** is Python's official style guide. Key rules:
- File names: \`snake_case.py\` (e.g. \`welcome_message.py\`)
- Indentation: 4 spaces (never tabs)
- One statement per line

Most editors (VS Code, PyCharm) auto-format this for you. Turn it on.
:::

:::mistake
In old tutorials you'll see \`print "Hello"\` without parentheses — that's **Python 2 syntax**. Python 3 requires \`print("Hello")\`. Python 2 reached end-of-life in 2020. If a tutorial uses it, close the tab.
:::

:::challenge
**Mission 1: Welcome Banner**

Priya shows you the spec. Write a script that prints this exact output (use your own details):

\`\`\`output
==========================================
       Welcome to FYNITY Platform!
==========================================
Student : Arjun Sharma
College : VIT Vellore
Branch  : B.Tech CSE (2025)
Status  : Ready to get placed!
==========================================
\`\`\`

Hint: You need multiple \`print()\` calls. The \`=\` lines are just repeated characters. No variables needed yet — those are next lesson.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  2: `:::scenario
Day 2. Priya drops the design doc on your desk.

"We need to store each student's profile — name, CGPA, graduation year, placement status. It all comes from the registration form. Design the data model."

You open a new file: \`student_profile.py\`. Time to meet Python's most fundamental concept: **variables and data types**.
:::

# Variables — Your Program's Memory

A variable is a **named box** that holds a value. Python figures out the type automatically — you just assign:

\`\`\`python
# Student registration data
name = "Arjun Sharma"        # text
cgpa = 8.75                  # decimal number
graduation_year = 2025       # whole number
is_placed = False            # true or false
college = "VIT Vellore"
\`\`\`

No \`String name;\` or \`int cgpa;\` like Java. Python infers the type.

## Python's Core Data Types

| Type | Example | Real Use Case |
|------|---------|---------------|
| \`str\` | \`"Arjun Sharma"\` | Names, emails, messages |
| \`int\` | \`2025\` | Year, count, ID |
| \`float\` | \`8.75\` | CGPA, salary, percentage |
| \`bool\` | \`True / False\` | Is placed? Has backlog? |
| \`list\` | \`["Python", "SQL"]\` | Skills, companies applied |
| \`dict\` | \`{"name": "Arjun"}\` | Full profile as key-value |
| \`tuple\` | \`(28.6, 77.2)\` | Fixed coordinates, RGB |
| \`set\` | \`{"Google", "Meta"}\` | Unique companies |

## Building the Student Profile

\`\`\`python
# Student model for CareerEzi
student_id = 1001
name = "Arjun Sharma"
email = "arjun@vit.ac.in"
cgpa = 8.75
year = 2025
branch = "CSE"
is_placed = False
backlogs = 0

print(f"ID     : {student_id}")
print(f"Name   : {name}")
print(f"CGPA   : {cgpa}")
print(f"Placed : {is_placed}")
\`\`\`

\`\`\`output
ID     : 1001
Name   : Arjun Sharma
CGPA   : 8.75
Placed : False
\`\`\`

## Checking and Converting Types

\`\`\`python
cgpa = 8.75
print(type(cgpa))               # <class 'float'>
print(isinstance(cgpa, float))  # True

# Type conversion — the input form sends everything as strings
raw_cgpa = "8.75"           # string from HTML form
cgpa = float(raw_cgpa)      # convert to float for comparison

raw_year = "2025"
year = int(raw_year)        # convert to int

print(cgpa > 7.5)           # True — now we can compare!
\`\`\`

:::insight
Python uses **dynamic typing** — a variable's type can change. \`x = 5\` makes x an int; \`x = "hello"\` now makes it a string. This flexibility is powerful but requires discipline. In production code, always know what type your variables hold.
:::

## Multiple Assignment and Swapping

\`\`\`python
# Assign multiple variables in one line
name, cgpa, year = "Priya Mehta", 9.1, 2024

# Swap without a temp variable (Python magic!)
a = 10
b = 20
a, b = b, a
print(a, b)   # 20 10
\`\`\`

## Naming Rules

\`\`\`python
# Valid variable names
student_name = "Arjun"
cgpa2025 = 8.75
_is_eligible = True

# Invalid — will throw SyntaxError
# 2cgpa = 8.75       — can't start with a number
# student-name = ""  — hyphens not allowed
# class = "CSE"      — 'class' is a reserved keyword
\`\`\`

:::tip
Use **descriptive names**. \`cgpa\` is better than \`c\`. \`is_placed\` is better than \`flag\`. Code is communication — make it readable at a glance.
:::

:::mistake
\`\`\`python
# This does NOT print the value!
cgpa = 8.75
cgpa    # no output — just evaluates and discards

# This does:
print(cgpa)    # 8.75
\`\`\`
Beginners often forget \`print()\` and wonder why nothing shows up. In a Python shell (REPL), typing a variable name shows its value — but in a \`.py\` file you need \`print()\`.
:::

:::challenge
**Mission 2: Smart Profile Printer**

Build a student profile display. Store these values in variables and print a formatted summary:

- Name, branch, CGPA (float), year (int), placed (bool)
- Also compute and print: eligible = CGPA >= 7.5 AND year == 2025

\`\`\`output
=== Student Profile ===
Name    : Priya Mehta
Branch  : ECE
CGPA    : 9.1
Year    : 2024
Placed  : False

Eligible for drives : True
\`\`\`

Hint: Eligibility is a boolean expression — \`cgpa >= 7.5 and year <= 2025\`
:::`,

  // ───────────────────────────────────────────────────────────────────────
  3: `:::scenario
Day 5. The notification system feature lands in your sprint.

"When a student gets shortlisted, we send a WhatsApp-style message: 'Hey Arjun! You've been shortlisted by Google for SDE-1. Interview on 15 Mar 2025 at 10:00 AM. Report to Hall B.'"

The message must be personalized for every student. It's dynamic text — which means it's time to master **strings**.
:::

# Strings — Text That Talks

A string is any sequence of characters wrapped in quotes. It's how your program communicates with humans.

\`\`\`python
# Three ways to create strings
name = "Arjun Sharma"          # double quotes
role = 'SDE-1 Intern'          # single quotes — same thing
message = """Hey Arjun!
You've been shortlisted.
Report tomorrow."""          # triple quotes for multi-line
\`\`\`

## f-Strings — The Modern Way to Build Messages

f-strings let you **embed variables directly** inside text:

\`\`\`python
name = "Arjun Sharma"
company = "Google"
role = "SDE-1"
date = "15 Mar 2025"
time = "10:00 AM"
venue = "Hall B"

message = f"""Hey {name}!
You've been shortlisted by {company} for {role}.
Interview on {date} at {time}.
Report to {venue}. All the best!"""

print(message)
\`\`\`

\`\`\`output
Hey Arjun Sharma!
You've been shortlisted by Google for SDE-1.
Interview on 15 Mar 2025 at 10:00 AM.
Report to Hall B. All the best!
\`\`\`

You can put any Python expression inside the curly braces:

\`\`\`python
cgpa = 8.75
rounds = 3
print(f"CGPA: {cgpa:.1f}")           # 8.8  (1 decimal place)
print(f"Rounds cleared: {rounds}/5")
print(f"Eligible: {cgpa >= 7.5}")    # expression evaluated!
\`\`\`

## Essential String Methods

\`\`\`python
email = "  arjun.sharma@VIT.AC.IN  "

# Cleaning up user input
clean_email = email.strip().lower()
print(clean_email)   # arjun.sharma@vit.ac.in

# Checking
print(clean_email.endswith("@vit.ac.in"))   # True
print(clean_email.startswith("arjun"))       # True

# Modifying
print("vit vellore".title())   # Vit Vellore
print("hello world".upper())  # HELLO WORLD

# Searching
msg = "Interview at Google HQ"
print(msg.find("Google"))     # 13 (index where it starts)
print("Google" in msg)        # True

# Replacing
print(msg.replace("Google", "Microsoft"))
# Interview at Microsoft HQ
\`\`\`

## String Slicing — Extract Any Part

\`\`\`python
email = "arjun@vit.ac.in"
#        0123456789...

username = email[:5]         # "arjun"    (start to index 5)
domain   = email[6:]         # "vit.ac.in" (index 6 to end)
ext      = email[-2:]        # "in"  (last 2 characters)
reversed_email = email[::-1] # reverse the whole string

print(f"Username : {username}")
print(f"Domain   : {domain}")
\`\`\`

\`\`\`output
Username : arjun
Domain   : vit.ac.in
\`\`\`

## Splitting and Joining

\`\`\`python
# Split: string → list
skills_raw = "Python, Java, SQL, React"
skills = skills_raw.split(", ")
print(skills)
# ['Python', 'Java', 'SQL', 'React']

# Join: list → string
formatted = " | ".join(skills)
print(formatted)
# Python | Java | SQL | React
\`\`\`

:::insight
\`split()\` and \`join()\` are the backbone of text processing. When you parse CSV files, query parameters, or user-submitted comma-separated data — these are your tools. Learn them well.
:::

## Validating User Input

\`\`\`python
def validate_email(email):
    email = email.strip().lower()
    return "@" in email and email.endswith((".ac.in", ".edu", ".com"))

print(validate_email("arjun@vit.ac.in"))   # True
print(validate_email("not-an-email"))       # False
\`\`\`

:::tip
Always \`.strip()\` user input before processing. Users accidentally add spaces all the time. Forgetting this causes bugs that are hard to trace — "Arjun " != "Arjun".
:::

:::mistake
\`\`\`python
# String + number directly raises TypeError!
cgpa = 8.75
print("Your CGPA is: " + cgpa)     # TypeError!

# Use f-string instead
print(f"Your CGPA is: {cgpa}")     # Works!

# Or convert explicitly
print("Your CGPA is: " + str(cgpa))
\`\`\`
:::

:::challenge
**Mission 3: Notification Generator**

Build a personalized placement notification. Output should look like a real message:

\`\`\`output
PLACEMENT NOTIFICATION
--------------------------
Hey Priya Mehta!

Great news! You've been SHORTLISTED by Microsoft
for the role of Software Engineer (FTE).

Interview Date : 20 Mar 2025
Time           : 2:00 PM
Venue          : Seminar Hall A
Package        : 18.5 LPA

Report 15 minutes early. All the best!
--------------------------
\`\`\`

Store all values in variables and use an f-string to build the message.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  4: `:::scenario
Day 8. The placement drive feature needs a backend.

"We need to track which companies are visiting campus this semester — their names, packages, and the order they visit. Companies can be added or removed. But once the visit order is fixed for a day, it cannot change."

Two problems. Two solutions: **lists** for the changing data, **tuples** for the fixed data.
:::

# Lists — Ordered, Changeable Collections

A list holds multiple items in order. You can add, remove, and modify items freely.

\`\`\`python
# Companies visiting campus this semester
companies = ["Google", "Microsoft", "Amazon", "Infosys", "TCS"]

# Accessing items
print(companies[0])     # Google  (first — index 0)
print(companies[-1])    # TCS     (last — negative index)
print(companies[1:3])   # ['Microsoft', 'Amazon']  (slice)

# Modifying
companies.append("Wipro")         # add to end
companies.insert(2, "Flipkart")   # insert at position 2
companies.remove("Infosys")       # remove by value
removed = companies.pop()         # remove and return last item

print(f"Companies: {len(companies)} registered")
print(f"Removed: {removed}")
\`\`\`

\`\`\`output
Companies: 5 registered
Removed: TCS
\`\`\`

## Useful List Operations

\`\`\`python
companies = ["Google", "Microsoft", "Amazon", "Flipkart"]

# Check if present
print("Google" in companies)        # True
print("Paytm" in companies)         # False

# Sort and reverse
companies.sort()                    # alphabetical in-place
companies.sort(reverse=True)        # reverse alphabetical

# Length, min, max on a numeric list
packages = [45.0, 18.5, 32.0, 12.0, 28.0]
print(f"Highest : {max(packages)} LPA")
print(f"Lowest  : {min(packages)} LPA")
print(f"Average : {sum(packages)/len(packages):.1f} LPA")
\`\`\`

\`\`\`output
Highest : 45.0 LPA
Lowest  : 12.0 LPA
Average : 27.1 LPA
\`\`\`

## List Comprehension — Python's Superpower

Build a new list from an existing one in a single, expressive line:

\`\`\`python
packages = [45.0, 18.5, 32.0, 12.0, 28.0]

# Filter: only premium packages
premium = [p for p in packages if p >= 20.0]
print(premium)   # [45.0, 32.0, 28.0]

# Transform: convert LPA to monthly (approx)
monthly = [round(p * 100000 / 12) for p in packages]
print(monthly)   # [375000, 154167, ...]

# Filter + transform
names = ["  Google  ", "Microsoft", " Amazon "]
clean = [n.strip() for n in names]
print(clean)     # ['Google', 'Microsoft', 'Amazon']
\`\`\`

:::insight
List comprehensions replace 3-4 lines of loop code with one readable line. They're idiomatic Python — you'll see them everywhere in real codebases. Master them and your code immediately looks more professional.
:::

## Nested Lists — 2D Data

\`\`\`python
# Each entry: [company, role, package]
drive_schedule = [
    ["Google",    "SDE-1",         45.0],
    ["Microsoft", "Software Eng",  32.0],
    ["Amazon",    "SDE",           28.0],
    ["Flipkart",  "Backend Dev",   18.5],
]

for company, role, pkg in drive_schedule:
    print(f"{company:12} | {role:18} | Rs.{pkg} LPA")
\`\`\`

\`\`\`output
Google       | SDE-1              | Rs.45.0 LPA
Microsoft    | Software Eng       | Rs.32.0 LPA
Amazon       | SDE                | Rs.28.0 LPA
Flipkart     | Backend Dev        | Rs.18.5 LPA
\`\`\`

## Tuples — Fixed, Immutable Data

Tuples look like lists but use \`()\` instead of \`[]\`. Once created, they **cannot be changed**.

\`\`\`python
# Today's interview schedule is FIXED — no changes allowed
morning_slots = ("9:00 AM", "10:30 AM", "12:00 PM")
afternoon_slots = ("2:00 PM", "3:30 PM", "5:00 PM")

# Access like a list
print(morning_slots[0])    # 9:00 AM

# Unpacking — elegant!
first, second, third = morning_slots
print(f"First slot: {first}")

# Trying to modify raises TypeError:
# morning_slots[0] = "8:00 AM"  <- TypeError!
\`\`\`

:::tip
**When to use list vs tuple?**
- Use a **list** when data changes: companies registered, students applied
- Use a **tuple** when data is fixed: interview time slots, RGB colors, GPS coordinates
- Tuples are slightly faster and signal to readers: "this data does not change"
:::

:::challenge
**Mission 4: Drive Analyzer**

You have this placement data:
\`\`\`python
drives = [
    ("Google", 45.0, 120),
    ("Microsoft", 32.0, 85),
    ("Amazon", 28.0, 200),
    ("Flipkart", 18.5, 310),
    ("TCS", 7.5, 500),
]
# Format: (company, package_lpa, students_applied)
\`\`\`

Write code that prints:
1. Companies offering >= 20 LPA (use list comprehension)
2. Total students who applied across all drives
3. Most competitive drive (highest applicants)

\`\`\`output
Premium companies (>=20 LPA): ['Google', 'Microsoft', 'Amazon']
Total applicants : 1215
Most competitive : TCS (500 applicants)
\`\`\`
:::`,

  // ───────────────────────────────────────────────────────────────────────
  5: `:::scenario
Day 12. The student application tracker feature.

"When a student applies to a company, we need to store their profile and track which companies they've applied to. Also, we need to find students who applied to BOTH Google AND Microsoft — they need special prep sessions."

Profile data = dictionary. Unique company tracking = sets. Let's build it.
:::

# Dictionaries — Named Data Storage

A dictionary stores **key-value pairs**. Think of it as a student's ID card — each field has a name and a value.

\`\`\`python
student = {
    "id": 1001,
    "name": "Arjun Sharma",
    "email": "arjun@vit.ac.in",
    "cgpa": 8.75,
    "branch": "CSE",
    "year": 2025,
    "is_placed": False,
    "skills": ["Python", "SQL", "React"],
}

# Accessing values
print(student["name"])              # Arjun Sharma
print(student.get("phone", "N/A"))  # N/A — safe access, no KeyError

# Modifying
student["cgpa"] = 8.9                      # update existing
student["github"] = "github.com/arjun"    # add new key
del student["email"]                       # delete a key

print("name" in student)    # True
print("phone" in student)   # False
\`\`\`

## Iterating Dictionaries

\`\`\`python
student = {"name": "Arjun", "cgpa": 8.75, "branch": "CSE", "year": 2025}

# Keys + Values — most common pattern
for key, value in student.items():
    print(f"  {key:10} : {value}")
\`\`\`

\`\`\`output
  name       : Arjun
  cgpa       : 8.75
  branch     : CSE
  year       : 2025
\`\`\`

## Dict Comprehension

\`\`\`python
students = ["Arjun", "Priya", "Karthik", "Sneha"]
cgpas    = [8.75,    9.1,     7.8,       8.4   ]

# Build a dict from two lists
student_cgpa = {name: cgpa for name, cgpa in zip(students, cgpas)}
print(student_cgpa)
# {'Arjun': 8.75, 'Priya': 9.1, 'Karthik': 7.8, 'Sneha': 8.4}

# Filter: only toppers
toppers = {name: gpa for name, gpa in student_cgpa.items() if gpa >= 8.5}
print(toppers)
# {'Arjun': 8.75, 'Priya': 9.1, 'Sneha': 8.4}
\`\`\`

## Nested Dictionaries — Full Student Records

\`\`\`python
database = {
    1001: {
        "name": "Arjun Sharma",
        "cgpa": 8.75,
        "applications": ["Google", "Microsoft", "Flipkart"],
        "status": "shortlisted",
    },
    1002: {
        "name": "Priya Mehta",
        "cgpa": 9.1,
        "applications": ["Microsoft", "Amazon", "Uber"],
        "status": "offered",
    },
}

# Access nested data
print(database[1001]["name"])          # Arjun Sharma
print(database[1002]["applications"])  # ['Microsoft', 'Amazon', 'Uber']

# Update nested
database[1001]["status"] = "offered"
database[1001]["offer"] = {"company": "Google", "package": 45.0}
\`\`\`

:::insight
Dictionaries are everywhere in Python — API responses come as dicts (JSON), database records are stored as dicts, configuration files are parsed into dicts. Mastering dicts means mastering data in Python.
:::

# Sets — Unique Values, Fast Lookup

A set stores only **unique values** with no duplicates. Membership checks on sets are O(1) — instant.

\`\`\`python
# Companies each student applied to
arjun_applied = {"Google", "Microsoft", "Flipkart", "Amazon"}
priya_applied = {"Microsoft", "Amazon", "Uber", "Google"}

# Who applied to BOTH? (Intersection)
both = arjun_applied & priya_applied
print(f"Common: {both}")
# {'Google', 'Microsoft', 'Amazon'}

# All unique companies across both (Union)
all_companies = arjun_applied | priya_applied
print(f"All: {all_companies}")

# Arjun applied to but Priya did not (Difference)
arjun_only = arjun_applied - priya_applied
print(f"Only Arjun: {arjun_only}")
\`\`\`

\`\`\`output
Common: {'Amazon', 'Microsoft', 'Google'}
All: {'Amazon', 'Uber', 'Google', 'Flipkart', 'Microsoft'}
Only Arjun: {'Flipkart'}
\`\`\`

## Deduplication with Sets

\`\`\`python
# Raw skills from all student profiles — duplicates expected
all_skills_raw = ["Python", "SQL", "Python", "Java", "SQL", "React", "Python"]

# Instantly deduplicate
unique_skills = sorted(set(all_skills_raw))
print(f"Unique skills: {unique_skills}")
# ['Java', 'Python', 'React', 'SQL']
\`\`\`

:::tip
Use \`set\` when you need: (1) uniqueness guaranteed, (2) fast membership check — \`x in my_set\` is O(1) regardless of size, (3) set operations like intersection and union.
:::

:::challenge
**Mission 5: Application Intelligence**

Given this database:
\`\`\`python
applications = {
    "Arjun":   {"Google", "Microsoft", "Flipkart"},
    "Priya":   {"Microsoft", "Amazon", "Google"},
    "Karthik": {"TCS", "Infosys", "Wipro"},
    "Sneha":   {"Google", "Amazon", "Uber"},
}
\`\`\`

Write code to find:
1. Students who applied to Google
2. Companies that Arjun and Priya both applied to
3. Count of all unique companies across all students

\`\`\`output
Applied to Google    : ['Arjun', 'Priya', 'Sneha']
Arjun and Priya both : {'Microsoft', 'Google'}
Unique companies     : 7
\`\`\`
:::`,

  // ───────────────────────────────────────────────────────────────────────
  6: `:::scenario
Day 15. The eligibility checker feature.

"Before a student can apply for a company, the system must check: CGPA threshold, no active backlogs, branch eligibility, graduation year. If any condition fails, show them exactly WHY — not just 'rejected'."

You need to make decisions based on multiple conditions. That's what **control flow** is for.
:::

# if / elif / else — Making Decisions

\`\`\`python
cgpa = 7.2
backlogs = 1
company_min_cgpa = 7.5

if cgpa >= company_min_cgpa and backlogs == 0:
    print("Eligible to apply!")
elif cgpa >= company_min_cgpa and backlogs > 0:
    print("Good CGPA, but clear your backlogs first.")
elif cgpa < company_min_cgpa and backlogs == 0:
    print(f"CGPA {cgpa} is below the {company_min_cgpa} cutoff.")
else:
    print("CGPA below cutoff AND active backlogs. Focus on academics.")
\`\`\`

\`\`\`output
Good CGPA, but clear your backlogs first.
\`\`\`

## Building the Full Eligibility Checker

\`\`\`python
def check_eligibility(student, company):
    reasons = []

    if student["cgpa"] < company["min_cgpa"]:
        reasons.append(f"CGPA {student['cgpa']} < required {company['min_cgpa']}")
    if student["backlogs"] > 0:
        reasons.append(f"{student['backlogs']} active backlog(s)")
    if student["branch"] not in company["branches"]:
        reasons.append(f"Branch {student['branch']} not eligible")
    if student["year"] != company["batch"]:
        reasons.append(f"Batch {student['year']} not matching {company['batch']}")

    if not reasons:
        return True, "All criteria met"
    else:
        return False, " | ".join(reasons)


student = {"name": "Arjun", "cgpa": 7.2, "backlogs": 1, "branch": "CSE", "year": 2025}
company = {"name": "Google", "min_cgpa": 7.5, "branches": ["CSE", "IT"], "batch": 2025}

eligible, message = check_eligibility(student, company)
status = "Eligible" if eligible else "Not Eligible"
print(f"{student['name']} for Google: {status}")
print(f"Reason: {message}")
\`\`\`

\`\`\`output
Arjun for Google: Not Eligible
Reason: CGPA 7.2 < required 7.5 | 1 active backlog(s)
\`\`\`

## for Loops — Process Every Student

\`\`\`python
students = [
    {"name": "Arjun",   "cgpa": 8.75, "backlogs": 0},
    {"name": "Priya",   "cgpa": 9.10, "backlogs": 0},
    {"name": "Karthik", "cgpa": 6.80, "backlogs": 2},
    {"name": "Sneha",   "cgpa": 7.50, "backlogs": 1},
]

eligible_list = []

for student in students:
    if student["cgpa"] >= 7.5 and student["backlogs"] == 0:
        eligible_list.append(student["name"])
        print(f"OK  {student['name']} — CGPA: {student['cgpa']}")
    else:
        print(f"NO  {student['name']} — not eligible")

print(f"\nEligible: {len(eligible_list)} students")
\`\`\`

\`\`\`output
OK  Arjun — CGPA: 8.75
OK  Priya — CGPA: 9.1
NO  Karthik — not eligible
NO  Sneha — not eligible

Eligible: 2 students
\`\`\`

## enumerate — Index + Value Together

\`\`\`python
companies = ["Google", "Microsoft", "Amazon", "Flipkart"]

for rank, company in enumerate(companies, start=1):
    print(f"#{rank}: {company}")
\`\`\`

\`\`\`output
#1: Google
#2: Microsoft
#3: Amazon
#4: Flipkart
\`\`\`

## while — Repeat Until Condition Met

\`\`\`python
# Retry sending notification (max 3 attempts)
attempts = 0
max_attempts = 3
sent = False

while attempts < max_attempts and not sent:
    attempts += 1
    print(f"Attempt {attempts}: Sending...")
    if attempts == 3:
        sent = True

if sent:
    print("Notification sent!")
else:
    print("Failed after 3 attempts. Log the error.")
\`\`\`

## break and continue

\`\`\`python
# Find first premium company
companies = [("TCS", 7.5), ("Infosys", 12.0), ("Microsoft", 32.0), ("Google", 45.0)]

for company, package in companies:
    if package < 20:
        continue    # skip low-package companies
    if package > 30:
        print(f"First premium: {company} at {package} LPA")
        break       # stop once found
\`\`\`

:::insight
Real production code is mostly control flow — eligibility checks, feature flags, error conditions, role-based access. Learning to think in conditions is more valuable than memorizing any specific syntax.
:::

:::tip
The **ternary expression** is a compact one-liner for simple conditions:
\`\`\`python
status = "Eligible" if cgpa >= 7.5 else "Not Eligible"
badge = "placed" if is_placed else "pending"
\`\`\`
:::

:::challenge
**Mission 6: Smart Eligibility Engine**

Check a list of students against a company's requirements and generate a report:

\`\`\`python
company = {"min_cgpa": 7.5, "branches": ["CSE", "IT"], "max_backlogs": 0}
students = [
    {"name": "Arjun",   "cgpa": 8.75, "branch": "CSE", "backlogs": 0},
    {"name": "Priya",   "cgpa": 9.10, "branch": "ECE", "backlogs": 0},
    {"name": "Karthik", "cgpa": 7.80, "branch": "IT",  "backlogs": 1},
    {"name": "Sneha",   "cgpa": 7.50, "branch": "CSE", "backlogs": 0},
]
\`\`\`

\`\`\`output
=== Eligibility Report ===
OK   Arjun    — Eligible
NO   Priya    — Branch ECE not allowed
NO   Karthik  — 1 active backlog(s)
OK   Sneha    — Eligible

Eligible: 2/4 students
\`\`\`
:::`,

  // ───────────────────────────────────────────────────────────────────────
  7: `:::scenario
Day 20. Code review day.

You show Priya your code. She reads it for 30 seconds.

"You're writing the eligibility check three times in three different places. And the notification builder is copy-pasted in four files. This is a maintenance nightmare."

She opens a new tab. "Ever heard of DRY? Don't Repeat Yourself. Time to learn functions."

Functions are how you write code once and use it everywhere.
:::

# Functions — Write Once, Use Everywhere

A function is a **named block of code** you can call whenever you need it.

\`\`\`python
# Without functions — repeated logic everywhere
student1_ok = student1["cgpa"] >= 7.5 and student1["backlogs"] == 0
student2_ok = student2["cgpa"] >= 7.5 and student2["backlogs"] == 0
student3_ok = student3["cgpa"] >= 7.5 and student3["backlogs"] == 0

# With a function — defined once, called anywhere
def is_eligible(student, min_cgpa=7.5):
    return student["cgpa"] >= min_cgpa and student["backlogs"] == 0

print(is_eligible(student1))                  # True or False
print(is_eligible(student3, min_cgpa=8.0))   # custom threshold
\`\`\`

## Anatomy of a Function

\`\`\`python
def generate_notification(name, company, role, date, package):
    """
    Generate a placement notification message.
    Returns a formatted string ready to send.
    """
    return f"""Hey {name}!

You've been shortlisted by {company} for {role}.
Interview: {date}
Package:   {package} LPA

Report 15 minutes early. All the best!"""

msg = generate_notification("Arjun", "Google", "SDE-1", "15 Mar", 45.0)
print(msg)
\`\`\`

## Default Parameters

\`\`\`python
def send_notification(student_name, company, channel="whatsapp", urgent=False):
    prefix = "URGENT: " if urgent else ""
    print(f"[{channel.upper()}] {prefix}Sending to {student_name} re: {company}")

send_notification("Arjun", "Google")               # uses defaults
send_notification("Priya", "Microsoft", "email")   # override channel
send_notification("Karthik", "Amazon", urgent=True) # keyword arg
\`\`\`

\`\`\`output
[WHATSAPP] Sending to Arjun re: Google
[EMAIL] Sending to Priya re: Microsoft
[WHATSAPP] URGENT: Sending to Karthik re: Amazon
\`\`\`

## *args — Variable Number of Arguments

\`\`\`python
def calculate_average(*scores):
    """Accept any number of scores."""
    if not scores:
        return 0
    return sum(scores) / len(scores)

print(calculate_average(85, 90, 78))           # 84.33
print(calculate_average(92, 88, 95, 79, 83))   # 87.4
\`\`\`

## **kwargs — Named Arguments as a Dict

\`\`\`python
def create_student_profile(**kwargs):
    """Build a student dict from any keyword arguments."""
    return {
        "id":     kwargs.get("id", 0),
        "name":   kwargs.get("name", "Unknown"),
        "cgpa":   kwargs.get("cgpa", 0.0),
        "placed": kwargs.get("placed", False),
    }

student = create_student_profile(name="Sneha", cgpa=8.4, id=1005)
print(student)
\`\`\`

## Returning Multiple Values

\`\`\`python
def analyze_batch(students):
    """Return key statistics for a batch."""
    cgpas  = [s["cgpa"] for s in students]
    placed = sum(1 for s in students if s.get("is_placed"))
    return max(cgpas), min(cgpas), placed / len(students) * 100

students = [
    {"name": "Arjun",   "cgpa": 8.75, "is_placed": True},
    {"name": "Priya",   "cgpa": 9.10, "is_placed": True},
    {"name": "Karthik", "cgpa": 6.80, "is_placed": False},
    {"name": "Sneha",   "cgpa": 8.40, "is_placed": True},
]

highest, lowest, rate = analyze_batch(students)
print(f"Highest CGPA   : {highest}")
print(f"Lowest CGPA    : {lowest}")
print(f"Placement rate : {rate:.1f}%")
\`\`\`

\`\`\`output
Highest CGPA   : 9.1
Lowest CGPA    : 6.8
Placement rate : 75.0%
\`\`\`

## Lambda — One-line Functions

\`\`\`python
students = [
    {"name": "Arjun",   "cgpa": 8.75},
    {"name": "Priya",   "cgpa": 9.10},
    {"name": "Karthik", "cgpa": 6.80},
]

# Sort by CGPA descending
by_cgpa = sorted(students, key=lambda s: s["cgpa"], reverse=True)

for s in by_cgpa:
    print(f"{s['name']:10} CGPA: {s['cgpa']}")
\`\`\`

:::insight
Lambdas shine with \`sorted()\`, \`min()\`, \`max()\`, \`filter()\`, \`map()\`. When you use them, you're thinking functionally. This scales to pandas DataFrames, Django querysets, and everywhere else in real codebases.
:::

:::tip
Write a docstring for every non-trivial function. Your teammates see it when they hover over the function call in their IDE — it's documentation that lives in the code and never goes stale.
:::

:::challenge
**Mission 7: Placement Utility Module**

Build a collection of functions for the CareerEzi platform:

1. \`is_eligible(student, company)\` returns bool
2. \`format_profile(student)\` returns formatted string
3. \`get_top_students(students, n=3)\` returns top N by CGPA
4. \`placement_stats(students)\` returns dict with rate and average CGPA

Call each and print a neat summary report.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  8: `:::scenario
Day 25. Hackathon night.

It's 11 PM. You need: unique student IDs, date calculations for drive schedules, and random pairing for mock interviews.

Priya walks by. "Don't reinvent the wheel. Python's standard library has everything. Use it."

Python ships with a massive **standard library** — hundreds of modules, zero installation needed.
:::

# Python's Standard Library — Batteries Included

The standard library comes with Python. No \`pip install\` needed.

## datetime — Handling Dates and Times

\`\`\`python
from datetime import datetime, timedelta, date

now   = datetime.now()
today = date.today()

print(f"Current time : {now.strftime('%d %b %Y, %I:%M %p')}")
print(f"Today's date : {today}")

# Drive scheduled 14 days from now
drive_date = today + timedelta(days=14)
print(f"Drive date   : {drive_date.strftime('%d %B %Y')}")

# Days until placement season
placement_start = date(2025, 8, 1)
days_left = (placement_start - today).days
print(f"Days to placement season: {days_left}")
\`\`\`

\`\`\`output
Current time : 08 Mar 2026, 10:30 AM
Today's date : 2026-03-08
Drive date   : 22 March 2026
Days to placement season: -220
\`\`\`

## random — Randomness and Sampling

\`\`\`python
import random

students = ["Arjun", "Priya", "Karthik", "Sneha", "Rahul", "Deepika"]

# Random selection
print(random.choice(students))     # random single student

# Shuffle a copy for seating
seating = students.copy()
random.shuffle(seating)
print(f"Seating order: {seating}")

# Sample without replacement
panel = random.sample(students, 3)
print(f"Interview panel: {panel}")

# Mock interview pairs
random.shuffle(students)
pairs = [(students[i], students[i+1]) for i in range(0, len(students)-1, 2)]
print("Mock pairs:")
for a, b in pairs:
    print(f"  {a} with {b}")
\`\`\`

## math — Mathematical Operations

\`\`\`python
import math

scores = [78, 85, 92, 67, 88, 91, 74, 95]

mean     = sum(scores) / len(scores)
variance = sum((x - mean)**2 for x in scores) / len(scores)
std_dev  = math.sqrt(variance)

print(f"Mean       : {mean:.2f}")
print(f"Std Dev    : {std_dev:.2f}")
print(f"Max score  : {max(scores)}")
print(f"Top 85+    : {sum(1 for s in scores if s >= 85)/len(scores):.0%}")
\`\`\`

\`\`\`output
Mean       : 83.75
Std Dev    : 9.23
Max score  : 95
Top 85+    : 38%
\`\`\`

## uuid — Unique IDs for Every Record

\`\`\`python
import uuid

def generate_application_id():
    return str(uuid.uuid4())[:8].upper()

for _ in range(4):
    print(f"APP-{generate_application_id()}")
\`\`\`

\`\`\`output
APP-3F7A2B1C
APP-9E4D5A8B
APP-1C6F3D7E
APP-7B2A4E9F
\`\`\`

## collections — Smarter Data Structures

\`\`\`python
from collections import Counter, defaultdict

# Counter: count occurrences
skills = ["Python", "Java", "Python", "SQL", "Java", "Python", "React", "SQL"]
skill_count = Counter(skills)
print(skill_count.most_common(3))
# [('Python', 3), ('Java', 2), ('SQL', 2)]

# defaultdict: no KeyError on missing keys
applications_by_company = defaultdict(list)

data = [
    ("Arjun", "Google"), ("Priya", "Google"),
    ("Karthik", "TCS"), ("Sneha", "Microsoft"), ("Arjun", "Microsoft")
]

for student, company in data:
    applications_by_company[company].append(student)

for company, applicants in applications_by_company.items():
    print(f"{company}: {applicants}")
\`\`\`

\`\`\`output
Google: ['Arjun', 'Priya']
TCS: ['Karthik']
Microsoft: ['Sneha', 'Arjun']
\`\`\`

## os and pathlib — File System Operations

\`\`\`python
import os
from pathlib import Path

print(os.getcwd())     # current working directory

# Create directories safely
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

# List Python files in current dir
py_files = list(Path(".").glob("*.py"))
print(f"Python files: {[f.name for f in py_files]}")

# Environment variables for secrets/config
db_url = os.getenv("DATABASE_URL", "sqlite:///local.db")
\`\`\`

:::insight
The standard library eliminates most third-party dependencies for common tasks. Before \`pip install something\`, check if Python's stdlib already has it. It usually does.
:::

:::tip
The most useful stdlib modules for backend work: \`datetime\`, \`json\`, \`os\`, \`pathlib\`, \`re\`, \`collections\`, \`itertools\`, \`functools\`, \`logging\`, \`hashlib\`. Learn these and you'll be dangerous.
:::

:::challenge
**Mission 8: Hackathon Dashboard**

Build an analytics dashboard using only stdlib:

- Use \`datetime\` to show days until placement season (Aug 1)
- Use \`random.sample\` to pick 3 students for a mock interview panel
- Use \`Counter\` to find the top 3 most-demanded skills from a list
- Use \`uuid\` to generate unique application IDs

Print a clean formatted report.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  9: `:::scenario
Day 30. A critical bug report lands.

"Every time the server restarts, all the application logs are lost. Students complain their submission history disappears."

Your task: build a system that reads, writes, and appends application records to disk. The data must survive server restarts. Welcome to **file handling**.
:::

# File Handling — Persistence Beyond the Program

Programs are ephemeral. Files are permanent. File I/O is how data outlives your program.

## Reading Files

\`\`\`python
# Read an entire file at once
with open("students.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line — memory efficient for large files
with open("students.txt", "r") as f:
    for line in f:
        print(line.strip())   # strip() removes the trailing newline

# Read all lines into a list
with open("students.txt", "r") as f:
    lines = f.readlines()
    print(f"Total students: {len(lines)}")
\`\`\`

:::insight
The \`with\` statement (context manager) guarantees the file is **always closed** — even if an exception occurs. Never use \`f = open(...)\` without \`with\` in production code.
:::

## Writing Files

\`\`\`python
from datetime import datetime

# Write mode ("w") — creates file or overwrites existing
with open("report.txt", "w") as f:
    f.write("=== Placement Report ===\n")
    f.write(f"Generated: {datetime.now()}\n\n")

# Append mode ("a") — adds to end, never overwrites
def log_application(student_name, company, status):
    with open("applications.log", "a") as f:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {student_name} -> {company} : {status}\n")

log_application("Arjun",   "Google",    "SHORTLISTED")
log_application("Priya",   "Microsoft", "OFFERED")
log_application("Karthik", "TCS",       "REJECTED")
\`\`\`

The log file now contains:
\`\`\`output
[2025-03-08 10:30:00] Arjun -> Google : SHORTLISTED
[2025-03-08 10:31:15] Priya -> Microsoft : OFFERED
[2025-03-08 10:32:45] Karthik -> TCS : REJECTED
\`\`\`

## JSON — Structured Data Storage

\`\`\`python
import json

students = [
    {"id": 1001, "name": "Arjun Sharma",  "cgpa": 8.75, "status": "shortlisted"},
    {"id": 1002, "name": "Priya Mehta",   "cgpa": 9.10, "status": "offered"},
    {"id": 1003, "name": "Karthik Nair",  "cgpa": 7.80, "status": "pending"},
]

# Write to JSON file
with open("students.json", "w") as f:
    json.dump(students, f, indent=2)

# Read it back
with open("students.json", "r") as f:
    loaded = json.load(f)

print(f"Loaded {len(loaded)} students")
for s in loaded:
    print(f"  {s['name']:15} — {s['status'].upper()}")
\`\`\`

\`\`\`output
Loaded 3 students
  Arjun Sharma    — SHORTLISTED
  Priya Mehta     — OFFERED
  Karthik Nair    — PENDING
\`\`\`

## CSV — Spreadsheet-Compatible Data

\`\`\`python
import csv

fieldnames = ["student_id", "name", "company", "role", "package_lpa", "status"]
rows = [
    {"student_id": 1001, "name": "Arjun", "company": "Google",
     "role": "SDE-1", "package_lpa": 45.0, "status": "Offered"},
    {"student_id": 1002, "name": "Priya", "company": "Microsoft",
     "role": "SWE", "package_lpa": 32.0, "status": "Offered"},
]

with open("placements.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

with open("placements.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']:10} -> {row['company']:12} @ {row['package_lpa']} LPA")
\`\`\`

## File Modes Reference

| Mode | Meaning |
|------|---------|
| \`r\` | Read (default, file must exist) |
| \`w\` | Write (creates or overwrites) |
| \`a\` | Append (add to end) |
| \`r+\` | Read and write |
| \`x\` | Create (fails if file exists) |
| \`b\` | Binary mode (combine as \`rb\` or \`wb\`) |

:::tip
Store configuration in JSON, logs in plain text with \`.log\` extension, tabular reports in CSV. For a real application you'd use a database — but understanding file I/O is the foundation for understanding ALL persistence.
:::

:::mistake
\`\`\`python
# DON'T do this — file may not close if exception occurs
f = open("data.txt", "r")
content = f.read()
f.close()

# DO this — guaranteed cleanup no matter what
with open("data.txt", "r") as f:
    content = f.read()
\`\`\`
:::

:::challenge
**Mission 9: Application Log System**

Build a persistent application tracking system:

1. \`save_students(students, filepath)\` — save list of dicts to JSON
2. \`load_students(filepath)\` — load and return list from JSON
3. \`log_event(event, filepath)\` — append timestamped event to .log file
4. \`generate_csv_report(students, filepath)\` — export to CSV

Test it: save 4 students, reload them, log 3 events, export a CSV. Print confirmation for each step.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  10: `:::scenario
Day 35. Architecture review.

The codebase is growing. Functions are everywhere but disconnected — student data is just a dict floating around. The notification function and the eligibility checker don't know about each other.

Priya draws a box on the whiteboard: "Student". Inside it: name, cgpa, backlogs, applied_companies. And methods: apply(), check_eligible(), get_summary().

"That's a class. Organize your data and behavior together. That's OOP."
:::

# Classes — Bundling Data and Behavior

A class is a **blueprint**. An object is a **specific instance** built from that blueprint.

\`\`\`python
class Student:
    def __init__(self, student_id, name, cgpa, branch, year):
        # Instance attributes — unique to each student
        self.id = student_id
        self.name = name
        self.cgpa = cgpa
        self.branch = branch
        self.year = year
        self.backlogs = 0
        self.applied_companies = []
        self.is_placed = False
        self.offer = None

    def apply(self, company_name, min_cgpa):
        """Apply to a company if eligible."""
        if self.cgpa < min_cgpa:
            return f"CGPA {self.cgpa} below {min_cgpa} cutoff"
        if company_name in self.applied_companies:
            return f"Already applied to {company_name}"
        self.applied_companies.append(company_name)
        return f"Applied to {company_name}"

    def receive_offer(self, company, package):
        """Record a placement offer."""
        self.is_placed = True
        self.offer = {"company": company, "package": package}

    def get_summary(self):
        """Return formatted profile summary."""
        if self.is_placed:
            status = f"Placed @ {self.offer['company']} ({self.offer['package']} LPA)"
        else:
            status = "Not yet placed"
        return (
            f"{'='*40}\n"
            f"  {self.name} (ID: {self.id})\n"
            f"  {self.branch} | CGPA: {self.cgpa} | Batch: {self.year}\n"
            f"  Applied: {len(self.applied_companies)} companies\n"
            f"  Status: {status}\n"
            f"{'='*40}"
        )

    def __str__(self):
        return f"Student({self.name}, CGPA={self.cgpa})"
\`\`\`

## Creating and Using Objects

\`\`\`python
arjun = Student(1001, "Arjun Sharma", 8.75, "CSE", 2025)
priya = Student(1002, "Priya Mehta",  9.10, "ECE", 2025)

print(arjun.apply("Google",    min_cgpa=7.5))
print(arjun.apply("Microsoft", min_cgpa=7.5))
print(arjun.apply("Google",    min_cgpa=7.5))   # duplicate

arjun.receive_offer("Google", 45.0)

print(arjun.get_summary())
print(priya)    # calls __str__
\`\`\`

\`\`\`output
Applied to Google
Applied to Microsoft
Already applied to Google
========================================
  Arjun Sharma (ID: 1001)
  CSE | CGPA: 8.75 | Batch: 2025
  Applied: 2 companies
  Status: Placed @ Google (45.0 LPA)
========================================
Student(Priya Mehta, CGPA=9.1)
\`\`\`

## Class Variables — Shared Across All Instances

\`\`\`python
class Student:
    total_students = 0       # class variable — shared by ALL instances
    MIN_CGPA = 6.0           # class constant

    def __init__(self, name, cgpa):
        Student.total_students += 1   # increments for every new Student
        self.id = Student.total_students
        self.name = name
        self.cgpa = cgpa

s1 = Student("Arjun", 8.75)
s2 = Student("Priya", 9.10)
s3 = Student("Karthik", 7.80)

print(f"Total students registered: {Student.total_students}")  # 3
print(f"Arjun's ID: {s1.id}")   # 1
print(f"Priya's ID: {s2.id}")   # 2
\`\`\`

## Properties — Smart Attribute Access

\`\`\`python
class Student:
    def __init__(self, name, cgpa):
        self.name = name
        self._cgpa = cgpa       # underscore signals "internal — don't access directly"

    @property
    def cgpa(self):
        return self._cgpa

    @cgpa.setter
    def cgpa(self, value):
        if not 0.0 <= value <= 10.0:
            raise ValueError(f"CGPA must be 0-10, got {value}")
        self._cgpa = round(value, 2)

    @property
    def grade(self):
        if self._cgpa >= 9.0: return "O"
        if self._cgpa >= 8.0: return "A+"
        if self._cgpa >= 7.0: return "A"
        if self._cgpa >= 6.0: return "B+"
        return "B"

s = Student("Arjun", 8.75)
print(f"{s.name}: CGPA {s.cgpa}, Grade {s.grade}")
s.cgpa = 9.1    # uses setter — validates automatically
\`\`\`

:::insight
\`__str__\` is called by \`print()\` — make it human-readable. \`__repr__\` is called in debug mode — make it unambiguous. This convention is followed by every library you'll ever use — Django models, SQLAlchemy entities, FastAPI schemas.
:::

:::tip
The \`@property\` decorator turns a method into a computed attribute. Instead of \`student.get_grade()\` you write \`student.grade\`. Cleaner API, and you can add validation in the setter without breaking any existing code.
:::

:::challenge
**Mission 10: Drive Application System**

Extend the \`Student\` class:
- \`apply(company, min_cgpa, allowed_branches)\` — enforces all criteria
- \`get_applications()\` — returns sorted list
- \`mark_placed(company, package)\` — records offer
- \`eligibility_score()\` — returns float (CGPA bonus for zero backlogs)

Create 3 students, apply them to 3 companies each, give 1 student an offer, print everyone's summary.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  11: `:::scenario
Day 42. New user roles enter the picture.

"We now have three types of users on CareerEzi: regular Students, Premium Students (paid tier — extra features, priority applications), and Admin Students (college reps who can see all data)."

"They all share basic Student behavior. But each has extras."

Priya points to the board: "That's inheritance. One parent class, multiple child classes. Don't copy-paste Student three times."
:::

# Inheritance — Build on What Exists

A **child class** inherits all the attributes and methods of a **parent class**, then adds its own.

\`\`\`python
class Student:
    """Base class for all CareerEzi users."""

    def __init__(self, student_id, name, cgpa, branch):
        self.id = student_id
        self.name = name
        self.cgpa = cgpa
        self.branch = branch
        self.is_placed = False
        self.applications = []

    def apply(self, company, min_cgpa):
        if self.cgpa < min_cgpa:
            return f"CGPA {self.cgpa} below {min_cgpa} cutoff"
        self.applications.append(company)
        return f"Applied to {company}"

    def get_profile(self):
        return f"{self.name} | {self.branch} | CGPA: {self.cgpa}"

    def __str__(self):
        return f"Student({self.name})"


class PremiumStudent(Student):
    """Paid-tier student with priority features."""

    def __init__(self, student_id, name, cgpa, branch, plan="monthly"):
        super().__init__(student_id, name, cgpa, branch)  # call parent __init__
        self.plan = plan
        self.priority_applications = []
        self.mentor = None

    def apply_priority(self, company, min_cgpa):
        """Premium feature: priority application queue."""
        if self.cgpa < min_cgpa:
            return f"Not eligible for {company}"
        self.priority_applications.append(company)
        self.applications.append(company)
        return f"PRIORITY application sent to {company}"

    def assign_mentor(self, mentor_name):
        self.mentor = mentor_name
        return f"Mentor {mentor_name} assigned to {self.name}"

    def get_profile(self):
        base = super().get_profile()   # reuse parent method
        return f"{base} | Premium ({self.plan}) | Mentor: {self.mentor or 'Unassigned'}"

    def __str__(self):
        return f"PremiumStudent({self.name}, plan={self.plan})"


class AdminStudent(Student):
    """College representative with elevated permissions."""

    def __init__(self, student_id, name, cgpa, branch, college):
        super().__init__(student_id, name, cgpa, branch)
        self.college = college
        self.managed_students = []

    def add_student(self, student):
        self.managed_students.append(student)
        return f"Added {student.name} to {self.college} roster"

    def get_college_report(self):
        total = len(self.managed_students)
        placed = sum(1 for s in self.managed_students if s.is_placed)
        avg   = sum(s.cgpa for s in self.managed_students) / total if total else 0
        return (
            f"\n=== {self.college} Report ===\n"
            f"Total Students  : {total}\n"
            f"Placed          : {placed} ({placed/total*100:.1f}%)\n"
            f"Average CGPA    : {avg:.2f}"
        )

    def get_profile(self):
        base = super().get_profile()
        return f"{base} | Admin ({self.college}, {len(self.managed_students)} students)"
\`\`\`

## Seeing Inheritance in Action

\`\`\`python
arjun = Student(1001, "Arjun Sharma", 8.75, "CSE")
priya = PremiumStudent(1002, "Priya Mehta", 9.10, "ECE", plan="annual")
admin = AdminStudent(9001, "Dr. Ramesh", 0.0, "Faculty", "VIT Vellore")

print(arjun.apply("Google", 7.5))           # inherited method
print(priya.apply("Microsoft", 7.5))        # also works!
print(priya.apply_priority("Google", 7.5))  # premium-only
print(priya.assign_mentor("Sundar Pichai"))

admin.add_student(arjun)
admin.add_student(priya)
arjun.is_placed = True

# Polymorphism — same method name, different behavior per class
for user in [arjun, priya, admin]:
    print(user.get_profile())

print(admin.get_college_report())
\`\`\`

\`\`\`output
Applied to Google
Applied to Microsoft
PRIORITY application sent to Google
Mentor Sundar Pichai assigned to Priya Mehta
Arjun Sharma | CSE | CGPA: 8.75
Priya Mehta | ECE | CGPA: 9.1 | Premium (annual) | Mentor: Sundar Pichai
Dr. Ramesh | Faculty | CGPA: 0.0 | Admin (VIT Vellore, 2 students)

=== VIT Vellore Report ===
Total Students  : 2
Placed          : 1 (50.0%)
Average CGPA    : 8.93
\`\`\`

## Polymorphism — One Interface, Many Behaviors

\`\`\`python
def send_digest(users):
    for user in users:
        print(f"[{type(user).__name__}] {user.get_profile()}")

send_digest([arjun, priya, admin])  # works for ALL types
\`\`\`

## isinstance and Type Checking

\`\`\`python
print(isinstance(priya, PremiumStudent))  # True
print(isinstance(priya, Student))         # True — is ALSO a Student
print(isinstance(arjun, PremiumStudent))  # False

# Feature gating
def can_apply_priority(user):
    return isinstance(user, PremiumStudent)
\`\`\`

:::insight
This exact pattern is used in Django's user system: \`User\`, \`AbstractUser\`, \`AnonymousUser\`. In FastAPI's dependency injection. In SQLAlchemy's model inheritance. Understanding OOP inheritance means understanding every major Python framework.
:::

:::tip
Use \`super()\` to call the parent class method instead of hard-coding the parent class name. It handles multiple inheritance correctly and makes refactoring easier.
:::

:::challenge
**Mission 11: Full Role System**

Add a \`TrialStudent\` class — free tier with:
- Limited to 3 applications max (\`apply()\` enforces this)
- \`upgrade()\` method that converts them to \`PremiumStudent\`
- \`get_profile()\` shows remaining application slots

Test the full hierarchy: create one of each type, apply to companies, upgrade a TrialStudent, print all profiles.
:::`,

  // ───────────────────────────────────────────────────────────────────────
  12: `:::scenario
Day 50. Production bug report — critical.

"The app crashed in production. A student typed 'eight point five' in the CGPA field. The code tried to convert it to float and blew up. Five students' records are corrupted."

Priya is not happy. "Your code needs to handle bad input gracefully. Always. If it can crash, it will crash — in production, at the worst possible time."

Time to make your code **bulletproof** with exception handling.
:::

# Exceptions — When Things Go Wrong

An exception is Python's way of saying "something unexpected happened." Without handling them, your program crashes.

\`\`\`python
# This crashes the program:
cgpa = float("eight point five")   # ValueError!
print(cgpa)                        # Never reached

# This handles it:
try:
    cgpa = float("eight point five")
except ValueError as e:
    print(f"Invalid CGPA: {e}")
    cgpa = 0.0   # safe default

print(f"CGPA set to: {cgpa}")    # Program continues
\`\`\`

\`\`\`output
Invalid CGPA: could not convert string to float: 'eight point five'
CGPA set to: 0.0
\`\`\`

## Full try / except / else / finally

\`\`\`python
def parse_student_cgpa(raw_value):
    try:
        cgpa = float(raw_value)           # might fail
        if not 0.0 <= cgpa <= 10.0:
            raise ValueError(f"CGPA must be 0-10, got {cgpa}")
    except (ValueError, TypeError) as e:
        print(f"  Input error: {e}")
        return None
    else:
        print(f"  CGPA validated: {cgpa}")  # runs ONLY if no exception
        return cgpa
    finally:
        print(f"  [Processed: '{raw_value}']")  # ALWAYS runs

parse_student_cgpa("8.75")
parse_student_cgpa("fifteen")
parse_student_cgpa("12.5")
\`\`\`

\`\`\`output
  CGPA validated: 8.75
  [Processed: '8.75']
  Input error: could not convert string to float: 'fifteen'
  [Processed: 'fifteen']
  Input error: CGPA must be 0-10, got 12.5
  [Processed: '12.5']
\`\`\`

## Custom Exceptions — Domain-Specific Errors

\`\`\`python
class CareerEziError(Exception):
    """Base exception for all CareerEzi errors."""
    pass

class IneligibleError(CareerEziError):
    """Raised when a student does not meet criteria."""
    def __init__(self, student_name, reason):
        self.student_name = student_name
        self.reason = reason
        super().__init__(f"{student_name} is ineligible: {reason}")

class DuplicateApplicationError(CareerEziError):
    """Raised when student applies to a company twice."""
    def __init__(self, student_name, company):
        super().__init__(f"{student_name} already applied to {company}")

class InvalidCGPAError(CareerEziError):
    """Raised for out-of-range CGPA values."""
    def __init__(self, value):
        super().__init__(f"CGPA {value} is not in valid range [0.0 to 10.0]")
\`\`\`

## Bulletproof Application System

\`\`\`python
def apply_to_company(student, company_name, min_cgpa):
    """
    Process a student's application with full error handling.
    Raises specific exceptions instead of crashing silently.
    """
    if not isinstance(student.get("cgpa"), (int, float)):
        raise InvalidCGPAError(student.get("cgpa"))

    cgpa = float(student["cgpa"])
    if not 0.0 <= cgpa <= 10.0:
        raise InvalidCGPAError(cgpa)

    if cgpa < min_cgpa:
        raise IneligibleError(
            student["name"],
            f"CGPA {cgpa} below {min_cgpa} cutoff"
        )

    if company_name in student.get("applications", []):
        raise DuplicateApplicationError(student["name"], company_name)

    student.setdefault("applications", []).append(company_name)
    return f"Application submitted: {student['name']} to {company_name}"


# Test with different scenarios
test_cases = [
    ({"name": "Arjun",   "cgpa": 8.75, "applications": []},        "Google",    7.5),
    ({"name": "Priya",   "cgpa": 6.20, "applications": []},        "Google",    7.5),
    ({"name": "Arjun",   "cgpa": 8.75, "applications": ["Google"]},"Google",    7.5),
    ({"name": "Karthik", "cgpa": "N/A", "applications": []},       "Microsoft", 7.5),
]

for student, company, min_cgpa in test_cases:
    try:
        print(apply_to_company(student, company, min_cgpa))
    except IneligibleError as e:
        print(f"Ineligible  — {e}")
    except DuplicateApplicationError as e:
        print(f"Duplicate   — {e}")
    except InvalidCGPAError as e:
        print(f"Data Error  — {e}")
\`\`\`

\`\`\`output
Application submitted: Arjun to Google
Ineligible  — Priya is ineligible: CGPA 6.2 below 7.5 cutoff
Duplicate   — Arjun already applied to Google
Data Error  — CGPA N/A is not in valid range [0.0 to 10.0]
\`\`\`

## Common Built-in Exceptions

| Exception | When it occurs |
|-----------|----------------|
| \`ValueError\` | Right type, wrong value — \`int("abc")\` |
| \`TypeError\` | Wrong type — \`len(42)\` |
| \`KeyError\` | Dict key doesn't exist — \`d["missing"]\` |
| \`IndexError\` | List index out of range — \`lst[999]\` |
| \`FileNotFoundError\` | File doesn't exist |
| \`ZeroDivisionError\` | Division by zero |
| \`AttributeError\` | Object doesn't have the attribute |

:::insight
In production at Flipkart, Google, or any serious company, unhandled exceptions are caught by monitoring tools (Sentry, Datadog) and wake engineers up at 3 AM. Every exception you handle thoughtfully is a crisis prevented.
:::

:::tip
**The Golden Rule**: Catch the most specific exception you expect. Never use a bare \`except:\` — it silently hides bugs and even catches \`KeyboardInterrupt\`:
\`\`\`python
# Too broad — hides real bugs
try:
    result = complex_operation()
except:
    pass

# Specific — handles what you expect, lets others bubble up
try:
    result = complex_operation()
except ValueError as e:
    print(f"Invalid value: {e}")
    result = default_value
\`\`\`
:::

:::mistake
\`\`\`python
# Swallowing exceptions silently — the worst pattern
try:
    cgpa = float(user_input)
except:
    cgpa = 0    # Where did this 0 come from? Nobody knows.

# Log it and tell the user
try:
    cgpa = float(user_input)
except ValueError:
    print(f"'{user_input}' is not a valid CGPA. Enter a number like 8.75.")
    cgpa = None
\`\`\`
:::

:::challenge
**Mission 12: Production-Ready Application Handler**

Build a \`StudentApplicationSystem\` class with:

1. \`register_student(data)\` — validates all fields, raises custom exceptions for bad data
2. \`submit_application(student_id, company_id)\` — with full error handling
3. \`bulk_import(rows)\` — process all rows, collect all errors, return a report

Bulk import must NOT stop on first error:

\`\`\`output
Bulk Import Results:
  Imported : 7 students
  Failed   : 3 students
    Row 3: InvalidCGPAError — CGPA 11.0 out of range
    Row 6: MissingFieldError — 'email' is required
    Row 9: DuplicateError — ID 1005 already exists
\`\`\`

This is exactly how production data pipelines work.
:::`,

}

export default pythonContent
