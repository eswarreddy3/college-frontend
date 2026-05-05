// Python course content generated from Python_Beginner to Advanced.docx
// Images are served from /pyimages/pimg*.png

const pythonContent: Record<number, string> = {
  1: `
Get started with the world's most popular programming language

## What is Python?

Python is a popular programming language created by Guido van Rossum and released in 1991. It is known for being simple, easy to read, and beginner-friendly.

Python is called a high-level language, which means you don’t need to worry about complex details of how the computer works. It is also interpreted, meaning the code runs line by line.

> Why Learn Python?
> ✅  Easy to read and write — syntax similar to plain English
> ✅  Versatile — used in Web, AI, Data Science, Automation, Games
> ✅  Huge community and rich library ecosystem
> ✅  #1 Most popular language for 3 years running (Stack Overflow Survey)
> ✅  High salary potential and huge job demand worldwide

## Where is Python Used?

| Domain | Examples |
| --- | --- |
| 🌐  Web Development | Django, Flask, FastAPI frameworks |
| 🤖  Artificial Intelligence | TensorFlow, PyTorch, Scikit-learn |
| 📊  Data Science | Pandas, NumPy, Matplotlib, Jupyter |
| 🔧  Automation / Scripting | Web scraping, file management, bots |
| 🎮  Game Development | Pygame, Panda3D |
| 🔒  Cybersecurity | Penetration testing, ethical hacking |
| 📡  IoT / Embedded | Raspberry Pi, MicroPython |
| Data Analysis | Pandas, NumPy |
| Machine Learning & AI | TensorFlow, PyTorch |
| Web Scraping | BeautifulSoup, Scrapy |
| Desktop Apps | Tkinter, PyQt |

## Key Features of Python

- Simple & Readable Syntax — code looks like English sentences

- Interpreted Language — runs line by line, easy to debug

- Dynamically Typed — no need to declare variable types

- Object-Oriented + Functional — supports multiple paradigms

- Cross-Platform — works on Windows, Mac, Linux

- Extensive Standard Library — batteries included!

- Open Source & Free — forever

Understanding the "Hello World" Program

\`\`\`python
print("Hello, World!")
Hello, World!    #Output
\`\`\`

How does this work:

![Image-1](/pyimages/pimg1.png)

🌍 Real-World Applications Using Python

Many big companies use Python:

- YouTube – Video streaming and backend systems

- Instagram – Handles millions of users

- Spotify – Music recommendations

- Dropbox – File storage services

- Netflix – Recommendation system

- Google – Data processing and testing

- Uber – Route optimization and pricing

- Pinterest – Image processing

👉 Today, almost every tech company uses Python in some way.

🔧 What Can You Do with Python?

Python is used in many areas:

- Web Development – Django, Flask

- Data Analysis – Pandas, NumPy

- Machine Learning & AI – TensorFlow, PyTorch

- Automation – Scripts to save time

- Game Development – Pygame

- Web Scraping – BeautifulSoup, Scrapy

- Desktop Apps – Tkinter, PyQt

- Scientific Work – SciPy, SymPy

- IoT Projects – Raspberry Pi, MicroPython

- Cloud & DevOps – Automation tools

- Cybersecurity – Ethical hacking tools

✅ Advantages of Python

- Easy to learn and use

- Huge library support for many tasks

- Open source and free

- Large community for help and resources

- Flexible coding styles

- Portable (runs anywhere)

- Interactive (quick testing and debugging)

⚠️ Disadvantages of Python

- Slower than some languages like C or Java

- GIL (Global Interpreter Lock) limits true parallel execution

- Uses more memory compared to some languages

- Dynamic typing can sometimes cause errors at runtime

- Package management issues may occur

- Too flexible sometimes, which can lead to messy code

- Not ideal for:

  - System-level programming

  - Mobile app development

  - Frontend web development

  - Real-time high-performance systems

## Installing Python & Setting Up IDE

### Step 1 — Download Python

1. Go to https://www.python.org/downloads/

2. Download the latest version (Python 3.x)

3. Run installer — IMPORTANT: Check "Add Python to PATH"

4. Click "Install Now"

### Step 2 — Verify Installation

Open your terminal / command prompt and type:

\`\`\`bash
python --version
# Expected output: Python 3.12.x
\`\`\`

### Step 3 — Choose Your IDE

| IDE | Best For |
| --- | --- |
| VS Code (Recommended) | Lightweight, free, best extensions |
| PyCharm Community | Full-featured Python IDE, great for big projects |
| Jupyter Notebook | Data science, interactive coding |
| IDLE (built-in) | Quick scripts, beginners |
| Thonny | Absolute beginners |

## 🖊️  Your First Python Program

By tradition, the first program in any language prints Hello, World! to the screen. Let's write it!

\`\`\`python
# This is your very first Python program!
# The print() function displays text on screen

print("Hello, World!")
print("Welcome to Python Programming!")
print("Let the learning begin!")
\`\`\`

\`\`\`output
Hello, World!
Welcome to Python Programming!
Let the learning begin!
\`\`\`

## 📝  Python Syntax Basics

### Comments

Comments explain code to humans. Python ignores them when running.

\`\`\`python
# This is a single-line comment

# You can use comments to explain your code
print("Code runs")  # This is an inline comment

"""
This is a multi-line comment (docstring)
It can span multiple lines
Useful for documenting functions and classes
"""
\`\`\`

Why Use Comments?

- Help others understand your code

- Make your code easier to read later

- Explain logic or steps

- Useful for debugging

### Indentation — The Golden Rule

> ⚠️  IMPORTANT: Indentation in Python
> Python uses indentation (spaces/tabs) to define code blocks.
> Unlike other languages that use { }, Python relies on consistent indentation.
> Use 4 spaces per indentation level (standard convention).
> Mixing tabs and spaces causes errors!

![Image2](/pyimages/pimg2.png)

> 💡  Quick Recap — Lesson 1
> • Python is a beginner-friendly, versatile programming language
> • Used in AI, web, data science, automation, and more
> • Install Python from python.org and use VS Code as your IDE
> • print() is used to display output
> • Comments start with # and are ignored by Python
> • Indentation defines code blocks — always use 4 spaces`,

  2: `
Storing and working with different kinds of information

## 📌  What is a Variable?

Variables are used to store data so that it can be used and changed later in a program. A variable is simply a name given to a value.

In Python, you do not need to specify the type of a variable. Python automatically figures out the type based on the value you assign.

\`\`\`python
# Creating variables — it's that simple!
name = 'Alice'
age = 25
height = 5.6
is_student = True

# Printing variables
print(name)       # Output: Alice
print(age)        # Output: 25
print(height)     # Output: 5.6
print(is_student) # Output: True
\`\`\`

## 📏  Variable Naming Rules

| Rule | Example |
| --- | --- |
| Must start with letter or underscore | name, _name ✅ |
| Can contain letters, digits, underscores | my_var1 ✅ |
| Cannot start with a digit | 1name ❌ |
| Cannot use Python keywords | if, for, while ❌ |
| Case sensitive | Name ≠ name ≠ NAME |
| Use snake_case convention | first_name, total_score ✅ |

> 🔑  Python Keywords (Cannot Use as Variable Names)
> False    None     True     and      as       assert
> async    await    break    class    continue def
> del      elif     else     except   finally  for
> from     global   if       import   in       is
> lambda   nonlocal not      or       pass     raise
> return   try      while    with     yield

Valid and Invalid Variable Names

Valid Variable Names

These are correct variable names:

\`\`\`python
age = 21
_colour = "lilac"
total_score = 90
name = 'Alice'
\`\`\`

Rules followed:

- Can start with a letter or underscore _

- Can contain letters, numbers, and underscores

## Invalid Variable Names

## These are wrong and will cause errors:

\`\`\`python
    1name = "Error"     # Cannot start with a number
class = 10          # 'class' is a reserved keyword
user-name = "Doe"   # Hyphen (-) is not allowed
\`\`\`

Assigning Values to Variables

Basic Assignment

We use the = operator to assign values:

\`\`\`python
    x = 5
    y = 3.14
    z = "Hi"
\`\`\`

Same variable can store different types of values.

Multiple Assignments

Assign Same Value to Multiple Variables

You can assign one value to many variables at once:

\`\`\`python
    a = b = c = 100
    print(a, b, c)

100 100 100   # Output
\`\`\`

Assign Different Values at the Same Time

You can assign different values in one line:

\`\`\`python
    x, y, z = 1, 2.5, "Python"
    print(x, y, z)

1 2.5 Python  # Output
\`\`\`

Concept of Object Reference

- In Python, variables do not store actual values directly.

- Instead, they store references (addresses) to objects.

\`\`\`python
    x = 5     # Example 1: Creating an Object
    Y = x     # Example 2: Shared Reference
    x = “careerEzi”   # Example 3: Changing One variable
    y = “Fynity”      # Example 4: Changing Another Variable
\`\`\`

What happens here:

Example 1:

- Python creates an object for value 5

- Variable x points (refers) to that object

Example 2:

- Python does NOT copy the value

- Both x and y point to the same object (5)

Example 3:

- Python creates a new object "careerEzi"

- x now points to this new object

- y still points to the old object 5

Example 4:

- Python creates another new object "Fynity"

- y points to it

- The old value 5 has no references now

That old object becomes ready for garbage collection (Python will remove it automatically).

![Image 3](/pyimages/pimg3.png)

## 🗂️  Python Data Types

Data types in Python are used to group different kinds of data. They show what type of value a variable holds and what actions can be done with it. In Python, everything is treated as an object, so data types are like categories (classes), and variables are examples (objects) of those categories.

| Data Type | Description | Example |
| --- | --- | --- |
| int | Whole numbers (no decimal) | age = 25 |
| float | Numbers with decimal points | price = 9.99 |
| str | Text / characters (in quotes) | name = "Alice" |
| bool | True or False only | is_student = True |
| list | Ordered, changeable collection | nums = [1, 2, 3] |
| tuple | Ordered, unchangeable collection | point = (3, 4) |
| dict | Key-value pairs | {"name": "Alice"} |
| set | Unordered unique elements | {1, 2, 3} |
| NoneType | Represents absence of value | result = None |

### Integer (int)

### An integer is a number without any decimal point. It can be positive, negative, or zero. In Python, integers are used to represent whole numbers such as age, year, or count values. You can also use underscores _ inside large numbers to make them easier to read, and Python will still treat them as normal integers.

\`\`\`python
# Integer examples
age = 25
year = 2024
temperature = -10
population = 1_000_000   # Underscores for readability!

print(type(age))         # <class 'int'>
print(type(population))  # <class 'int'>
\`\`\`

### Float (float)

### A float is a number that contains a decimal point. It is used when more precise values are needed, such as prices, measurements, or scientific data. Python also supports scientific notation, which is useful for representing very large or very small numbers.

\`\`\`python
# Float examples
price = 9.99
pi = 3.14159
temperature = 36.6
scientific = 1.5e10   # Scientific notation = 15000000000.0

print(type(price))   # <class 'float'>
\`\`\`

### String (str)

### A string is used to store text. It can include letters, numbers, and symbols, and must be written inside single quotes ' ' or double quotes " ". Python also allows multi-line strings using triple quotes. A modern and useful feature is the f-string, which lets you easily insert variables into a string.

\`\`\`python
# String examples — use single or double quotes
name = "Alice"
greeting = 'Hello, World!'

# Multi-line string
"""
This is a
multi-line string
"""

# f-string (formatted string) — most modern way
name = "Bob"
age = 30
message = f"My name is {name} and I am {age} years old."
print(message)   # My name is Bob and I am 30 years old.
\`\`\`

### Boolean (bool)

### A boolean represents one of two values: True or False. It is commonly used in conditions and decision-making in programs. Boolean values are often the result of comparisons, such as checking if one number is greater than another.

\`\`\`python
# Boolean examples
is_student = True
has_license = False

# Booleans from comparisons
x = 10
print(x > 5)    # True
print(x == 3)   # False

print(type(True))  # <class 'bool'>
\`\`\`

## 🔄  Type Casting in Programming

In programming, variables store different types of data such as integers, decimal numbers, strings, and more. These data types decide how the computer understands and works with the data.

Sometimes, we need to convert one data type into another so that operations can be performed correctly. This process is called type casting (or type conversion).

Type casting is important because it helps avoid errors, ensures correct results, and makes programs more flexible.

What is Type Casting?

Type casting means changing a value from one data type to another.

For example:

- Converting an integer to a float

- Converting a string to an integer

This helps when working with different types of data in the same program.

![Image 4](/pyimages/pimg4.png)

Types of Type Casting

There are two main types of type casting:

1. Implicit (Automatic) Type Casting

2. Explicit (Manual) Type Casting

# Implicit Type Casting (Automatic)

Implicit type casting happens automatically. The programmer does not need to do anything.

When an operation involves different data types, Python (or any language) automatically converts the smaller type into a larger or more precise type to avoid data loss.

This process is also called type promotion.

Example

\`\`\`python
    x = 5      # int
    y = 2.5    # float

    result = x + y
    print(result)        # 7.5
    print(type(result))  # float
\`\`\`

- Python converts 5 (int) into 5.0 (float)

- Then performs the addition

# Explicit Type Casting (Manual)

Explicit type casting is done manually by the programmer.

Sometimes, automatic conversion is not enough or may give wrong results. In such cases, we force the conversion using functions.

### Example:

\`\`\`python
    x = 5
    y = 2

    result = float(x) / y
    print(result)   # 2.5
\`\`\`

- We manually convert x into a float using float()

Difference Between Implicit and Explicit Type Casting

| Feature | Implicit (Automatic) | Explicit (Manual) |
| --- | --- | --- |
| Definition | Done automatically by Python | Done by programmer |
| Control | No control needed | Full control by user |
| When it happens | During operations | When explicitly written |
| Risk | May lose precision sometimes | Must be used carefully |
| Syntax | No special syntax | Uses functions like int(), float() |

| Function | Description |
| --- | --- |
| int(x) | Convert x to integer |
| float(x) | Convert x to float |
| str(x) | Convert x to string |
| bool(x) | Convert x to boolean |
| list(x) | Convert x to list |

\`\`\`python
# Type casting examples
x = "42"              # This is a string
print(type(x))        # <class 'str'>

num = int(x)          # Convert string → int
print(num + 8)        # 50  (math works now!)

f = float('3.14')     # string → float
print(f * 2)          # 6.28

s = str(100)          # int → string
print('Value: ' + s)  # Value: 100

# bool conversions
print(bool(0))        # False
print(bool(1))        # True
print(bool(""))       # False
print(bool("hello"))  # True
\`\`\`

## ⌨️  Input / Output Functions

### print() — Output

### The print() function is used to display output on the screen. It can print text, numbers, variables, and multiple values together. You can also customize how the output appears using options like sep (separator) and end (line ending). It also supports f-strings, which allow you to easily include variables inside text.

\`\`\`python
# Basic print
print("Hello!")                    # Hello!

# Print multiple values
print("Name:", "Alice", "Age:", 25) # Name: Alice Age: 25

# Custom separator
print("A", "B", "C", sep="-")      # A-B-C

# Custom end (default is newline)
print("Hello", end=" ")
print("World")                     # Hello World

# Print with f-string
name = "Alice"
age = 25
print(f"{name} is {age} years old.")
\`\`\`

### input() — Getting User Input

### The input() function is used to take input from the user. By default, the value entered by the user is always treated as a string, even if it looks like a number. This allows programs to interact with users.

\`\`\`python
# input() always returns a string!
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Convert input to number
age = int(input("Enter your age: "))
print(f"In 10 years, you will be {age + 10}")

price = float(input("Enter price: "))
print(f"With tax: {price * 1.18:.2f}")
\`\`\`

\`\`\`output
Enter your name: Alice
Hello, Alice!
Enter your age: 20
In 10 years, you will be 30
\`\`\`

- print() → Used to show output

- input() → Used to take user input

- input() returns a string by default

> 💡  Quick Recap — Lesson 2
> • Variables store data using the assignment operator =
> • Variable names: start with letter/underscore, case-sensitive, use snake_case
> • Main types: int, float, str, bool
> • Use type() to check the type of a variable
> • Type casting: int(), float(), str(), bool()
> • input() returns a string — convert with int() or float() for numbers`,

  3: `
Performing operations on data — the building blocks of logic

## 📌  What are Operators?

Operators in Python are special symbols used to perform operations on variables and values. They allow you to carry out tasks like calculations, comparisons, and logical decisions within a program.

## ➕  Arithmetic Operators

## Arithmetic operators in Python are used to perform mathematical operations on numbers, such as addition, subtraction, multiplication, and division.

| Operator | Description & Example |
| --- | --- |
| + | Addition:            5 + 3 = 8 |
| - | Subtraction:         10 - 4 = 6 |
| * | Multiplication:      3 * 4 = 12 |
| / | Division (float):    10 / 3 = 3.333... |
| // | Floor Division:      10 // 3 = 3 |
| % | Modulus (remainder): 10 % 3 = 1 |
| ** | Exponentiation:      2 ** 8 = 256 |

\`\`\`python
# Arithmetic operators in action
a = 10
b = 3

print(a + b)    # 13  — Addition
print(a - b)    # 7   — Subtraction
print(a * b)    # 30  — Multiplication
print(a / b)    # 3.3333...  — Division
print(a // b)   # 3   — Floor division (drops decimal)
print(a % b)    # 1   — Remainder
print(a ** b)   # 1000 — 10 to the power of 3

# Real-world example: Calculate circle area
import math
radius = 7
area = math.pi * radius ** 2
print(f"Circle area: {area:.2f}")  # Circle area: 153.94
\`\`\`

## 🔍  Comparison Operators

Comparison operators in Python are used to compare two values and return a result of True or False based on the comparison.

| Operator | Meaning & Example |
| --- | --- |
| == | Equal to:              5 == 5  → True |
| != | Not equal to:          5 != 3  → True |
| > | Greater than:          10 > 5  → True |
| < | Less than:             3 < 7   → True |
| >= | Greater than or equal: 5 >= 5  → True |
| <= | Less than or equal:    3 <= 4  → True |

\`\`\`python
age = 18

print(age == 18)   # True  — exactly 18
print(age != 21)   # True  — not 21
print(age > 17)    # True  — over 17
print(age < 18)    # False — not under 18
print(age >= 18)   # True  — 18 or older
print(age <= 18)   # True  — 18 or younger

# Comparison result stored in variable
can_vote = age >= 18
print(f"Can vote: {can_vote}")   # Can vote: True
\`\`\`

## 🧠  Logical Operators

Logical operators in Python are used to combine multiple conditions and return a True or False result based on the logic applied.

| Operator | Meaning | Example |
| --- | --- | --- |
| and | True if BOTH conditions are True | age>18 and has_id → True |
| or | True if AT LEAST ONE is True | is_admin or is_mod → True |
| not | Reverses the condition | not is_banned → True |

\`\`\`python
age = 20
has_id = True
is_banned = False

# and — both must be true
print(age >= 18 and has_id)    # True — can enter

# or — at least one must be true
print(age < 18 or has_id)      # True — has_id is True

# not — reverses boolean
print(not is_banned)           # True — not banned

# Combining all three
can_enter = (age >= 18) and has_id and (not is_banned)
print(f"Can enter club: {can_enter}")   # Can enter club: True
\`\`\`

## 📝  Assignment Operators

Assignment operators in Python are used to assign values to variables and update their values in a shorter and simpler way.

| Operator | Equivalent To |
| --- | --- |
| x = 5 | Assign 5 to x |
| x += 3 | x = x + 3 |
| x -= 3 | x = x - 3 |
| x *= 3 | x = x * 3 |
| x /= 3 | x = x / 3 |
| x //= 3 | x = x // 3 |
| x %= 3 | x = x % 3 |
| x **= 3 | x = x ** 3 |

\`\`\`python
score = 100

score += 50     # score = 100 + 50 = 150
print(score)    # 150

score -= 20     # score = 150 - 20 = 130
print(score)    # 130

score *= 2      # score = 130 * 2 = 260
print(score)    # 260

score //= 3     # score = 260 // 3 = 86
print(score)    # 86
\`\`\`

Membership Operators

Used to check if a value exists in a sequence (list, string, etc.)

Operators:

- in

- not in

\`\`\`python
name = "Python"
print("P" in name)       # True
print("z" not in name)   # True
\`\`\`

Identity Operators

Used to check if two variables refer to the same object.

Operators:

- is

- is not

\`\`\`python
x = [1, 2]
y = x
print(x is y)  # True (same object)
z = [1, 2]
print(x is z)  # False (different objects)
\`\`\`

## 🔢  Operator Precedence

Operator precedence in Python refers to the order in which different operators are evaluated in an expression, determining which operation is performed first.

| Priority (Highest first) | Operators |
| --- | --- |
| 1. Parentheses | ( ) |
| 2. Exponentiation | ** |
| 3. Unary (positive/negative) | +x, -x |
| 4. Multiplication/Division | *, /, //, % |
| 5. Addition/Subtraction | +, - |
| 6. Comparison | ==, !=, <, >, <=, >= |
| 7. Logical NOT | not |
| 8. Logical AND | and |
| 9. Logical OR | or |

\`\`\`python
# Precedence examples
result = 2 + 3 * 4       # 2 + 12 = 14 (not 20!)
print(result)             # 14

result = (2 + 3) * 4     # 5 * 4 = 20 (parentheses first!)
print(result)             # 20

result = 2 ** 3 + 1      # 8 + 1 = 9
print(result)             # 9
\`\`\`

> 💡  Quick Recap — Lesson 3
> • Arithmetic: +, -, *, /, //, %, ** for math operations
> • Comparison: ==, !=, >, <, >=, <= return True/False
> • Logical: and, or, not combine multiple conditions
> • Assignment: =, +=, -=, *= shorthand for updating variables
> • Precedence: Parentheses > Exponent > Multiply/Divide > Add/Subtract`,

  4: `# 🔀 LESSON 4
## Control Flow Statements
Making decisions with if, elif, and else

## 📌  What is Control Flow?

Control flow is the way a program decides which instructions to run and in what order. It allows the program to make decisions, repeat actions, and respond to different situations instead of just running code from top to bottom.

Without control flow, programs would be very limited and could not handle real-world logic like checking conditions or making choices.

## 🔷  The if Statement

The if statement is used to check a condition. If the condition is True, the code inside the if block runs. If the condition is False, the code is skipped.

Python uses indentation (spaces) to define the block of code that belongs to the if statement.

### Syntax

\`\`\`
if condition:
    # code to run if condition is True
    # (must be indented!)
\`\`\`

Example code:

\`\`\`python
age = 20

if age >= 18:
    print("You are an adult.")
    print("You can vote.")

# Since age=20 >= 18, both print statements run

▶  Output
You are an adult.
You can vote.
\`\`\`

- The condition age >= 18 is checked

- Since it is True, the message is printed

## Important Points

- The condition must return True or False

- A colon : is required after the condition

- Indentation is mandatory in Python

- If the condition is False, nothing happens

## if...else

The if...else statement is used when you want to execute one block of code if a condition is True and another block if it is False. It provides a fallback option when the condition does not meet.

\`\`\`python
temperature = 15

if temperature >= 25:
    print("It's warm! Wear light clothes.")
else:
    print("It's cool. Wear a jacket.")

# Output: It's cool. Wear a jacket.
\`\`\`

🔍 Explanation:

- The program checks the condition: temperature >= 25

- Here, 15 >= 25 is False

- So, the if block is skipped

👉 Flow (Iteration of execution):

1. Check condition

2. Condition = False

3. Skip if

4. Execute else

## 🔷  if...elif...else

### The if...elif...else structure is used to check multiple conditions one by one. As soon as one condition becomes True, its block runs and the rest are skipped.

### Syntax

\`\`\`
if condition1:
    # runs if condition1 is True
elif condition2:
    # runs if condition2 is True
elif condition3:
    # runs if condition3 is True
else:
    # runs if none of the above are True
\`\`\`

Example code:

\`\`\`python
score = 75

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score} → Grade: {grade}")
# Output: Score: 75 → Grade: C
\`\`\`

🔍 Explanation:

- Python checks conditions one by one from top to bottom

- 75 >= 90 → False

- 75 >= 80 → False

- 75 >= 70 → True ✅

👉 Once a condition is True:

- That block runs (grade = "C")

- Remaining conditions are not checked

👉 Flow (Step-by-step iteration):

1. Check first condition → False

2. Move to next → False

3. Next condition → True

4. Execute that block

5. Stop checking further

## 🔗  Nested Conditions

Nested conditions mean placing an if statement inside another if statement. This is useful when decisions depend on multiple conditions step by step.

\`\`\`python
age = 25
has_ticket = True
is_vip = False

if age >= 18:
    if has_ticket:
        if is_vip:
            print("Welcome to the VIP lounge!")
        else:
            print("Welcome! Enjoy the show.")
    else:
        print("No ticket — purchase at the counter.")
else:
    print("Sorry, 18+ only.")

# Output: Welcome! Enjoy the show.
\`\`\`

🔍 Explanation:

- First condition: age >= 18 → True

- Go inside first if

- Second condition: has_ticket → True

- Go inside second if

- Third condition: is_vip → False

So:

- Skip VIP block

- Execute else → "Welcome! Enjoy the show."

Flow (Step-by-step iteration):

1. Check age >= 18 → True

2. Move inside

3. Check has_ticket → True

4. Move inside

5. Check is_vip → False

6. Execute inner else

7. Stop

> 💡  Better Alternative — Use 'and'
> Instead of deeply nested ifs, combine conditions with 'and':
> if age >= 18 and has_ticket:
>     print('Welcome!')
> This is cleaner and easier to read. Avoid nesting more than 2-3 levels.

## ⚡  One-Line Conditional (Ternary)

The one-line conditional (also called a ternary operator) is used to write simple if-else conditions in a single line. It makes the code shorter and easier to read for small decisions.

\`\`\`python
# Syntax: value_if_true  if  condition  else  value_if_false
\`\`\`

Example code 1:

\`\`\`python
age = 20
status = "Adult" if age >= 18 else "Minor"
print(status)   # Adult
\`\`\`

▶️ Execution Flow:

1. Check condition → age >= 18 → True

2. Since True → "Adult" is assigned to status

3. Output → Adult

Example code 2:

\`\`\`python

x = 7
parity = "Odd" if x % 2 != 0 else "Even"
print(parity)
\`\`\`

▶️ Execution Flow:

1. Check condition → x % 2 != 0 → True

2. Since True → "Odd" is assigned

3. Output → Odd

## ⚠️  Indentation — The Golden Rule

\`\`\`python
# ✅ CORRECT — consistent 4-space indentation
if True:
    print('Line 1')   # 4 spaces
    print('Line 2')   # 4 spaces

# ❌ WRONG — causes IndentationError
if True:
  print('2 spaces')   # Error! Inconsistent!
    print('4 spaces') # Error! Inconsistent!
\`\`\`

> 💡  Quick Recap — Lesson 4
> • if checks a condition — runs block if True
> • else provides a fallback when if is False
> • elif checks additional conditions in sequence
> • Only the FIRST matching branch executes
> • Ternary: value_if_true if condition else value_if_false
> • Always indent code blocks with 4 spaces!`,

  5: `
Repeating actions efficiently with for and while loops

## 📌  What are Loops?

Loops are used to repeat a block of code multiple times without writing the same code again and again. They are very important because they help in saving time, reducing code length, and handling repetitive tasks efficiently.

For example, if you want to print numbers from 1 to 100, instead of writing 100 print statements, you can use a loop.

## 🔄  The for Loop

### The for loop is used to iterate over a sequence, such as a list, string, or range of numbers. It executes a block of code once for each item in the sequence.

### Syntax

\`\`\`
for variable in sequence:
    # code to execute for each item
\`\`\`

🔍 How it Works

- The loop takes each value from the sequence one by one

- Assigns it to the variable

- Executes the code block

- Repeats until all items are processed

\`\`\`python
# Loop through a list
fruits = ['apple', 'banana', 'cherry']

for i in fruits:
    print(f"I love {i}!")

# Output:
# I love apple!
# I love banana!
# I love cherry!
\`\`\`

🔄 Iteration Flow

- 1st iteration
i = 'apple'
Output → I love apple!

- 2nd iteration
i = 'banana'
Output → I love banana!

- 3rd iteration
i = 'cherry'
Output → I love cherry!

### The range() Function

The range() function is used to generate a sequence of numbers, which is commonly used in loops. It helps you repeat a block of code a specific number of times without manually writing numbers.

| Syntax | Description |
| --- | --- |
| range(stop) | 0, 1, 2, ..., stop-1 |
| range(start, stop) | start, start+1, ..., stop-1 |
| range(start, stop, step) | start, start+step, ... (step can be negative) |

🔍 Explanation

- start → where the sequence begins (default is 0)

- stop → where the sequence ends (not included)

- step → how much the number increases each time (default is 1)

\`\`\`python
# range(5) = 0, 1, 2, 3, 4
for i in range(5):
    print(i, end=' ')   # 0 1 2 3 4

# range(1, 6) = 1, 2, 3, 4, 5
for i in range(1, 6):
    print(i, end=' ')   # 1 2 3 4 5

# range(0, 10, 2) = 0, 2, 4, 6, 8
for i in range(0, 10, 2):
    print(i, end=' ')   # 0 2 4 6 8

# Count down!
for i in range(5, 0, -1):
    print(i, end=' ')   # 5 4 3 2 1
\`\`\`

### enumerate() — Index + Value

### The enumerate() function is used when you need both the position (index) and the value while looping through a sequence like a list.

### Normally, a for loop gives only the value, but enumerate() adds an automatic counter (index) along with it.

\`\`\`python
# enumerate gives both index and value
students = ['Alice', 'Bob', 'Charlie']

for index, name in enumerate(students):
    print(f"{index + 1}. {name}")

# Output:
# 1. Alice
# 2. Bob
# 3. Charlie
\`\`\`

🔄 Step-by-Step Execution

- 1st iteration
index = 0, name = 'Alice'
Output → 1. Alice

- 2nd iteration
index = 1, name = 'Bob'
Output → 2. Bob

- 3rd iteration
index = 2, name = 'Charlie'
Output → 3. Charlie

📌 What is Happening?

- enumerate(students) returns pairs like:
(0, 'Alice'), (1, 'Bob'), (2, 'Charlie')

- index stores the position

- name stores the actual value

- index + 1 is used to start numbering from 1 instead of 0

## 🔁  The while Loop

The while loop keeps executing as long as its condition remains True. Use it when you don't know ahead of time how many iterations are needed.

### Syntax

\`\`\`
while condition:
    # code to execute
    # must eventually make condition False (or use break)
\`\`\`

\`\`\`python
# Count from 1 to 5
count = 1

while count <= 5:
    print(f"Count: {count}")
    count += 1   # IMPORTANT: Update condition variable!

# Output:
# Count: 1 ... Count: 5
\`\`\`

Step-by-Step Execution (Iteration)

1. count = 1 → condition 1 <= 5 → True → print

2. count = 2 → condition 2 <= 5 → True → print

3. count = 3 → condition 3 <= 5 → True → print

4. count = 4 → condition 4 <= 5 → True → print

5. count = 5 → condition 5 <= 5 → True → print

6. count = 6 → condition 6 <= 5 → False → loop stops

> ⚠️  Infinite Loop Warning!
> If the condition never becomes False, the loop runs forever!
> # DANGEROUS — infinite loop!
> while True:          # Always True!
>     print('Forever') # Runs indefinitely
> Always ensure the condition can become False, or use 'break'.

Important Points

- The loop runs only while the condition is True

- You must update the variable inside the loop

- If the condition never becomes False → infinite loo

\`\`\`python
# Practical while loop: User input validation
while True:
    password = input("Enter password: ")
    if password == "secret123":
        print("Access granted!")
        break   # Exit the loop
    else:
        print("Wrong password. Try again.")
\`\`\`

## 🛑  break, continue, pass

### break — Exit the Loop Immediately

### The break statement is used to stop the loop instantly, even if the loop condition is still True. Once break is executed, the loop ends and control moves outside the loop

\`\`\`python
# Find first even number
numbers = [1, 3, 7, 4, 9, 2]

for num in numbers:
    if num % 2 == 0:     # Found an even number
        print(f"First even: {num}")
        break            # Stop searching

# Output: First even: 4
\`\`\`

Execution Flow:

- 1 → not even → continue

- 3 → not even → continue

- 7 → not even → continue

- 4 → even → print → break loop

- Loop stops (does not check 9, 2)

Output: First even: 4

### continue — Skip to Next Iteration

### The continue statement is used to skip the current iteration and move to the next loop cycle without executing the remaining code in that iteration.

\`\`\`python
# Print only odd numbers
for i in range(1, 11):
    if i % 2 == 0:       # If even
        continue          # Skip this iteration
    print(i, end=" ")    # Only prints odd numbers

# Output: 1 3 5 7 9
\`\`\`

Execution Flow:

- If number is even → skip

- If number is odd → print

Output: 1 3 5 7 9

### pass — Placeholder (Do Nothing)

### The pass statement is used when a statement is required but you don’t want to write any code yet. It acts as a placeholder and does nothing.

\`\`\`python
# pass is used when syntax requires a block but you have no code yet
for i in range(5):
    pass   # TODO: add logic later

# Also used for empty functions/classes
def my_function():
    pass   # Coming soon!
\`\`\`

Explanation:

- Loop runs but does nothing

- Function is defined but has no logic yet

## 🔗  Nested Loops

Loops inside loops — useful for grids, patterns, and tables.

\`\`\`python
# Multiplication table (3x3)
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i*j:3}", end="")
    print()   # New line after each row

# Output:
#   1  2  3
#   2  4  6
#   3  6  9

# Star pattern
for i in range(1, 6):
    print('*' * i)
# Output:
# *
# **
# ***
# ****
# *****
\`\`\`

> 💡  Quick Recap — Lesson 5
> • for loop: iterates over a sequence a known number of times
> • while loop: repeats while a condition is True
> • range(start, stop, step): generates number sequences
> • break: immediately exits the loop
> • continue: skips rest of current iteration, moves to next
> • pass: placeholder — does nothing
> • Always update the condition variable in while loops!

# Python Programming
## COMPLETE BEGINNER COURSE — LESSONS 6 TO 10
Strings • Lists • Tuples & Sets • Dictionaries • Functions
📘  What you will learn in this volume:
Deep-dive into Python's most-used data structures and reusable functions

| Lesson | Topic & Description |
| --- | --- |
| 📝  Lesson 6 | Strings — indexing, slicing, methods, f-strings, immutability |
| 📋  Lesson 7 | Lists — CRUD methods, sorting, list comprehension, patterns |
| 🗃️  Lesson 8 | Tuples & Sets — immutability, unpacking, set operations, differences |
| 📖  Lesson 9 | Dictionaries — key-value data, nesting, comprehension, patterns |
| ⚡  Lesson 10 | Functions — params, return, defaults, *args/**kwargs, lambda, scope |`,

  6: `
Master Python's most-used data type — text processing & formatting

## 📌  What Is a String?

A string is an ordered sequence of characters enclosed in quotes. In Python, strings belong to the str class and are immutable — meaning once created, individual characters cannot be changed. Strings can hold letters, numbers, symbols, spaces, emojis, and even Unicode characters from any language.

> 🔑  Key String Facts
> • Strings are IMMUTABLE — you cannot change characters in place
> • Python has no separate 'char' type — a single character is a string of length 1
> • Strings support indexing, slicing, iteration, and many built-in methods
> • Use single quotes ' ', double quotes " ", or triple quotes """ """ to create strings
> • Triple-quoted strings can span multiple lines

## Creating Strings — 4 Ways

## 1. Single Quotes

## Single quotes are used to create simple strings.

\`\`\`python
1. Single quotes
name = 'Alice'
\`\`\`

Explanation:

- 'Alice' is a string value

- It is stored in the variable name

- Works best for short and simple text

## 2. Double Quotes

Double quotes work the same as single quotes

\`\`\`python
# Double quotes (same result — use either)
greeting = "Hello, World!"
\`\`\`

Explanation:

- "Hello, World!" is also a string

- You can use double quotes when your text contains a single quote
Example: "It's easy"

3. Triple Quotes (Multi-line Strings)

Triple quotes are used for strings that span multiple lines.

\`\`\`python
# Triple quotes — multi-line strings
"""
This is a
multi-line string.
It spans multiple lines.
"""
\`\`\`

Explanation:

- Allows writing text on multiple lines

- No need for \\n for line breaks

- Commonly used for long text, documentation, or messages

## 4. Escape Characters

Escape characters are used to include special characters inside strings.

\`\`\`python

# 4. Escape characters inside strings
path    = "C:\\\\Users\\\\Alice"  # \\\\ = backslash
newline = "Line1\\nLine2"     # \\n = new line
tab     = "Name:\\tAlice"     # \\t = tab
quote   = 'He said \\'Hi\\''  # \\'=apostrophe
\`\`\`

## 🔢  String Indexing — Accessing Individual Characters

Strings are sequences, so every character has a numeric position called an index. Python supports both positive (left-to-right) and negative (right-to-left) indexing.

![Image 5](/pyimages/pimg5.png)

\`\`\`python
word = "PYTHON"          # 6 characters

# Positive indexing (starts at 0)
print(word[0])   # P — first character
print(word[1])   # Y
print(word[5])   # N — last character

# Negative indexing (counts from end)
print(word[-1])  # N — last character
print(word[-2])  # O — second from end
print(word[-6])  # P — same as word[0]

# Using len() to get string length
print(len(word)) # 6
\`\`\`

## ✂️  String Slicing — Extracting Substrings

Slicing lets you extract a portion of a string using the [start:stop:step] syntax. The start index is inclusive, stop is exclusive.

> 📐  Syntax
> string [ start : stop : step ]
> start  = index to begin from (default: 0)
> stop   = index to stop BEFORE (default: end of string)
> step   = how many characters to jump (default: 1)

\`\`\`python
s = "HELLO WORLD"

# Basic slices
print(s[0:5])    # HELLO    (index 0,1,2,3,4)
print(s[6:])     # WORLD    (from 6 to end)
print(s[:5])     # HELLO    (from start to 4)
print(s[-5:])    # WORLD    (last 5 chars)

# Step slicing
print(s[::2])    # HLOWRD   (every 2nd char)
print(s[1::2])   # ELWRD    (start at 1, step 2)

# Reverse a string — classic trick!
print(s[::-1])   # DLROW OLLEH

# Practical: extract part of a filename
filename = "report_2024.pdf"
name = filename[:6]    # report
ext  = filename[-3:]   # pdf

▶  Output
HELLO
WORLD
HELLO
WORLD
HLOWRD
ELWRD
DLROW OLLEH
report
pdf
\`\`\`

## 🔧  String Methods — Complete Reference

String methods are built-in functions you call on string objects. They always return NEW strings — they never modify the original (because strings are immutable).

![Image 6](/pyimages/pimg6.png)

String Methods

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| upper() | Converts to uppercase | "hello".upper() | "HELLO" |
| lower() | Converts to lowercase | "HELLO".lower() | "hello" |
| title() | Capitalizes each word | "hello world".title() | "Hello World" |
| capitalize() | Capitalizes first letter | "hello".capitalize() | "Hello" |
| swapcase() | Swaps upper ↔ lower | "PyThOn".swapcase() | "pYtHoN" |

Space Handling

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| strip() | Removes both side spaces | " hi ".strip() | "hi" |
| lstrip() | Removes left spaces | " hi".lstrip() | "hi" |
| rstrip() | Removes right spaces | "hi ".rstrip() | "hi" |

Replace & Modify

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| replace() | Replace text | "hi world".replace("world","Python") | "hi Python" |

Split & Join

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| split() | Split string → list | "a,b,c".split(",") | ['a','b','c'] |
| join() | Join list → string | ",".join(['a','b','c']) | "a,b,c" |

Searching

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| find() | First index of substring | "hello".find("ll") | 2 |
| rfind() | Last index of substring | "hello".rfind("l") | 3 |
| count() | Count occurrences | "hello".count("l") | 2 |

Checking (Boolean Methods)

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| startswith() | Starts with text | "hello".startswith("he") | True |
| endswith() | Ends with text | "hello".endswith("lo") | True |
| isdigit() | All digits | "123".isdigit() | True |
| isalpha() | All letters | "abc".isalpha() | True |
| isalnum() | Letters + numbers | "abc123".isalnum() | True |
| islower() | All lowercase | "abc".islower() | True |
| isupper() | All uppercase | "ABC".isupper() | True |
| isspace() | Only spaces | " ".isspace() | True |

Other Useful Methods

| Method | Description | Example | Output |
| --- | --- | --- | --- |
| len() | Length of string | len("hello") | 5 |
| index() | Position of substring | "hello".index("e") | 1 |
| splitlines() | Split by lines | "a\\nb".splitlines() | ['a','b'] |
| partition() | Split into 3 parts | "hi=ok".partition("=") | ('hi','=','ok') |
| encode() | Encode string | "hi".encode() | b'hi' |

### Case Methods

### Case methods are used to change the letter case (uppercase/lowercase) of a string. These methods help in formatting text, making it consistent and readable.

### Important:
All these methods return a new string and do not change the original string.

\`\`\`python
s = "hello world python"

print(s.upper())       # HELLO WORLD PYTHON
print(s.lower())       # hello world python
print(s.title())       # Hello World Python
print(s.capitalize())  # Hello world python
print(s.swapcase())    # HELLO WORLD PYTHON → hello world python
\`\`\`

### Strip / Search Methods

### Strip and search methods are used to clean strings (remove unwanted spaces/characters) and find or check content inside strings. These methods do not change the original string — they return a new result.

\`\`\`python
# strip removes leading and trailing whitespace
dirty = "   hello   "
print(dirty.strip())    # "hello"
print(dirty.lstrip())   # "hello   " (left only)
print(dirty.rstrip())   # "   hello" (right only)

# find vs index
s = "hello world"
print(s.find("world"))  # 6  (returns -1 if not found)
print(s.index("world")) # 6  (raises ValueError if not found)
print(s.find("xyz"))    # -1 (safe!)
print(s.count("l"))     # 3  (counts all occurrences)
print("hello" in s)     # True (membership test)
\`\`\`

### Split & Join — Very Commonly Used

### Split and Join are very useful string methods used for converting between strings and lists.

### 🔹 Concept

- split() → breaks a string into parts (list)

- join() → combines list elements into a single string

\`\`\`python
# split: string → list
csv_row = "Alice,25,Hyderabad,Engineer"
parts = csv_row.split(",")
print(parts)  # ['Alice', '25', 'Hyderabad', 'Engineer']

sentence = "hello world python"
words = sentence.split()   # split on any whitespace
print(words)  # ['hello', 'world', 'python']

# join: list → string
joined = " - ".join(words)
print(joined)  # hello - world - python

path_parts = ["home", "alice", "documents"]
path = "/".join(path_parts)
print(path)    # home/alice/documents
\`\`\`

When this code runs, Python processes each line in sequence and internally works on the string data.

It starts with the string "Alice,25,Hyderabad,Engineer". The split(",") method scans the string and breaks it wherever it finds a comma, converting the single string into a list:
['Alice', '25', 'Hyderabad', 'Engineer'].

Next, the string "hello world python" is processed. The split() method (without arguments) automatically splits the string at whitespace (spaces), producing the list:
['hello', 'world', 'python'].

Then, the join() method is used. Python takes each word from the list and combines them into a single string using " - " as a separator. This results in:
"hello - world - python".

Finally, the list ["home", "alice", "documents"] is joined using "/" as a separator. Python connects each element with /, creating a path-like string:
"home/alice/documents".

## ✨  f-Strings — Modern String Formatting

- f-strings are used to insert variables and expressions directly inside strings

- Start the string with f

- Use { } to place variables or expressions

- They are faster, cleaner, and more readable

> 📐  Syntax
> f"text {variable} more text"
> f"expression result: {2 + 3}"
> f"formatted number: {pi:.2f}"
> f"padded: {name:>15}"

\`\`\`python
name  = "Alice"
age   = 25
score = 98.765

# Basic embedding
print(f"My name is {name}.")         # My name is Alice.
print(f"{name} is {age} years old.") # Alice is 25 years old.

# Expressions inside {}
print(f"In 5 years: {age + 5}")      # In 5 years: 30
print(f"Upper: {name.upper()}")      # Upper: ALICE

# Number formatting
print(f"Score: {score:.2f}")         # Score: 98.77
print(f"Score: {score:.0f}")         # Score: 99
print(f"{1000000:,}")                # 1,000,000 (comma separator)

# Width and alignment
print(f"{name:>10}")  # "     Alice" (right-align in 10)
print(f"{name:<10}")  # "Alice     " (left-align in 10)
print(f"{name:^10}")  # "  Alice   " (center in 10)

▶  Output
My name is Alice.
Alice is 25 years old.
In 5 years: 30
Upper: ALICE
Score: 98.77
Score: 99
1,000,000
     Alice
Alice
  Alice
\`\`\`

## 🔄  String Immutability — Why It Matters

## Strings in Python are immutable, which means:

## You cannot change characters directly

\`\`\`python
s = "Hello"

# You CANNOT change a character directly
# s[0] = 'J'   ← TypeError: 'str' does not support item assignment

# Instead, create a NEW string
s_new = "J" + s[1:]
print(s_new)  # Jello

# replace() also creates a new string
result = s.replace("Hello", "Jello")
print(result)  # Jello
print(s)       # Hello  (original unchanged!)

# String concatenation creates a new string
a = "Hello"
b = " World"
c = a + b      # Creates new string
print(c)       # Hello World
print(a)       # Hello (unchanged)
\`\`\`

## 📊  String Operations Summary

| Operation | Example & Result |
| --- | --- |
| Concatenation (+) | "Hello" + " World" → "Hello World" |
| Repetition (*) | "Ha" * 3 → "HaHaHa" |
| Membership (in) | "ell" in "hello" → True |
| Length (len) | len("hello") → 5 |
| Comparison | "abc" < "abd" → True (alphabetical) |
| Indexing | "hello"[1] → "e" |
| Slicing | "hello"[1:4] → "ell" |

> 💡  Lesson 6 Recap — Key Takeaways
> • Strings are immutable ordered sequences of characters
> • Indexing: s[0]=first, s[-1]=last; Slicing: s[start:stop:step]
> • s[::-1] reverses a string — a very common trick!
> • Methods: upper/lower/title/strip/split/join/replace/find/count
> • f-strings: f'Hi {name}!' — the modern, preferred way to format
> • Methods always RETURN new strings — they never change the original`,

  7: `
Python's most versatile and widely-used data structure

## 📌  What Is a List?

A list is an ordered, mutable (changeable) collection that can hold any number of items of any data type — including other lists! Lists are one of Python's most powerful built-in structures and are used everywhere.

Features of Python Lists

- Allows duplicate values
→ The same element can appear more than once

- Mutable
→ You can modify the list after creating it (add, update, delete items)

- Ordered
→ Elements stay in the order they are added

- Index-based
→ Each item has a position starting from index 0

- Heterogeneous
→ A list can contain different data types like numbers, strings, booleans, or even other lists

> 🔑  Key List Properties
> • ORDERED — items maintain their insertion order
> • MUTABLE — you can add, remove, and modify items after creation
> • ALLOWS DUPLICATES — the same value can appear multiple times
> • INDEXED — access items by position starting at index 0
> • HETEROGENEOUS — can contain mixed types: [1, 'hello', 3.14, True]
> • NESTABLE — lists can contain other lists (2D grids, matrices)

## Creating Listss

## Lists can be created in multiple ways such as:ssssssssss

- Using square brackets []

- Using the list() constructor

- By repeating elements

1. Using Square Brackets:

## You can create a list directly by enclosing elements inside square brackets [].

\`\`\`python
a = [10, 20, 30, 40, 50] # List of integers
b = ['cat', 'dog', 'goat'] # List of strings
c = [1, 'John', 2.14, True] # Mixed data types
print(a)
print(b)
print(c)
\`\`\`

## Output:

## [10, 20, 30, 40, 50]

## ['cat', 'dog', 'goat']

## [1, 'John', 2.14, True]

2. Using list() Constructor:

## A list can also be created by using the list() function and passing an iterable like a tuple, string, or another list.

\`\`\`python
a = list((10, 20, 30, 'John', 2.5))
print(a)
b = list("careerEzi")
print(b)
\`\`\`

## Output:

## [10, 20, 30, 'John', 2.5]

## ['c', 'a', 'r', 'e', 'e', 'r', 'E', 'z', 'i']

3. Creating a List with Repeated Elements:

## You can create a list with repeated values by using the multiplication (*) operator.

\`\`\`python

a = [8] * 5
b = [0] * 3
print(a)
print(b)
\`\`\`

Output:

[8, 8, 8, 8, 8]

[0, 0, 0]

Internal Representation of Lists

In Python, a list does not store actual values directly. Instead, it stores references (memory addresses) to objects.

- A list holds references to objects, not the objects themselves

- The actual values (like numbers, strings, etc.) are stored separately in memory

- If a mutable object (like a list) is changed, the change affects the original object

- If an immutable object (like int, string) is reassigned, Python creates a new object instead of modifying the existing one

\`\`\`python

a = [10, 20, "careerEzi", 40, True]

print(a)
print(a[0])
print(a[1])
print(a[2])
\`\`\`

Output:

[10, 20, 'careerEzi', 40, True]

![Image 7](/pyimages/pimg7.png)

Explanation:

- The list a contains integers (10, 20, 40), a string ("careerEzi"), and a boolean (True).

- Lists can store multiple data types together.

- Elements in the list are ordered and stored in sequence.

- Elements are accessed using indexing like a[0], a[1], a[2].

- Indexing starts from 0 (first element).

- a[0] gives 10, a[1] gives 20, and a[2] gives "careerEzi".

- Each element keeps its original data type (int, string, boolean).

## 🔍 Indexing & Slicing Lists

Lists use the same indexing and slicing rules as strings — zero-based, with full support for negative indexing.

1. Indexing in Lists

Indexing is used to access a single element from a list using its position.

Lists follow:

- Positive indexing → starts from 0

- Negative indexing → starts from -1 (from end)

Example

\`\`\`python
fruits = ["apple", "banana", "cherry", "date", "elderberry"]
#          0        1         2         3       4
#         -5       -4        -3        -2      -1

# Indexing — access single element
print(fruits[0])    # apple
print(fruits[2])    # cherry
print(fruits[-1])   # elderberry (last)
print(fruits[-2])   # date
\`\`\`

Explanation

- fruits[0] → first element → "apple"

- fruits[2] → third element → "cherry"

- fruits[-1] → last element → "elderberry"

- fruits[-2] → second last → "date"

2. Slicing in Lists

Slicing is used to extract a part of the list (sub-list).

Syntax:

\`\`\`python
list[start : end]
\`\`\`

- start → included

- end → excluded

Example:

\`\`\`python
# Slicing — extract sub-list
print(fruits[1:4])  # ["banana", "cherry", "date"]
print(fruits[:3])   # ["apple", "banana", "cherry"]
print(fruits[2:])   # ["cherry", "date", "elderberry"]
print(fruits[::-1]) # reversed list
\`\`\`

Explanation

- fruits[1:4] → index 1 to 3 → "banana", "cherry", "date"

- fruits[:3] → start to index 2 → "apple", "banana", "cherry"

- fruits[2:] → index 2 to end → "cherry", "date", "elderberry"

- fruits[::-1] → reverse the list

3. Modifying List (Mutability)

Lists are mutable, meaning you can change their values.

\`\`\`python
# Modifying with index — lists are MUTABLE
fruits[0] = "avocado"
print(fruits[0])    # avocado (changed!)
\`\`\`

Explanation

- Replaces "apple" with "avocado"

- Output → "avocado"

- Original list is modified

4. Nested List Access

A nested list is a list inside another list.

\`\`\`python

# Nested list access
matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(matrix[1][2])  # 6 (row 1, column 2)
\`\`\`

Explanation

- matrix[1] → [4,5,6] (second row)

- matrix[1][2] → 6 (third element in that row)

## 🔧  List Methods — Complete Guide

![Image 8](/pyimages/pimg8.png)


All list methods:

| Method | Description | Syntax | Example |
| --- | --- | --- | --- |
| append() | Adds element at end | list.append(x) | a=[1]; a.append(2) → [1,2] |
| extend() | Adds multiple elements | list.extend(iterable) | a=[1]; a.extend([2,3]) → [1,2,3] |
| insert() | Inserts at index | list.insert(i,x) | a=[1,3]; a.insert(1,2) → [1,2,3] |
| remove() | Removes first occurrence | list.remove(x) | a=[1,2,2]; a.remove(2) → [1,2] |
| pop() | Removes & returns element | list.pop([i]) | a=[1,2]; a.pop() → 2 |
| clear() | Removes all elements | list.clear() | a=[1,2]; a.clear() → [] |
| index() | Finds index of element | list.index(x) | a=[1,2,3]; a.index(2) → 1 |
| count() | Counts occurrences | list.count(x) | a=[1,2,2]; a.count(2) → 2 |
| sort() | Sorts list | list.sort() | a=[3,1]; a.sort() → [1,3] |
| sort(reverse=True) | Sort descending | list.sort(reverse=True) | a=[1,3]; a.sort(reverse=True) → [3,1] |
| reverse() | Reverses list | list.reverse() | a=[1,2]; a.reverse() → [2,1] |
| copy() | Returns shallow copy | list.copy() | a=[1]; b=a.copy() |
| len() | Returns length | len(list) | len([1,2,3]) → 3 |
| min() | Smallest element | min(list) | min([3,1,2]) → 1 |
| max() | Largest element | max(list) | max([3,1,2]) → 3 |
| sum() | Sum of elements | sum(list) | sum([1,2,3]) → 6 |

### Adding Elements

\`\`\`python
items = ["a", "b", "c"]

# append — adds ONE item to end (fastest)
items.append("d")
print(items)   # ['a', 'b', 'c', 'd']

# insert — adds at specific index
items.insert(1, "x")   # insert at index 1
print(items)   # ['a', 'x', 'b', 'c', 'd']

# extend — merges another list
items.extend(["e", "f"])
print(items)   # ['a', 'x', 'b', 'c', 'd', 'e', 'f']

# + operator — creates a NEW list (does not modify original)
combined = [1,2] + [3,4]
print(combined)  # [1, 2, 3, 4]
\`\`\`

Explanation

1. A list items is created with elements "a", "b", "c".

2. items.append("d") adds "d" to the end of the list.

3. print(items) displays the updated list → ['a', 'b', 'c', 'd'].

4. items.insert(1, "x") inserts "x" at index position 1, shifting other elements to the right.

5. print(items) shows the updated list → ['a', 'x', 'b', 'c', 'd'].

6. items.extend(["e", "f"]) adds multiple elements "e" and "f" to the end of the list.

7. print(items) displays the extended list → ['a', 'x', 'b', 'c', 'd', 'e', 'f'].

8. combined = [1,2] + [3,4] combines two lists using + and creates a new list.

9. print(combined) prints the new list → [1, 2, 3, 4].

### Removing Elements

\`\`\`python
nums = [5, 2, 8, 2, 9, 1]

# remove — deletes FIRST occurrence of value
nums.remove(2)     # removes first 2
print(nums)        # [5, 8, 2, 9, 1]

# pop() — removes & returns LAST element
last = nums.pop()
print(last)        # 1
print(nums)        # [5, 8, 2, 9]

# pop(i) — removes & returns element at index i
second = nums.pop(1)
print(second)      # 8

# del — removes by index or slice
del nums[0]        # delete first element
print(nums)        # [2, 9]

# clear — removes ALL elements
nums.clear()
print(nums)        # []
\`\`\`

Explanation

1. A list nums is created with elements [5, 2, 8, 2, 9, 1].

2. nums.remove(2) removes the first occurrence of value 2 from the list.

3. print(nums) displays the updated list → [5, 8, 2, 9, 1].

4. last = nums.pop() removes the last element (1) and stores it in last.

5. print(last) prints the removed value → 1.

6. print(nums) shows the list after removal → [5, 8, 2, 9].

7. second = nums.pop(1) removes the element at index 1 (8) and stores it in second.

8. print(second) prints the removed value → 8.

9. del nums[0] deletes the element at index 0 (5).

10. print(nums) shows the updated list → [2, 9].

11. nums.clear() removes all elements from the list.

12. print(nums) prints the empty list → [].

### Searching & Sorting

\`\`\`python
nums = [5, 3, 8, 1, 9, 2, 7]

# sort() — sorts list IN-PLACE
nums.sort()                    # ascending
print(nums)   # [1, 2, 3, 5, 7, 8, 9]

nums.sort(reverse=True)        # descending
print(nums)   # [9, 8, 7, 5, 3, 2, 1]

# sorted() — returns NEW sorted list (original unchanged)
original = [5, 3, 1, 4, 2]
new_sorted = sorted(original)
print(original)    # [5, 3, 1, 4, 2] unchanged!
print(new_sorted)  # [1, 2, 3, 4, 5]

# index() — find position of element
print(nums.index(7))   # 2

# count() — count occurrences
data = [1, 2, 2, 3, 2]
print(data.count(2))   # 3

# in — membership test
print(5 in nums)       # True
print(6 in nums)       # False

# min, max, sum
print(min(nums), max(nums), sum(nums))  # 1 9 29
\`\`\`

Explanation (Line by Line)

1. A list nums is created with elements [5, 3, 8, 1, 9, 2, 7].

2. nums.sort() sorts the list in ascending order (modifies original list).

3. print(nums) displays the sorted list → [1, 2, 3, 5, 7, 8, 9].

4. nums.sort(reverse=True) sorts the list in descending order.

5. print(nums) displays the reversed sorted list → [9, 8, 7, 5, 3, 2, 1].

6. A new list original is created [5, 3, 1, 4, 2].

7. new_sorted = sorted(original) creates a new sorted list without changing original.

8. print(original) shows original list remains unchanged → [5, 3, 1, 4, 2].

9. print(new_sorted) shows sorted result → [1, 2, 3, 4, 5].

10. print(nums.index(7)) finds index of value 7 in list → 2.

11. A list data is created [1, 2, 2, 3, 2].

12. print(data.count(2)) counts how many times 2 appears → 3.

13. print(5 in nums) checks if 5 exists → True.

14. print(6 in nums) checks if 6 exists → False.

15. print(min(nums), max(nums), sum(nums)) returns smallest, largest, and sum → 1 9 29.

## ⚡  List Comprehension — Pythonic Power

List comprehension is an elegant, readable one-liner that creates a new list from an existing sequence. It replaces multi-line for loops with a concise expression.

> 📐  Syntax
> [ expression   for   variable   in   iterable ]
> [ expression   for   variable   in   iterable   if   condition ]

1. Traditional Loop (Squares)

\`\`\`python
# Traditional loop vs comprehension
# Goal: squares of 1 through 10

# Traditional (4 lines):
squares = []
for x in range(1, 11):
    squares.append(x ** 2)

# output : [1,4,9,16,25,36,49,64,81,100]
\`\`\`

- An empty list squares is created

- The loop runs from 1 to 10

- For each value of x, Python calculates x ** 2 (square)

- Each result is added to the list using append()

2. List Comprehension (Same Task)

\`\`\`python

# Comprehension (1 line — same result):
squares = [x**2 for x in range(1, 11)]
print(squares)   # [1,4,9,16,25,36,49,64,81,100]
\`\`\`

- Python loops from 1 to 10

- Calculates square of each number

- Directly creates the list in one line

Same result as traditional loop but shorter and cleaner

3. With Condition (Even Numbers)

\`\`\`python

# With condition — only even numbers
evens = [x for x in range(1, 21) if x % 2 == 0]
print(evens)     # [2,4,6,8,10,12,14,16,18,20]
\`\`\`

- Loop runs from 1 to 20

- Condition x % 2 == 0 checks if number is even

- Only even numbers are included in list

4. Transform Strings

\`\`\`python
# Transform a list of strings
names = ["alice", "bob", "charlie"]
upper = [n.upper() for n in names]
print(upper)     # ['ALICE', 'BOB', 'CHARLIE']
\`\`\`

- Loop goes through each name in list

- Applies .upper() to convert to uppercase

- Stores transformed values in new list

5. Filter + Transform

\`\`\`python

# Filter + transform
words = ["apple", "fig", "banana", "kiwi", "mango"]
long_upper = [w.upper() for w in words if len(w) > 4]
print(long_upper) # ['APPLE', 'BANANA', 'MANGO']
\`\`\`

- Loop checks each word

- Condition len(w) > 4 filters long words

- Selected words are converted to uppercase

6. Flatten Nested List

\`\`\`python

# Flatten nested list
nested = [[1,2,3],[4,5],[6,7,8,9]]
flat = [x for row in nested for x in row]
print(flat)       # [1,2,3,4,5,6,7,8,9]
\`\`\`

- Outer loop → goes through each sublist (row)

- Inner loop → goes through each element (x) in sublist

- All elements are collected into one single list

## 📦  Common List Patterns

\`\`\`python
# Stack (LIFO — Last In First Out)
stack = []
stack.append("first")
stack.append("second")
stack.append("third")
print(stack.pop())  # 'third' — last in, first out

# Queue (FIFO — First In First Out)
from collections import deque
queue = deque([])
queue.append("first")
queue.append("second")
print(queue.popleft())  # 'first' — first in, first out

# Enumerate — index + value
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
# 1. apple   2. banana   3. cherry

# Zip — combine two lists
names = ["Alice", "Bob"]
ages  = [25, 30]
for name, age in zip(names, ages):
    print(f"{name}: {age}")
\`\`\`

> 💡  Lesson 7 Recap — Key Takeaways
> • Lists: ordered, mutable, allow duplicates, defined with [ ]
> • Access with indexing [i] (0-based) and slicing [start:stop:step]
> • append(x) — end | insert(i,x) — at position | extend(lst) — merge
> • remove(x) — by value | pop() — last | pop(i) — by index | del — by slice
> • sort() modifies in-place; sorted() returns a new sorted list
> • List comprehension: [expr for x in iterable if condition] — pythonic!`,

  8: `# 🗃️ LESSON 8
## Tuples & Sets
Immutable sequences and unique unordered collections

![Image 9](/pyimages/pimg9.png)

## 🛠️ Tuples

What is a Tuple?

A tuple is a built-in data structure in Python used to store an ordered collection of elements. It is similar to a list, but the main difference is that tuples are immutable, meaning their values cannot be changed after creation.

Tuples are useful when you want to store data that should remain constant and not be modified accidentally during program execution.

Features of Tuples

Tuples have several important characteristics that make them useful:

- Ordered → Elements maintain the order in which they are added. You can access them using indexing.

- Immutable → Once created, elements cannot be changed, added, or removed.

- Allows duplicates → Same value can appear multiple times in a tuple.

- Heterogeneous → Can store different data types like integers, strings, booleans, etc.

- Faster and memory efficient compared to lists due to immutability.

Why and When to Use Tuples

Tuples are best used when data should not change. They provide better performance and are safer for fixed data.

Common use cases:

- Coordinates (x, y)

- Returning multiple values from functions

- Dictionary keys (since tuples are immutable)

Creating and Accessing Tuples

Tuples can be created using parentheses () or simply by separating values with commas. A single-element tuple must include a comma to be recognized as a tuple.

\`\`\`python
# t1 = (1, 2, 3)
t2 = 4, 5, 6
t3 = (10,)   # single element tuple
\`\`\`

Explanation:

- t1 and t2 are tuples with multiple elements.

- t3 contains one element; comma is required.

Elements in a tuple are accessed using indexing, just like lists.

\`\`\`python
t = (10, 20, 30, 40)
print(t[0])   # 10
print(t[-1])  # 40
\`\`\`

Explanation:

- Index starts from 0.

- Negative index accesses elements from the end.

Slicing can be used to extract a part of a tuple.

\`\`\`python
print(t[1:3])   # (20, 30)
\`\`\`

Returns elements from index 1 to 2.

Immutability and Its Behavior

Tuples are immutable, meaning you cannot directly change their elements.

\`\`\`python
t = (1, 2, 3)
# t[0] = 10   ❌ Error
\`\`\`

This will give an error because tuples do not allow modification.

However, if a tuple contains a mutable object like a list, that internal object can still be changed.

![Image 10](/pyimages/pimg10.png)

\`\`\`python
t = ([1, 2], 3)
t[0][0] = 100
print(t)   # ([100, 2], 3)
\`\`\`

Explanation:

- The tuple itself is unchanged

- The list inside it is modified

# Packing, Unpacking and Nested Tuples

Tuple packing means storing multiple values into a tuple automatically.

\`\`\`python
t = 1, 2, 3
\`\`\`

Tuple unpacking means extracting values into variables.

\`\`\`python
a, b, c = t
\`\`\`

Now a=1, b=2, c=3.

Tuples can also be nested (tuple inside tuple).

\`\`\`python
t = ((1,2), (3,4))
print(t[1][0])   # 3
\`\`\`

Explanation:

- First access second tuple (3,4)

- Then access first element → 3

# Tuple Operations and Methods

Even though tuples are immutable, they support operations like combining, repeating, and checking elements.

\`\`\`python
t1 = (1,2)
t2 = (3,4)
print(t1 + t2)   # (1,2,3,4)
print(t1 * 2)    # (1,2,1,2)
print(2 in t1)   # True
\`\`\`

Explanation:

- + joins tuples

- * repeats elements

- in checks membership

Tuple Operations in Python

| Operation | Description | Syntax | Example |
| --- | --- | --- | --- |
| Concatenation | Combines tuples | t1 + t2 | (1,2) + (3,4) → (1,2,3,4) |
| Repetition | Repeats tuple elements | t * n | (1,2) * 2 → (1,2,1,2) |
| Membership | Checks if element exists | x in t | 2 in (1,2,3) → True |
| Non-membership | Checks if element not exists | x not in t | 5 not in (1,2,3) → True |
| Indexing | Access element by position | t[i] | (10,20,30)[0] → 10 |
| Negative Indexing | Access from end | t[-1] | (10,20,30)[-1] → 30 |
| Slicing | Extract sub-tuple | t[start:end] | (1,2,3,4)[1:3] → (2,3) |
| Length | Number of elements | len(t) | len((1,2,3)) → 3 |
| Minimum | Smallest value | min(t) | min((5,2,8)) → 2 |
| Maximum | Largest value | max(t) | max((5,2,8)) → 8 |
| Sum | Total of elements | sum(t) | sum((1,2,3)) → 6 |
| Iteration | Loop through elements | for x in t | for x in (1,2): print(x) |
| Packing | Create tuple | t = 1,2,3 | t = 1,2,3 |
| Unpacking | Assign values to variables | a,b,c = t | a,b,c=(1,2,3) |
| Nested Access | Access inner tuple | t[i][j] | ((1,2),(3,4))[1][0] → 3 |
| Comparison | Compare tuples | t1 < t2 | (1,2) < (1,3) → True |
| Conversion | Convert list ↔ tuple | tuple(), list() | tuple([1,2]) → (1,2) |

Tuples have very few built-in methods:

\`\`\`python
t = (1,2,2,3)
print(t.count(2))   # 2
print(t.index(3))   # 3
\`\`\`

| Method | Description | Syntax | Example |
| --- | --- | --- | --- |
| count() | Counts how many times a value appears in the tuple | t.count(x) | (1,2,2,3).count(2) → 2 |
| index() | Returns the index of first occurrence of a value | t.index(x) | (1,2,3).index(2) → 1 |

## Python Sets

## What is a Set?

## A set is a built-in data structure in Python used to store a collection of unique (no duplicates) elements. Sets are unordered, meaning they do not maintain any specific order of elements.

## Sets are mainly used when you need to store values without repetition and perform operations like union, intersection, etc.

## Features of Sets

## Sets have the following important properties:

- Unique elements → Duplicate values are automatically removed

- Unordered → Elements do not have a fixed position

- Mutable → You can add or remove elements

- Heterogeneous → Can store different data types (but must be immutable types)

- No indexing → Cannot access elements using index

## Creating and Accessing Sets

## Sets are created using curly braces {} or the set() constructor.

\`\`\`python
s1 = {1, 2, 3, 3, 4}
print(s1)   # {1, 2, 3, 4}
\`\`\`

- Duplicate value 3 is removed automatically

- Only unique elements remain

\`\`\`python
s2 = set([1, 2, 2, 3])
print(s2)   # {1, 2, 3}
\`\`\`

## Converts list into a set and removes duplicates

## Since sets are unordered, you cannot use indexing like lists or tuples

## Adding and Removing Elements

## Sets allow adding and removing elements dynamically.

\`\`\`python
s = {1, 2, 3}
s.add(4)
print(s)
s.remove(2)
print(s)
\`\`\`

- add() adds a new element

- remove() deletes an element

## Other useful methods:

\`\`\`python
s.discard(10)   # no error if not found
s.pop()         # removes random element
s.clear()       # removes all elements
\`\`\`

## Set Operations (Main Purpose)

\`\`\`python
a = {1,2,3}
b = {3,4,5}
print(a | b)   # union → {1,2,3,4,5}
print(a & b)   # intersection → {3}
print(a - b)   # difference → {1,2}
print(a ^ b)   # symmetric difference → {1,2,4,5}
\`\`\`

## Explanation:

- | → combines elements

- & → common elements

- - → elements in first but not second

- ^ → elements not common

## 📊  List vs Tuple vs Set — Full Comparison

| Feature | List [ ] | Tuple ( ) |
| --- | --- | --- |
| Ordered | ✅ Yes | ✅ Yes |
| Mutable | ✅ Yes — changeable | ❌ No — immutable |
| Duplicates | ✅ Allowed | ✅ Allowed |
| Indexed [i] | ✅ Yes | ✅ Yes |
| Hashable | ❌ No | ✅ Yes (can be dict key) |
| Performance | Good | Faster than list |
| Memory | More | Less |
| Best for | Dynamic collections | Fixed / constant data |

| Feature | Set { } |
| --- | --- |
| Ordered | ❌ No — unordered (no guaranteed order) |
| Mutable | ✅ Yes — add/remove allowed |
| Duplicates | ❌ Not allowed — auto-removed |
| Indexed | ❌ No — cannot use s[0] |
| Hashable | ❌ No (but frozenset is) |
| Membership O(1) | ✅ Very fast — constant time lookup |
| Best for | Unique data, deduplication, set math |

> 💡  Lesson 8 Recap — Key Takeaways
> • Tuples: ordered, IMMUTABLE, allow duplicates, use () or packing
> • Single-element tuple needs trailing comma: (42,) not (42)
> • Tuple unpacking: x, y = (10, 20) — very common in Python
> • Tuples are hashable — can be dictionary keys; lists cannot
> • Sets: unordered, mutable, NO duplicates, use {} or set()
> • Empty set = set() — NOT {} (that creates an empty dict!)
> • Set operations: | union, & intersection, - difference, ^ symmetric diff
> • Membership test 'in' is O(1) for sets — much faster than list O(n)`,

  9: `# 📖 LESSON 9
## Dictionaries
Key-value pairs — Python's most powerful data structure

What is a Dictionary?

A dictionary is a built-in data structure in Python that stores data in the form of key–value pairs. Each key is unique and is used to access its corresponding value, similar to how a word maps to its meaning in a real dictionary.

Dictionaries are widely used because they provide fast access to data, are flexible, and can store complex structured information.

Features of Dictionaries

Dictionaries have the following important characteristics:

- Key–Value Structure → Data is stored as pairs (key: value)

- Keys must be unique → Duplicate keys are not allowed

- Values can be anything → Lists, tuples, or even other dictionaries

- Mutable → You can add, update, or delete elements

- Ordered (Python 3.7+) → Maintains insertion order

- No indexing → Access is done using keys, not positions

![Image 11](/pyimages/pimg11.png)

Creating and Accessing Dictionaries

Dictionaries can be created using {} or the dict() function. Keys are used to access values.

\`\`\`python
person = {'name':'Alice', 'age':25, 'city':'Hyderabad'}
print(person['name'])
print(person.get('age'))
\`\`\`

## Description:

- A dictionary person is created with key-value pairs

- person['name'] directly accesses value

- get() safely accesses value without error

\`\`\`python
print(person.get('phone'))
print(person.get('phone', 'N/A'))
\`\`\`

## Description:

- If key doesn’t exist, get() returns None

- Default value can be provided ('N/A')

# Modifying Dictionary Data

Dictionaries are mutable, so values can be added, updated, or removed.

\`\`\`python
person['email'] = 'alice@gmail.com'
person['age'] = 26
del person['city']
\`\`\`

Description:

- New key-value pair is added

- Existing value is updated

- Key is deleted using del

\`\`\`python
print('name' in person)
\`\`\`

Description:

- Checks whether a key exists

- Returns True or False

Iterating Through Dictionary

You can loop through dictionary keys, values, or both.

\`\`\`python
scores = {'Alice':95, 'Bob':87, 'Carol':92}
for name, score in scores.items():
    print(name, score)
\`\`\`

Description:

- .items() returns key-value pairs

- Loop accesses both key and value together

# Nested Dictionaries

Dictionaries can contain other dictionaries, allowing structured data storage.

\`\`\`python
company = {
    'employees': {
        'E001': {'name':'Alice', 'salary':90000}
    }
}
print(company['employees']['E001']['name'])
\`\`\`

Description:

- Dictionary inside dictionary (nested structure)

- Access is done using multiple keys

# Dictionary Comprehension

Dictionary comprehension allows creating dictionaries in a single line.

\`\`\`python
squares = {x: x**2 for x in range(1,6)}
print(squares)
\`\`\`

Description:

- Loops through numbers

- Creates key-value pairs automatically

\`\`\`python
evens = {x: x**2 for x in range(1,11) if x % 2 == 0}
\`\`\`

Description:

- Adds condition to filter elements

- Only even numbers are included

# Useful Dictionary Operations

Dictionaries support many practical operations.

\`\`\`python
a = {'x':1, 'y':2}
b = {'y':99, 'z':3}
merged = a | b
print(merged)
\`\`\`

Description:

- Merges two dictionaries

- Values from second dictionary overwrite duplicates

\`\`\`python
scores = {'Alice':95,'Bob':72,'Carol':88}
sorted_scores = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
print(sorted_scores)
\`\`\`

Description

- Sorts dictionary by values

- Converts result back into dictionary

## 🔧  Dictionary Methods — Complete Guide

![Image 12](/pyimages/pimg12.png)

| Method / Function | Description | Syntax | Example |
| --- | --- | --- | --- |
| get() | Safely gets value for a key (no error if missing) | d.get(key, default) | d.get('a','NA') |
| update() | Adds/updates key-value pairs | d.update(other) | d.update({'b':2}) |
| keys() | Returns all keys | d.keys() | {'a':1}.keys() |
| values() | Returns all values | d.values() | {'a':1}.values() |
| items() | Returns key-value pairs | d.items() | {'a':1}.items() |
| pop() | Removes key and returns value | d.pop(key) | d.pop('a') → 1 |
| setdefault() | Returns value or inserts default | d.setdefault(key, value) | d.setdefault('a',0) |
| copy() | Returns a shallow copy | d.copy() | x = d.copy() |
| clear() | Removes all items | d.clear() | d.clear() |
| popitem() | Removes last inserted pair | d.popitem() | d.popitem() |
| fromkeys() | Creates dict from keys with same value | dict.fromkeys(keys, value) | dict.fromkeys(['a','b'],0) |
| len() | Returns number of key-value pairs | len(d) | len({'a':1}) → 1 |
| in | Checks if key exists | key in d | 'a' in d → True |
| del | Deletes a key-value pair | del d[key] | del d['a'] |
| max() | Returns max key | max(d) | max({'a':1,'b':2}) |
| min() | Returns min key | min(d) | min({'a':1,'b':2}) |
| sorted() | Returns sorted keys | sorted(d) | sorted({'b':2,'a':1}) |
| dict() | Creates dictionary | dict() | dict(a=1,b=2) |

### Iterating Over a Dictionary

\`\`\`python
scores = {'Alice':95, 'Bob':87, 'Carol':92}

# Iterate KEYS (default behaviour)
for name in scores:
    print(name)   # Alice  Bob  Carol

# Iterate KEYS explicitly
for name in scores.keys():
    print(name)

# Iterate VALUES
for score in scores.values():
    print(score)   # 95  87  92

# Iterate KEY-VALUE pairs (most common!)
for name, score in scores.items():
    print(f'{name}: {score}')
# Alice: 95
# Bob: 87
# Carol: 92

# Find best student
best = max(scores, key=lambda k: scores[k])
print(f'Best: {best} with {scores[best]}')  # Best: Alice with 95
\`\`\`

  Python loops through the dictionary in different ways:

- First loop → goes through keys only (default behavior)

- Second loop → explicitly gets keys using .keys()

- Third loop → gets values only using .values()

- Fourth loop → gets both key and value using .items()

  max() is used to find the key with the highest value:

- It checks each student’s score

- Compares values using lambda

- Returns the student with highest score → "Alice"

## 🏗️  Nested Dictionaries

Dictionaries can contain other dictionaries as values, allowing you to represent complex, hierarchical data — like database records, JSON APIs, or configuration files.

\`\`\`python
# Company database
company = {
    'name': 'TechCorp',
    'employees': {
        'E001': {'name':'Alice', 'role':'Developer', 'salary':90000},
        'E002': {'name':'Bob',   'role':'Designer',  'salary':75000},
        'E003': {'name':'Carol', 'role':'Manager',   'salary':110000}
    },
    'offices': {
        'HQ':   {'city':'Hyderabad', 'country':'India'},
        'Branch':{'city':'Mumbai',   'country':'India'}
    }
}

# Access nested values — chain [] operators
print(company['name'])                        # TechCorp
print(company['employees']['E001']['name'])   # Alice
print(company['offices']['HQ']['city'])       # Hyderabad

# Iterate employees
for emp_id, details in company['employees'].items():
    print(f"{emp_id}: {details['name']} — {details['role']}")

# Calculate average salary
salaries = [e['salary'] for e in company['employees'].values()]
avg = sum(salaries) / len(salaries)
print(f'Avg Salary: Rs.{avg:,.0f}')  # Avg Salary: Rs.91,667
\`\`\`

  A nested dictionary is created (dictionary inside dictionary)

  Values are accessed using multiple keys (chain indexing)

  Loop:

- Iterates through employees

- Extracts employee ID and details

- Prints name and role

  Salary calculation:

- Extracts all salaries using list comprehension

- Calculates total and average

- Formats output nicely

## 🔄  Dictionary Comprehension

Similar to list comprehension, dictionary comprehension creates a dict in a single, readable line.

> 📐  Syntax
> { key_expr : value_expr   for   item   in   iterable }
> { key_expr : value_expr   for   item   in   iterable   if   condition }

\`\`\`python
# Squares dictionary
squares = {x: x**2 for x in range(1, 6)}
print(squares)  # {1:1, 2:4, 3:9, 4:16, 5:25}

# Only even numbers
evens = {x: x**2 for x in range(1, 11) if x % 2 == 0}
print(evens)    # {2:4, 4:16, 6:36, 8:64, 10:100}

# Invert a dictionary (swap keys and values)
original = {'a':1, 'b':2, 'c':3}
inverted = {v:k for k,v in original.items()}
print(inverted) # {1:'a', 2:'b', 3:'c'}

# Count word frequency
words = ['apple','banana','apple','cherry','banana','apple']
freq = {w: words.count(w) for w in set(words)}
print(freq)  # {'apple':3, 'banana':2, 'cherry':1}

# Filter dictionary — keep high scores only
scores = {'Alice':95,'Bob':72,'Carol':88,'Dan':65}
top = {k:v for k,v in scores.items() if v >= 80}
print(top)   # {'Alice':95, 'Carol':88}
\`\`\`

  Dictionary comprehension creates dictionaries in one line

  Examples:

- Squares → generates number → square mapping

- Evens → filters only even numbers

- Inversion → swaps keys and values

- Frequency → counts occurrences of words

- Filter → keeps only high scores

  Combines:

- Loop

- Condition

- Transformation

## 📊  Useful Dictionary Patterns

\`\`\`python
# Default values with setdefault()
d = {}
d.setdefault('count', 0)    # add if missing
d['count'] += 1
print(d)   # {'count': 1}

# Merge two dicts (Python 3.9+)
a = {'x':1, 'y':2}
b = {'y':99, 'z':3}
merged = a | b              # new syntax Python 3.9+
print(merged)  # {'x':1, 'y':99, 'z':3}

# Merge with update (all versions)
a.update(b)   # a is modified in-place

# Sort dict by value
scores = {'Alice':95,'Bob':72,'Carol':88}
by_score = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
print(by_score)  # {'Alice':95, 'Carol':88, 'Bob':72}
\`\`\`

  setdefault():

- Adds key if it doesn’t exist

- Prevents errors

- Useful for counting

  Merging dictionaries:

- | creates a new merged dictionary

- update() modifies original dictionary

  Sorting:

- sorted() sorts based on values

- lambda tells Python to use value for sorting

- Converted back to dictionary

> 💡  Lesson 9 Recap — Key Takeaways
> • Dictionaries: key-value pairs, defined with { } or dict()
> • Keys must be unique and immutable; values can be anything
> • Access: d[key] raises KeyError; d.get(key,'default') is safe
> • d.keys(), d.values(), d.items() — iterate parts of a dict
> • Nested dicts: access with chained [] operators
> • Dict comprehension: {k:v for item in iterable if condition}
> • Python 3.7+ — dictionaries maintain insertion order`,

  10: `# ⚡ LESSON 10
## Functions
Write once, use many times — the cornerstone of clean code

## 📌  What Is a Function?

A function is a named, reusable block of code that performs a specific task. Instead of repeating the same code, you define it once and call it as many times as needed. Functions are fundamental to every Python program.

> 🌟  Why Use Functions? — DRY Principle
> DRY = Don't Repeat Yourself
> ✅ REUSABILITY — write code once, call it from anywhere
> ✅ READABILITY — break complex problems into small named steps
> ✅ MAINTAINABILITY — fix bugs in one place, fixed everywhere
> ✅ TESTABILITY — test small pieces independently
> ✅ ABSTRACTION — hide complex details behind a simple name

## 🏗️  Function Anatomy

![Image 13](/pyimages/pimg13.png)

Parts of a Function

🔹 def Keyword

Used to define a function. It tells Python that you are creating a function.

🔹 Function Name

A unique name given to the function. It should describe what the function does.

🔹 Parameters

Variables inside parentheses that accept input values when the function is called.

🔹 Function Body

The block of code that performs the task. It is written with proper indentation.

🔹 return Statement

Used to send a result back to the caller. It is optional but very useful.

## 📝  Defining & Calling Functions

> 📐  Syntax
> def  function_name( parameters ):
>     """Docstring — describes what this function does"""
>     # function body — indented code block
>     return value   # optional — sends result back

\`\`\`python
# Simple function — no parameters
def greet():
    print('Hello! Welcome to Python!')

# Call it — use the name followed by ()
greet()   # Hello! Welcome to Python!
greet()   # Called again — same result
greet()   # And again!

# Function with docstring
def show_info():
    """Display program information."""
    print('Python Beginner Course')
    print('Lesson 10: Functions')

# Access the docstring
print(show_info.__doc__)   # Python Beginner Course…
\`\`\`

What is Happening

🔹 First Function (greet)

- A function named greet is defined with no parameters

- Inside the function, a message is printed

- When greet() is called:

  - Python executes the function body

  - Prints → "Hello! Welcome to Python!"

- Calling it multiple times:

  - Runs the same code again and again

  - Output is repeated each time

This shows function reusability

🔹Second Function (show_info)

- A function show_info is defined

- It contains a docstring (text inside triple quotes)

- Docstring describes what the function does

- Inside the function:

  - Two print statements display course details

🔹 Accessing Docstring

\`\`\`python
print(show_info.__doc__)
\`\`\`

- __doc__ is a special attribute

- It retrieves the docstring of the function

- It does NOT execute the function body

- Only returns the description text

## 📦  Parameters & Arguments

Parameters are the variable names listed in the function definition. Arguments are the actual values you pass when calling the function. They are often used interchangeably, but the distinction matters.

| Term | Meaning & Example |
| --- | --- |
| Parameter | Variable in function definition: def add(a, b)  ← a and b are parameters |
| Argument | Value passed during call: add(3, 5)  ← 3 and 5 are arguments |
| Positional arg | Matched by position: add(3, 5) → a=3, b=5 |
| Keyword arg | Matched by name: add(b=5, a=3) → a=3, b=5 |
| Default arg | Has a preset value: def greet(name, msg='Hello') |
| *args | Collects any number of positional args as a tuple |
| **kwargs | Collects any number of keyword args as a dict |

\`\`\`python
# Positional parameters — order matters
def introduce(name, age, city):
    print(f'I am {name}, {age} years old, from {city}.')

introduce('Alice', 25, 'Hyderabad')   # positional
# → I am Alice, 25 years old, from Hyderabad.

introduce(age=30, city='Mumbai', name='Bob')  # keyword
# → I am Bob, 30 years old, from Mumbai.

introduce('Carol', city='Delhi', age=22)  # mixed
# → I am Carol, 22 years old, from Delhi.
\`\`\`

## ↩️  The return Statement

The return statement ends the function and sends a value back to the caller. A function without return (or with bare return) sends back None. Functions can return multiple values as a tuple.

\`\`\`python
# Function that RETURNS a value
def square(n):
    return n ** 2

result = square(5)      # store returned value
print(result)           # 25
print(square(7) + 1)    # 50 — use directly in expression

# Function that returns MULTIPLE values (as a tuple)
def divide(a, b):
    quotient  = a // b
    remainder = a % b
    return quotient, remainder   # returns a tuple

q, r = divide(17, 5)   # unpack the tuple
print(f'17 ÷ 5 = {q} remainder {r}')  # 17 ÷ 5 = 3 remainder 2

# Early return — exit function early
def is_even(n):
    if n % 2 == 0:
        return True
    return False
    # Code after return never runs

# Function with no return → returns None
def say_hi():
    print('Hi!')

val = say_hi()     # prints 'Hi!'
print(val)         # None
\`\`\`

Function Returning Single Value (square)

- The function square(n) takes a number and returns its square using n ** 2

- square(5) is called and its result is stored in result → 25

- The returned value can also be used directly in expressions → square(7) + 1 = 49 + 1 = 50

Shows how functions can return and reuse computed values

🔹 Function Returning Multiple Values (divide)

- The function calculates:

  - quotient using integer division (//)

  - remainder using modulus (%)

- return quotient, remainder returns multiple values as a tuple

- q, r = divide(17,5) unpacks the returned tuple into two variables

Output: 17 ÷ 5 = 3 remainder 2

Demonstrates:

- Returning multiple values

- Tuple unpacking

🔹 Early Return (is_even)

- Function checks if number is even

- If condition is True → returns True immediately

- If not → returns False

Important:

- Once return runs, function stops execution immediately

- Any code after return is never executed

🔹 Function with No Return (say_hi)

- Function prints "Hi!" but has no return statement

- When called:

  - It prints "Hi!"

  - Automatically returns None

- val = say_hi() stores None

- print(val) prints None

Shows:

- Functions without return always return None

## 🎯  Default Arguments

Default arguments provide preset values for parameters. If the caller doesn't pass a value for that parameter, the default is used. Parameters with defaults must come AFTER parameters without defaults.

\`\`\`python
# Default argument for 'greeting'
def greet(name, greeting='Hello', punctuation='!'):
    print(f'{greeting}, {name}{punctuation}')

greet('Alice')                    # Hello, Alice!
greet('Bob', 'Good Morning')      # Good Morning, Bob!
greet('Carol', 'Hey', '...')      # Hey, Carol...

# Power function — default exponent is 2 (square)
def power(base, exponent=2):
    return base ** exponent

print(power(5))      # 25  (5 squared — default)
print(power(2, 10))  # 1024 (2 to the power of 10)
print(power(3, 3))   # 27  (3 cubed)

# Send email — many optional fields with defaults
def send_email(to, subject, body='',
               cc='', priority='normal'):
    print(f'To: {to} | Subject: {subject}')
    print(f'Priority: {priority}')

send_email('alice@mail.com', 'Meeting')  # only required args
\`\`\`

## ♾️  *args & **kwargs — Variable Arguments

![Image 14](/pyimages/pimg14.png)

\`\`\`python
# *args — any number of positional arguments
def total(*numbers):
    print(f'Received: {numbers}')   # tuple
    return sum(numbers)

print(total(1, 2))              # 3
print(total(1, 2, 3, 4, 5))    # 15
print(total(10, 20, 30))       # 60

# **kwargs — any number of keyword arguments
def create_profile(**details):
    print('Profile created:')
    for key, value in details.items():
        print(f'  {key}: {value}')

create_profile(name='Alice', age=25, role='Developer')

# Combined: both *args and **kwargs
def everything(required, *args, **kwargs):
    print(f'Required: {required}')
    print(f'Extra args: {args}')
    print(f'Keyword args: {kwargs}')

everything('must', 1, 2, name='Alice', city='Hyd')
\`\`\`

🔹 *args (Variable Positional Arguments)

- The function total(*numbers) can accept any number of positional arguments

- All passed values are collected into a tuple called numbers

- Example:

  - total(1, 2) → numbers = (1, 2)

  - total(1,2,3,4,5) → numbers = (1,2,3,4,5)

- sum(numbers) calculates total of all elements

This allows flexible input size without changing function definition

🔹 **kwargs (Variable Keyword Arguments)

- The function create_profile(**details) accepts any number of keyword arguments

- All key-value pairs are stored in a dictionary called details

- Example call:

create_profile(name='Alice', age=25, role='Developer')

→ details = {'name':'Alice','age':25,'role':'Developer'}

- Loop prints each key and value

Useful for passing dynamic or optional named data

🔹 Combined Usage (*args + **kwargs)

- The function everything(required, *args, **kwargs) combines:

  - required → mandatory argument

  - *args → extra positional arguments (tuple)

  - **kwargs → extra keyword arguments (dictionary)

- Example call:

everything('must', 1, 2, name='Alice', city='Hyd')

  - required = 'must'

  - args = (1, 2)

  - kwargs = {'name':'Alice','city':'Hyd'}

Shows how Python groups different types of inputs

## ⚡  Lambda Functions

A lambda is a small anonymous function defined in a single line. It can have any number of arguments but only ONE expression. Lambda functions are often used as short-lived helpers for sorting, filtering, and mapping.

> 📐  Syntax
> lambda  arguments  :  expression
> # Equivalent to:
> def function_name(arguments):
>     return expression

\`\`\`python
# Lambda examples
double   = lambda x: x * 2
square   = lambda x: x ** 2
add      = lambda a, b: a + b
greet    = lambda name: f'Hello, {name}!'
is_even  = lambda n: n % 2 == 0

print(double(5))         # 10
print(square(4))         # 16
print(add(3, 7))         # 10
print(greet('Alice'))    # Hello, Alice!
print(is_even(8))        # True

# Lambda with sorted() — sort by custom key
students = [('Alice',85), ('Bob',92), ('Carol',78)]
by_score = sorted(students, key=lambda s: s[1])
print(by_score)   # [('Carol',78),('Alice',85),('Bob',92)]

# Lambda with filter() — keep only evens
nums   = [1,2,3,4,5,6,7,8,9,10]
evens  = list(filter(lambda n: n%2==0, nums))
print(evens)      # [2,4,6,8,10]

# Lambda with map() — transform each element
prices = [100, 200, 300]
with_tax = list(map(lambda p: p * 1.18, prices))
print(with_tax)   # [118.0, 236.0, 354.0]
\`\`\`

What is Happening

🔹 Basic Lambda Functions

- Lambda functions are small anonymous (unnamed) functions written in one line

- Each lambda takes input, performs a simple operation, and returns the result

Examples:

- double → multiplies input by 2

- square → returns square of number

- add → adds two numbers

- greet → returns formatted string

- is_even → checks if number is even (returns True/False)

These work like normal functions but are shorter and used for simple logic

🔹 Lambda with sorted()

- A list of tuples students contains name and score

- sorted() sorts the list

- key=lambda s: s[1] tells Python to sort based on second element (score)

Result: students are sorted by marks in ascending order

🔹 Lambda with filter()

- filter() selects elements based on a condition

- lambda n: n % 2 == 0 checks for even numbers

- Only numbers satisfying condition are kept

Result: [2, 4, 6, 8, 10]

🔹 Lambda with map()

- map() applies a function to every element in a list

- lambda p: p * 1.18 adds 18% tax to each price

- Each value is transformed

Result: [118.0, 236.0, 354.0]

## 🔭  Variable Scope — Local, Global, Enclosing

Scope controls where a variable is visible in your code. Python follows the LEGB rule: Local → Enclosing → Global → Built-in.

![Image15](/pyimages/pimg15.png)

Variable Scope

\`\`\`python
x = 'global'   # global variable

def outer():
    x = 'outer'    # local to outer (enclosing for inner)

    def inner():
        x = 'inner'   # local to inner
        print(x)       # 'inner' — local wins

    inner()
    print(x)  # 'outer' — inner's x not visible here

outer()
print(x)  # 'global' — outer's x not visible here
\`\`\`

What is Happening

- A global variable x = 'global' is created outside all functions

- Inside outer():

  - A new variable x = 'outer' is created

  - This does not change the global x, it creates a new local variable

- Inside inner():

  - Another variable x = 'inner' is created

  - This is local to inner() only

Scope Priority (LEGB rule):

- Local → Enclosing → Global → Built-in

- So:

  - print(x) inside inner() → prints 'inner'

  - After inner finishes, outer() prints its own x → 'outer'

  - Outside all functions → global x is printed → 'global'

Using global Keyword

\`\`\`python
# global keyword — modify a global from inside function
counter = 0
def increment():
    global counter   # tell Python: use the GLOBAL counter
    counter += 1

increment(); increment(); increment()
print(counter)   # 3
\`\`\`

  A global variable counter = 0 is created

  Inside increment():

- global counter tells Python to use the global variable, not create a new local one

- counter += 1 increases the same global variable

  Function is called 3 times:

- counter becomes → 1 → 2 → 3

Using nonlocal Keyword

\`\`\`python

# nonlocal keyword — modify enclosing scope
def make_counter():
    count = 0
    def step():
        nonlocal count   # use enclosing count
        count += 1
        return count
    return step

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
\`\`\`

- make_counter() creates a variable count = 0

- Inside step():

  - nonlocal count refers to variable in enclosing function (make_counter)

  - count is updated each time step() is called

- make_counter() returns the function step

- When calling counter():

  - First call → count = 1

  - Second call → count = 2

  - Third call → count = 3

Important:

- Value is remembered between calls (closure behavior)

## 📐  Recursive Functions

A function that calls itself is called recursive. Recursion is elegant for problems that can be broken into smaller identical sub-problems, like factorials, Fibonacci sequences, and tree traversal.

\`\`\`python
# Factorial using recursion
# 5! = 5 × 4 × 3 × 2 × 1 = 120
def factorial(n):
    if n <= 1:          # BASE CASE — stop recursion
        return 1
    return n * factorial(n - 1)  # RECURSIVE CALL

print(factorial(5))   # 120
print(factorial(10))  # 3628800
\`\`\`

What is Happening (Factorial)

- A recursive function factorial(n) is defined

- It has two important parts:

  - Base case → if n <= 1 → stops recursion

  - Recursive call → factorial(n - 1)

Flow for factorial(5):

- factorial(5) → 5 × factorial(4)

- factorial(4) → 4 × factorial(3)

- factorial(3) → 3 × factorial(2)

- factorial(2) → 2 × factorial(1)

- factorial(1) → returns 1 (base case reached)

Then results are calculated backward:

- 2 × 1 = 2

- 3 × 2 = 6

- 4 × 6 = 24

- 5 × 24 = 120

\`\`\`python
# Fibonacci using recursion
# 0, 1, 1, 2, 3, 5, 8, 13, ...
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

print([fib(i) for i in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

- Function fib(n) returns:

  - n if n <= 1 (base case)

  - Otherwise → sum of previous two values

Flow:

- fib(0) → 0

- fib(1) → 1

- fib(2) → fib(1) + fib(0) → 1

- fib(3) → fib(2) + fib(1) → 2

- fib(4) → fib(3) + fib(2) → 3

It keeps calling itself until base case is reached

- List comprehension:

  - Calls fib(i) for values from 0 to 9

  - Collects results into a list

> 🎉
> Congratulations!
> You have completed all 10 Python Beginner Lessons!
> What you've learned:
> Variables • Data Types • Operators • Control Flow • Loops • Strings • Lists • Tuples • Sets • Dictionaries • Functions
> 🚀  Next: Intermediate Python — OOP, File I/O, Exception Handling, Modules & Libraries
> 💡  Lesson 10 Recap — Key Takeaways
> • def defines a function; call it using function_name()
> • Parameters receive arguments; return sends back a result
> • Default arguments: def f(x, y=10) — use when arg is often the same
> • *args collects extra positional args as a TUPLE
> • **kwargs collects extra keyword args as a DICT
> • Lambda: lambda x: x*2 — one-liner anonymous function
> • LEGB scope rule: Local → Enclosing → Global → Built-in
> • global x and nonlocal x let inner functions modify outer variables

# 🐍
## Python Programming
INTERMEDIATE LEVEL
CORE PROGRAMMING SKILLS
Lessons 11–14
Advanced Functions  •  Modules & Packages
File Handling  •  Exception Handling
📘  Each topic includes: concept explanation • syntax reference • multiple separated
code examples with detailed explanations • expected output • key takeaways

Contents

| Lesson | Topics Covered |
| --- | --- |
| ⚡  Lesson 11— Advanced Functions | *args, **kwargs, Lambda, Closures, Decorators, Recursion |
| 📦  Lesson 12 — Modules & Packages | Importing, Custom Modules, Standard Library, Packages |
| 📂  Lesson 13 — File Handling | Modes, Read/Write, CSV, JSON, pathlib, Context Manager |
| 🛡️  Lesson 14 — Exception Handling | try/except/else/finally, Multiple Exceptions, Custom Exceptions |`,

  11: `# ⚡  INTERMEDIATE  •  LESSON 11
## Advanced Functions
*args, **kwargs, Lambda, Closures, Decorators & Recursion

# 📌  What Makes a Function "Advanced"?

At the beginner level you learned to define functions with fixed parameters and return values. Advanced functions unlock much more power:

• Flexible argument handling — accept any number of positional or keyword arguments

• Anonymous (lambda) functions — one-line throwaway functions

• Closures — functions that remember the environment they were created in

• Decorators — wrap any function with extra behaviour without modifying it

• Recursion — functions that call themselves to solve problems by breaking them down

These tools appear in every professional Python codebase. Mastering them puts you firmly in "intermediate" territory.

# 1️⃣  *args — Variable Positional Arguments

Normally a Python function accepts a fixed number of positional arguments. If you call it with more or fewer arguments, you get a TypeError. *args removes that restriction entirely.

When you put an asterisk (*) before a parameter name, Python collects all extra positional arguments into a tuple and passes it to the function as a single variable. The name "args" is just a naming convention — what matters is the asterisk.

![Image 16](/pyimages/pimg16.png)

> 💡  Key Point: Inside the function, args is a regular Python tuple. You can loop over it, index it, pass it to sum(), len(), etc.
> 📐  Syntax
> def function_name(*args):
>     # args is a TUPLE — iterate it, sum it, index it
>     for item in args:
>         print(item)
> # Call with any number of positional arguments:
> function_name(1, 2, 3)
> function_name("a", "b", "c", "d", "e")

  Example 1: Basic *args — Sum Any Number of Values

This example shows the simplest use of *args: accepting any number of numbers and summing them. Notice that Python automatically packs all the positional arguments into a tuple.

>   🐍 Example 1 — Basic *args
> def total(*numbers):
>     """Sum any quantity of numeric arguments."""
>     print(f"Received as tuple: {numbers}")
>     return sum(numbers)
> # Call with 2 arguments
> print(total(1, 2))
> # Call with 3 arguments
> print(total(10, 20, 30))
> # Call with 6 arguments
> print(total(1, 2, 3, 4, 5, 6))
> ▶  Output
> Received as tuple: (1, 2)
> 3
> Received as tuple: (10, 20, 30)
> 60
> Received as tuple: (1, 2, 3, 4, 5, 6)
> 21

Explanation: The function total() takes *numbers, which means Python collects all positional arguments into a tuple called numbers. We can then pass that tuple directly to the built-in sum() function. The function works with 2 arguments, 3 arguments, or 6 — it does not care.

  Example 2: Mixing a Regular Parameter with *args

A regular parameter can appear before *args. Python assigns arguments left-to-right: the first argument goes to the regular parameter, and all remaining arguments are packed into args.

>   🐍 Example 2 — Regular param + *args
> def greet(greeting, *names):
>     """Greet one or more people with the same greeting."""
>     for name in names:
>         print(f"{greeting}, {name}!")
> # First arg → greeting, rest → names tuple
> greet("Hello", "Alice", "Bob", "Carol")
> # Works with just one name too
> greet("Good morning", "David")
> ▶  Output
> Hello, Alice!
> Hello, Bob!
> Hello, Carol!
> Good morning, David!

Explanation: "Hello" is assigned to greeting because it is the first positional argument. "Alice", "Bob", and "Carol" are packed into the names tuple. The for loop then iterates over the tuple and prints a personalised greeting for each name.

  Example 3: Unpacking a List into *args Using the * Operator

If you already have values stored in a list, you can unpack them into positional arguments using the * operator at the call site. This is the reverse operation of collecting them.

>   🐍 Example 3 — Unpacking with *
> def total(*numbers):
>     return sum(numbers)
> nums = [5, 10, 15, 20]
> # Without unpacking — passes the WHOLE list as ONE argument
> # total(nums)  ← This would fail because sum() gets a list of lists
> # WITH unpacking — passes each element as a separate argument
> result = total(*nums)
> print(f"total(*nums) = {result}")   # same as total(5, 10, 15, 20)
> # Works with tuples too
> values = (100, 200, 300)
> print(total(*values))  # 600
> ▶  Output
> total(*nums) = 50
> 600

Explanation: total(*nums) is exactly equivalent to writing total(5, 10, 15, 20). The * before the variable "unpacks" the sequence and passes each element as a separate positional argument.

  Example 4: *args Accepts Any Data Type

args is just a tuple — its elements can be of any type: strings, numbers, booleans, lists, even other functions. This example demonstrates mixed types and shows how to inspect each element.

>   🐍 Example 4 — Mixed types in *args
> def describe(*items):
>     """Print each item with its type and position."""
>     print(f"Total items received: {len(items)}")
>     for i, item in enumerate(items, 1):
>         print(f"  Item {i}: {item!r}  (type: {type(item).__name__})")
> describe("hello", 42, 3.14, True, [1, 2, 3])
> ▶  Output
> Total items received: 5
>   Item 1: 'hello'  (type: str)
>   Item 2: 42  (type: int)
>   Item 3: 3.14  (type: float)
>   Item 4: True  (type: bool)
>   Item 5: [1, 2, 3]  (type: list)

Explanation: enumerate(items, 1) gives us both the index (starting at 1) and the value. The !r format specifier shows the repr() of the item, which includes quotes around strings. This demonstrates that args truly accepts anything.

# 2️⃣  **kwargs — Variable Keyword Arguments

**kwargs is the keyword-argument counterpart of *args. While *args collects extra positional arguments into a tuple, **kwargs collects extra keyword arguments into a dictionary.

The double asterisk (**) is the syntax that makes it work. "kwargs" is just a convention — the real magic is in the **. Inside the function, kwargs is a regular Python dictionary where keys are the argument names (as strings) and values are the argument values.

> 💡  Key Point: kwargs is a dict. You can use all dictionary methods on it: .items(), .keys(), .values(), .get(), and so on.
> 📐  Syntax
> def function_name(**kwargs):
>     # kwargs is a DICT of {keyword: value} pairs
>     for key, value in kwargs.items():
>         print(f"{key}: {value}")
> # Call with any keyword arguments:
> function_name(name="Alice", age=25, city="Hyderabad")

  Example 1: Basic **kwargs — Building a Profile

This example uses **kwargs to accept any number of named attributes and build a profile. The caller decides which fields to include; the function handles whatever it receives.

>   🐍 Example 1 — Basic **kwargs
> def create_profile(**details):
>     """Build a user profile from arbitrary keyword arguments."""
>     print("─── Profile ───────────────────")
>     for key, val in details.items():
>         print(f"  {key:15}: {val}")
>     print("───────────────────────────────")
> # Call with 5 keyword arguments
> create_profile(
>     name="Alice",
>     age=25,
>     city="Hyderabad",
>     role="Developer",
>     experience="3 years"
> )
> ▶  Output
> ─── Profile ───────────────────
>   name           : Alice
>   age            : 25
>   city           : Hyderabad
>   role           : Developer
>   experience     : 3 years
> ───────────────────────────────

Explanation: Every keyword argument becomes a key-value pair in the kwargs dict. The .items() method returns both the key and value together, which we use to print the profile. The function does not care how many keyword arguments are passed — it handles any number.

  Example 2: Using .get() to Provide Default Values

A common pattern with **kwargs is to extract known keys using .get(key, default). This lets you define expected parameters while still accepting unexpected ones gracefully.

>   🐍 Example 2 — Default values with .get()
> def configure(**settings):
>     """Configure a server with optional settings."""
>     # Use .get() to extract values with fallback defaults
>     host  = settings.get("host",  "localhost")
>     port  = settings.get("port",  8080)
>     debug = settings.get("debug", False)
>     print(f"Server: {host}:{port}  |  debug={debug}")
> # Provide specific settings
> configure(host="example.com", port=443, debug=True)
> # Provide no settings — all defaults are used
> configure()
> # Provide only some settings
> configure(port=9000)
> ▶  Output
> Server: example.com:443  |  debug=True
> Server: localhost:8080  |  debug=False
> Server: localhost:9000  |  debug=False

Explanation: settings.get("host", "localhost") looks up "host" in the kwargs dict. If it is present, it returns that value; if absent, it returns the default "localhost". This is much cleaner than checking if each key exists manually.

  Example 3: Unpacking a Dictionary into **kwargs

Just as * unpacks a list into positional arguments, ** unpacks a dictionary into keyword arguments at the call site.

>   🐍 Example 3 — Unpacking a dict with **
> def create_profile(**details):
>     for key, val in details.items():
>         print(f"  {key}: {val}")
> # Dictionary already contains the data
> user_data = {"name": "Bob", "age": 30, "city": "Mumbai"}
> # WITHOUT unpacking — this would fail (passes a dict as one arg)
> # create_profile(user_data)  ← TypeError!
> # WITH ** unpacking — each key becomes a keyword argument
> create_profile(**user_data)
> # Equivalent to: create_profile(name="Bob", age=30, city="Mumbai")
> ▶  Output
>   name: Bob
>   age: 30
>   city: Mumbai

Explanation: **user_data unpacks the dictionary so that each key becomes a keyword argument name. This is extremely useful when you load data from a JSON file or API response and want to pass it directly into a function.

# 3️⃣  Combining All Argument Types — The Correct Order

Python is strict about the order in which different argument types must appear in a function signature. Violating this order causes a SyntaxError at parse time, before the code even runs.

| Position | Argument Type |
| --- | --- |
| 1st | Regular positional parameters   →  def f(a, b) |
| 2nd | Parameters with default values  →  def f(a, x=10) |
| 3rd | *args                            →  def f(a, x=10, *args) |
| 4th | Keyword-only parameters          →  def f(a, *args, kw_only) |
| 5th | **kwargs                         →  def f(a, x=10, *args, **kw) |
| 💡  Rule of thumb: arrange parameters from LEAST flexible (must be provided, in order) to MOST flexible (optional, named) from left to right. |  |

  Example 1: Full Signature Demonstration

This example defines a function that uses all five argument types in the correct order, then calls it so you can see exactly which value goes where.

>   🐍 Example 1 — All argument types together
> def full_signature(pos, default="hi", *args, kw_only=0, **kwargs):
>     print(f"pos       = {pos}")       # required positional
>     print(f"default   = {default}")   # optional positional
>     print(f"args      = {args}")      # extra positional → tuple
>     print(f"kw_only   = {kw_only}")   # must use keyword
>     print(f"kwargs    = {kwargs}")    # extra keyword → dict
> full_signature("must", "hey", 1, 2, 3, kw_only=99, x=10, y=20)
> ▶  Output
> pos       = must
> default   = hey
> args      = (1, 2, 3)
> kw_only   = 99
> kwargs    = {'x': 10, 'y': 20}

Explanation: "must" → pos (required, 1st), "hey" → default (overrides the default), 1,2,3 → args tuple (everything that doesn't match a named parameter), kw_only=99 → keyword-only parameter (cannot be passed positionally), x=10,y=20 → kwargs dict.

  Example 2: Practical — Flexible Logging Function

A real-world example: a log() function that accepts a mandatory level, any number of messages, and optional metadata. This pattern is used in professional logging libraries.

>   🐍 Example 2 — Flexible log() function
> def log(level, *messages, separator=" | ", **meta):
>     """
>     level     : required string (INFO, ERROR, DEBUG)
>     *messages : any number of message strings
>     separator : keyword-only, defaults to " | "
>     **meta    : optional key=value metadata tags
>     """
>     body = separator.join(str(m) for m in messages)
>     tags = "  " + " ".join(f"{k}={v}" for k, v in meta.items()) if meta else ""
>     print(f"[{level.upper()}] {body}{tags}")
> # One level, two messages
> log("info", "Server started", "Port 8080")
> # One level, one message, metadata tags
> log("error", "DB connection failed", host="db.local", code=503)
> # Custom separator
> log("debug", "x=1", "y=2", "z=3", separator=" >> ")
> ▶  Output
> [INFO] Server started | Port 8080
> [ERROR] DB connection failed  host=db.local code=503
> [DEBUG] x=1 >> y=2 >> z=3

# 4️⃣  Lambda Functions — Anonymous One-Liners

A lambda is a small, anonymous function written in a single expression. It is not stored under a name (unless you assign it to a variable) and is typically used where a full def would be overkill. Lambdas are the backbone of functional programming in Python.

Key Concepts

- Lambda functions are one-line functions

- They automatically return the result of the expression

- Commonly used with:

  - sorted() for custom sorting

  - filter() for selection

  - map() for transformation

  - max() and min() for custom comparison

When to Use Lambda

Use lambda functions when:

- The function is simple and short

- It is used only once

- You want concise code

Avoid lambda functions when:

- The logic is complex

- Multiple statements are required

![Image 17](/pyimages/pimg17.png)

> 📐  Syntax
> lambda  param1, param2, ...  :  expression
> # The expression is automatically returned — no "return" keyword needed
> # Equivalent regular function:
> def name(param1, param2, ...):
>     return expression
> 💡  When to use lambda vs def: Use lambda for simple, single-expression functions passed as arguments. Use def when the function has multiple steps, needs a docstring, or will be reused in many places.

  Example 1: Basic Lambda Expressions

These examples show simple lambdas assigned to variables. While you can do this, the real power of lambdas is passing them directly as arguments without assigning to a variable first.

>   🐍 Example 1 — Basic lambda expressions
> # A lambda that doubles a number
> double = lambda x: x * 2
> print(double(7))          # 14
> # A lambda that squares a number
> square = lambda x: x ** 2
> print(square(9))          # 81
> # A lambda with two parameters
> add = lambda a, b: a + b
> print(add(4, 6))          # 10
> # A lambda that builds a string
> greet = lambda name: f"Hello, {name}!"
> print(greet("Alice"))     # Hello, Alice!
> # A lambda that returns a boolean
> is_even = lambda n: n % 2 == 0
> print(is_even(8))         # True
> print(is_even(7))         # False
> # A lambda with three parameters (clamps n between lo and hi)
> clamp = lambda n, lo, hi: max(lo, min(n, hi))
> print(clamp(150, 0, 100))  # 100  (too high → clamped to max)
> print(clamp(-5,  0, 100))  # 0    (too low  → clamped to min)
> print(clamp(50,  0, 100))  # 50   (in range → unchanged)
> ▶  Output
> 14
> 81
> 10
> Hello, Alice!
> True
> False
> 100
> 0
> 50

Explanation: Each lambda takes parameters before the colon and returns the expression after the colon. The clamp lambda uses Python's nested max/min trick: min(n, hi) ensures n is not above hi, then max(lo, ...) ensures it is not below lo.

  Example 2: Lambda with sorted() — Custom Sort Keys

The sorted() function accepts a key= parameter — a function that extracts a comparison value from each element. Lambdas are perfect here because the key function is usually simple and used only once.

>   🐍 Example 2 — Lambda with sorted()
> students = [
>     {"name": "Alice", "gpa": 3.9, "age": 21},
>     {"name": "Bob",   "gpa": 3.5, "age": 23},
>     {"name": "Carol", "gpa": 3.7, "age": 20},
> ]
> # Sort by GPA, highest first (reverse=True)
> by_gpa = sorted(students, key=lambda s: s["gpa"], reverse=True)
> print("By GPA:", [s["name"] for s in by_gpa])
> # Sort by name, alphabetically
> by_name = sorted(students, key=lambda s: s["name"])
> print("By name:", [s["name"] for s in by_name])
> # Sort by age, youngest first
> by_age = sorted(students, key=lambda s: s["age"])
> print("By age:", [s["name"] for s in by_age])
> ▶  Output
> By GPA:  ['Alice', 'Carol', 'Bob']
> By name: ['Alice', 'Bob', 'Carol']
> By age:  ['Carol', 'Alice', 'Bob']

Explanation: key=lambda s: s["gpa"] tells sorted() to use each student's "gpa" value as the sort key. sorted() calls this lambda once for each item in the list to get its key, then sorts by those keys. This avoids having to define a separate named function just for sorting.

  Example 3: Lambda with filter() — Selecting Elements

filter(function, iterable) returns only the elements for which the function returns True. Lambda makes it easy to specify the filter condition inline.

>   🐍 Example 3 — Lambda with filter()
> scores = [45, 78, 92, 34, 88, 55, 99, 62]
> # Keep only scores >= 60 (passing grade)
> passed = list(filter(lambda s: s >= 60, scores))
> print("Passed:", passed)
> # Keep only even numbers
> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
> evens = list(filter(lambda n: n % 2 == 0, numbers))
> print("Evens:", evens)
> # Keep only non-empty strings
> words = ["apple", "", "banana", "", "cherry"]
> non_empty = list(filter(lambda w: w != "", words))
> print("Non-empty:", non_empty)
> ▶  Output
> Passed: [78, 92, 88, 99, 62]
> Evens: [2, 4, 6, 8, 10]
> Non-empty: ['apple', 'banana', 'cherry']

Explanation: filter() calls the lambda for each element and keeps only those for which the lambda returns True. We wrap the result in list() because filter() returns an iterator, not a list. The lambda condition can be any expression that evaluates to True or False.

  Example 4: Lambda with map() — Transforming Elements

map(function, iterable) applies a function to every element and returns the transformed values. Use it with lambda to apply quick transformations without writing a loop.

>   🐍 Example 4 — Lambda with map()
> prices = [100, 200, 300, 400, 500]
> # Add 18% GST to every price
> with_gst = list(map(lambda p: round(p * 1.18, 2), prices))
> print("With GST:", with_gst)
> # Convert Celsius temperatures to Fahrenheit
> celsius = [0, 20, 37, 100]
> fahrenheit = list(map(lambda c: (c * 9/5) + 32, celsius))
> print("Fahrenheit:", fahrenheit)
> # Convert all strings to uppercase
> names = ["alice", "bob", "carol"]
> upper = list(map(lambda n: n.upper(), names))
> print("Upper:", upper)
> ▶  Output
> With GST: [118.0, 236.0, 354.0, 472.0, 590.0]
> Fahrenheit: [32.0, 68.0, 98.6, 212.0]
> Upper: ['ALICE', 'BOB', 'CAROL']

Explanation: map() applies the lambda to every element and returns an iterator. We wrap it in list() to get a list. This is more concise than a for loop when the transformation is simple. For complex multi-step transformations, a regular for loop or list comprehension is clearer.

# 5️⃣  Closures — Functions That Remember

A closure is created when an inner function references variables from its enclosing (outer) scope, and the outer function returns the inner function. Even after the outer function has finished executing, the inner function still "remembers" and has access to those variables.

Think of it like this: when you create a closure, the inner function captures a "snapshot" of the variables it needs from the outer scope. This lets you create specialised functions that carry their own private data.

# 💡  Why use closures? Closures create private state without needing a full class. They are perfect for factories that produce customised functions, counters, and simple configuration.

  Example 1: Function Factory — Creating Custom Multipliers

A classic closure example: a factory function that produces multiplier functions. Each returned function "closes over" a different value of factor.

>   🐍 Example 1 — Closure as a function factory
> def make_multiplier(factor):
>     """Return a function that multiplies any number by factor."""
>     def multiply(number):
>         # This inner function "remembers" the value of factor
>         # even after make_multiplier() has finished running
>         return number * factor
>     return multiply   # return the function itself, not its result
> # Create three different multiplier functions
> double  = make_multiplier(2)   # factor=2 is "captured"
> triple  = make_multiplier(3)   # factor=3 is "captured"
> times10 = make_multiplier(10)  # factor=10 is "captured"
> # Each function behaves differently
> print(double(5))     # 5 * 2 = 10
> print(triple(5))     # 5 * 3 = 15
> print(times10(7))    # 7 * 10 = 70
> # You can even verify what they captured:
> print(double.__closure__[0].cell_contents)   # 2
> print(triple.__closure__[0].cell_contents)   # 3
> ▶  Output
> 10
> 15
> 70
> 2
> 3

Explanation: make_multiplier(2) creates and returns the multiply function. At that moment, the value 2 is "closed over" — stored alongside the function. When you later call double(5), multiply still knows that factor=2 even though make_multiplier() finished running long ago.

  Example 2: Closure as a Stateful Counter

Closures can maintain mutable state by using a mutable container (a list) inside the closure. This lets you build counter objects without writing a class.

>   🐍 Example 2 — Stateful counter using closure
> def make_counter(start=0):
>     """Return an increment function that counts from start."""
>     count = [start]   # Use a list so we can mutate it inside the closure
>     def increment(step=1):
>         count[0] += step   # modify the mutable list element
>         return count[0]
>     def reset():
>         count[0] = start   # reset back to starting value
>     increment.reset = reset  # attach reset as an attribute
>     return increment
> counter = make_counter(10)  # starts counting from 10
> print(counter())     # 11  (increments by 1)
> print(counter())     # 12
> print(counter(5))    # 17  (increments by 5)
> counter.reset()      # reset back to start (10)
> print(counter())     # 11  (counting from 10 again)
> ▶  Output
> 11
> 12
> 17
> 11

Explanation: We store count as a single-element list [start] because integers are immutable in Python — you cannot rebind them from inside a nested function without the nonlocal keyword. A list is mutable, so count[0] += step works. Each call to make_counter() creates an independent counter with its own private count list.

# 6️⃣  Decorators — Wrapping Functions with Extra Behaviour

A decorator is a function that takes another function as input, adds some behaviour before or after it (or both), and returns the enhanced version. Python's @decorator syntax is just a shorthand that makes this pattern clean to write.

The underlying mechanism is simple: @timer above a function is exactly the same as writing my_function = timer(my_function) after the function definition.

# 📐  Syntax
## @decorator_name       # shorthand — equivalent to the line below
def my_function():
...
# The above is IDENTICAL to:
def my_function():
...
my_function = decorator_name(my_function)

  Example 1: Timer Decorator — Measure Execution Time

A practical decorator that measures how long any function takes to run. Once defined, it can be applied to any function with a single @ line.

>   🐍 Example 1 — Timer decorator
> import time
> def timer(func):
>     """Decorator: print the execution time of any function."""
>     def wrapper(*args, **kwargs):
>         start  = time.perf_counter()      # record start time
>         result = func(*args, **kwargs)    # run the original function
>         end    = time.perf_counter()      # record end time
>         elapsed = end - start
>         print(f"{func.__name__}() took {elapsed:.4f} seconds")
>         return result
>     return wrapper
> # Apply the decorator with @ syntax
> @timer
> def slow_sum(n):
>     """Sum all numbers from 0 to n."""
>     return sum(range(n))
> result = slow_sum(10_000_000)
> print(f"Result: {result:,}")
> ▶  Output
> slow_sum() took 0.2831 seconds
> Result: 49,999,995,000,000

Explanation: The timer decorator defines a wrapper function that has *args and **kwargs so it can wrap any function regardless of its signature. It records time before and after calling the original function. @timer is syntactic sugar for slow_sum = timer(slow_sum) — after decoration, slow_sum points to wrapper, which calls the original slow_sum internally.

  Example 2: Logger Decorator — Log Every Call

A logger decorator that prints the function name, arguments, and return value every time the function is called. Useful for debugging without modifying the function body.

>   🐍 Example 2 — Logger decorator
> def logger(func):
>     """Decorator: log every call to the function."""
>     def wrapper(*args, **kwargs):
>         # Log what was called
>         print(f"  → Calling {func.__name__} with args={args} kwargs={kwargs}")
>         result = func(*args, **kwargs)
>         # Log what was returned
>         print(f"  ← {func.__name__} returned {result}")
>         return result
>     return wrapper
> @logger
> def add(a, b):
>     """Add two numbers."""
>     return a + b
> @logger
> def greet(name, greeting="Hello"):
>     return f"{greeting}, {name}!"
> add(3, 5)
> greet("Alice")
> greet("Bob", greeting="Good morning")
> ▶  Output
>   → Calling add with args=(3, 5) kwargs={}
>   ← add returned 8
>   → Calling greet with args=('Alice',) kwargs={}
>   ← greet returned Hello, Alice!
>   → Calling greet with args=('Bob',) kwargs={'greeting': 'Good morning'}
>   ← greet returned Good morning, Bob!

Explanation: The same logger decorator is applied to both add() and greet(). This demonstrates the reusability of decorators — once written, you can use @logger on any function with no changes. The wrapper function captures and logs the arguments automatically because it uses *args and **kwargs.

# 7️⃣  Recursion — Functions That Call Themselves

Recursion is when a function calls itself to solve a smaller version of the same problem. It is a powerful technique for problems that have a naturally self-similar or hierarchical structure, such as tree traversal, directory scanning, and divide-and-conquer algorithms.

Every recursive function MUST have two components:

1. BASE CASE — the condition that stops the recursion and returns a direct answer

2. RECURSIVE CASE — the logic that calls the function with a simpler or smaller input

![Image 18](/pyimages/pimg18.png)

> 📐  Syntax
> def recursive_function(problem):
>     if base_case_condition:          # STOP — simplest possible problem
>         return simplest_answer
>     # Reduce the problem, then recurse (must get CLOSER to base case!)
>     return recursive_function(smaller_problem)
> 💡  WARNING: Every recursive call MUST move closer to the base case. If it does not, you will get an infinite recursion and Python will raise a RecursionError after ~1000 calls.

  Example 1: Factorial — n! = n × (n-1) × ... × 1

The factorial of n (written n!) is the product of all positive integers from 1 to n. It is the "Hello World" of recursion because the mathematical definition is itself recursive: n! = n × (n-1)!

>   🐍 Example 1 — Factorial
> def factorial(n):
>     """
>     Compute n! recursively.
>     Base case:     factorial(0) = 1  (by definition)
>     Recursive case: factorial(n) = n * factorial(n-1)
>     """
>     if n <= 1:                      # BASE CASE: 0! = 1, 1! = 1
>         return 1
>     return n * factorial(n - 1)    # RECURSIVE CASE: n * (n-1)!
> print(factorial(0))   # 1
> print(factorial(5))   # 120  = 5 × 4 × 3 × 2 × 1
> print(factorial(10))  # 3628800
> # Trace the calls for factorial(4):
> # factorial(4) → 4 * factorial(3)
> #              → 4 * 3 * factorial(2)
> #              → 4 * 3 * 2 * factorial(1)
> #              → 4 * 3 * 2 * 1   (base case!)
> #              → 24
> ▶  Output
> 1
> 120
> 3628800

Explanation: factorial(5) calls factorial(4), which calls factorial(3), and so on, until factorial(1) hits the base case and returns 1. Python then unwinds the call stack: 1×2=2, 2×3=6, 6×4=24, 24×5=120.

  Example 2: Fibonacci Sequence

The Fibonacci sequence is: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ... Each number is the sum of the two preceding numbers. This makes it a perfect example of recursion with two base cases.

>   🐍 Example 2 — Fibonacci sequence
> def fib(n):
>     """
>     Return the nth Fibonacci number.
>     Base cases:     fib(0) = 0,  fib(1) = 1
>     Recursive case: fib(n) = fib(n-1) + fib(n-2)
>     """
>     if n <= 1:                       # TWO base cases
>         return n                     # fib(0)=0, fib(1)=1
>     return fib(n - 1) + fib(n - 2)  # recursive case
> # Print first 10 Fibonacci numbers
> print([fib(i) for i in range(10)])
> # Individual lookups
> print(fib(10))   # 55
> print(fib(15))   # 610
> ▶  Output
> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
> 55
> 610

Explanation: Each call to fib(n) makes TWO recursive calls: fib(n-1) and fib(n-2). This means the total number of calls grows exponentially. For fib(5), Python makes 15 function calls. For fib(30) it makes millions. To fix this, use memoisation with @functools.lru_cache.

  Example 3: Sum of Digits

A cleaner example: recursively sum all digits of a number. 12345 → 1+2+3+4+5 = 15. The idea is to peel off the last digit (n % 10) and recurse on the rest (n // 10).

>   🐍 Example 3 — Sum of digits
> def digit_sum(n):
>     """
>     Sum all digits of a non-negative integer.
>     Base case:     single digit — return it directly
>     Recursive case: last digit + digit_sum(remaining digits)
>     """
>     if n < 10:           # BASE CASE: single digit
>         return n
>     return (n % 10) + digit_sum(n // 10)
>     # n % 10  → last digit    (12345 % 10 = 5)
>     # n // 10 → remove last   (12345 // 10 = 1234)
> print(digit_sum(12345))   # 1+2+3+4+5 = 15
> print(digit_sum(9999))    # 9+9+9+9   = 36
> print(digit_sum(7))       # 7  (base case)
> ▶  Output
> 15
> 36
> 7

Explanation: For digit_sum(12345): the last digit is 12345%10=5, the rest is 12345//10=1234. So we return 5 + digit_sum(1234). This continues until we reach a single-digit number.

  Example 4: Reverse a String

Recursion works naturally on strings: to reverse a string, take the first character and append it after the reverse of the remaining characters.

>   🐍 Example 4 — Reverse a string
> def reverse(s):
>     """
>     Reverse a string recursively.
>     Base case:     string of 0 or 1 characters → return as-is
>     Recursive case: reverse(s[1:]) + s[0]
>     """
>     if len(s) <= 1:           # BASE CASE: empty or single char
>         return s
>     return reverse(s[1:]) + s[0]
>     # s[1:]  → everything except first char ("ython")
>     # s[0]   → first character ("P")
> print(reverse("Python"))   # nohtyP
> print(reverse("hello"))    # olleh
> print(reverse("a"))        # a   (base case)
> print(reverse(""))         # ""  (base case)
> ▶  Output
> nohtyP
> olleh
> a

Explanation: reverse("Python") calls reverse("ython"), which calls reverse("thon"), and so on. When we reach "n" (single character), we return "n". Then we start building the result: "n" + "o" + "h" + "t" + "y" + "P" = "nohtyP".

  Example 5: Binary Search — Divide and Conquer

Binary search is a classic divide-and-conquer algorithm. Given a sorted list, it repeatedly halves the search space until it finds the target or determines it is not there.

>   🐍 Example 5 — Binary search (recursive)
> def binary_search(arr, target, lo=0, hi=None):
>     """
>     Search for target in sorted list arr.
>     Returns the index if found, -1 if not found.
>     """
>     if hi is None:
>         hi = len(arr) - 1
>     if lo > hi:              # BASE CASE: search space exhausted
>         return -1
>     mid = (lo + hi) // 2    # find middle index
>     if arr[mid] == target:   # BASE CASE: found it!
>         return mid
>     elif arr[mid] < target:  # target is in RIGHT half
>         return binary_search(arr, target, mid + 1, hi)
>     else:                    # target is in LEFT half
>         return binary_search(arr, target, lo, mid - 1)
> data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
> print(binary_search(data, 23))   # 5   (found at index 5)
> print(binary_search(data, 56))   # 7   (found at index 7)
> print(binary_search(data, 99))   # -1  (not found)
> ▶  Output
> 5
> 7
> -1

Explanation: For a 10-element list, binary search takes at most log₂(10) ≈ 4 comparisons to find any element — compared to 10 comparisons for a linear search. Each recursive call halves lo or hi, so the search space shrinks by half each time, guaranteeing we reach the base case.

# 💡  Lesson Recap — Key Takeaways
## *args: packs all extra positional arguments into a TUPLE inside the function — def f(*args)
**kwargs: packs all extra keyword arguments into a DICT inside the function — def f(**kwargs)
Parameter order: positional → default → *args → keyword-only → **kwargs
Unpacking at call site: total(*my_list) and create_profile(**my_dict)
Lambda syntax: lambda x: x*2 — a one-expression anonymous function, no return needed
Lambda use cases: sorted(key=), filter(), map(), max/min(key=), callbacks
Closure: an inner function that "remembers" variables from the enclosing scope after it returns
Decorator: @dec wraps a function to add behaviour without modifying the original code
Recursion: a function that calls itself — MUST have a base case, each call MUST approach it
Recursion caution: Python default limit is 1000 calls; use iteration or lru_cache for performance`,

  12: `# 📦  INTERMEDIATE  •  LESSON 12
## Modules & Packages
Organise and reuse code across files and projects

# 📌  What Is a Module?

A module is simply a Python file (.py) that contains functions, classes, variables, and runnable code. Any .py file you write is already a module — you can import it in other files and reuse its contents without copying and pasting code.

Python's strength comes largely from its vast module ecosystem: hundreds of modules are built into every Python installation (the Standard Library), and over 500,000 third-party modules are available on PyPI (Python Package Index).

| Term | Meaning |
| --- | --- |
| Module | A single .py file containing reusable Python code |
| Package | A directory of modules that contains an __init__.py file |
| Library | A collection of related packages (e.g. NumPy, Pandas, Django) |
| Standard Library | Modules bundled with Python — no installation needed |
| PyPI | Python Package Index — 500,000+ third-party packages at pypi.org |
| pip | Package installer — pip install package_name |

# 📥  Importing Modules — 4 Styles

Python gives you four different ways to import modules. Each style has its own trade-offs in terms of readability, namespace cleanliness, and typing convenience.

![Image 19](/pyimages/pimg19.png)

  Example 1: Style 1 — import module (Full Module Import)

The cleanest style. You import the whole module and access everything with the module name as a prefix. This makes it crystal clear where each function comes from.

>   🐍 Example 1 — import module
> import math
> import os
> # Use the module name as a prefix
> print(math.sqrt(144))   # 12.0
> print(math.pi)          # 3.141592653589793
> print(math.e)           # 2.718281828459045
> print(math.floor(4.9))  # 4
> print(math.ceil(4.1))   # 5
> print(os.getcwd())      # print current working directory
> ▶  Output
> 12.0
> 3.141592653589793
> 2.718281828459045
> 4
> 5
> /home/alice/projects   (your actual directory)

Explanation: math.sqrt(144) makes it obvious that sqrt comes from the math module. This is the recommended style for most situations because it avoids name collisions and makes the code self-documenting.

  Example 2: Style 2 — from module import name (Selective Import)

Import only specific names from a module. You can use them directly without the module prefix — good when you use a few functions very frequently.

>   🐍 Example 2 — from module import name
> from math import sqrt, pi, floor, ceil, factorial
> # Now use directly — no "math." prefix needed
> print(sqrt(81))        # 9.0
> print(floor(4.9))      # 4
> print(ceil(4.1))       # 5
> print(factorial(6))    # 720
> print(pi)              # 3.141592653589793
> # Practical: area of a circle
> radius = 5
> area = pi * radius ** 2
> print(f"Area = {area:.2f}")   # Area = 78.54
> ▶  Output
> 9.0
> 4
> 5
> 720
> 3.141592653589793
> Area = 78.54

Explanation: Only the listed names are added to the current namespace. Other math functions like math.tan() are NOT available — you imported only what you asked for. This style is clean but can cause confusion if two modules export functions with the same name.

  Example 3: Style 3 — import module as alias (Aliased Import)

Import a module with a shorter nickname. Essential for modules with long names, and a standard convention in the data science world (import numpy as np, import pandas as pd).

>   🐍 Example 3 — import with alias
> import datetime as dt
> import os.path as osp
> # Use the alias instead of the full name
> today = dt.date.today()
> print(today)                    # 2024-12-25
> now = dt.datetime.now()
> print(now.strftime("%H:%M:%S")) # current time like 14:30:22
> print(osp.exists("notes.txt"))  # True or False
> print(osp.join("data", "output", "results.csv"))  # data/output/results.csv
> # Industry standard aliases (memorise these):
> # import numpy as np
> # import pandas as pd
> # import matplotlib.pyplot as plt
> ▶  Output
> 2024-12-25
> 14:30:22
> False
> data/output/results.csv

Explanation: import datetime as dt means "import the datetime module and refer to it as dt". Every use of dt.something is exactly the same as datetime.something. Aliases reduce typing for frequently used modules.

  Example 4: Style 4 — from module import * (Wildcard Import)

Imports everything from a module directly into the current namespace. Convenient in interactive shells but strongly discouraged in production code.

>   🐍 Example 4 — Wildcard import (use carefully)
> from math import *
> # Everything from math is now available directly
> print(ceil(2.3))      # 3
> print(sin(pi / 2))    # 1.0
> print(log(100, 10))   # 2.0
> # DANGER — why to avoid this:
> # What if two modules both define "sum", "max", or "open"?
> # The second import silently overwrites the first.
> # Inspect a module — useful for learning what is available
> import random
> print(dir(random))        # list all functions and variables
> print(random.__file__)    # file path of the module
> help(random.randint)      # read the built-in documentation
> 💡  Best practice: Use "import module" or "from module import specific_name". Avoid wildcard imports (from module import *) in any file that other people will read or maintain.

# 🛠️  Creating a Custom Module

Every .py file you write is automatically a module. To create a reusable module: write functions and variables in a .py file, then import that file in any other Python file in the same directory.

![Image20](/pyimages/pimg20.png)

  Example 1: Writing the Module File — myutils.py

Create a file called myutils.py with reusable utilities. The if __name__ == "__main__": block at the bottom allows the file to be both run directly for testing and imported cleanly.

# 🐍 myutils.py — the module file
## # ─── myutils.py ──────────────────────────────────────────────
"""Utility functions for the project."""
# Module-level constants
PI = 3.14159265358979
E  = 2.71828182845905
def greet(name, greeting="Hello"):
"""Return a personalised greeting string."""
return f"{greeting}, {name}!"
def celsius_to_fahrenheit(c):
"""Convert Celsius to Fahrenheit."""
return (c * 9 / 5) + 32
def is_palindrome(text):
"""Return True if text reads the same forwards and backwards."""
clean = text.lower().replace(" ", "")
return clean == clean[::-1]
def factorial(n):
"""Compute n! recursively."""
if n <= 1: return 1
return n * factorial(n - 1)
class Calculator:
"""A simple calculator class."""
def add(self, a, b): return a + b
def sub(self, a, b): return a - b
def mul(self, a, b): return a * b
def div(self, a, b):
if b == 0: raise ZeroDivisionError("Cannot divide by zero")
return a / b
# This block runs ONLY when you execute: python myutils.py
# It is SKIPPED when you do: import myutils
if __name__ == "__main__":
print("Running myutils tests...")
print(greet("World"))               # Hello, World!
print(celsius_to_fahrenheit(100))   # 212.0
print(is_palindrome("racecar"))     # True

  Example 2: Importing and Using the Module — main.py

Now import myutils from any other Python file in the same directory. You can import the whole module or selectively import specific names.

>   🐍 main.py — using the module
> # ─── main.py ─────────────────────────────────────────────────
> import myutils                          # import the whole module
> from myutils import greet, is_palindrome, PI
> # Use functions via the module name
> print(myutils.celsius_to_fahrenheit(37))    # 98.6
> print(myutils.factorial(7))                 # 5040
> # Use selectively imported functions directly
> print(greet("Alice"))                       # Hello, Alice!
> print(greet("Bob", "Good morning"))         # Good morning, Bob!
> print(is_palindrome("never odd or even"))   # True
> print(PI)                                   # 3.14159265358979
> # Use the Calculator class from the module
> calc = myutils.Calculator()
> print(calc.add(10, 5))    # 15
> print(calc.div(20, 4))    # 5.0
> ▶  Output
> 98.6
> 5040
> Hello, Alice!
> Good morning, Bob!
> True
> 3.14159265358979
> 15
> 5.0

# 📁  Packages — Multi-Module Projects

A package is a directory that contains multiple Python modules plus a special __init__.py file. The __init__.py file is what tells Python "this directory is a package, not just a folder of files". Packages let you organise large projects into logical namespaces.

  Example 1: Package Directory Structure

# 🐍 Package directory structure
## # Recommended directory structure:
my_project/
main.py                  ← your entry point
utils/                   ← this is the PACKAGE directory
__init__.py          ← marks it as a package (can be empty)
math_utils.py        ← module with maths functions
string_utils.py      ← module with string functions
file_utils.py        ← module with file I/O helpers
data/                ← sub-package
__init__.py
loader.py
cleaner.py

 What is Happening

- my_project is the main project folder

- main.py is the starting file (entry point)

- utils/ is a package

  - It contains multiple modules like:

    - math_utils.py → math-related functions

    - string_utils.py → string-related functions

    - file_utils.py → file handling functions

- __init__.py:

  - Marks the folder as a package

  - Can be empty or used to control imports

- data/ is a sub-package

  - Contains its own __init__.py

  - Has modules like loader.py and cleaner.py

  Example 2: Importing from a Package

# 🐍 Importing from a package
## # Importing from the utils package in main.py
# Import an entire module from the package
from utils import math_utils
result = math_utils.factorial(5)   # 120
# Import a specific function from a module in the package
from utils.string_utils import is_palindrome
print(is_palindrome("racecar"))    # True
# Import from a sub-package
from utils.data.loader import load_csv
data = load_csv("students.csv")
# ── utils/__init__.py can expose things directly ──
# Add to utils/__init__.py:
# from .math_utils   import factorial, circle_area
# from .string_utils import is_palindrome, reverse
# __all__ = ["factorial", "circle_area", "is_palindrome"]
# Then in main.py:
from utils import factorial    # works directly!

 Import Entire Module

- Imports the whole module math_utils from package utils

- You must use module name to access functions

- Calls factorial(5) → returns 120

Import Specific Function

- Imports only the required function

- No need to use module name

- Directly calls the function

- Output → True

Import from Sub-package

  Accesses nested structure:

- utils → data → loader

  Imports load_csv function

  Demonstrates how packages can be deeply structured

Using __init__.py for Cleaner Imports

Inside utils/__init__.py:

- Re-exports selected functions at package level

- __all__ controls what gets imported

Now in main.py:

- You can directly import functions without mentioning module name

- Makes code cleaner and easier to use

# 📚  Standard Library — Key Modules Reference

| Module | Key Items & Typical Use |
| --- | --- |
| math | sqrt, pi, e, floor, ceil, log, sin, factorial, gcd — Maths calculations |
| os | getcwd, listdir, mkdir, remove, environ — File system operations |
| sys | argv, exit, path, version, stdin, stdout — System-level access |
| random | random, randint, choice, shuffle, sample, seed — Random data |
| datetime | date, time, datetime, timedelta, strftime, strptime — Date & time |
| json | loads, dumps, load, dump — JSON serialisation & API data |
| re | match, search, findall, sub, compile — Regular expressions |
| csv | reader, writer, DictReader, DictWriter — CSV file processing |
| pathlib | Path, mkdir, glob, exists, read_text, write_text — File paths |
| collections | Counter, defaultdict, OrderedDict, namedtuple, deque — Containers |
| itertools | chain, product, permutations, combinations, cycle — Iterators |
| functools | reduce, partial, lru_cache, wraps — Functional programming |

# 🔒  The __name__ == "__main__" Guard

When Python imports a module, it sets the module's __name__ attribute to the module's file name (without .py). But when you run a file directly with python myfile.py, Python sets __name__ to the special string "__main__".

This means you can write code that runs tests or demos when the file is run directly, but is completely skipped when the file is imported as a module — which is exactly what you want.

  Example 1: Using the __main__ Guard

>   🐍 Example — __main__ guard
> # myutils.py
> def add(a, b): return a + b
> def sub(a, b): return a - b
> # Guard: this block runs ONLY when executed as: python myutils.py
> # It is completely SKIPPED when: import myutils
> if __name__ == "__main__":
>     print("Testing myutils...")
>     assert add(2, 3) == 5,   "add failed"
>     assert sub(10, 4) == 6,  "sub failed"
>     print("All tests passed ✅")
> # ─────────────────────────────────────────────────────────────
> # When you run:  python myutils.py
> #   __name__ == "__main__"  →  tests RUN
> # When you run:  import myutils  (from another file)
> #   __name__ == "myutils"   →  tests SKIPPED
> ▶  Output
> # Running: python myutils.py
> Testing myutils...
> All tests passed ✅
> # Importing: import myutils
> (no output — tests are skipped)

# 💡  Lesson Recap — Key Takeaways
## Module = any .py file; Package = directory with __init__.py inside
import math → access as math.sqrt(); from math import sqrt → access directly as sqrt()
import numpy as np → creates an alias (industry standard for data science libraries)
Avoid from module import * — it pollutes the namespace and causes hidden conflicts
Every .py file you write is automatically importable as a module
__name__ == "__main__" guard prevents test/demo code from running when imported
dir(module) lists all attributes; help(func) shows the docstring documentation
Packages organise multiple modules into a namespace using a directory with __init__.py
Standard Library is already installed — use math, os, sys, json, csv, datetime freely`,

  13: `# 📂  INTERMEDIATE  •  LESSON 13
## File Handling
Read, write, and manage files — give your programs persistence

# 📌  Why File Handling?

Programs are ephemeral — when they end, all data in memory is lost. Files provide persistence: your programs can save results, read configuration, process data from spreadsheets, log events, and interact with the real file system.

File handling is essential in every real-world application: web servers write logs, data pipelines read CSV files, APIs send and receive JSON, and applications store settings in config files.

![Image 21](/pyimages/pimg21.png)

# 🗂️  File Modes — Complete Reference

| Mode | Full Behaviour |
| --- | --- |
| "r"  — Read | Open for reading ONLY. Pointer at start. Raises FileNotFoundError if file does not exist. DEFAULT mode. |
| "w"  — Write | Open for writing. OVERWRITES entire content if file exists. Creates new file if it does not exist. |
| "a"  — Append | Open for appending. Writes go to END of existing content. Creates file if it does not exist. Never overwrites. |
| "x"  — Exclusive | Create a NEW file only. Raises FileExistsError if file already exists. Safe for new-file creation. |
| "r+" — Read+Write | Open existing file for both reading AND writing. Raises error if file does not exist. |
| "b"  — Binary | Add to any mode: "rb", "wb", "ab". For non-text files: images, PDFs, audio, executables. |
| "t"  — Text | Default mode. "rt" = "r". Handles platform line-ending differences automatically (\\n vs \\r\\n). |

# 📖  Reading Files

The safest and most Pythonic way to open any file is with the with statement (context manager). It guarantees the file is closed even if an exception occurs inside the block. Always use with — never manually call f.close().

# 📐  Syntax
## with open("filename.txt", "r", encoding="utf-8") as f:
content    = f.read()       # entire file as ONE string
first_line = f.readline()   # read ONE line (advances pointer)
all_lines  = f.readlines()  # list of all lines (with \\n)
for line in f:              # iterate line by line (best for large files)
process(line)

  Example 1: read() — Read the Entire File as One String

Use f.read() when you need the complete file content as a single string. Good for small files where you want to search, replace, or parse the whole content at once.

>   🐍 Example 1 — f.read()
> # First, let us create a sample file to read
> with open("poem.txt", "w", encoding="utf-8") as f:
>     f.write("Roses are red,\\n")
>     f.write("Violets are blue,\\n")
>     f.write("Python is great,\\n")
>     f.write("And so are you!\\n")
> # Now read the entire file as one string
> with open("poem.txt", "r", encoding="utf-8") as f:
>     content = f.read()       # reads everything at once
> print(content)
> print(f"Total characters: {len(content)}")
> print(f"Contains 'Python': {'Python' in content}")
> ▶  Output
> Roses are red,
> Violets are blue,
> Python is great,
> And so are you!
> Total characters: 62
> Contains 'Python': True

Explanation: f.read() returns the entire file as one string, including newline characters (\\n). After read() the file pointer is at the end — calling read() again would return an empty string. The with block ensures the file is closed when we exit, even if an error occurs.

  Example 2: readlines() — Read All Lines into a List

Use readlines() when you want to process each line individually and need random access to lines by index.

>   🐍 Example 2 — f.readlines()
> # Create a data file
> with open("data.txt", "w") as f:
>     f.write("Alice 95\\n")
>     f.write("Bob 82\\n")
>     f.write("Carol 91\\n")
>     f.write("David 78\\n")
> # Read all lines into a list
> with open("data.txt", "r") as f:
>     lines = f.readlines()     # each element includes trailing \\n
> print(f"Total lines: {len(lines)}")
> for i, line in enumerate(lines, 1):
>     # rstrip() removes the trailing \\n from each line
>     clean = line.rstrip()
>     name, score = clean.split()
>     print(f"  Line {i}: {name} scored {score}")
> ▶  Output
> Total lines: 4
>   Line 1: Alice scored 95
>   Line 2: Bob scored 82
>   Line 3: Carol scored 91
>   Line 4: David scored 78

Explanation: readlines() returns a Python list where each element is one line of text, including the trailing newline character \\n. We use .rstrip() to strip that trailing whitespace before processing. This approach loads the entire file into memory at once.

  Example 3: Iterating Line by Line — Memory Efficient

The best approach for large files. Instead of reading the whole file into memory, Python reads and processes one line at a time. This works even for files that are gigabytes in size.

>   🐍 Example 3 — Iterate line by line
> # Create a larger sample file
> with open("book.txt", "w", encoding="utf-8") as f:
>     f.write("The quick brown fox jumps over the lazy dog.\\n")
>     f.write("\\n")   # blank line
>     f.write("Python is a versatile programming language.\\n")
>     f.write("It is used for web development, data science, AI.\\n")
> # Count words without loading entire file into memory
> word_count = 0
> line_count = 0
> with open("book.txt", "r", encoding="utf-8") as f:
>     for line in f:                    # Python reads ONE line at a time
>         line = line.strip()           # remove leading/trailing whitespace
>         if line:                      # skip blank lines
>             line_count += 1
>             word_count += len(line.split())
> print(f"Lines (non-blank): {line_count}")
> print(f"Total words:       {word_count}")
> ▶  Output
> Lines (non-blank): 3
> Total words:       25

Explanation: for line in f is the most memory-efficient reading method. Python reads one line at a time from disk rather than loading everything into RAM. This is crucial for log files, data pipelines, and any file that could be hundreds of MB or GB in size.

# ✍️  Writing Files

  Example 1: write() — Create or Overwrite a File

Use "w" mode to write text to a file. If the file already exists, its contents are completely erased first. If the file does not exist, it is created.

>   🐍 Example 1 — write() to a file
> # Create a new file (or OVERWRITE existing)
> with open("output.txt", "w", encoding="utf-8") as f:
>     f.write("Line 1: Hello, File!\\n")   # \\n required — write() does not add it
>     f.write("Line 2: Python rocks!\\n")
>     f.write("Line 3: File handling is easy.\\n")
> # Verify by reading it back
> with open("output.txt", "r") as f:
>     print(f.read())
> ▶  Output
> Line 1: Hello, File!
> Line 2: Python rocks!
> Line 3: File handling is easy.

Explanation: Unlike print(), f.write() does NOT automatically add a newline at the end of each string. You must explicitly include \\n if you want each write to be on a new line. The file is automatically closed when the with block ends.

  Example 2: writelines() — Write a List of Strings

writelines() accepts any iterable of strings and writes them all. Like write(), it does not add newlines automatically — include \\n in each string if needed.

>   🐍 Example 2 — writelines() and print(..., file=f)
> names = ["Alice\\n", "Bob\\n", "Carol\\n", "David\\n"]
> with open("names.txt", "w") as f:
>     f.writelines(names)   # writes all strings in the list
> # Alternative: using print() with file= argument
> with open("report.txt", "w") as f:
>     print("Sales Report 2024", file=f)  # print() adds \\n automatically
>     print("=" * 20,           file=f)
>     print(f"Total: Rs.{9999:,}", file=f)
> with open("report.txt", "r") as f:
>     print(f.read())
> ▶  Output
> Sales Report 2024
> ====================
> Total: Rs.9,999

Explanation: print(value, file=f) is a very convenient trick — it redirects print output to any file object instead of the screen, and automatically adds newlines. writelines() is faster for writing large lists because it makes fewer system calls than writing line by line.

  Example 3: Append Mode — Add to Existing File

Use "a" mode when you want to add new content to the END of an existing file without touching what is already there. Perfect for log files.

>   🐍 Example 3 — Append mode
> from datetime import datetime
> # Each time this runs, a new log entry is ADDED
> # The file is never erased — old entries are preserved
> with open("app.log", "a") as f:
>     ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
>     f.write(f"[{ts}] INFO: Server started\\n")
> # Simulate a second event
> with open("app.log", "a") as f:
>     ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
>     f.write(f"[{ts}] INFO: User logged in: alice\\n")
> # Read the log
> with open("app.log", "r") as f:
>     print(f.read())
> ▶  Output
> [2024-12-25 14:30:00] INFO: Server started
> [2024-12-25 14:30:01] INFO: User logged in: alice

Explanation: Every time you open a file in "a" mode and write to it, the new content is added at the very end. If you used "w" mode here instead, you would lose the previous log entries every time the program runs. Append mode is essential for log files.

# 📊  Working with CSV Files

CSV (Comma-Separated Values) is the most common format for tabular data — think Excel spreadsheets as plain text. Python's built-in csv module handles edge cases like quoted fields, commas inside values, and different delimiters (tab, semicolon, etc.).

  Example 1: Writing a CSV File with csv.writer

csv.writer handles all the formatting: quoting fields that contain commas, adding proper line endings, etc. Always use newline="" when opening CSV files to prevent double line endings.

>   🐍 Example 1 — Writing CSV with csv.writer
> import csv
> students = [
>     ["Name",  "Age", "Grade", "City"],      # header row
>     ["Alice", 20,    "A",     "Hyderabad"],
>     ["Bob",   22,    "B",     "Mumbai"],
>     ["Carol", 21,    "A+",    "Bangalore"],
> ]
> # newline="" is required for csv module — prevents extra blank lines
> with open("students.csv", "w", newline="", encoding="utf-8") as f:
>     writer = csv.writer(f)
>     writer.writerows(students)   # write ALL rows at once
> print("students.csv created successfully!")
> ▶  Output
> students.csv created successfully!
> # File contents:
> Name,Age,Grade,City
> Alice,20,A,Hyderabad
> Bob,22,B,Mumbai
> Carol,21,A+,Bangalore

  Example 2: Reading a CSV File with csv.reader

csv.reader returns each row as a list of strings. Use next(reader) to skip the header row, then iterate over the remaining rows.

>   🐍 Example 2 — Reading CSV with csv.reader
> import csv
> with open("students.csv", "r", encoding="utf-8") as f:
>     reader = csv.reader(f)
>     header = next(reader)          # read and skip the header row
>     print("Columns:", header)
>     print("-" * 45)
>     for row in reader:
>         name, age, grade, city = row   # unpack the row
>         print(f"{name:8} | Age {age} | Grade {grade} | {city}")
> ▶  Output
> Columns: ['Name', 'Age', 'Grade', 'City']
> ---------------------------------------------
> Alice    | Age 20 | Grade A  | Hyderabad
> Bob      | Age 22 | Grade B  | Mumbai
> Carol    | Age 21 | Grade A+ | Bangalore

  Example 3: DictReader — Rows as Dictionaries (Recommended)

DictReader automatically uses the first row as column headers and returns each subsequent row as an OrderedDict. This is much more readable because you access fields by name instead of by index.

>   🐍 Example 3 — DictReader
> import csv
> with open("students.csv", "r") as f:
>     reader = csv.DictReader(f)   # first row becomes the keys
>     for row in reader:
>         # Access fields by name — much clearer than row[0], row[2]!
>         print(f"{row['Name']} (age {row['Age']}) → Grade: {row['Grade']} from {row['City']}")
> ▶  Output
> Alice (age 20) → Grade: A from Hyderabad
> Bob (age 22) → Grade: B from Mumbai
> Carol (age 21) → Grade: A+ from Bangalore

Explanation: With csv.reader, you access fields by position: row[0] for name, row[2] for grade. With csv.DictReader, you access by name: row["Name"], row["Grade"]. DictReader is far more readable and does not break if you add columns to the CSV.

# 🔷  Working with JSON Files

JSON (JavaScript Object Notation) is the universal data-interchange format used by almost every web API. Python dictionaries and lists map directly to JSON objects and arrays. The json module provides four functions for working with JSON.

| Function | What It Does |
| --- | --- |
| json.dumps(obj) | Python dict/list → JSON string (for sending over network, printing) |
| json.loads(str) | JSON string → Python dict/list (for parsing API responses) |
| json.dump(obj, file) | Python dict/list → JSON file (for saving data to disk) |
| json.load(file) | JSON file → Python dict/list (for loading saved data) |

  Example 1: Python Dictionary to JSON String — json.dumps()

Use json.dumps() to convert a Python object to a JSON-formatted string. The indent parameter makes it human-readable (pretty-printed).

>   🐍 Example 1 — json.dumps() Python → JSON string
> import json
> student = {
>     "name":   "Alice",
>     "age":    20,
>     "grades": [85, 92, 78, 95],
>     "active": True,
>     "address": {"city": "Hyderabad", "pin": "500001"}
> }
> # Convert to JSON string (pretty-printed with indent=4)
> json_str = json.dumps(student, indent=4)
> print(json_str)
> print(f"Type: {type(json_str)}")  # str
> ▶  Output
> {
>     "name": "Alice",
>     "age": 20,
>     "grades": [85, 92, 78, 95],
>     "active": true,
>     "address": {
>         "city": "Hyderabad",
>         "pin": "500001"
>     }
> }
> Type: <class 'str'>

Explanation: Notice that Python's True becomes JSON's true (lowercase). Python None becomes JSON's null. Strings are always double-quoted in JSON. The resulting string is just a regular Python string that happens to be valid JSON.

  Example 2: Save to File and Load Back — json.dump() and json.load()

Use json.dump() to save Python data to a JSON file, and json.load() to read it back. This is the standard way to save configuration or program state between runs.

>   🐍 Example 2 — json.dump() and json.load()
> import json
> # Save Python object to a JSON file
> with open("student.json", "w", encoding="utf-8") as f:
>     json.dump(student, f, indent=4)   # student is the dict from above
> # Load JSON file back into Python
> with open("student.json", "r", encoding="utf-8") as f:
>     loaded = json.load(f)
> # Access the loaded data just like any Python dict
> print(loaded["name"])              # Alice
> print(loaded["grades"])            # [85, 92, 78, 95]
> print(loaded["address"]["city"])   # Hyderabad
> # Compute average grade
> avg = sum(loaded["grades"]) / len(loaded["grades"])
> print(f"Average grade: {avg:.1f}")  # 87.5
> ▶  Output
> Alice
> [85, 92, 78, 95]
> Hyderabad
> Average grade: 87.5

  Example 3: Parsing an API Response — json.loads()

When you call a web API, the response body is a JSON string. Use json.loads() (load string) to convert it into a Python dictionary or list that you can work with.

>   🐍 Example 3 — json.loads() for API responses
> import json
> # Simulate an API response (in real code this would come from requests.get())
> api_response = '{"status":"ok","count":3,"items":[10,20,30],"user":"Alice"}'
> # Parse the JSON string into a Python dict
> data = json.loads(api_response)
> print(type(data))           # <class 'dict'>
> print(data["status"])       # ok
> print(data["count"])        # 3
> print(data["items"])        # [10, 20, 30]
> print(sum(data["items"]))   # 60
> ▶  Output
> <class 'dict'>
> ok
> 3
> [10, 20, 30]
> 60

# 📁  File & Directory Operations — pathlib

Python provides two ways to work with the file system: the older os/os.path modules and the modern pathlib.Path (added in Python 3.4). pathlib is recommended for all new code — it is object-oriented, cleaner, and more readable.

  Example 1: Basic pathlib Operations

# 🐍 Example 1 — Path object basics
## from pathlib import Path
# Create a Path object
p = Path("data/students.csv")
# Inspect the path components
print(p.name)      # students.csv   (filename with extension)
print(p.stem)      # students       (filename without extension)
print(p.suffix)    # .csv           (extension including dot)
print(p.parent)    # data           (parent directory)
# Check existence and type
print(p.exists())   # True or False
print(p.is_file())  # True if it is a file
print(p.is_dir())   # True if it is a directory
# Get file size
if p.exists():
print(f"Size: {p.stat().st_size} bytes")

  Example 2: Creating Directories and Searching for Files

# 🐍 Example 2 — Directories and glob patterns
## from pathlib import Path
# Create a directory (no error if it already exists)
Path("logs").mkdir(parents=True, exist_ok=True)
Path("data/reports").mkdir(parents=True, exist_ok=True)
# Quick read/write with pathlib (no need to open/close)
p = Path("hello.txt")
p.write_text("Hello from pathlib!", encoding="utf-8")
print(p.read_text())   # Hello from pathlib!
# Find all Python files in the current directory (recursive)
py_files = list(Path(".").glob("**/*.py"))
print(f"Found {len(py_files)} Python files")
# Find all CSV files in a specific directory
csv_files = list(Path("data").glob("*.csv"))
for f in csv_files:
print(f"  {f.name}  ({f.stat().st_size} bytes)")

# 💡  Lesson Recap — Key Takeaways
## ALWAYS use "with open(...) as f:" — it auto-closes the file even if an error occurs
"r"=read, "w"=write/overwrite, "a"=append (never erases), "x"=create new only
Always specify encoding="utf-8" for text files — avoids issues with special characters
read() → full string | readlines() → list of lines | for line in f: → memory efficient
csv module: csv.reader/writer for plain rows; DictReader/DictWriter for dict-based rows
json.dumps/loads work with strings; json.dump/load work with files
pathlib.Path is the modern, clean alternative to os.path — use it in all new code
"a" mode APPENDS to the end — never use "w" if you want to keep existing content
Always use newline="" when opening CSV files for writing`,

  14: `# 🛡️  INTERMEDIATE  •  LESSON 14
## Exception Handling
Write robust programs that handle errors gracefully

# 📌  What Is an Exception?

An exception is a runtime error — an error that occurs while the program is running, not when Python parses the code. When Python encounters something it cannot handle (dividing by zero, opening a missing file, accessing a missing key), it raises an exception.

Without exception handling, these errors immediately crash your program and print a traceback. With exception handling, you can catch the error, respond gracefully, inform the user, and optionally continue running.

# 💡  Key concept: Every exception is an object — an instance of a class that inherits from BaseException. Python has a rich hierarchy of built-in exception classes, and you can create your own custom ones.

![Image22](/pyimages/pimg22.png)

# ⚡  Common Built-in Exceptions

| Exception | What Causes It — Example |
| --- | --- |
| ZeroDivisionError | Dividing by zero — 10 / 0 |
| ValueError | Right type, wrong value — int("hello") |
| TypeError | Wrong data type — "abc" + 5 |
| NameError | Variable not defined — print(undefined_var) |
| IndexError | List index out of range — [1,2,3][99] |
| KeyError | Dictionary key missing — d["missing_key"] |
| FileNotFoundError | File does not exist — open("no_file.txt") |
| AttributeError | Object has no attribute — "hi".push() |
| ImportError | Module not found — import nonexistent_module |
| PermissionError | No read/write access to the file |
| RecursionError | Recursion depth exceeded (~1000 calls) |
| StopIteration | Iterator exhausted — next() on empty iterator |

# 🛡️  try / except — The Basic Structure

The try block contains code that might fail. The except block catches specific exception types and runs recovery code. Python checks each except clause in order from top to bottom and runs only the first one that matches.

# 📐  Syntax
## try:
# Code that might raise an exception
risky_operation()
except ExceptionType:
# Runs ONLY if ExceptionType was raised
handle_the_error()
except AnotherType as e:
# "as e" gives you access to the exception object
print(f"Error: {e}")

  Example 1: Catching a Specific Exception

The most basic and important use of exception handling: anticipate which error might occur and handle exactly that one.

>   🐍 Example 1 — Catching specific exceptions
> try:
>     number = int(input("Enter a number: "))   # may raise ValueError
>     result = 100 / number                     # may raise ZeroDivisionError
>     print(f"100 ÷ {number} = {result:.2f}")
> except ZeroDivisionError:
>     # This runs ONLY if ZeroDivisionError was raised
>     print("Error: cannot divide by zero!")
> except ValueError:
>     # This runs ONLY if ValueError was raised
>     print("Error: please enter a valid whole number!")
> ▶  Output
> # Input: 0
> Enter a number: 0
> Error: cannot divide by zero!
> # Input: abc
> Enter a number: abc
> Error: please enter a valid whole number!
> # Input: 4
> Enter a number: 4
> 100 ÷ 4 = 25.00

Explanation: Python tries the code in the try block. If int(input()) raises a ValueError (user typed letters), Python jumps to the ValueError handler. If the division raises ZeroDivisionError (user typed 0), Python jumps to that handler. If no exception is raised, both handlers are skipped.

  Example 2: Catching Multiple Exceptions in One Line

If two different exceptions should be handled the same way, you can group them in a tuple inside a single except clause.

>   🐍 Example 2 — Multiple exceptions in one handler
> # Catch multiple exceptions with the SAME handler
> try:
>     x = int("not_a_number")  # raises ValueError
> except (ValueError, TypeError) as e:
>     print(f"Conversion error: {type(e).__name__}: {e}")
> # Another example: database operations that can fail in multiple ways
> def fetch_record(data, key, index):
>     try:
>         return data[key][index]
>     except (KeyError, IndexError) as e:
>         print(f"Data access failed ({type(e).__name__}): {e}")
>         return None
> db = {"users": ["Alice", "Bob", "Carol"]}
> print(fetch_record(db, "users", 1))      # Bob
> print(fetch_record(db, "users", 99))     # IndexError
> print(fetch_record(db, "products", 0))   # KeyError
> ▶  Output
> Conversion error: ValueError: invalid literal for int() with base 10: 'not_a_number'
> Bob
> Data access failed (IndexError): list index out of range
> Data access failed (KeyError): 'products'

  Example 3: Using "as e" to Inspect the Exception Object

The "as e" syntax gives you access to the exception object itself. This lets you print a detailed message, log the error, or extract specific attributes.

>   🐍 Example 3 — Inspecting the exception object
> try:
>     result = 10 / 0
> except ZeroDivisionError as e:
>     print(f"Exception type:    {type(e).__name__}")
>     print(f"Exception message: {e}")
>     print(f"Exception args:    {e.args}")
> # FileNotFoundError has extra attributes
> try:
>     open("missing_file.txt")
> except FileNotFoundError as e:
>     print(f"\\nFileNotFoundError details:")
>     print(f"  errno:    {e.errno}")
>     print(f"  strerror: {e.strerror}")
>     print(f"  filename: {e.filename}")
> ▶  Output
> Exception type:    ZeroDivisionError
> Exception message: division by zero
> Exception args:    ('division by zero',)
> FileNotFoundError details:
>   errno:    2
>   strerror: No such file or directory
>   filename: missing_file.txt

Explanation: type(e).__name__ gives the class name as a string ("ZeroDivisionError"). str(e) or just e in an f-string gives the error message. e.args is the tuple of arguments passed to the exception constructor. Specific exception types like FileNotFoundError have additional attributes like errno and filename.

# ✅  try / except / else / finally — The Full Structure

The complete exception-handling structure has four clauses. You do not need all four every time, but understanding when each runs gives you precise control.

| Clause | When It Runs |
| --- | --- |
| try: | Always — contains the code that might fail |
| except ExceptionType: | Only if that specific exception was raised in try |
| else: | Only if NO exception was raised in try (the "success path") |
| finally: | ALWAYS — whether exception occurred or not — used for cleanup |

  Example 1: All Four Clauses Working Together

A division function that shows exactly when each clause runs. Run it with different inputs to see the pattern.

>   🐍 Example 1 — All four clauses
> def safe_divide(a, b):
>     """Demonstrate all four exception-handling clauses."""
>     try:
>         result = a / b                    # might raise ZeroDivisionError or TypeError
>     except ZeroDivisionError:
>         print(f"  ❌ Cannot divide {a} by zero!")
>         return None
>     except TypeError as e:
>         print(f"  ❌ Type error: {e}")
>         return None
>     else:
>         # Runs ONLY when NO exception occurred
>         print(f"  ✅ {a} ÷ {b} = {result:.4f}")
>         return result
>     finally:
>         # ALWAYS runs — perfect for cleanup code
>         print(f"  🔁 safe_divide({a}, {b}) complete")
> safe_divide(10, 4)      # success path
> safe_divide(10, 0)      # ZeroDivisionError
> safe_divide(10, "x")    # TypeError
> ▶  Output
>   ✅ 10 ÷ 4 = 2.5000
>   🔁 safe_divide(10, 4) complete
>   ❌ Cannot divide 10 by zero!
>   🔁 safe_divide(10, 0) complete
>   ❌ Type error: unsupported operand type(s) for /: 'int' and 'str'
>   🔁 safe_divide(10, x) complete

Explanation: Notice that finally ALWAYS runs, even when we return inside the except block. The else block runs instead of the except block when everything in try succeeds. This is cleaner than putting the success code at the bottom of try, because any exception in the success code would be mistakenly caught.

# 🔥  Handling Multiple Exceptions — Layered Strategy

Real programs deal with many failure modes. A robust file processor shows how to layer exception handling for each type of failure, providing a specific, helpful error message for each.

  Example 1: Robust Config File Loader

>   🐍 Example 1 — Layered exception handling
> import json, os
> def load_config(path):
>     """Load JSON config file — handle every possible failure mode."""
>     try:
>         with open(path, "r", encoding="utf-8") as f:
>             raw = f.read()
>         config = json.loads(raw)
>         port   = int(config.get("port", 8080))
>         host   = config["host"]          # may raise KeyError
>         return {"host": host, "port": port}
>     except FileNotFoundError:
>         print(f"Config file not found: {path}")
>         print("Using defaults: localhost:8080")
>         return {"host": "localhost", "port": 8080}
>     except PermissionError:
>         print(f"No read permission: {path}")
>         return None
>     except json.JSONDecodeError as e:
>         print(f"Invalid JSON in {path}: {e.msg} at line {e.lineno}")
>         return None
>     except KeyError as e:
>         print(f"Missing required key in config: {e}")
>         return None
>     except ValueError as e:
>         print(f"Invalid value in config: {e}")
>         return None
>     finally:
>         print(f"load_config({path!r}) finished")
> # Test with a missing file
> cfg = load_config("server.json")
> print(f"Config: {cfg}")
> ▶  Output
> Config file not found: server.json
> Using defaults: localhost:8080
> load_config('server.json') finished
> Config: {'host': 'localhost', 'port': 8080}

# 🚀  raise — Throwing Exceptions Manually

You can raise exceptions yourself using the raise statement. This is how you enforce constraints, signal invalid input to callers, and make your functions fail loudly and clearly rather than silently producing wrong results.

  Example 1: Validating Input with raise

Raise an exception as soon as you detect invalid input — before any damage is done. Choose the most appropriate exception type: ValueError for bad values, TypeError for wrong types.

>   🐍 Example 1 — Raising exceptions for validation
> def set_age(age):
>     """Set a persons age — validate the input first."""
>     if not isinstance(age, (int, float)):
>         raise TypeError(f"age must be a number, got {type(age).__name__}")
>     if not 0 <= age <= 150:
>         raise ValueError(f"age {age} is unrealistic (must be 0–150)")
>     return int(age)
> # Test with a string
> try:
>     set_age("twenty")
> except TypeError as e:
>     print(f"TypeError:  {e}")
> # Test with an out-of-range value
> try:
>     set_age(200)
> except ValueError as e:
>     print(f"ValueError: {e}")
> # Test with a valid value
> print(f"Valid age: {set_age(25)}")
> ▶  Output
> TypeError:  age must be a number, got str
> ValueError: age 200 is unrealistic (must be 0–150)
> Valid age: 25

  Example 2: Re-raising and Chaining Exceptions

Sometimes you want to log or partially handle an exception, then let it propagate to the caller. Use bare "raise" to re-raise the current exception. Use "raise X from Y" to chain exceptions.

>   🐍 Example 2 — Re-raise and exception chaining
> import logging
> # Re-raise: log it, then let it propagate
> def process(data):
>     try:
>         result = int(data)   # may raise ValueError
>     except ValueError as e:
>         logging.error(f"Failed to parse: {data!r} — {e}")
>         raise   # bare raise — re-raises the SAME exception
> # Exception chaining — wrap one exception in another
> def connect(host):
>     try:
>         # Simulate a connection failure
>         raise OSError("Connection refused")
>     except OSError as e:
>         # Raise a higher-level exception, but preserve the original cause
>         raise ConnectionError(f"Failed to connect to {host}") from e
> try:
>     connect("db.local")
> except ConnectionError as e:
>     print(f"ConnectionError: {e}")
>     print(f"Caused by: {e.__cause__}")
> ▶  Output
> ConnectionError: Failed to connect to db.local
> Caused by: Connection refused

# 🏗️  Custom Exceptions — Building Your Own

Custom exceptions let you define domain-specific error types with meaningful names and additional data. Callers can catch your specific exception type rather than catching a generic ValueError or Exception.

Best practice: create a base exception class for your application (AppError), then inherit specific exceptions from it. This lets callers catch all your exceptions with "except AppError" or a specific one with "except InsufficientFundsError".

![Image23](/pyimages/pimg23.png)

  Example 1: Defining a Custom Exception Hierarchy

A bank account example with a custom exception hierarchy. Each exception carries the relevant data fields, making error handling much richer than a plain error message.

# 🐍 Example 1 — Custom exception hierarchy
## # Step 1: Define the base exception for all app errors
class AppError(Exception):
"""Base class for all application-specific exceptions."""
pass
# Step 2: Define specific exceptions with extra data
class InsufficientFundsError(AppError):
"""Raised when a withdrawal exceeds the account balance."""
def __init__(self, balance, amount):
self.balance = balance
self.amount  = amount
super().__init__(f"Need Rs.{amount:,.0f} but only Rs.{balance:,.0f} available")
class InvalidAgeError(AppError):
"""Raised when age is outside valid range."""
def __init__(self, age, min_age=0, max_age=150):
self.age = age
super().__init__(f"Age {age} is outside valid range [{min_age}, {max_age}]")
class ConnectionTimeoutError(AppError):
"""Raised when a network connection times out."""
def __init__(self, host, timeout_secs):
self.host    = host
self.timeout = timeout_secs
super().__init__(f"Timeout connecting to {host} after {timeout_secs}s")

  Example 2: Using Custom Exceptions in a BankAccount Class

Now use the custom exceptions in a real class. The rich error information (balance, amount) lets callers display precise, helpful messages to the user.

>   🐍 Example 2 — Custom exceptions with BankAccount
> class BankAccount:
>     def __init__(self, owner, balance=0):
>         self.owner   = owner
>         self.balance = balance
>     def deposit(self, amount):
>         if amount <= 0:
>             raise ValueError("Deposit amount must be positive")
>         self.balance += amount
>         return self.balance
>     def withdraw(self, amount):
>         if amount > self.balance:
>             raise InsufficientFundsError(self.balance, amount)
>         self.balance -= amount
>         return self.balance
> # Use the account
> account = BankAccount("Alice", 1000)
> account.deposit(500)
> print(f"Balance after deposit: Rs.{account.balance:,}")
> # Try to withdraw too much
> try:
>     account.withdraw(3000)
> except InsufficientFundsError as e:
>     print(f"Transaction failed: {e}")
>     print(f"Current balance:      Rs.{e.balance:,}")
>     print(f"Attempted withdrawal: Rs.{e.amount:,}")
>     print(f"Shortfall:            Rs.{e.amount - e.balance:,}")
> ▶  Output
> Balance after deposit: Rs.1,500
> Transaction failed: Need Rs.3,000 but only Rs.1,500 available
> Current balance:      Rs.1,500
> Attempted withdrawal: Rs.3,000
> Shortfall:            Rs.1,500

Explanation: InsufficientFundsError stores balance and amount as attributes. The caller can access e.balance and e.amount to show precise details — something impossible with a plain ValueError. This is the real power of custom exceptions.

  Example 3: Catching Custom Exceptions Generically and Specifically

Because custom exceptions inherit from AppError, you can catch them either specifically (for fine-grained handling) or generally (for catch-all logging).

>   🐍 Example 3 — Catching custom exceptions
> # Catch SPECIFICALLY — only InsufficientFundsError
> try:
>     account.withdraw(5000)
> except InsufficientFundsError as e:
>     print(f"Funds error: {e}")
> # Catch ALL app errors generically via the base class
> try:
>     raise ConnectionTimeoutError("db.local", 30)
> except AppError as e:
>     # This catches ANY exception in our AppError hierarchy
>     print(f"App error ({type(e).__name__}): {e}")
> # Catching order matters — specific before general!
> try:
>     account.withdraw(5000)
> except InsufficientFundsError as e:
>     print(f"Not enough funds: balance=Rs.{e.balance:,}")
> except AppError as e:
>     print(f"General app error: {e}")   # fallback for other app errors
> except Exception as e:
>     print(f"Unexpected error: {e}")    # last resort
> ▶  Output
> Funds error: Need Rs.5,000 but only Rs.1,500 available
> App error (ConnectionTimeoutError): Timeout connecting to db.local after 30s
> Not enough funds: balance=Rs.1,500

# 📋  Exception Handling Best Practices

✅  DO | ❌  AVOID
Catch specific exceptions: except ValueError: | Bare except: — catches even KeyboardInterrupt and SystemExit
Use "as e" to access the exception object | Silently swallow errors: except: pass
Log exceptions with enough context to debug | Catching Exception for every single error
Use finally for guaranteed cleanup (close file) | Catching broad types when a narrow one fits better
Re-raise when you cannot fully handle here | Ignoring exception details (type, message, traceback)
Create domain-specific custom exceptions | Using generic Exception for domain-specific errors
Document which exceptions your functions raise | Using exceptions for normal control flow
💡  Lesson Recap — Key Takeaways try: — attempt the risky code; except ExceptionType: — handle a specific error else: — runs ONLY when no exception occurred in try (the success path) finally: — ALWAYS runs, whether exception happened or not — ideal for cleanup code "as e" gives you the exception object: type(e).__name__, str(e), e.args raise ExceptionType("message") — throw your own exception with a helpful message Bare raise (inside except) — re-raises the current exception to the caller Custom exceptions: inherit from Exception; add __init__ to store extra data as attributes Build a hierarchy: AppError → InsufficientFundsError, InvalidAgeError, etc. NEVER use bare "except:" — always catch specific types for predictable, debuggable code Order matters: always list more specific exceptions BEFORE more general ones |

# 🐍
## Python Programming
INTERMEDIATE LEVEL
LESSONS 15 — 18
🏗️  OOP   •   🧬  OOP Concepts
⚡  Comprehensions   •   📚  Libraries & pip
📊  Includes visual diagrams • flow charts • separated examples • deep explanations

Contents

| Lesson | Topics Covered |
| --- | --- |
| 🏗️  Lesson 15 — OOP | Classes, Objects, __init__, self, Class vs Instance Variables, Dunder Methods |
| 🧬  Lesson 16 — OOP Concepts | Inheritance, Polymorphism, Encapsulation, Abstraction, super(), ABC |
| ⚡  Lesson 17 — Comprehensions | List, Dict, Set Comprehensions; Generators; Nested; Ternary |
| 📚  Lesson 18 — Libraries | math, random, datetime, pip, Virtual Environments, Popular Packages |`,

  15: `# 🏗️  INTERMEDIATE  •  LESSON 15
## Object-Oriented Programming
Classes, Objects, __init__, self, Instance vs Class Variables, Dunder Methods

# 📌  What Is Object-Oriented Programming?

Object-Oriented Programming (OOP) is a programming paradigm that organises code around objects — entities that bundle related data (attributes) and behaviour (methods) together in one cohesive unit called a class.

Instead of writing separate functions that operate on separate variables, OOP packages everything that logically belongs together into a single class. This makes large programs dramatically easier to design, understand, extend, and maintain.

# 💡  Real-world analogy: A class is like a blueprint for a house. The blueprint describes the structure — number of rooms, windows, walls. An object is the actual house built from that blueprint. You can build many houses from one blueprint, each with its own colour and furniture (data), but all sharing the same structure and layout (methods).

❌  Procedural Style | ✅  Object-Oriented Style
name = "Alice" age  = 25 gpa  = 3.8 # Data and logic disconnected: get_grade(gpa) | alice = Student("Alice", 25, 3.8) # Data and logic bundled: alice.get_grade() alice.enroll(course)

# 🏗️  Classes & Objects — Blueprint vs Instance

A CLASS is a template or blueprint. An OBJECT (also called an instance) is a concrete thing created from that blueprint. The class defines what data an object stores and what actions it can perform. When you create an object, Python calls the class and allocates memory for a fresh, independent instance.

You can create as many objects as you need from one class — each has its own independent set of data (instance variables), but they all share the same methods (behaviour defined in the class).

Visual overview of how a class maps to its instances:

![Image 24](/pyimages/pimg24.png)

# 📐  Syntax
## class ClassName:           # PascalCase convention (not snake_case)
"""Class docstring."""
class_variable = value     # shared by ALL instances
def __init__(self, param1, param2):  # constructor — called at creation
self.attr1 = param1    # instance variable — unique per object
self.attr2 = param2
def method_name(self):     # instance method — called on an object
return self.attr1      # access own data via self
# Create objects (instantiate):
obj1 = ClassName(val1, val2)   # → Python calls __init__ automatically
obj2 = ClassName(val3, val4)   # → independent object, own data

Visual overview of how a class maps to its instances:

  Example 1: The Dog Class — A Complete OOP Walkthrough

A full example covering class variables, instance variables, the constructor, multiple methods, and the __str__ dunder method. Read the comments carefully — each line is explained.

# 🐍 Example 1 — Dog class definition
## class Dog:
"""Represents a dog. Demonstrates all core OOP concepts."""
# ── Class variables ── shared by ALL Dog instances ──────
species    = "Canis lupus familiaris"
total_dogs = 0   # tracks how many Dog objects exist
# ── Constructor ─────────────────────────────────────────
def __init__(self, name, breed, age):
"""Called automatically when you write Dog(name, breed, age)."""
# Instance variables — each dog has its OWN copy of these:
self.name  = name    # "self" = "this particular dog object"
self.breed = breed
self.age   = age
Dog.total_dogs += 1  # update class variable (shared counter)
# ── Instance methods ─────────────────────────────────────
def bark(self):
print(f"{self.name} says: Woof! Woof!")
def get_info(self):
return f"Name: {self.name} | Breed: {self.breed} | Age: {self.age}"
def is_adult(self):
return self.age >= 2   # returns True or False
def birthday(self):
self.age += 1          # modifies THIS object only
print(f"Happy birthday, {self.name}! Now {self.age}.")
# ── Dunder method ─────────────────────────────────────────
def __str__(self):   # called by print(dog) and str(dog)
return f"Dog({self.name}, {self.breed}, {self.age}yr)"

>   🐍 Example 1 continued — Using the Dog objects
> # ── Create three independent Dog objects ────────────────────
> dog1 = Dog("Buddy", "Labrador", 3)   # __init__ called with these args
> dog2 = Dog("Max",   "Poodle",   1)
> dog3 = Dog("Luna",  "Husky",    5)
> # ── Call instance methods (each uses its own data) ──────────
> dog1.bark()                   # Buddy says: Woof! Woof!
> print(dog1.get_info())        # Name: Buddy | Breed: Labrador | Age: 3
> print(dog1.is_adult())        # True (age 3 >= 2)
> dog2.birthday()               # Happy birthday, Max! Now 2.
> # ── Access attributes directly ───────────────────────────────
> print(dog1.name)              # Buddy
> print(dog2.name)              # Max  ← completely independent
> dog1.age = 4                  # directly modify one attribute
> # ── Class variables ──────────────────────────────────────────
> print(Dog.species)            # Canis lupus familiaris
> print(Dog.total_dogs)         # 3  (three objects were created)
> print(dog1.species)           # also works via instance (reads class)
> # ── __str__ dunder: print() uses it automatically ────────────
> print(dog1)   # Dog(Buddy, Labrador, 4yr)
> print(dog2)   # Dog(Max, Poodle, 2yr)
> ▶  Output
> Buddy says: Woof! Woof!
> Name: Buddy | Breed: Labrador | Age: 3
> True
> Happy birthday, Max! Now 2.
> Buddy
> Max
> Canis lupus familiaris
> 3
> Canis lupus familiaris
> Dog(Buddy, Labrador, 4yr)
> Dog(Max, Poodle, 2yr)

Key insight: dog1.age = 4 changes only dog1's age. dog2 and dog3 are completely unaffected — they each have their own independent instance variables. But Dog.species is shared — change it via Dog.species = "..." and ALL dogs see the new value immediately.

# 🔧  The __init__ Constructor — Deep Dive

__init__ is Python's constructor method. It runs automatically the moment you write Dog("Buddy", "Lab", 3). Its job is to set up the object — validate inputs, store data as self.attributes, and initialise any collections the object needs.

The self parameter is always first and always refers to the newly created object. You never pass self explicitly — Python inserts it automatically when you call a method on an object.

  Example 2: BankAccount — Validation, History, and Interest

A more realistic class that demonstrates: constructor validation, storing instance data, maintaining a history list, a class-level interest rate, and a method that calls another method (deposit calls add to history).

>   🐍 Example 2 — BankAccount class
> class BankAccount:
>     """A bank account with owner, balance and transaction history."""
>     interest_rate = 0.04   # 4% annual — CLASS variable (same for all)
>     def __init__(self, owner, balance=0, currency="INR"):
>         if balance < 0:
>             raise ValueError("Opening balance cannot be negative")
>         # Store instance data
>         self.owner        = owner
>         self.balance      = balance
>         self.currency     = currency
>         self.transactions = []    # each account gets its OWN empty list
>         print(f"Account created for {owner} with {currency} {balance:,.0f}")
>     def deposit(self, amount):
>         if amount <= 0: raise ValueError("Deposit must be positive")
>         self.balance += amount
>         self.transactions.append(("DEP", amount, self.balance))
>         return self.balance
>     def withdraw(self, amount):
>         if amount > self.balance: raise ValueError("Insufficient funds")
>         self.balance -= amount
>         self.transactions.append(("WDR", amount, self.balance))
>         return self.balance
>     def statement(self):
>         print(f"\\n─── Statement: {self.owner} ───")
>         for txn_type, amt, bal in self.transactions:
>             print(f"  {txn_type}: {self.currency} {amt:8,.0f}  → bal={bal:,.0f}")
>         print(f"  Balance: {self.currency} {self.balance:,.0f}")
>     def add_interest(self):
>         interest = self.balance * BankAccount.interest_rate
>         self.deposit(interest)   # reuse deposit method!
>         print(f"Interest {BankAccount.interest_rate*100:.0f}% added: {self.currency} {interest:,.0f}")
> acc = BankAccount("Alice", 10000)
> acc.deposit(5000)
> acc.withdraw(2000)
> acc.add_interest()
> acc.statement()
> ▶  Output
> Account created for Alice with INR 10,000
> ─── Statement: Alice ───
>   DEP: INR     5,000  → bal=15,000
>   WDR: INR     2,000  → bal=13,000
>   DEP: INR       520  → bal=13,520
>   Balance: INR 13,520

# 📦  Instance vs Class Variables

Understanding the difference between instance and class variables is critical for writing correct OOP code. Instance variables belong to individual objects; class variables are shared across all instances.

![Image 25](/pyimages/pimg25.png)

| Variable Type | Description & Behaviour |
| --- | --- |
| Instance Variable | Defined with self.name = value inside __init__. Each object has its own INDEPENDENT copy. Changing it for dog1 does NOT affect dog2. |
| Class Variable | Defined at class level (no self). SHARED by all instances. Change it via ClassName.var and every instance sees the new value immediately. |
| @classmethod | Receives cls (the class) as first arg. Can read/modify class variables. Call via ClassName.method() or instance.method(). |
| @staticmethod | Receives neither self nor cls. A regular function logically grouped inside the class. No access to instance or class data. |

  Example 3: Student — Class Variables, @classmethod, @staticmethod

>   🐍 Example 3 — Class variables, @classmethod, @staticmethod
> class Student:
>     # Class variables — shared across ALL students
>     school_name = "careerEzi Academy"
>     passing_gpa = 2.0
>     total_count = 0
>     def __init__(self, name, gpa):
>         # Instance variables — unique to each student
>         self.name = name
>         self.gpa  = gpa
>         Student.total_count += 1   # update shared class counter
>     @classmethod
>     def get_count(cls):
>         """@classmethod: receives cls (the class itself), not self."""
>         return f"{cls.total_count} students enrolled at {cls.school_name}"
>     @staticmethod
>     def letter_grade(gpa):
>         """@staticmethod: no self or cls — just a utility function."""
>         if gpa >= 3.7: return "A"
>         if gpa >= 3.3: return "B+"
>         if gpa >= 3.0: return "B"
>         return "C"
> s1 = Student("Alice", 3.9)
> s2 = Student("Bob",   3.4)
> s3 = Student("Carol", 3.0)
> # Instance variables — each object has its own
> print(s1.name, s1.gpa)         # Alice 3.9
> print(s2.name, s2.gpa)         # Bob   3.4
> # Class variable — same for all
> print(Student.school_name)      # careerEzi Academy
> print(Student.get_count())      # 3 students enrolled at careerEzi Academy
> # @staticmethod — called on class or instance
> print(Student.letter_grade(3.9))   # A
> print(s1.letter_grade(3.4))        # B+
> # Changing class variable via ClassName affects ALL instances
> Student.school_name = "Advanced careerEzi Academy"
> print(s1.school_name)    # Advanced careerEzi Academy
> print(s2.school_name)    # Advanced careerEzi Academy
> ▶  Output
> Alice 3.9
> Bob 3.4
> careerEzi Academy
> 3 students enrolled at careerEzi Academy
> A
> B+
> Advanced careerEzi Academy
> Advanced careerEzi Academy

# ✨  Dunder (Magic) Methods

Dunder methods (double-underscore, also called magic methods) let your custom classes integrate seamlessly with Python's built-in syntax. They are called automatically by Python when you use print(), ==, +, len(), in, [], and other operators on your objects.

Implementing dunders makes your objects feel like native Python types — users of your class can write natural Python code without needing to learn special API calls.

| Dunder Method | Triggered By | Purpose |
| --- | --- | --- |
| __init__(self,...) | obj = MyClass(...) | Constructor — initialise the object |
| __str__(self) | print(obj), str(obj) | Human-readable string representation |
| __repr__(self) | repr(obj), interactive shell | Developer/debug string — should be unambiguous |
| __len__(self) | len(obj) | Return integer length |
| __eq__(self,other) | obj1 == obj2 | Equality comparison → True/False |
| __lt__(self,other) | obj1 < obj2 | Less-than comparison (enables sorting!) |
| __add__(self,other) | obj1 + obj2 | Addition — return new combined object |
| __contains__(self,x) | x in obj | Membership test → True/False |
| __getitem__(self,i) | obj[i] | Index access |
| __del__(self) | del obj | Cleanup before object is destroyed |

  Example 4: Vector Class — Implementing Arithmetic Operators

A 2D mathematical vector class that implements six dunder methods, making vectors work naturally with +, -, *, ==, len(), and unary negation. This is the exact pattern used in NumPy arrays and other scientific Python libraries.

>   🐍 Example 4 — Vector with dunder methods
> import math
> class Vector:
>     """2D mathematical vector with full operator support."""
>     def __init__(self, x, y):
>         self.x, self.y = x, y
>     def __str__(self):             # print(v) → "Vector(3, 4)"
>         return f"Vector({self.x}, {self.y})"
>     def __repr__(self):            # repr(v) → developer view
>         return f"Vector(x={self.x}, y={self.y})"
>     def __add__(self, other):      # v1 + v2
>         return Vector(self.x + other.x, self.y + other.y)
>     def __sub__(self, other):      # v1 - v2
>         return Vector(self.x - other.x, self.y - other.y)
>     def __mul__(self, scalar):     # v * 3  (scalar multiplication)
>         return Vector(self.x * scalar, self.y * scalar)
>     def __eq__(self, other):       # v1 == v2
>         return self.x == other.x and self.y == other.y
>     def __len__(self):             # len(v) → magnitude (integer)
>         return int(math.sqrt(self.x**2 + self.y**2))
>     def __neg__(self):             # -v  (unary negation)
>         return Vector(-self.x, -self.y)
>     def magnitude(self):           # exact float magnitude
>         return math.sqrt(self.x**2 + self.y**2)
> v1 = Vector(3, 4)
> v2 = Vector(1, 2)
> print(v1)              # Vector(3, 4)    ← uses __str__
> print(v1 + v2)         # Vector(4, 6)    ← uses __add__
> print(v1 - v2)         # Vector(2, 2)    ← uses __sub__
> print(v1 * 3)          # Vector(9, 12)   ← uses __mul__
> print(v1 == v2)        # False           ← uses __eq__
> print(v1 == Vector(3,4))  # True
> print(len(v1))         # 5 (√(9+16)=5)  ← uses __len__
> print(-v1)             # Vector(-3, -4)  ← uses __neg__
> print(f"Exact magnitude: {v1.magnitude():.4f}")  # 5.0000
> ▶  Output
> Vector(3, 4)
> Vector(4, 6)
> Vector(2, 2)
> Vector(9, 12)
> False
> True
> 5
> Vector(-3, -4)
> Exact magnitude: 5.0000

# 💡  Lesson Recap — Key Takeaways
## Class = blueprint/template; Object = real instance created from the class
__init__ is the constructor — called automatically when you write ClassName(...)
self always refers to the current instance — always the first method parameter
Instance variables (self.x): unique to each object — changing one does NOT affect others
Class variables: SHARED across ALL instances — defined at class level, not inside __init__
@classmethod receives cls (the class); @staticmethod receives neither self nor cls
Dunder methods let your objects use Python syntax: print(), ==, +, -, len(), in, []
__str__ → human-readable | __repr__ → developer/debug representation
PascalCase for class names (MyClass); snake_case for methods and variables`,

  16: `# 🧬  INTERMEDIATE  •  LESSON 16
## OOP Concepts
Inheritance • Polymorphism • Encapsulation • Abstraction — The Four Pillars

# 📌  The Four Pillars of OOP

These four principles define well-structured object-oriented code. Every professional Python framework — Django, Flask, SQLAlchemy, FastAPI — is built on these concepts. Together they produce systems that are modular, flexible, safe, and easy to extend.

![Image 26](/pyimages/pimg26.png)

# 🧬  Pillar 1 — Inheritance

Inheritance allows a child class (subclass) to automatically acquire all the attributes and methods of a parent class (superclass) without copying any code. The child class then extends the parent by adding new methods or overrides existing ones with specialised behaviour.

This is the IS-A relationship: a Dog IS-A Animal. A Dog can do everything an Animal can (eat, breathe) and more (bark, fetch). The parent defines the common interface; each child specialises it.

# 📐  Syntax
## class Child(Parent):           # inherit from Parent with (ParentName)
def __init__(self, ...):
super().__init__(...)  # MUST call parent constructor first!
self.child_attr = ...  # add child-specific data
def override_method(self): # redefine parent behaviour
...
def new_method(self):      # add brand new child-only behaviour
...

  Example 1: Animal Hierarchy — Dog, Cat, Bird

A classic inheritance example. Animal defines the shared interface. Dog, Cat, and Bird each inherit it, override speak() with their own sound, and add their own unique methods.

>   🐍 Example 1a — Animal parent class
> # ── Parent class (base / superclass) ────────────────────────
> class Animal:
>     """Base class: defines attributes and methods ALL animals share."""
>     def __init__(self, name, age):
>         self.name = name
>         self.age  = age
>     def eat(self):
>         print(f"{self.name} is eating.")
>     def breathe(self):
>         print(f"{self.name} is breathing.")
>     def speak(self):             # default — child classes override this
>         print(f"{self.name} makes a sound.")
>     def __str__(self):
>         return f"{type(self).__name__}({self.name}, {self.age}yr)"
>   🐍 Example 1b — Dog, Cat, Bird subclasses
> # ── Child class: Dog ─────────────────────────────────────────
> class Dog(Animal):
>     def __init__(self, name, age, breed):
>         super().__init__(name, age)  # call Animal.__init__ first!
>         self.breed = breed           # Dog-only data
>     def speak(self):                 # OVERRIDE parent speak()
>         print(f"{self.name} says: Woof! Woof!")
>     def fetch(self, item):           # NEW method — Dog only
>         print(f"{self.name} fetches the {item}!")
> # ── Child class: Cat ─────────────────────────────────────────
> class Cat(Animal):
>     def __init__(self, name, age, indoor=True):
>         super().__init__(name, age)
>         self.indoor = indoor
>     def speak(self):                 # OVERRIDE
>         print(f"{self.name} says: Meow!")
>     def purr(self):                  # NEW — Cat only
>         print(f"{self.name} is purring...")
> # ── Child class: Bird ────────────────────────────────────────
> class Bird(Animal):
>     def __init__(self, name, age, wingspan_cm):
>         super().__init__(name, age)
>         self.wingspan_cm = wingspan_cm
>     def speak(self):
>         print(f"{self.name} says: Tweet!")
>     def fly(self):
>         print(f"{self.name} flies with {self.wingspan_cm}cm wingspan!")
>   🐍 Example 1c — Using the hierarchy
> # ── Using the hierarchy ──────────────────────────────────────
> dog  = Dog("Buddy", 3, "Labrador")
> cat  = Cat("Whiskers", 5)
> bird = Bird("Tweety", 2, 28)
> # Inherited methods work without redefining them:
> dog.eat()          # Buddy is eating.      ← from Animal
> dog.breathe()      # Buddy is breathing.   ← from Animal
> # Overridden method — Dog uses its own version:
> dog.speak()        # Buddy says: Woof! Woof!  ← Dog override
> cat.speak()        # Whiskers says: Meow!      ← Cat override
> bird.speak()       # Tweety says: Tweet!       ← Bird override
> # New methods specific to each subclass:
> dog.fetch("ball")  # Buddy fetches the ball!
> cat.purr()         # Whiskers is purring...
> bird.fly()         # Tweety flies with 28cm wingspan!
> # isinstance() checks — Dog IS-A Animal!
> print(isinstance(dog, Dog))     # True
> print(isinstance(dog, Animal))  # True  ← Dog IS-A Animal
> print(isinstance(cat, Dog))     # False ← Cat is NOT a Dog
> print(issubclass(Dog, Animal))  # True  ← class-level check
> # __str__ inherited from Animal:
> print(dog)    # Dog(Buddy, 3yr)
> ▶  Output
> Buddy is eating.
> Buddy is breathing.
> Buddy says: Woof! Woof!
> Whiskers says: Meow!
> Tweety says: Tweet!
> Buddy fetches the ball!
> Whiskers is purring...
> Tweety flies with 28cm wingspan!
> True
> True
> False
> True
> Dog(Buddy, 3yr)

  Example 2: Multiple Inheritance — Duck inherits from three parents

Python supports multiple inheritance — a class can inherit from more than one parent. Python uses the Method Resolution Order (MRO) to decide which parent's method to call if there is a conflict. Use sparingly.

>   🐍 Example 2 — Multiple inheritance
> class Flyable:
>     def fly(self):
>         print(f"{self.name} is flying!")
> class Swimmable:
>     def swim(self):
>         print(f"{self.name} is swimming!")
> # Duck inherits from THREE parents: Animal, Flyable, Swimmable
> class Duck(Animal, Flyable, Swimmable):
>     def speak(self):
>         print(f"{self.name} says: Quack!")
> d = Duck("Donald", 3)
> d.speak()    # Quack!      ← overridden
> d.fly()      # flying!     ← from Flyable
> d.swim()     # swimming!   ← from Swimmable
> d.eat()      # eating.     ← from Animal
> # Check the MRO (Method Resolution Order):
> print(Duck.__mro__)
> # (<class Duck>, <class Animal>, <class Flyable>, <class Swimmable>, ...)
> ▶  Output
> Donald says: Quack!
> Donald is flying!
> Donald is swimming!
> Donald is eating.
> (<class 'Duck'>, <class 'Animal'>, <class 'Flyable'>, <class 'Swimmable'>, ...)

# 🔄  Pillar 2 — Polymorphism

Polymorphism (from Greek: "many forms") means the same method name produces different behaviour depending on the type of the object it is called on. It lets you write generic code that works with any subclass without knowing the exact type at runtime.

The key insight: you write a loop that calls animal.speak() for every animal in a list. You don't need if/elif to check whether it's a Dog or a Cat. Each object automatically uses its own version of speak(). This is polymorphism.

  Example 3: Method Polymorphism — Same Code, Different Results

>   🐍 Example 3 — Polymorphism in action
> animals = [
>     Dog("Rex",    2, "German Shepherd"),
>     Cat("Luna",   4),
>     Bird("Rio",   1, 32),
>     Dog("Charlie",5, "Beagle"),
> ]
> # This single loop works for ANY Animal subclass.
> # We never check the type — polymorphism handles it.
> for animal in animals:
>     animal.speak()   # each object calls ITS OWN speak()
> # ── Generic function using polymorphism ──────────────────────
> def describe_animal(animal):
>     """Works with ANY Animal subclass — no isinstance() needed."""
>     print(f"--- {type(animal).__name__}: {animal.name} ---")
>     animal.speak()    # polymorphic — different for each type
>     animal.breathe()  # inherited from Animal — same for all
>     print(f"  Age: {animal.age} years")
> describe_animal(Dog("Spot", 2, "Dalmatian"))
> describe_animal(Cat("Felix", 3))
> # ── Operator polymorphism ────────────────────────────────────
> # The + operator behaves differently depending on the type:
> print(5 + 3)             # integer addition    → 8
> print("hi" + " you")    # string concatenation → "hi you"
> print([1,2] + [3,4])    # list merge           → [1, 2, 3, 4]
> v = Vector(1,2) + Vector(3,4)  # custom __add__ → Vector(4, 6)
> ▶  Output
> Rex says: Woof! Woof!
> Luna says: Meow!
> Rio says: Tweet!
> Charlie says: Woof! Woof!
> --- Dog: Spot ---
> Spot says: Woof! Woof!
> Spot is breathing.
>   Age: 2 years
> --- Cat: Felix ---
> Felix says: Meow!
> Felix is breathing.
>   Age: 3 years
> 8
> hi you
> [1, 2, 3, 4]
> Vector(4, 6)

# 🔒  Pillar 3 — Encapsulation

Encapsulation means hiding internal implementation details and exposing only a clean, controlled public interface. This protects data integrity — the outside world cannot accidentally put your object into an invalid state.

Python implements encapsulation by convention and name-mangling (not hard enforcement). The @property decorator provides the cleanest way to expose private data with optional validation.

![Image27](/pyimages/pimg27.png)

  Example 4: SecureAccount — Private Data with @property

>   🐍 Example 4 — Encapsulation with @property
> class SecureAccount:
>     """Bank account demonstrating all three access levels."""
>     def __init__(self, owner, pin, balance=0):
>         self.owner      = owner     # public   — freely accessible
>         self._bank      = "PyBank"  # _protected — convention: handle carefully
>         self.__balance  = balance   # __private  — name-mangled: _SecureAccount__balance
>         self.__pin      = pin       # __private
>         self.__history  = []        # __private
>     # @property creates a READ-ONLY getter for __balance
>     @property
>     def balance(self):
>         return self.__balance   # caller writes acc.balance, gets the value
>     # @property for history — returns a COPY (protects original)
>     @property
>     def history(self):
>         return list(self.__history)
>     def verify_pin(self, pin):
>         return self.__pin == pin
>     def deposit(self, amount, pin):
>         if not self.verify_pin(pin):
>             raise PermissionError("Invalid PIN")
>         if amount <= 0:
>             raise ValueError("Deposit must be positive")
>         self.__balance += amount
>         self.__history.append(f"+{amount}")
>     def withdraw(self, amount, pin):
>         if not self.verify_pin(pin):
>             raise PermissionError("Invalid PIN")
>         if amount > self.__balance:
>             raise ValueError("Insufficient funds")
>         self.__balance -= amount
>         self.__history.append(f"-{amount}")
> acc = SecureAccount("Alice", pin=1234, balance=5000)
> acc.deposit(2000, 1234)
> acc.withdraw(500,  1234)
> print(acc.balance)        # 6500  ← read via @property getter
> print(acc.history)        # ["+2000", "-500"]
> # Trying to access private attribute directly — AttributeError!
> # print(acc.__balance)   ← AttributeError: no attribute __balance
> # Wrong PIN test:
> try:
>     acc.deposit(1000, 9999)   # wrong PIN
> except PermissionError as e:
>     print(f"Blocked: {e}")
> ▶  Output
> 6500
> ['+2000', '-500']
> Blocked: Invalid PIN

# 🎭  Pillar 4 — Abstraction

Abstraction hides complexity and exposes only the essential interface. In Python, you create abstract classes using the abc (Abstract Base Class) module. An abstract class defines WHAT methods a class must have, without specifying HOW they work.

Any class that inherits from an abstract class MUST implement all @abstractmethod methods. If it doesn't, Python raises a TypeError when you try to create an instance — enforcing a contract at the class level.

  Example 5: Shape Hierarchy — Abstract Base Class

Shape is an abstract class that cannot be instantiated. It defines two abstract methods (area, perimeter) that every concrete shape MUST implement, plus concrete methods that use those abstract methods (describe, is_larger_than).

>   🐍 Example 5a — Abstract Shape base class and subclasses
> from abc import ABC, abstractmethod
> import math
> # Abstract class — cannot be created directly (ABC = Abstract Base Class)
> class Shape(ABC):
>     """Contract: ALL shapes MUST implement area() and perimeter()."""
>     @abstractmethod
>     def area(self) -> float:
>         """Return the area. Subclasses MUST implement this."""
>         pass   # no body needed — subclass provides it
>     @abstractmethod
>     def perimeter(self) -> float:
>         """Return the perimeter. Subclasses MUST implement this."""
>         pass
>     # Concrete method — works for ALL shapes using the abstract methods
>     def describe(self):
>         name = type(self).__name__
>         return f"{name}: area={self.area():.4f}, perimeter={self.perimeter():.4f}"
>     def is_larger_than(self, other):
>         return self.area() > other.area()
> # Concrete subclasses — MUST implement area() and perimeter()
> class Circle(Shape):
>     def __init__(self, radius):
>         self.radius = radius
>     def area(self):
>         return math.pi * self.radius ** 2
>     def perimeter(self):
>         return 2 * math.pi * self.radius
> class Rectangle(Shape):
>     def __init__(self, width, height):
>         self.width, self.height = width, height
>     def area(self):
>         return self.width * self.height
>     def perimeter(self):
>         return 2 * (self.width + self.height)
> class Triangle(Shape):
>     def __init__(self, a, b, c):
>         self.a, self.b, self.c = a, b, c
>     def perimeter(self):
>         return self.a + self.b + self.c
>     def area(self):
>         s = self.perimeter() / 2    # Heron's formula
>         return math.sqrt(s*(s-self.a)*(s-self.b)*(s-self.c))
>   🐍 Example 5b — Using the shape hierarchy
> # ── Try to instantiate abstract class ───────────────────────
> # Shape()   ← TypeError: Can't instantiate abstract class Shape
> # ── Use the concrete subclasses ─────────────────────────────
> shapes = [Circle(7), Rectangle(6, 4), Triangle(3, 4, 5)]
> for shape in shapes:
>     print(shape.describe())
> # Polymorphism: is_larger_than works for any two shapes
> c, r = Circle(5), Rectangle(4, 8)
> print(f"Circle larger than Rectangle: {c.is_larger_than(r)}")
> # Sort shapes by area — works because each implements area()
> shapes.sort(key=lambda s: s.area())
> print("Sorted by area:", [type(s).__name__ for s in shapes])
> ▶  Output
> Circle: area=153.9380, perimeter=43.9823
> Rectangle: area=24.0000, perimeter=20.0000
> Triangle: area=6.0000, perimeter=12.0000
> Circle larger than Rectangle: True
> Sorted by area: ['Triangle', 'Rectangle', 'Circle']

# 💡  Lesson Recap — Key Takeaways
## Inheritance: class Child(Parent) — child gets all parent attributes and methods FREE
super().__init__() — ALWAYS call parent constructor in child __init__
Override: define a method with same name in child for specialised behaviour
Multiple inheritance: class Duck(Animal, Flyable, Swimmable) — Python MRO decides order
Polymorphism: same method name, different behaviour per subclass — enables generic code
Encapsulation: name_protected, __name_private, @property creates clean getter/setter
Abstraction: from abc import ABC, abstractmethod — forces subclass to implement contract
isinstance(obj, Class) → True if obj is an instance of Class or any subclass
issubclass(Child, Parent) → True if Child inherits from Parent (class-level check)`,

  17: `# ⚡  INTERMEDIATE  •  LESSON 17
## List Comprehensions
Concise, Pythonic data transformations: List • Dict • Set • Generator

# 📌  Why Comprehensions?

Comprehensions are a hallmark of Pythonic code — single-line expressions that create new collections by transforming or filtering existing ones. They replace verbose for-loops with concise, readable expressions.

Every professional Python developer uses comprehensions daily. They are approximately 1.35× faster than equivalent for-loops because they are optimised at the bytecode level.

![Image28](/pyimages/pimg28.png)

# 📋  List Comprehension — Complete Guide

# 📐  Syntax
## # Basic — transform every element:
result = [ expression  for  variable  in  iterable ]
# With filter — include only matching elements:
result = [ expression  for  variable  in  iterable  if  condition ]
# With ternary — branch on each element:
result = [ a if condition else b  for  variable  in  iterable ]
# Nested — two loops (outer first):
result = [ expr  for  v1 in iterable1  for  v2 in iterable2  if cond ]

  Example 1: Basic Transformations — Squares, Cubes, Strings

Apply any operation to every element in one clean line. Compare each to its verbose for-loop equivalent to understand what the comprehension replaces.

>   🐍 Example 1 — Basic list comprehensions
> # ── squares ──────────────────────────────────────────────────
> # For loop version (4 lines):
> # result = []
> # for x in range(1, 11):
> #     result.append(x**2)
> # Comprehension version (1 line, ~1.35× faster):
> squares = [x**2 for x in range(1, 11)]
> print("Squares:", squares)
> # ── cubes and strings ────────────────────────────────────────
> cubes    = [x**3 for x in range(1, 6)]
> strings  = [str(x) for x in range(1, 6)]
> print("Cubes:", cubes)
> print("Strings:", strings)
> # ── Apply string methods ─────────────────────────────────────
> uppercased = [s.upper() for s in ["hello", "world", "python"]]
> stripped   = [s.strip() for s in ["  alice  ", " bob ", "carol"]]
> print("Uppercased:", uppercased)
> print("Stripped:", stripped)
> ▶  Output
> Squares: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
> Cubes: [1, 8, 27, 64, 125]
> Strings: ['1', '2', '3', '4', '5']
> Uppercased: ['HELLO', 'WORLD', 'PYTHON']
> Stripped: ['alice', 'bob', 'carol']

 1: Squares

- Python takes numbers from 1 to 10

- For each number x, it calculates x²

- Stores all results in a list

2: Cubes and Strings

Cubes:

- Takes numbers from 1 to 5

- Calculates cube (x³)

- Stores results

Strings:

- Takes numbers from 1 to 5

- Converts each number into a string

- Stores results

3: String Operation

Uppercase:

- Takes each word

- Converts it to capital letters

Strip:

- Takes each name

- Removes extra spaces from beginning and end

  Example 2: Filtering with if — Even Numbers, Primes

Add an if clause at the end to include only elements that pass a test. The if filters; the expression transforms (or just returns the value unchanged).

>   🐍 Example 2 — Filtering with if
> # ── Keep only even numbers ───────────────────────────────────
> evens = [x for x in range(1, 21) if x % 2 == 0]
> print("Evens:", evens)
> # ── Keep only words longer than 4 characters, uppercased ─────
> words     = ["apple", "fig", "banana", "kiwi", "mango", "pear", "cherry"]
> long_upper = [w.upper() for w in words if len(w) > 4]
> print("Long words:", long_upper)
> # ── Prime numbers (advanced filter) ─────────────────────────
> # A prime has no divisors from 2 to x-1
> primes = [x for x in range(2, 30)
>           if all(x % i != 0 for i in range(2, x))]
> print("Primes:", primes)
> # ── Extract passing scores (>= 60) ──────────────────────────
> scores = [45, 78, 92, 34, 88, 55, 99, 62]
> passing = [s for s in scores if s >= 60]
> print("Passing:", passing)
> ▶  Output
> Evens: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
> Long words: ['APPLE', 'BANANA', 'MANGO', 'CHERRY']
> Primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
> Passing: [78, 92, 88, 99, 62]

 1: Even Numbers

- Numbers from 1 to 20

- Condition: x % 2 == 0 → number must be divisible by 2

- Only even numbers pass

2: Long Words + Uppercase

- Takes each word from the list

- Condition: word length must be more than 4 characters

- If it passes:

- Convert it to uppercase

- Add to list

3: Prime Numbers

- Check numbers from 2 to 29

- For each number x, we check:

“Is x divisible by ANY number from 2 to x-1?”

- all(...) means:

  - All conditions must be TRUE

  - If even one division works → it's NOT prime

  Example 3: Ternary Expression — Per-Element Branching

Use a conditional expression (ternary) in the output part to produce different values based on each element. The format is: value_if_true if condition else value_if_false.

>   🐍 Example 3 — Ternary in comprehension
> # ── Label each number as odd or even ─────────────────────────
> labels = ["even" if n % 2 == 0 else "odd" for n in range(1, 11)]
> print(labels)
> # ── FizzBuzz in one line — classic interview problem! ─────────
> fb = ["FizzBuzz" if n % 15 == 0
>       else "Fizz"     if n % 3  == 0
>       else "Buzz"     if n % 5  == 0
>       else str(n)
>       for n in range(1, 21)]
> print(fb)
> # ── Clamp scores to 0-100 range ──────────────────────────────
> raw_scores = [-5, 45, 102, 78, 95, 110, 30]
> clamped = [max(0, min(100, s)) for s in raw_scores]
> print("Clamped:", clamped)
> ▶  Output
> ['odd','even','odd','even','odd','even','odd','even','odd','even']
> ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz','16','17','Fizz','19','Buzz']
> Clamped: [0, 45, 100, 78, 95, 100, 30]

  Example 4: Nested Comprehensions — Matrices and Cartesian Products

Nested comprehensions have multiple for clauses, read left to right (outer loop first). They handle multi-dimensional data, Cartesian products, and flattening nested structures.

>   🐍 Example 4 — Nested comprehensions
> # ── Flatten a nested list (list of lists → flat list) ────────
> nested = [[1, 2, 3], [4, 5], [6, 7, 8, 9]]
> flat   = [x for row in nested for x in row]
> print("Flat:", flat)
> # ── Build a 3×3 multiplication table ────────────────────────
> table = [[i * j for j in range(1, 4)] for i in range(1, 4)]
> for row in table:
>     print(row)
> # ── Transpose a matrix ───────────────────────────────────────
> # Original: 3 rows × 3 cols → Transposed: 3 cols × 3 rows
> matrix     = [[1,2,3],[4,5,6],[7,8,9]]
> transposed = [[row[i] for row in matrix] for i in range(3)]
> print("Transposed:", transposed)
> # ── Cartesian product: every (colour, size) combination ──────
> colours = ["red", "green", "blue"]
> sizes   = ["S", "M", "L", "XL"]
> combos  = [(c, s) for c in colours for s in sizes]
> print(f"{len(combos)} combinations: {combos[:4]}...")
> ▶  Output
> Flat: [1, 2, 3, 4, 5, 6, 7, 8, 9]
> [1, 2, 3]
> [2, 4, 6]
> [3, 6, 9]
> Transposed: [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
> 12 combinations: [('red', 'S'), ('red', 'M'), ('red', 'L'), ('red', 'XL')]...

# 📖  Dictionary Comprehension

Dictionary comprehensions create a new dict by specifying key: value pairs. Use curly braces {} with a colon. Same filtering and ternary logic applies.

  Example 5: Dict Comprehensions — Squares, Filters, Inversion

>   🐍 Example 5 — Dictionary comprehensions
> # ── Basic dict comprehension ─────────────────────────────────
> squares = {x: x**2 for x in range(1, 6)}
> print(squares)     # {1:1, 2:4, 3:9, 4:16, 5:25}
> # ── Build dict from two parallel lists using zip() ──────────
> keys   = ["name", "age", "city"]
> values = ["Alice", 25, "Hyderabad"]
> profile = {k: v for k, v in zip(keys, values)}
> print(profile)
> # ── Filter: keep only high-scoring students (score >= 80) ───
> scores = {"Alice":95,"Bob":72,"Carol":88,"Dan":55,"Eve":91}
> top    = {k: v for k, v in scores.items() if v >= 80}
> print("Top students:", top)
> # ── Apply 10% discount to all prices ────────────────────────
> prices     = {"apple": 100, "banana": 50, "cherry": 200}
> discounted = {item: round(price * 0.9, 2) for item, price in prices.items()}
> print("After discount:", discounted)
> # ── Invert a dictionary (swap keys and values) ───────────────
> original = {"a": 1, "b": 2, "c": 3}
> inverted = {v: k for k, v in original.items()}
> print("Inverted:", inverted)
> # ── Word frequency counter ───────────────────────────────────
> words = ["apple","banana","apple","cherry","banana","apple"]
> freq  = {w: words.count(w) for w in set(words)}
> print("Frequency:", freq)
> ▶  Output
> {1:1, 2:4, 3:9, 4:16, 5:25}
> {'name':'Alice','age':25,'city':'Hyderabad'}
> Top students: {'Alice':95,'Carol':88,'Eve':91}
> After discount: {'apple':90.0,'banana':45.0,'cherry':180.0}
> Inverted: {1:'a', 2:'b', 3:'c'}
> Frequency: {'apple':3,'banana':2,'cherry':1}

# 🔷  Set Comprehension

Set comprehensions use curly braces {} WITHOUT a colon. They work like list comprehensions but produce a set — automatically eliminating duplicate values.

  Example 6: Set Comprehensions — Unique Values

>   🐍 Example 6 — Set comprehensions
> # ── Basic set comprehension — duplicates auto-removed ────────
> # Input has duplicates: [1,2,2,3,3,3,4]
> # Squaring first, then deduplicating:
> unique_sq = {x**2 for x in [1, 2, 2, 3, 3, 3, 4]}
> print(unique_sq)     # {1, 4, 9, 16}   — no duplicates!
> # ── Extract unique first letters ─────────────────────────────
> names    = ["Alice","Bob","Anna","Carol","Brian","Amy"]
> initials = {n[0] for n in names}
> print(initials)      # {"A", "B", "C"}  — only unique initials
> # ── All unique vowels in a sentence ──────────────────────────
> text   = "the quick brown fox jumps over the lazy dog"
> vowels = {c for c in text if c in "aeiou"}
> print(vowels)        # {"a","e","i","o","u"}
> # ── Set operations on comprehension results ──────────────────
> set_a = {x**2 for x in range(1, 6)}       # {1,4,9,16,25}
> set_b = {x    for x in range(1,26) if x % 5 == 0}  # {5,10,15,20,25}
> print("Intersection:", set_a & set_b)   # {25}
> print("Union:",        set_a | set_b)
> print("Difference:",   set_a - set_b)   # {1, 4, 9, 16}
> ▶  Output
> {1, 4, 9, 16}
> {'A', 'B', 'C'}
> {'a', 'e', 'i', 'o', 'u'}
> Intersection: {25}
> Union: {1, 4, 5, 9, 10, 15, 16, 20, 25}
> Difference: {1, 4, 9, 16}

# ⚡  Generator Expressions — Memory Efficiency

Generator expressions look identical to list comprehensions but use parentheses () instead of square brackets []. The crucial difference: a list comprehension builds the entire list in RAM immediately. A generator expression is lazy — it computes values one at a time, only when requested.

  Example 7: List vs Generator — Memory & Practical Use

>   🐍 Example 7 — Generator expressions
> # ── Memory comparison ────────────────────────────────────────
> import sys
> # List comprehension: builds ALL 1 million values immediately (~8 MB)
> lst = [x**2 for x in range(1_000_000)]
> print(f"List size:      {sys.getsizeof(lst):>12,} bytes")
> # Generator expression: computes ONE value at a time (~120 bytes)
> gen = (x**2 for x in range(1_000_000))
> print(f"Generator size: {sys.getsizeof(gen):>12,} bytes")
> # ── Generators with built-in functions ──────────────────────
> # sum() only needs one value at a time — perfect for generators
> total   = sum(x**2 for x in range(1001))
> print(f"Sum of squares: {total:,}")
> maximum = max(len(w) for w in ["apple","kiwi","banana","fig"])
> print(f"Longest word:   {maximum} chars")
> # ── any() and all() short-circuit! ──────────────────────────
> # They STOP as soon as the answer is known — very efficient!
> nums = [2, 4, 7, 8, 10, 12]
> all_even = all(n % 2 == 0 for n in nums)   # stops at 7 → False
> any_odd  = any(n % 2 != 0 for n in nums)   # stops at 7 → True
> print(f"All even: {all_even}  |  Any odd: {any_odd}")
> # ── next() — pull values one at a time ──────────────────────
> gen2 = (x**2 for x in range(5))
> print(next(gen2))   # 0  (first value computed)
> print(next(gen2))   # 1  (second value computed)
> print(next(gen2))   # 4  (third value computed)
> # 9 and 16 are still not computed!
> ▶  Output
> List size:        8,448,728 bytes
> Generator size:          200 bytes
> Sum of squares: 333,833,500
> Longest word: 6 chars
> All even: False  |  Any odd: True
> 0
> 1
> 4

Approach | Speed | Memory | Best Use
for loop + append | Baseline (1×) | Normal | Simple loops, debugging, side effects
List comprehension | ~1.35× faster | Same as loop | Default choice — clean, fast, readable
map() + lambda | Similar | Same | Functional style, simple transforms
Generator expression | Same speed | Minimal (lazy) | Large data, sum/max/any/all, use once
💡  Lesson Recap — Key Takeaways List:      [expr for x in it if cond]   — eager, all values in RAM Dict:      {k:v for x in it if cond}    — creates a dictionary Set:       {expr for x in it}            — creates a set (no duplicates) Generator: (expr for x in it)            — lazy, one value at a time, minimal RAM Nested:    [x for row in matrix for x in row]  — read left→right (outer loop first) Ternary:   [a if cond else b for x in it]  — per-item branching without if/else FizzBuzz and primes are classic interview problems — practice writing them from memory Use generators with sum(), max(), min(), any(), all() for large datasets List comprehensions are ~1.35× faster than for-loops with .append() |  |  |`,

  18: `# 📚  INTERMEDIATE  •  LESSON 18
## Working with Libraries
math, random, datetime — and the vast pip ecosystem

# 📌  Python's Library Ecosystem

Python's real power comes from its enormous library ecosystem. The Standard Library ships with every Python installation and covers mathematics, file I/O, networking, cryptography, text processing, and much more — no installation needed.

PyPI (Python Package Index) hosts over 500,000 third-party packages. With one pip install command you add professional-grade tools for web development, data science, machine learning, image processing, and anything else you can imagine.

![Image 29](/pyimages/pimg29.png)

| Layer | What It Is | Examples |
| --- | --- | --- |
| Built-in functions | Always available, no import | print(), len(), range(), int(), str() |
| Standard Library | Ships with Python, just import | math, os, sys, json, csv, datetime, random |
| PyPI / pip | Install with pip install | numpy, pandas, requests, flask, django |
| Your own modules | Files you write | myutils.py, models.py, config.py |

# 📐  math — Mathematical Operations

The math module provides C-level implementations of mathematical functions and constants. They are significantly faster than pure Python equivalents and cover everything from rounding and roots to trigonometry and combinatorics.

  Example 1: Constants and Rounding

The fundamental mathematical constants are immediately accessible. Rounding functions give you precise control over how numbers are rounded.

>   🐍 Example 1 — Constants and rounding
> import math
> # ── Mathematical constants ───────────────────────────────────
> print(f"π (pi):    {math.pi}")    # 3.141592653589793
> print(f"e:         {math.e}")     # 2.718281828459045  Euler's number
> print(f"τ (tau):   {math.tau}")   # 6.283185307179586  = 2π
> print(f"∞ (inf):   {math.inf}")   # inf
> # ── Rounding functions ───────────────────────────────────────
> print(math.floor(3.9))    # 3   — always round DOWN to integer
> print(math.floor(-3.1))   # -4  — note: -3.1 rounds down to -4
> print(math.ceil(3.1))     # 4   — always round UP to integer
> print(math.ceil(-3.9))    # -3  — -3.9 rounds up to -3
> print(math.trunc(3.9))    # 3   — truncate (drop decimal)
> print(math.trunc(-3.9))   # -3  — towards zero (not floor!)
> ▶  Output
> π (pi):    3.141592653589793
> e:         2.718281828459045
> τ (tau):   6.283185307179586
> ∞ (inf):   inf
> 3
> -4
> 4
> -3
> 3
> -3

Key distinction: floor() always goes towards -∞; trunc() always goes towards 0. For positive numbers they are the same, but for negative numbers floor(-3.9)=-4 while trunc(-3.9)=-3.

  Example 2: Powers, Roots and Logarithms

>   🐍 Example 2 — Powers and logarithms
> # ── Square root and powers ───────────────────────────────────
> print(math.sqrt(144))     # 12.0   — always returns float
> print(math.sqrt(2))       # 1.4142135623730951
> print(math.pow(2, 10))    # 1024.0 — math.pow always returns float
> print(2 ** 10)            # 1024   — Python operator, returns int for int
> print(math.isqrt(17))     # 4      — integer square root (floor)
> # ── Logarithms ───────────────────────────────────────────────
> print(math.log(100, 10))  # 2.0    — log base 10
> print(math.log10(1000))   # 3.0    — shorthand for log base 10
> print(math.log2(1024))    # 10.0   — log base 2
> print(math.log(math.e))   # 1.0    — natural log (base e)
> # ── Practical: compound interest formula ────────────────────
> principal = 10000   # Rs.10,000
> rate      = 0.08    # 8% annual
> years     = 5
> amount    = principal * math.pow(1 + rate, years)
> print(f"After {years} years: Rs.{amount:,.2f}")
> ▶  Output
> 12.0
> 1.4142135623730951
> 1024.0
> 1024
> 4
> 2.0
> 3.0
> 10.0
> 1.0
> After 5 years: Rs.14,693.28

  Example 3: Trigonometry and Geometry

All trigonometric functions use radians. Use math.radians() to convert from degrees, or math.degrees() to convert to degrees.

>   🐍 Example 3 — Trigonometry and geometry
> # ── Trigonometry (angles always in RADIANS) ─────────────────
> print(math.sin(math.pi / 2))     # 1.0   sin(90°) = 1
> print(math.cos(0))               # 1.0   cos(0°)  = 1
> print(math.tan(math.pi / 4))     # 1.0   tan(45°) = 1
> # ── Convert between degrees and radians ─────────────────────
> print(math.degrees(math.pi))     # 180.0
> print(math.radians(90))          # 1.5707963267948966
> # ── Practical: distance between two GPS coordinates ─────────
> # Using the Pythagorean theorem (flat-earth approximation)
> x1, y1 = 3, 0
> x2, y2 = 0, 4
> distance = math.hypot(x2-x1, y2-y1)
> print(f"Distance: {distance}")   # 5.0  (3-4-5 right triangle)
> # ── Circle geometry calculator ───────────────────────────────
> def circle_stats(radius):
>     return {
>         "area":          round(math.pi * radius**2, 4),
>         "circumference": round(2 * math.pi * radius, 4),
>         "diameter":      radius * 2,
>     }
> print(circle_stats(7))
> ▶  Output
> 1.0
> 1.0
> 1.0
> 180.0
> 1.5707963267948966
> Distance: 5.0
> {'area': 153.938, 'circumference': 43.9823, 'diameter': 14}

  Example 4: Combinatorics — Permutations, Combinations, GCD

>   🐍 Example 4 — Combinatorics
> # ── Combinatorics ────────────────────────────────────────────
> print(math.factorial(10))   # 3628800    — 10! = 10×9×8×...×1
> print(math.gcd(48, 18))     # 6          — greatest common divisor
> print(math.lcm(4, 6))       # 12         — least common multiple
> # ── Combinations: "n choose k" (order does not matter) ──────
> # How many ways to choose 3 students from 10?
> print(math.comb(10, 3))     # 120        — C(10,3) = 10!/(3!×7!)
> # ── Permutations: ordered arrangements ──────────────────────
> # How many 3-letter arrangements from 10 letters?
> print(math.perm(10, 3))     # 720        — P(10,3) = 10×9×8
> # ── Practical: probability calculator ───────────────────────
> total  = math.comb(52, 5)   # 5-card hands from 52-card deck
> flush  = 4 * math.comb(13, 5)  # 4 suits × C(13,5) flush hands
> print(f"Total 5-card hands: {total:,}")
> print(f"Probability of flush: 1 in {total//flush}")
> ▶  Output
> 3628800
> 6
> 12
> 120
> 720
> Total 5-card hands: 2,598,960
> Probability of flush: 1 in 508

# 🎲  random — Generating Random Data

The random module generates pseudo-random numbers using the Mersenne Twister algorithm — one of the most widely used PRNGs. It is perfect for games, simulations, sampling, test data generation, and security tokens.

Use random.seed(n) to make results reproducible — same seed always produces the same sequence. For cryptographically secure randomness (passwords, tokens), use the secrets module instead.

  Example 5: Numbers, Choices, and Shuffle

# 🐍 Example 5 — random numbers and sequences
## import random
# ── Random floats ────────────────────────────────────────────
print(random.random())            # float in [0.0, 1.0)
print(random.uniform(1.5, 9.5))  # float in [1.5, 9.5]
# ── Random integers ──────────────────────────────────────────
print(random.randint(1, 6))       # 1,2,3,4,5 or 6 (both inclusive!)
print(random.randrange(0, 10))    # 0..9 (like range — excludes 10)
print(random.randrange(0, 10, 2)) # only even: 0,2,4,6 or 8
# ── Choosing from a sequence ─────────────────────────────────
fruits = ["apple","banana","cherry","date","elderberry"]
print(random.choice(fruits))        # ONE random item
print(random.choices(fruits, k=3))  # 3 items WITH replacement
print(random.sample(fruits,  k=3))  # 3 items WITHOUT replacement
# ── Shuffle in-place ─────────────────────────────────────────
deck = list(range(1, 14))   # cards 1–13
random.shuffle(deck)        # shuffle IN PLACE (no return value!)
print("Shuffled deck:", deck[:5], "...")

  Example 6: Weighted Choices, Seeds, and Password Generator

>   🐍 Example 6 — Weighted choices, seed, password generator
> # ── Weighted choices ─────────────────────────────────────────
> # Lose is 5× more likely than win
> outcomes = ["win",  "lose", "draw"]
> weights  = [1,      5,      2    ]
> results  = random.choices(outcomes, weights=weights, k=10)
> print("Results:", results)
> # ── Seed for reproducibility ─────────────────────────────────
> random.seed(42)   # fix the starting point of the RNG
> print([random.randint(1, 100) for _ in range(5)])
> # Always produces: [52, 68, 24, 72, 17] with seed 42
> random.seed(42)   # reset to same seed
> print([random.randint(1, 100) for _ in range(5)])
> # Same output again: [52, 68, 24, 72, 17]
> # ── Gaussian (normal) distribution ──────────────────────────
> # Mean=170cm, std_dev=10 → realistic human heights
> heights = [round(random.gauss(170, 10), 1) for _ in range(8)]
> print("Heights:", heights)
> # ── Practical: secure password generator ────────────────────
> import string
> def gen_password(length=12):
>     chars = string.ascii_letters + string.digits + "!@#$%^&*"
>     return "".join(random.choices(chars, k=length))
> print("Password:", gen_password())
> print("Password:", gen_password(16))
> ▶  Output
> Results: ['lose','lose','win','lose','lose','draw','lose','lose','lose','draw']
> [52, 68, 24, 72, 17]
> [52, 68, 24, 72, 17]
> Heights: [164.2, 178.1, 159.8, 172.4, 181.3, 168.7, 175.0, 163.9]
> Password: Kp2#mQ8!nRjL
> Password: sT9@fYqW2!nRjL&p

# 📅  datetime — Dates, Times & Durations

The datetime module is one of the most commonly used in real-world Python — logging, scheduling, reports, age calculations, countdowns, and API timestamps all depend on it. There are four main classes: date, time, datetime, and timedelta.

| Class / Function | Purpose & Usage |
| --- | --- |
| date(year, month, day) | A calendar date with no time component: date(2024, 12, 25) |
| time(hour, minute, second) | A time of day with no date: time(14, 30, 0) |
| datetime(y,m,d,h,mi,s) | Full date AND time: datetime(2024, 12, 25, 14, 30, 0) |
| timedelta(days, hours, ...) | A duration / time difference: timedelta(days=7, hours=3) |
| datetime.now() | Current local date and time (datetime object) |
| date.today() | Current local date only (date object) |
| dt.strftime(format) | datetime → human-readable string: dt.strftime("%B %d, %Y") |
| datetime.strptime(s,fmt) | Parse string → datetime: datetime.strptime("25-12-2024","%d-%m-%Y") |

  Example 7: Creating, Accessing, and Formatting Dates

>   🐍 Example 7 — Working with dates and formatting
> from datetime import datetime, date, time, timedelta
> # ── Current date and time ────────────────────────────────────
> now   = datetime.now()   # full datetime
> today = date.today()     # date only
> print(f"Now:   {now}")   # 2024-12-25 14:30:15.123456
> print(f"Today: {today}") # 2024-12-25
> # ── Create specific dates ────────────────────────────────────
> birthday = date(1999, 7, 15)
> meeting  = datetime(2024, 12, 25, 10, 30, 0)
> # ── Access individual components ─────────────────────────────
> print(f"Year: {now.year}  Month: {now.month}  Day: {now.day}")
> print(f"Hour: {now.hour}  Min: {now.minute}  Sec: {now.second}")
> print(f"Weekday: {today.strftime("%A")}")
> # ── strftime: format datetime as a string ────────────────────
> print(now.strftime("%Y-%m-%d"))           # 2024-12-25
> print(now.strftime("%d/%m/%Y"))           # 25/12/2024
> print(now.strftime("%B %d, %Y"))          # December 25, 2024
> print(now.strftime("%I:%M %p"))           # 02:30 PM
> print(now.strftime("%A, %d %b %Y"))       # Wednesday, 25 Dec 2024
> ▶  Output
> Now:   2024-12-25 14:30:15.123456
> Today: 2024-12-25
> Year: 2024  Month: 12  Day: 25
> Hour: 14  Min: 30  Sec: 15
> Weekday: Wednesday
> 2024-12-25
> 25/12/2024
> December 25, 2024
> 02:30 PM
> Wednesday, 25 Dec 2024

  Example 8: Date Arithmetic with timedelta

timedelta represents a duration. Add or subtract timedelta objects from date or datetime objects to get new dates. Subtract two dates to get a timedelta.

>   🐍 Example 8 — Date arithmetic and age calculator
> # ── Date arithmetic ──────────────────────────────────────────
> one_week  = timedelta(weeks=1)
> one_month = timedelta(days=30)
> two_hours = timedelta(hours=2)
> print(f"One week later:   {today + one_week}")
> print(f"One month ago:    {today - one_month}")
> print(f"2 hours from now: {now + two_hours}")
> # ── Duration between two dates ───────────────────────────────
> project_start = date(2024, 1, 1)
> project_end   = date(2024, 12, 31)
> duration      = project_end - project_start   # returns timedelta
> print(f"Project duration: {duration.days} days")
> # ── Age calculator ───────────────────────────────────────────
> def calculate_age(dob: date) -> int:
>     today = date.today()
>     age   = today.year - dob.year
>     # Subtract 1 if birthday has not happened yet this year
>     if (today.month, today.day) < (dob.month, dob.day):
>         age -= 1
>     return age
> born = date(1999, 7, 15)
> print(f"Age: {calculate_age(born)} years")
> # ── Parse a string into a datetime ──────────────────────────
> dt_str = "25-12-2024 14:30"
> parsed = datetime.strptime(dt_str, "%d-%m-%Y %H:%M")
> print(f"Parsed: {parsed.year}/{parsed.month}/{parsed.day} at {parsed.hour}h")
> ▶  Output
> One week later:   2025-01-01
> One month ago:    2024-11-25
> 2 hours from now: 2024-12-25 16:30:15
> Project duration: 365 days
> Age: 25 years
> Parsed: 2024/12/25 at 14h

# 📦  pip — Python Package Manager

pip is the standard tool for installing packages from PyPI. Every Python project uses pip to manage its dependencies. Combined with virtual environments, pip lets each project have its own isolated set of packages — preventing version conflicts between projects.

| pip Command | What It Does |
| --- | --- |
| pip install requests | Install the latest version of requests |
| pip install numpy==1.26.0 | Install a specific version exactly |
| pip install 'flask>=2.0,<3.0' | Install within a version range |
| pip install -r requirements.txt | Install all packages listed in the file |
| pip uninstall requests | Remove a package |
| pip list | List all installed packages with versions |
| pip show requests | Detailed info about a package |
| pip freeze > requirements.txt | Save current environment to a file |
| pip install --upgrade requests | Upgrade to the latest version |
| pip install --upgrade pip | Upgrade pip itself |

  Example 9: Virtual Environments — Isolate Each Project

A virtual environment is an isolated Python installation for a single project. Without one, all projects share the same packages — meaning upgrading Flask for Project A might break Project B. Always use virtual environments.

# 🐍 Example 9 — Virtual environments
## # ── Why virtual environments? ────────────────────────────────
# Project A needs Django 4.2
# Project B needs Django 3.2
# Without venv → conflict! With venv → each project is isolated.
# ── Create a virtual environment ─────────────────────────────
python -m venv myenv          # creates a folder "myenv/"
# ── Activate (must do this before installing packages) ───────
source myenv/bin/activate      # Mac / Linux
myenv\\Scripts\\activate         # Windows
# ── Install packages INTO the virtual environment ────────────
pip install requests flask pandas
# ── Save the environment to requirements.txt ─────────────────
pip freeze > requirements.txt
# requirements.txt will contain:
# requests==2.31.0
# flask==3.0.0
# pandas==2.1.0
# ── Recreate on another machine / after git clone ────────────
pip install -r requirements.txt
# ── Deactivate when done ──────────────────────────────────────
deactivate

| Package | Install Command | What It Does |
| --- | --- | --- |
| requests | pip install requests | HTTP requests — call any web API |
| numpy | pip install numpy | Fast arrays, matrices, linear algebra |
| pandas | pip install pandas | Data analysis with DataFrames |
| matplotlib | pip install matplotlib | Charts, graphs, visualisations |
| flask | pip install flask | Lightweight web framework |
| django | pip install django | Full-featured web framework |
| sqlalchemy | pip install sqlalchemy | SQL database ORM |
| pytest | pip install pytest | Professional testing framework |
| pillow | pip install pillow | Image processing and manipulation |
| scikit-learn | pip install scikit-learn | Machine learning algorithms |
| fastapi | pip install fastapi | Modern async web API framework |
| beautifulsoup4 | pip install beautifulsoup4 | Web scraping / HTML parsing |

  Example 10: requests — Making HTTP / API Calls

The requests library is the most popular Python package — downloaded billions of times. It makes HTTP requests simple. Before using: pip install requests.

>   🐍 Example 10 — requests library
> # pip install requests  (first time only)
> import requests
> # ── GET request: fetch data from an API ─────────────────────
> resp = requests.get("https://httpbin.org/json")
> print(f"Status code: {resp.status_code}")   # 200 = success
> data = resp.json()     # automatically parse JSON response
> print(data)
> # ── GET with query parameters ────────────────────────────────
> params   = {"q": "python", "per_page": 3}
> response = requests.get("https://api.github.com/search/repositories",
>                         params=params)
> results  = response.json()["items"]
> for repo in results:
>     print(f"{repo['name']:30} ⭐{repo['stargazers_count']:,}")
> # ── Error checking ───────────────────────────────────────────
> response.raise_for_status()   # raises HTTPError if status >= 400
> # ── POST request: send data to an API ───────────────────────
> payload = {"name": "Alice", "score": 99}
> r = requests.post("https://httpbin.org/post", json=payload)
> print(r.json()["json"])    # API echoes back our data
> # ── Practical: fetch exchange rates ─────────────────────────
> # r = requests.get("https://api.exchangerate.host/latest?base=INR")
> # rates = r.json()["rates"]
> # print(f"1 INR = {rates['USD']:.6f} USD")
> ▶  Output
> Status code: 200
> {'slideshow': {'author': 'Yours Truly', 'date': 'date of publication', ...}}
> cpython                        ⭐62,000
> awesome-python                 ⭐215,000
> flask                          ⭐66,000
> {'name': 'Alice', 'score': 99}

# 💡  Lesson Recap — Key Takeaways
## math: pi, e, sqrt, floor, ceil, log, log2, sin, cos, factorial, gcd, lcm, comb, perm, hypot
random: random(), randint(a,b), choice(lst), choices(lst,k=n), sample(lst,k=n), shuffle(lst), seed(n)
datetime: date.today(), datetime.now(), strftime("%Y-%m-%d"), strptime(str,fmt)
timedelta: duration arithmetic — date + timedelta(days=7), date1 - date2 = timedelta
strftime() converts datetime TO string | strptime() parses string INTO datetime
pip install package — install from PyPI; pip freeze > requirements.txt
Virtual environments: python -m venv env — isolate each project's dependencies
requirements.txt is the standard way to share/recreate a project environment
requests — the go-to library for HTTP/API calls (not in stdlib, pip install first)

# 🐍
## Python Programming
ADVANCED LEVEL
INDUSTRY & PROJECT READY
Lessons 19–23: Advanced OOP  •  Iterators & Generators
Decorators  •  Multithreading & Multiprocessing  •  Working with APIs
📘  Every example includes: concept • syntax • code • line-by-line explanation • expected output

Contents

| Lesson | Topics Covered |
| --- | --- |
| 🔱  L19 — Advanced OOP | Multiple Inheritance, MRO, Method Overriding, Dunder Methods, Context Managers |
| ⚡  L20 — Iterators & Generators | Iterator Protocol, yield, yield from, send(), Generator Expressions, Pipelines |
| 🎨  L21 — Decorators | Building Decorators, Parameterised, Class Decorators, @lru_cache, @property |
| ⚙️  L22 — Multithreading | Threading, GIL, ThreadPoolExecutor, Multiprocessing, asyncio, async/await |
| 🌐  L23 — Working with APIs | HTTP Methods, requests, JSON, Authentication, Session, CRUD, Real Projects |`,

  19: `# 🔱  ADVANCED  •  LESSON 19
## Advanced OOP Concepts
Multiple Inheritance, MRO, Method Overriding, Magic Methods & Context Managers

# 📌  What Makes OOP "Advanced"?

You already know classes, inheritance, and encapsulation. Advanced OOP covers the nuances that separate beginner code from production-grade Python:

- Method Resolution Order (MRO) — how Python decides which parent's method to call in multiple inheritance

- super() and cooperative inheritance — calling the right parent without hardcoding class names

- The complete suite of dunder/magic methods — making objects behave like native Python types

- Context managers — guaranteed setup/teardown logic for resources (files, DB connections, locks)

These patterns appear in every serious Python library: Django's models, SQLAlchemy sessions, Flask decorators, NumPy arrays all use advanced OOP extensively.

# 1️⃣  Multiple Inheritance & Method Resolution Order (MRO)

Python allows a class to inherit from MULTIPLE parent classes at the same time. The list of parents is specified in the class definition: class Child(Base1, Base2, Base3). Each parent contributes its own attributes and methods to the child.

When Python looks up a method on an object, it searches through a specific ordered list of classes — this is the MRO (Method Resolution Order). Python computes the MRO using the C3 Linearisation algorithm, which guarantees a consistent and predictable search order.

![Image 30](/pyimages/pimg30.png)

# 🔍  How MRO is Computed
## Rule 1: The class itself is always first in its own MRO.
Rule 2: Parents are listed left-to-right as you wrote them: class D(B, C) → B before C.
Rule 3: A class never appears before its own parents (child before parent).
Rule 4: If a class appears in multiple inheritance paths, it only appears ONCE — at the rightmost valid position.
The result: D → B → C → A → object  (for the diamond problem below)

# 📐  Syntax / Template
## class Child(Base1, Base2, Base3):  # inherit from all three, left-to-right priority
...
# Inspect the MRO at runtime:
print(Child.__mro__)    # tuple: (Child, Base1, Base2, Base3, object)
print(Child.mro())      # same as list

  Example 1: The Diamond Problem — Understanding MRO

The "diamond problem" occurs when two parents share a common ancestor. Without MRO, there would be ambiguity about which grandparent method to call. Python's C3 linearisation solves this cleanly.

🐍  Example 1 — Diamond problem and MRO # ── The Diamond Problem ────────────────────────────────────── #          A           ← common ancestor #         / \\ #        B   C         ← both inherit from A #         \\ / #          D           ← inherits from BOTH B and C   class A:     def greet(self): return "Hello from A"     def info(self):  return f"I am {type(self).__name__}"   class B(A):     def greet(self): return "Hello from B"  # overrides A.greet   class C(A):     def greet(self): return "Hello from C"  # overrides A.greet   class D(B, C):   # B listed first — B takes priority over C     pass   d = D()   # MRO determines which greet() is called: print(d.greet())      # "Hello from B"  ← B is found first print(D.__mro__)      # (<class D>, <class B>, <class C>, <class A>, <class object>)   # info() is NOT in B or C, so Python keeps searching → finds it in A print(d.info())       # "I am D"  ← found in A, but type(self) is D |
▶  Expected Output Hello from B (<class '__main__.D'4>, <class '__main__.B'>, <class '__main__.C'>, <class '__main__.A'>, <class 'object'>) I am D |
📝 | Explanation:  Python searches D → B → C → A → object. Since B has greet(), Python uses B's version. It never reaches C or A. The info() method is not in D, B, or C, so Python finds it in A. type(self).__name__ returns "D" because self is still a D instance even though the method came from A.

  Example 2: Cooperative Inheritance with super()

super() does not mean "call my parent". It means "call the NEXT class in the MRO". This is cooperative inheritance — each class in the chain calls super() to pass control down the MRO, ensuring every class gets a chance to run its __init__ or method.

🐍  Example 2 — Cooperative inheritance with super() class LogMixin:     """A mixin that logs every greet() call."""     def greet(self):         print("[LOG] greet() was called")         return super().greet()   # passes to NEXT class in MRO, not "parent"   class FormalGreeter(A):     def greet(self):         return "Good day, sir."   # MRO: FancyGreeter → LogMixin → FormalGreeter → A → object class FancyGreeter(LogMixin, FormalGreeter):     pass   fg = FancyGreeter() result = fg.greet() print(result)   # Step-by-step what happens: # 1. fg.greet() → LogMixin.greet() runs (prints the log) # 2. super().greet() in LogMixin → goes to NEXT in MRO → FormalGreeter.greet() # 3. FormalGreeter returns "Good day, sir." # 4. LogMixin returns that string up the chain   print(FancyGreeter.__mro__) # (FancyGreeter, LogMixin, FormalGreeter, A, object) |
▶  Expected Output [LOG] greet() was called Good day, sir. (<class 'FancyGreeter'>, <class 'LogMixin'>, <class 'FormalGreeter'>, <class 'A'>, <class 'object'>) |
📝 | Explanation:  super() in LogMixin does NOT call LogMixin's parent in the class hierarchy — it calls the next class in FancyGreeter's MRO, which is FormalGreeter. This "cooperative" pattern lets mixins and extensions work together cleanly without hardcoding parent names.

# 2️⃣  Method Overriding & super()

Method overriding is when a child class defines a method with the same name as a parent's method. The child's version takes priority. Use super().method() to call the parent's version and extend it rather than completely replacing it.

# 🔢  How it works — Step by Step
## Step 1:  Python looks up a method on the object's class first.
Step 2:  If not found, Python walks up the MRO (parent, grandparent...) until found.
Step 3:  If the child defines the same method name → child's version runs (override).
Step 4:  If the child calls super().method() → parent's version also runs (extension).

  Example 3: Shape Hierarchy — Override and Extend

The Shape → Circle → Square hierarchy shows two patterns: pure override (replacing parent's area()) and extension (adding to parent's describe() using super()).

🐍  Example 3 — Override and extend with super() class Shape:     def __init__(self, colour="black"):         self.colour = colour       def describe(self):         # Returns a basic description: "red Circle"         return f"{self.colour} {type(self).__name__}"       def area(self):         # Parent has no real implementation — subclasses MUST override         raise NotImplementedError("subclass must implement area()")   class Circle(Shape):     def __init__(self, radius, colour="red"):         super().__init__(colour)   # ← call Shape.__init__ first!         self.radius = radius       # add Circle-specific attribute       def area(self):                # PURE OVERRIDE — replaces parent completely         import math         return round(math.pi * self.radius**2, 4)       def describe(self):            # EXTENSION — calls parent, then adds more         base = super().describe()  # get "red Circle" from Shape         return f"{base} | radius={self.radius} | area={self.area()}"   class Square(Shape):     def __init__(self, side, colour="blue"):         super().__init__(colour)         self.side = side       def area(self):         return self.side ** 2      # OVERRIDE: side squared       def describe(self):         base = super().describe()  # "blue Square"         return f"{base} | side={self.side} | area={self.area()}"   c = Circle(7, "crimson") s = Square(5, "navy")   print(c.describe())   # crimson Circle | radius=7 | area=153.938 print(s.describe())   # navy Square | side=5 | area=25 print(c.area())       # 153.9380 print(s.area())       # 25   # Polymorphism: same describe() call, different output per class shapes = [Circle(3), Square(4), Circle(10)] for shape in shapes:     print(f"  {shape.describe()}") |
▶  Expected Output crimson Circle | radius=7 | area=153.938 navy Square | side=5 | area=25 153.9380 25   red Circle | radius=3 | area=28.2743   blue Square | side=4 | area=16   red Circle | radius=10 | area=314.1593 |
📝 | Explanation:  super().__init__(colour) calls Shape's constructor so the colour attribute gets set up properly. super().describe() gets Shape's string ("crimson Circle"), then Circle's describe() adds radius and area information. This pattern avoids duplicating the base description logic.

# 3️⃣  Magic / Dunder Methods — Complete Guide

Magic methods (named with double underscores on both sides, like __str__) are called automatically by Python when you use built-in operations on your object. They let your custom classes behave like native Python types — working with print(), len(), +, ==, in, [], and even with statements.

You never call them directly. Python calls them behind the scenes when it needs them.

![Image31](/pyimages/pimg31.png)

| Dunder Method | Triggered By | What to Return |
| --- | --- | --- |
| __init__(self,...) | MyClass(args) | None — set up instance variables |
| __str__(self) | print(obj), str(obj) | Human-readable string for end users |
| __repr__(self) | repr(obj), REPL, logs | Developer/debug string — should be unambiguous |
| __len__(self) | len(obj) | Integer: the "size" of the object |
| __bool__(self) | if obj:, bool(obj) | True or False — is the object "truthy"? |
| __eq__(self,other) | obj1 == obj2 | True or False |
| __lt__(self,other) | obj1 < obj2 | True or False (enables sorting!) |
| __add__(self,other) | obj1 + obj2 | New combined object |
| __mul__(self,n) | obj * n | New scaled object |
| __getitem__(self,key) | obj[key], obj[1:5] | The value at that index/slice |
| __setitem__(self,k,v) | obj[key] = value | None — store the value |
| __contains__(self,x) | x in obj | True or False |
| __iter__(self) | for x in obj | Iterator object (usually self or iter(collection)) |
| __next__(self) | next(obj) | Next value, or raise StopIteration |
| __enter__(self) | with obj as x: | The object to bind to the "as" variable |
| __exit__(self,et,ev,tb) | end of with block | True to suppress exception, False to propagate |
| __call__(self,...) | obj(args) | Any value — treat object like a function |
| __del__(self) | del obj, garbage collection | None — cleanup code |

  Example 4: ShoppingCart — Six Dunders in One Class

This example implements __len__, __bool__, __contains__, __getitem__, __iter__, __add__, __str__, and __repr__ on a ShoppingCart class, making it behave exactly like a Python built-in collection.

🐍  Example 4a — ShoppingCart dunder definitions class ShoppingCart:     """A shopping cart that behaves like a native Python collection."""       def __init__(self, owner):         self.owner  = owner         self._items = []   # private list of {name, price, qty} dicts       def add(self, name, price, qty=1):         self._items.append({"name": name, "price": price, "qty": qty})         return self           # return self allows METHOD CHAINING: cart.add().add()       def __len__(self):         # len(cart) → total item count (sum of quantities)         return sum(i["qty"] for i in self._items)       def __bool__(self):        # if cart: → True if cart has items         return len(self) > 0   # calls our own __len__ above       def __contains__(self, name):  # "Apple" in cart → True/False         return any(i["name"] == name for i in self._items)       def __getitem__(self, idx):    # cart[0] → first item dict         return self._items[idx]       def __iter__(self):            # for item in cart → iterate all items         return iter(self._items)       def __add__(self, other):      # cart1 + cart2 → merged cart         merged = ShoppingCart(f"{self.owner}+{other.owner}")         merged._items = self._items + other._items         return merged       @property     def total(self):               # cart.total → sum of all prices         return sum(i["price"] * i["qty"] for i in self._items)       def __str__(self):             # print(cart) → formatted receipt         lines = [f"  {i['name']:20} x{i['qty']:2}  Rs.{i['price']*i['qty']:>8,.0f}"                  for i in self._items]         return (f"\\n{'='*45}\\n {self.owner}'s Cart\\n{'='*45}\\n" +                 "\\n".join(lines) +                 f"\\n{'─'*45}\\n  TOTAL:  Rs.{self.total:>10,.0f}\\n")       def __repr__(self):            # repr(cart) → developer view         return f"ShoppingCart(owner={self.owner!r}, items={len(self._items)})" |
🐍  Example 4b — Using the ShoppingCart # ── Create and populate the cart ─────────────────────────────── cart = ShoppingCart("Alice") # Method chaining because add() returns self: cart.add("Apple iPhone 15", 75000).add("AirPods Pro", 22000, 2).add("Case", 500, 3)   # ── __len__ ────────────────────────────────────────────────── print(f"Total items: {len(cart)}")          # 1 + 2 + 3 = 6   # ── __contains__ ───────────────────────────────────────────── print("iPhone in cart:", "Apple iPhone 15" in cart)   # True print("Laptop in cart:", "Laptop" in cart)             # False   # ── __bool__ ───────────────────────────────────────────────── print("Cart is empty:", not cart)           # False (has items) empty = ShoppingCart("Bob") print("Empty cart:", not empty)              # True (no items)   # ── __getitem__ ────────────────────────────────────────────── print(f"First item: {cart[0]['name']}")     # Apple iPhone 15   # ── __iter__ ───────────────────────────────────────────────── for item in cart:     print(f"  {item['name']} → Rs.{item['price']:,}")   # ── __str__ ────────────────────────────────────────────────── print(cart)   # ── __repr__ ───────────────────────────────────────────────── print(repr(cart))   # ── __add__: merge two carts ───────────────────────────────── cart2 = ShoppingCart("Bob") cart2.add("Headphones", 5000) merged = cart + cart2 print(f"Merged cart owner: {merged.owner}") print(f"Merged total items: {len(merged)}") |
▶  Expected Output Total items: 6 iPhone in cart: True Laptop in cart: False Cart is empty: False Empty cart: True First item: Apple iPhone 15   Apple iPhone 15 → Rs.75,000   AirPods Pro → Rs.22,000   Case → Rs.500 ===========================================  Alice's Cart ===========================================   Apple iPhone 15     x 1  Rs.  75,000   AirPods Pro         x 2  Rs.  44,000   Case                x 3  Rs.   1,500 ───────────────────────────────────────────   TOTAL:  Rs.     120,500   ShoppingCart(owner='Alice', items=3) Merged cart owner: Alice+Bob Merged total items: 7 |
📝 | Explanation:  Each dunder corresponds to exactly one Python operation. __len__ powers len(). __contains__ powers the in operator. __iter__ makes for loops work. __add__ makes + work. __str__ is for print() while __repr__ is for the developer (REPL, logs, repr()). None of these are ever called directly — Python invokes them automatically.

# 4️⃣  Context Managers — __enter__ & __exit__

A context manager defines setup logic (__enter__) and teardown logic (__exit__) that run automatically with Python's with statement. This guarantees cleanup ALWAYS happens — even if an exception is raised inside the with block.

You already use context managers every time you write "with open(file) as f:". The file object's __exit__ closes the file automatically. You can create your own for any resource that needs guaranteed cleanup.

# 🔄  Context Manager Lifecycle
## 1. Python evaluates the expression after "with"  →  calls __enter__()
2. __enter__() sets up the resource and returns something
3. The returned value is bound to the "as" variable
4. The with block body executes (your code)
5. When the block ends (normally OR via exception)  →  __exit__() is always called
6. __exit__() receives exc_type, exc_val, traceback (all None if no exception)
7. If __exit__() returns True  →  any exception is SUPPRESSED
8. If __exit__() returns False/None  →  exception propagates normally

  Example 5: DatabaseConnection — Class-Based Context Manager

🐍  Example 5 — Class-based context manager class DatabaseConnection:     """Simulates a managed database connection."""       def __init__(self, host, db_name):         self.host    = host         self.db_name = db_name         self.conn    = None       def __enter__(self):         # SETUP: runs when Python enters the "with" block         print(f"[DB] Connecting to {self.host}/{self.db_name}...")         self.conn = {"host": self.host, "open": True}   # simulate connection         print("[DB] Connection established!")         return self.conn    # ← this becomes the "as conn" variable       def __exit__(self, exc_type, exc_val, exc_tb):         # TEARDOWN: runs when the with block ends — always!         # exc_type:  the exception class (e.g., ValueError) or None         # exc_val:   the exception instance or None         # exc_tb:    the traceback object or None         print(f"[DB] Closing connection. Exception was: {exc_type}")         self.conn["open"] = False   # always close the connection         return False    # False = do NOT suppress any exception   # ── Normal usage — no exception ───────────────────────────── with DatabaseConnection("localhost", "myapp") as conn:     print(f"  Running query on: {conn}")     # Connection guaranteed to close when block exits   # ── Exception case — __exit__ still runs! ─────────────────── try:     with DatabaseConnection("localhost", "myapp") as conn:         print("  About to cause an error...")         raise ValueError("Oops! Query failed")  # __exit__ runs anyway except ValueError as e:     print(f"  Caught outside: {e}") |
▶  Expected Output [DB] Connecting to localhost/myapp... [DB] Connection established!   Running query on: {'host': 'localhost', 'open': True} [DB] Closing connection. Exception was: None [DB] Connecting to localhost/myapp... [DB] Connection established!   About to cause an error... [DB] Closing connection. Exception was: <class 'ValueError'>   Caught outside: Oops! Query failed |
📝 | Explanation:  Even when ValueError is raised inside the with block, __exit__ runs before the exception propagates. This guarantees the database connection closes no matter what. __exit__ returns False, so the ValueError is NOT suppressed — it propagates to the outer try/except.

  Example 6: @contextmanager — Generator-Based Context Manager

The contextlib.contextmanager decorator lets you write a context manager as a simple generator function. Code before yield = setup (__enter__). Code after yield = teardown (__exit__). The try/finally ensures cleanup always runs.

🐍  Example 6 — @contextmanager generator-based from contextlib import contextmanager import time   @contextmanager def timer(label):     """Context manager that times a block of code."""     start = time.perf_counter()     print(f"[{label}] Starting...")     try:         yield           # ← execution PAUSES here and enters the "with" block                         # everything after yield is the teardown     finally:            # finally ensures this always runs, even on exception         elapsed = time.perf_counter() - start         print(f"[{label}] Finished in {elapsed:.4f}s")   # ── Usage ──────────────────────────────────────────────────── with timer("Heavy computation"):     result = sum(i**2 for i in range(1_000_000))     print(f"Result: {result:,}")   # ── Nesting context managers ───────────────────────────────── @contextmanager def managed_file(path, mode):     """Safe file wrapper."""     f = open(path, mode, encoding="utf-8")     try:         yield f     # bind open file to the "as" variable     finally:         f.close()   # always close, even on exception   with managed_file("output.txt", "w") as f:     f.write("Hello from context manager!\\n") # File is ALWAYS closed when the block exits |
▶  Expected Output [Heavy computation] Starting... Result: 333,332,333,000 [Heavy computation] Finished in 0.0842s |
📝 | Explanation:  The @contextmanager decorator transforms a generator function into a full context manager. yield splits setup (before) from teardown (after). The try/finally guarantees the finally block runs even if an exception occurs in the with block body. This is often much simpler than writing a class with __enter__ and __exit__.

# 💡  Lesson Recap — Key Takeaways
## Multiple Inheritance: class D(B, C) → Python searches B first, then C, then shared ancestors
MRO: always check Class.__mro__ when debugging — it shows exact lookup order
super() follows MRO — always use it instead of hardcoding Parent.method(self)
Method Override: redefine in child → child's version runs; call super().method() to extend
__str__: human-readable (for print) | __repr__: developer-readable (for debug/REPL)
__len__, __bool__, __contains__, __iter__, __getitem__ make objects work like collections
__add__, __mul__, __eq__, __lt__ make objects work with operators
__enter__ + __exit__ implement the context manager protocol (with statement)
@contextmanager: turn a generator into a context manager with yield as the split point`,

  20: `# ⚡  ADVANCED  •  LESSON 20
## Iterators & Generators
Iterator Protocol, yield keyword, Generator Expressions & Pipelines

# 📌  What Is an Iterator?

An iterator is any object that implements the iterator protocol — two methods: __iter__() and __next__(). Every for loop in Python secretly uses this protocol: it calls iter() on the object to get an iterator, then calls next() repeatedly until StopIteration is raised.

Understanding iterators lets you create data sources that produce values lazily — one at a time — instead of building everything in memory at once. This is critical for processing large datasets.

![Image32](/pyimages/pimg32.png)

# 🔄  What Happens Inside a for Loop
## for item in collection:     # Python secretly does this:
process(item)           # 1. iterator = iter(collection)  → calls __iter__()
# 2. try: item = next(iterator)   → calls __next__()
# 3. if StopIteration is raised → loop ends
# 4. otherwise → run loop body, go back to step 2

# 1️⃣  The Iterator Protocol

# 📐  Syntax / Template
## class MyIterator:
def __iter__(self):   # return the iterator object — usually "self"
return self
def __next__(self):   # return next value OR raise StopIteration when done
if self.is_done:
raise StopIteration   # ← signal that iteration is complete
return self.compute_next_value()

  Example 1: Counter — A Custom Infinite Iterator

An infinite counter that produces values forever. We use itertools.islice to take only the first N values from it — a common pattern with infinite iterators.

🐍  Example 1 — Infinite counter iterator class Counter:     """Infinite counter: start, start+step, start+2*step, ..."""       def __init__(self, start=0, step=1):         self.current = start   # tracks current position         self.step    = step       def __iter__(self):         return self    # the Counter IS its own iterator       def __next__(self):         # This is called each time Python needs the next value         value        = self.current    # save current value to return         self.current += self.step      # advance to next position         return value                   # never raises StopIteration = infinite!   # ── Take first 5 values using itertools.islice ────────────── import itertools counter = Counter(10, 5) first_5 = list(itertools.islice(counter, 5)) print(first_5)   # [10, 15, 20, 25, 30]   # ── iter() and next() directly ────────────────────────────── it = iter([10, 20, 30])   # iter() calls list.__iter__() print(next(it))    # 10  — calls list.__next__() print(next(it))    # 20 print(next(it))    # 30 # next(it) now → StopIteration (no more values) |
▶  Expected Output [10, 15, 20, 25, 30] 10 20 30 |
📝 | Explanation:  The Counter never raises StopIteration, so it never stops naturally. itertools.islice wraps it and stops after N values. The iter([10,20,30]) call invokes the list's __iter__ method, which returns a list iterator. Each next() call invokes __next__ on that iterator.

  Example 2: SquareRange — A Finite Iterator

>   🐍  Example 2 — Finite SquareRange iterator
> class SquareRange:
>     """Yields the squares of integers from start to end (inclusive)."""
>     def __init__(self, start, end):
>         self.current = start
>         self.end     = end
>     def __iter__(self):
>         return self
>     def __next__(self):
>         if self.current > self.end:    # ← check if we are done
>             raise StopIteration        # ← signal end of iteration
>         result       = self.current ** 2   # compute the square
>         self.current += 1                  # advance position
>         return result
> # ── Use in a for loop ────────────────────────────────────────
> for sq in SquareRange(1, 6):
>     print(sq, end=" ")    # 1 4 9 16 25 36
> # ── Use in list comprehension ────────────────────────────────
> squares = [x for x in SquareRange(1, 5)]
> print(squares)    # [1, 4, 9, 16, 25]
> # ── sum(), max(), min() all work with iterators ──────────────
> print(sum(SquareRange(1, 10)))   # 385  (sum of squares 1..10)
> ▶  Expected Output
> 1 4 9 16 25 36
> [1, 4, 9, 16, 25]
> 385

# 2️⃣  The yield Keyword — Generator Functions

A generator function is any function that contains the yield keyword. When called, it does NOT execute immediately — instead, it returns a generator object (which is an iterator). Each call to next() runs the function body until the next yield statement, pauses there, and returns the yielded value.

All local variables and the execution position are preserved between calls. This is the key difference from a regular function — a generator can "remember where it was".

# ⚡  yield vs return
## return:  terminates the function completely. All local state is gone.
yield:   PAUSES the function. All local variables are saved. Execution resumes
at the next line after yield when next() is called again.
A function with any yield statement becomes a generator function.
Calling a generator function returns a generator object — no code runs yet.
The generator object is an iterator: it implements __iter__ and __next__.

  Example 3: square_range as a Generator — 3 Lines vs 15 Lines

The same SquareRange logic from above, rewritten as a generator. Compare the two versions — they produce identical output but the generator is dramatically simpler.

❌  Class Iterator (15 lines) class SquareRange:     def __init__(self,start,end):         self.current=start         self.end=end     def __iter__(self):         return self     def __next__(self):         if self.current>self.end:             raise StopIteration         result=self.current**2         self.current+=1         return result | ✅  Generator Function (3 lines) def square_range(start, end):     for n in range(start, end+1):         yield n ** 2 # That's it — 3 lines! # Same output as the class version. # Python handles __iter__, # __next__, and StopIteration # automatically for generators.
🐍  Example 3 — Generator function def square_range(start, end):     """Generator function: yields squares from start² to end²."""     for n in range(start, end + 1):         yield n ** 2    # pauses here, returns n², resumes on next call   for sq in square_range(1, 6):     print(sq, end=" ")   # 1 4 9 16 25 36 |
▶  Expected Output 1 4 9 16 25 36 |
📝 | Explanation:  When Python calls square_range(1,6), it returns a generator object immediately — no code runs yet. When the for loop calls next(), the function runs until "yield n**2", pauses, and returns the square. On the next next() call, it resumes right after the yield and continues the for loop. When range is exhausted, the function returns normally and Python auto-raises StopIteration.

  Example 4: Fibonacci — Infinite Generator

An infinite generator that produces the Fibonacci sequence. It runs forever — use itertools.islice or a conditional break to stop it.

>   🐍  Example 4 — Infinite Fibonacci generator
> def fibonacci():
>     """Infinite Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, ..."""
>     a, b = 0, 1
>     while True:        # infinite loop — generator never exhausts
>         yield a        # produce current value, then pause
>         a, b = b, a+b  # update: new a=old b, new b=old a+old b
> # Take first 10 using next() in a list comprehension
> fib = fibonacci()
> first_10 = [next(fib) for _ in range(10)]
> print(first_10)   # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
> # Take first N using itertools.islice
> import itertools
> first_15 = list(itertools.islice(fibonacci(), 15))
> print(first_15)
> # Sum of first 20 Fibonacci numbers
> total = sum(itertools.islice(fibonacci(), 20))
> print(f"Sum of first 20 Fibonacci: {total:,}")
> ▶  Expected Output
> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
> Sum of first 20 Fibonacci: 10,945

  Example 5: yield from — Delegating to Sub-Generators

"yield from" delegates iteration to another iterable. It is cleaner and more efficient than manually looping and yielding each item. It also correctly handles two-way send() communication and exception propagation.

>   🐍  Example 5 — yield from
> # ── yield from: chain multiple iterables ────────────────────
> def chain(*iterables):
>     """Yield all items from multiple iterables in sequence."""
>     for it in iterables:
>         yield from it      # equivalent to: for x in it: yield x
>                            # but more efficient and handles send()
> result = list(chain([1, 2], "AB", range(3, 6)))
> print(result)   # [1, 2, 'A', 'B', 3, 4, 5]
> # ── Recursive generator with yield from ─────────────────────
> def flatten(nested):
>     """Flatten arbitrarily nested lists."""
>     for item in nested:
>         if isinstance(item, list):
>             yield from flatten(item)   # recurse into sub-lists
>         else:
>             yield item                 # yield leaf values directly
> deep = [1, [2, [3, [4]], 5], 6]
> print(list(flatten(deep)))   # [1, 2, 3, 4, 5, 6]
> ▶  Expected Output
> [1, 2, 'A', 'B', 3, 4, 5]
> [1, 2, 3, 4, 5, 6]

  Example 6: send() — Two-Way Communication with a Generator

Normally data flows ONE WAY: caller gets values from the generator via next(). The send() method enables two-way communication: the caller can SEND a value INTO the paused generator. The sent value becomes the result of the yield expression inside the generator.

🐍  Example 6 — Two-way send() def accumulator():     """Receive values via send(), yield running total."""     total = 0     while True:         value = yield total    # TWO things happen here:                                # 1. yield total: send current total to caller                                # 2. value = ...: receive value from send()         if value is None:             break              # send(None) or close() stops the generator         total += value   acc = accumulator()   # IMPORTANT: must call next() ONCE first to advance to the yield # This is called "priming" the generator next(acc)            # advance to first yield — returns 0 (initial total)   # Now we can send values in: print(acc.send(10))  # send 10 → total becomes 10 → yields 10 print(acc.send(25))  # send 25 → total becomes 35 → yields 35 print(acc.send(15))  # send 15 → total becomes 50 → yields 50 |
▶  Expected Output 10 35 50 |
📝 | Explanation:  Before calling send(), you must "prime" the generator with next() (or send(None)). This advances execution to the first yield. After priming, send(value) resumes the generator — the sent value becomes the result of the yield expression, and execution continues until the next yield or return.

# 3️⃣  Generator Expressions vs List Comprehensions

Generator expressions use () instead of []. They look identical to list comprehensions but are fundamentally different: a list comprehension builds everything in memory immediately. A generator expression is lazy — it produces values one at a time only when requested.

[ ] List Comprehension — Eager # ALL values built in RAM at once: lst = [x**2 for x in range(100_000)] # Consumes ~800 KB immediately # Can be indexed: lst[0], lst[-1] # Can be iterated multiple times | ( ) Generator Expression — Lazy # Lazy — no values computed yet: gen = (x**2 for x in range(100_000)) # Consumes ~200 bytes immediately # Cannot be indexed (no random access) # Can only be iterated ONCE

  Example 7: Memory Comparison and Generator Pipelines

🐍  Example 7 — Memory comparison and pipelines import sys   # ── Memory comparison ──────────────────────────────────────── lst = [x**2 for x in range(100_000)] gen = (x**2 for x in range(100_000))   print(f"List size:      {sys.getsizeof(lst):>10,} bytes") print(f"Generator size: {sys.getsizeof(gen):>10,} bytes")   # ── Generator pipeline — lazy end-to-end ───────────────────── # Imagine a 10GB log file — these generators process it line by line # WITHOUT loading the whole file into memory   def read_lines(filename):     """Generator: yield lines from a file one at a time."""     with open(filename) as f:         for line in f:             yield line.strip()   def filter_errors(lines):     """Generator: pass through only ERROR lines."""     for line in lines:         if "ERROR" in line:             yield line   def parse_errors(lines):     """Generator: parse each error line into a dict."""     for line in lines:         parts = line.split(" - ")         yield {"time": parts[0], "msg": parts[-1]}   # Pipeline composition — no data flows until we iterate! # lines  = read_lines("server.log")    # open but DO NOT read # errors = filter_errors(lines)        # filter but DO NOT materialise # parsed = parse_errors(errors)        # parse but DO NOT collect # for err in parsed: process(err)      # NOW data flows, one line at a time   # ── Practical: built-ins accept generators directly ────────── total = sum(x**2 for x in range(1, 1001)) print(f"Sum of squares 1-1000: {total:,}")   data = [2, 4, 6, 7, 8, 10] print(f"All even: {all(n%2==0 for n in data)}")   # False (stops at 7) print(f"Any > 9:  {any(n>9    for n in data)}")   # True  (stops at 10) |
▶  Expected Output List size:         800,056 bytes Generator size:         200 bytes Sum of squares 1-1000: 333,833,500 All even: False Any > 9:  True |
📝 | Explanation:  The pipeline pattern is powerful: each generator stage is lazy. No data actually moves until the final for loop starts pulling values. all() and any() short-circuit — they stop iterating as soon as the answer is known, which is why all(n%2==0) stops at 7 and any(n>9) stops at 10.

# 💡  Lesson Recap — Key Takeaways
## Iterator protocol: __iter__() returns self; __next__() returns next value or raises StopIteration
for x in obj secretly calls iter(obj) then next() repeatedly until StopIteration
Generator function: any function with yield — returns a generator object when called
yield: PAUSES execution, saves all local state, returns value. Resumes on next()
yield from: delegates to a sub-iterable — cleaner than for x in it: yield x
send(value): two-way communication — caller can send values INTO a paused generator
Generator expression (expr for x in it): lazy, ~200 bytes vs ~8MB for a list
Pipeline: chain generators for lazy streaming — perfect for large files or data streams
Use generators with sum(), max(), min(), any(), all() — they accept any iterable`,

  21: `# 🎨  ADVANCED  •  LESSON 21
## Decorators
Function Decorators, Parameterised Decorators, Class Decorators & Built-in Decorators

# 📌  What Is a Decorator?

A decorator is a function that takes another function as input, adds behaviour around it (before the call, after the call, or both), and returns the enhanced version. You apply a decorator with the @ symbol above a function definition.

@decorator_name is just syntactic sugar. Writing @dec above def my_func is EXACTLY the same as writing my_func = dec(my_func) after the definition. Python performs this substitution automatically.

![Image 33](/pyimages/pimg33.png)

# 🎨  The Decorator Substitution
## @logger                    # This is EXACTLY equivalent to:
def add(a, b):             # def add(a, b):
return a + b           #     return a + b
# add = logger(add)   ← Python does this for you
After decoration, "add" no longer refers to the original function.
It refers to whatever logger() returned — usually a "wrapper" function.

# 1️⃣  Building a Decorator — Step by Step

> 📐  Syntax / Template
> def decorator(func):          # 1. accepts the function to wrap
>     @functools.wraps(func)    # 2. preserves __name__, __doc__, __module__
>     def wrapper(*args, **kwargs):  # 3. *args, **kwargs = accepts ANY signature
>         # 4. Code to run BEFORE the original function
>         result = func(*args, **kwargs)   # 5. Call the ORIGINAL function
>         # 6. Code to run AFTER the original function
>         return result         # 7. Return the original function's result
>     return wrapper            # 8. Return the wrapper function (not its result!)
> @decorator                   # Apply: my_func = decorator(my_func)
> def my_func(): ...
> ⚠️  Always use @functools.wraps(func) inside your decorator. Without it, the decorated function loses its __name__, __doc__, and __module__ — which breaks help(), logging, and debugging tools.

  Example 1: Logger Decorator — Log Every Call

🐍  Example 1 — Logger decorator import functools   def logger(func):     """Decorator: log every call — what arguments, what return value."""     @functools.wraps(func)   # preserves func.__name__, func.__doc__     def wrapper(*args, **kwargs):         print(f"→ Calling {func.__name__}({args}, {kwargs})")         result = func(*args, **kwargs)   # call the original function         print(f"← {func.__name__} returned {result!r}")         return result     return wrapper   @logger def add(a, b):     """Add two numbers."""     return a + b   add(3, 5)   # @functools.wraps preserves metadata: print(add.__name__)    # "add"  ← correct (without @wraps it would be "wrapper") print(add.__doc__)     # "Add two numbers." |
▶  Expected Output → Calling add((3, 5), {}) ← add returned 8 add Add two numbers. |
📝 | Explanation:  After @logger, "add" points to "wrapper". When you call add(3,5), you are actually calling wrapper(3,5). wrapper logs the call, calls the ORIGINAL add via func(*args, **kwargs), logs the result, and returns it. @functools.wraps copies the name and docstring from the original to wrapper.

  Example 2: Timer Decorator — Measure Execution Time

>   🐍  Example 2 — Timer decorator
> import functools, time
> def timer(func):
>     """Decorator: print how long the function took to run."""
>     @functools.wraps(func)
>     def wrapper(*args, **kwargs):
>         start  = time.perf_counter()           # high-precision timer
>         result = func(*args, **kwargs)         # run the function
>         end    = time.perf_counter()
>         print(f"{func.__name__}: {(end-start)*1000:.2f}ms")
>         return result
>     return wrapper
> @timer
> def slow_sum(n):
>     """Sum numbers from 0 to n."""
>     return sum(range(n))
> result = slow_sum(10_000_000)
> print(f"Result: {result:,}")
> ▶  Expected Output
> slow_sum: 312.45ms
> Result: 49,999,995,000,000

  Example 3: Stacking Decorators — Applied Bottom-Up, Executed Top-Down

You can apply multiple decorators to one function. They are applied in BOTTOM-UP order (closest to the function first), but they execute in TOP-DOWN order when the function is called.

>   🐍  Example 3 — Stacking decorators
> # Stacking decorators:
> @logger    # applied SECOND → outermost wrapper
> @timer     # applied FIRST  → innermost wrapper (closest to original)
> def power(base, exp):
>     return base ** exp
> # Equivalent to:
> # power = logger(timer(power))
> # When power(2, 20) is called:
> # 1. logger's wrapper runs first (logs the call)
> # 2. timer's wrapper runs (starts timer)
> # 3. original power() runs
> # 4. timer wrapper finishes (prints elapsed time)
> # 5. logger wrapper finishes (logs the return value)
> power(2, 20)
> ▶  Expected Output
> → Calling power((2, 20), {})
> power: 0.01ms
> ← power returned 1048576

# 2️⃣  Parameterised Decorators (Decorator Factories)

Sometimes you want to configure a decorator: @retry(max_attempts=3) or @require_role("admin"). This requires three levels of nesting: an outer factory function that receives the parameters, an inner decorator that receives the function, and a wrapper that receives the call arguments.

# 🔢  How it works — Step by Step
## Step 1:  The factory function is called with the configuration parameters → @retry(3, delay=0.1)
Step 2:  The factory returns a decorator function
Step 3:  Python applies the decorator to the function → decorator(func)
Step 4:  The decorator returns a wrapper function
Step 5:  The wrapper is called when the user calls the decorated function

  Example 4: @retry — Retry on Failure with Configuration

🐍  Example 4 — Parameterised @retry decorator import functools, time, random   def retry(max_attempts=3, delay=0.5, exceptions=(Exception,)):     """     Decorator factory: retry the decorated function up to max_attempts times.     max_attempts: number of tries before giving up     delay: seconds to wait between retries     exceptions: tuple of exception types that trigger a retry     """     def decorator(func):          # ← this is the actual decorator         @functools.wraps(func)         def wrapper(*args, **kwargs):   # ← this wraps each call             last_error = None             for attempt in range(1, max_attempts + 1):                 try:                     return func(*args, **kwargs)   # success → return immediately                 except exceptions as e:                     last_error = e                     print(f"  Attempt {attempt}/{max_attempts} failed: {e}")                     if attempt < max_attempts:                         time.sleep(delay)    # wait before next retry             raise last_error   # all retries exhausted → raise last error         return wrapper     return decorator   # ← factory returns the decorator   # Apply with configuration: retry up to 3 times, 0.1s delay @retry(max_attempts=3, delay=0.1, exceptions=(ValueError,)) def unstable_parser(text):     """Simulates an operation that fails sometimes."""     if random.random() < 0.6:   # 60% chance of failure         raise ValueError("Parse failed!")     return f"Parsed: {text}"   result = unstable_parser("hello world") print(result) |
▶  Expected Output   Attempt 1/3 failed: Parse failed!   Attempt 2/3 failed: Parse failed! Parsed: hello world   (or similar — depends on random) |
📝 | Explanation:  Three levels: retry(3, delay=0.1) is called first — it receives the config and returns decorator. Python then calls decorator(unstable_parser) — it wraps the function and returns wrapper. Later, unstable_parser("hello") calls wrapper("hello") which runs the retry logic.

# 3️⃣  Class Decorators & Built-in Decorators

  Example 5: CallCounter — Stateful Class Decorator

A class can be used as a decorator if it implements __call__. The advantage: classes have state (instance variables), making them ideal for stateful decorators like call counters.

>   🐍  Example 5 — Class-based stateful decorator
> import functools
> class CallCounter:
>     """Stateful decorator: counts how many times the function is called."""
>     def __init__(self, func):
>         functools.update_wrapper(self, func)   # copy __name__, __doc__ to self
>         self.func  = func
>         self.calls = 0   # mutable state — impossible with a regular function
>     def __call__(self, *args, **kwargs):
>         # __call__ makes this class instance callable: greet("Alice") calls this
>         self.calls += 1
>         print(f"{self.func.__name__} called {self.calls}× total")
>         return self.func(*args, **kwargs)
> @CallCounter   # greet = CallCounter(greet)
> def greet(name):
>     return f"Hello, {name}!"
> greet("Alice")   # greet called 1× total
> greet("Bob")     # greet called 2× total
> greet("Carol")   # greet called 3× total
> print(f"Total calls: {greet.calls}")   # 3
> ▶  Expected Output
> greet called 1× total
> greet called 2× total
> greet called 3× total
> Total calls: 3

  Example 6: Built-in Decorators — @lru_cache, @property, @staticmethod

>   🐍  Example 6 — @lru_cache, @property, @staticmethod, @classmethod
> from functools import lru_cache, cached_property
> # ── @lru_cache — Memoisation (cache results) ─────────────────
> # LRU = Least Recently Used. Caches the last maxsize results.
> # Calling fib(50) without caching: ~2^50 recursive calls
> # Calling fib(50) with @lru_cache: only 50 unique calls (rest are cache hits)
> @lru_cache(maxsize=128)
> def fib(n):
>     if n <= 1: return n
>     return fib(n-1) + fib(n-2)
> print(fib(50))            # 12586269025  — instant!
> print(fib.cache_info())   # CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)
> fib.cache_clear()         # clear the cache if needed
> # ── @property — attribute-style access with logic ────────────
> class Circle:
>     def __init__(self, radius):
>         self.radius = radius
>     @property
>     def area(self):                # accessed as c.area, not c.area()
>         return 3.14159 * self.radius ** 2
>     @property
>     def circumference(self):
>         return 2 * 3.14159 * self.radius
>     @area.setter
>     def area(self, value):         # c.area = 100 → sets radius
>         import math
>         self.radius = math.sqrt(value / 3.14159)
> c = Circle(7)
> print(c.area)              # 153.938  ← no () needed!
> print(c.circumference)     # 43.982
> c.area = 314.159           # setter adjusts the radius
> print(c.radius)            # ~10.0
> # ── @staticmethod and @classmethod ──────────────────────────
> class Temperature:
>     @staticmethod
>     def celsius_to_fahrenheit(c):
>         return (c * 9/5) + 32
>     @classmethod
>     def from_fahrenheit(cls, f):
>         return cls((f - 32) * 5/9)   # create instance from Fahrenheit
> print(Temperature.celsius_to_fahrenheit(100))   # 212.0
> t = Temperature.from_fahrenheit(212)
> ▶  Expected Output
> 12586269025
> CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)
> 153.93812899999998
> 43.98226
> 10.0
> 212.0

  Example 7: Real-World: Input Validation Decorator

>   🐍  Example 7 — Input validation decorator
> import functools
> def validate_types(**expected_types):
>     """
>     Parameterised decorator: validate argument types before running the function.
>     Usage: @validate_types(name=str, age=int, score=float)
>     """
>     def decorator(func):
>         @functools.wraps(func)
>         def wrapper(**kwargs):   # keyword-only args for clarity
>             for param, expected in expected_types.items():
>                 if param in kwargs and not isinstance(kwargs[param], expected):
>                     raise TypeError(
>                         f"{param} must be {expected.__name__}, "
>                         f"got {type(kwargs[param]).__name__}"
>                     )
>             return func(**kwargs)
>         return wrapper
>     return decorator
> @validate_types(name=str, age=int, score=float)
> def register_student(name, age, score):
>     return f"Registered {name}, age {age}, score {score}"
> # Valid call:
> print(register_student(name="Alice", age=20, score=98.5))
> # Invalid call — wrong type for age:
> try:
>     register_student(name="Bob", age="twenty", score=90.0)
> except TypeError as e:
>     print(f"TypeError: {e}")
> ▶  Expected Output
> Registered Alice, age 20, score 98.5
> TypeError: age must be int, got str

# 💡  Lesson Recap — Key Takeaways
## Decorator = function that wraps another function: dec(func) → wrapper
@dec is shorthand for: func = dec(func)  — Python does this substitution automatically
Always use @functools.wraps(func) inside — preserves __name__, __doc__, __module__
Use *args, **kwargs in wrapper so it works with ANY function signature
Parameterised @retry(3) needs three levels: factory → decorator → wrapper
Stacking: applied bottom-up (@timer closer to function); executed top-down
Class decorator: implement __call__ — useful for stateful decorators (call counters)
@lru_cache: instant memoisation from functools — O(1) lookup vs O(2^n) recursion
@property: attribute-style access to computed values with getter/setter/deleter
Real-world uses: logging, timing, retry, rate limiting, validation, caching, auth`,

  22: `# ⚙️  ADVANCED  •  LESSON 22
## Multithreading & Multiprocessing
Concurrency, Parallelism, the GIL & Async I/O

# 📌  Concurrency vs Parallelism — The Critical Distinction

These two terms are often confused. Understanding the difference determines which Python tool to use for your task.

CONCURRENCY: multiple tasks are in progress at the same time — but they may not literally run simultaneously. Like a single chef preparing multiple dishes: they work on one, pause, switch to another.

PARALLELISM: multiple tasks literally run at the same time on multiple CPU cores. Like multiple chefs each cooking a separate dish simultaneously.

![Image 34](/pyimages/pimg34.png)

Approach | Best For | Python Tool | Speedup
Threading | I/O-bound: network, files, DB, user input | threading, ThreadPoolExecutor | Yes (I/O)
Multiprocessing | CPU-bound: math, ML, image processing | multiprocessing, ProcessPoolExecutor | Yes (CPU)
Async / await | Many concurrent I/O tasks (web servers) | asyncio, aiohttp, aiofiles | Yes (I/O)
None | Simple sequential scripts | Just regular Python | N/A
🔑  The Golden Rule I/O-bound  → Use threading or asyncio             (waiting for network, disk, database) CPU-bound  → Use multiprocessing             (number crunching, ML, image/video processing) Massive concurrency → Use asyncio             (thousands of simultaneous connections) |  |  |

# 1️⃣  Threading — Concurrent I/O

  Example 1: Basic Thread Creation and Joining

Create a Thread by passing a target function and its arguments. Start it with .start(). Wait for it to complete with .join(). Without .join(), your main program might exit before the thread finishes.

🐍  Example 1 — Basic threading import threading, time   def print_numbers(name, count):     """Task to run in a separate thread."""     for i in range(1, count + 1):         print(f"  [{name}] {i}")         time.sleep(0.1)   # Create thread objects (they do NOT run yet) t1 = threading.Thread(target=print_numbers, args=("Thread-A", 3)) t2 = threading.Thread(target=print_numbers, args=("Thread-B", 3))   t1.start()    # both threads start CONCURRENTLY t2.start()    # they interleave because of time.sleep()   t1.join()     # main thread WAITS for t1 to complete t2.join()     # main thread WAITS for t2 to complete print("Both threads done!") |
▶  Expected Output   [Thread-A] 1   [Thread-B] 1   [Thread-A] 2   [Thread-B] 2   [Thread-A] 3   [Thread-B] 3 Both threads done!  (order may vary) |
📝 | Explanation:  Both threads run concurrently. The GIL (see below) is released during time.sleep(), so both threads can actually run in parallel during the sleep. Without .join(), the main program might print "Both threads done!" before the threads finish.

  Example 2: ThreadPoolExecutor — High-Level API for I/O Tasks

ThreadPoolExecutor manages a pool of threads automatically. It is simpler than creating threads manually and handles the join() calls for you.

>   🐍  Example 2 — ThreadPoolExecutor
> from concurrent.futures import ThreadPoolExecutor, as_completed
> import requests, time
> def fetch_url(url):
>     """Fetch a URL and return a summary string."""
>     resp = requests.get(url, timeout=5)
>     return f"{url}: {resp.status_code} ({len(resp.content)} bytes)"
> urls = [
>     "https://httpbin.org/get",
>     "https://httpbin.org/ip",
>     "https://httpbin.org/uuid",
>     "https://httpbin.org/user-agent",
> ]
> start = time.perf_counter()
> # max_workers=4: up to 4 threads in the pool
> with ThreadPoolExecutor(max_workers=4) as executor:
>     # Submit all tasks, get Future objects
>     futures = {executor.submit(fetch_url, url): url for url in urls}
>     # as_completed yields futures as they FINISH (not in submission order)
>     for future in as_completed(futures):
>         print(future.result())
> print(f"4 requests in {time.perf_counter()-start:.2f}s")
> # Sequential would take ~4× longer!
> ▶  Expected Output
> https://httpbin.org/uuid: 200 (172 bytes)
> https://httpbin.org/ip: 200 (32 bytes)
> https://httpbin.org/get: 200 (429 bytes)
> https://httpbin.org/user-agent: 200 (55 bytes)
> 4 requests in 0.42s   (sequential would be ~1.6s)

  Example 3: Thread Safety with Lock

When multiple threads share mutable data, a race condition can corrupt it: thread A reads the value, thread B reads the same value, thread A writes back, thread B writes back — one update is lost. A Lock prevents this.

>   🐍  Example 3 — Thread lock for safety
> import threading
> counter = 0
> lock    = threading.Lock()
> def safe_increment():
>     global counter
>     for _ in range(100_000):
>         with lock:       # acquire → only ONE thread can be here at a time
>             counter += 1 # critical section — read-modify-write is now atomic
>                          # lock releases automatically when with block exits
> threads = [threading.Thread(target=safe_increment) for _ in range(5)]
> for t in threads: t.start()
> for t in threads: t.join()
> print(f"Counter: {counter}")   # always 500,000 (safe!)
> # Without the lock, result is unpredictable (race condition)
> ▶  Expected Output
> Counter: 500000

# 2️⃣  The GIL — Global Interpreter Lock

The GIL is a mutex (mutual exclusion lock) in CPython that allows only ONE thread to execute Python bytecode at any moment. It was introduced to protect Python's internal memory management (reference counting) from race conditions.

# 🔒  GIL Key Facts
## • Exists ONLY in CPython (the standard Python) — not in Jython, IronPython, PyPy
• The GIL is RELEASED during I/O operations (network, file, sleep)
→ Threads still help for I/O-bound work because threads run while others wait
• The GIL PREVENTS true parallel CPU execution on multiple cores
→ Two CPU-bound threads run no faster than one (actually slightly slower)
• Workaround for CPU-bound: multiprocessing — each process has its OWN GIL
• Workaround for I/O-bound: asyncio — single thread, cooperative switching
• Python 3.13+ introduced experimental "no-GIL" mode (PEP 703)

  Example 4: GIL Demonstration — Threads vs Processes for CPU Work

🐍  Example 4 — GIL: threads vs processes for CPU-bound work import time from threading       import Thread from multiprocessing import Process   def cpu_task(n):     """CPU-bound: sum of squares — keeps CPU 100% busy."""     return sum(i*i for i in range(n))   N = 10_000_000   # ── Sequential: run twice in series ───────────────────────── start = time.perf_counter() cpu_task(N) cpu_task(N) seq_time = time.perf_counter() - start print(f"Sequential:   {seq_time:.2f}s")   # ── Two Threads: GIL means no speedup for CPU-bound tasks! ── start = time.perf_counter() t1 = Thread(target=cpu_task, args=(N,)) t2 = Thread(target=cpu_task, args=(N,)) t1.start(); t2.start() t1.join();  t2.join() thread_time = time.perf_counter() - start print(f"2 Threads:    {thread_time:.2f}s  ← same as sequential (GIL!)")   # ── Two Processes: each has its own GIL → true parallelism! ─ start = time.perf_counter() p1 = Process(target=cpu_task, args=(N,)) p2 = Process(target=cpu_task, args=(N,)) p1.start(); p2.start() p1.join();  p2.join() proc_time = time.perf_counter() - start print(f"2 Processes:  {proc_time:.2f}s  ← ~2× faster (true parallel!)") |
▶  Expected Output Sequential:   2.14s 2 Threads:    2.18s  ← same as sequential (GIL!) 2 Processes:  1.12s  ← ~2× faster (true parallel!) |
📝 | Explanation:  Two CPU-bound threads are SLOWER than sequential because they contend for the GIL. Two processes have INDEPENDENT GILs, so they genuinely run in parallel on separate CPU cores. Always use multiprocessing for CPU-intensive work.

# 3️⃣  Multiprocessing — True Parallelism

The multiprocessing module creates separate OS processes, each with its own Python interpreter and GIL. This allows true parallel execution on multi-core CPUs. The trade-off: processes have more overhead than threads (separate memory space, startup cost, serialisation for data passing).

  Example 5: ProcessPoolExecutor — Distribute CPU Work

>   🐍  Example 5 — ProcessPoolExecutor
> from concurrent.futures import ProcessPoolExecutor
> import time
> def compute(n):
>     """CPU-intensive: sum of squares up to n."""
>     return sum(i**2 for i in range(n))
> numbers = [1_000_000, 2_000_000, 1_500_000, 500_000]
> # ── Sequential ───────────────────────────────────────────────
> start = time.perf_counter()
> results = [compute(n) for n in numbers]
> seq_time = time.perf_counter() - start
> print(f"Sequential: {seq_time:.2f}s")
> # ── Parallel with ProcessPoolExecutor ────────────────────────
> # if __name__ == "__main__":  ← required on Windows/macOS!
> start = time.perf_counter()
> with ProcessPoolExecutor() as executor:
>     # executor.map applies compute to each number in parallel
>     results = list(executor.map(compute, numbers))
> par_time = time.perf_counter() - start
> print(f"Parallel:   {par_time:.2f}s  (speedup: {seq_time/par_time:.1f}×)")
> print(f"Results:    {results}",)
> ▶  Expected Output
> Sequential: 0.84s
> Parallel:   0.31s  (speedup: 2.7×)
> Results: [333332833333500000, ...]
> 💡  On Windows and macOS, ProcessPoolExecutor code MUST be inside if __name__ == "__main__": to prevent recursive process spawning. This is not required on Linux.

  Example 6: multiprocessing.Pool and Queue

>   🐍  Example 6 — Pool.map() and Queue
> from multiprocessing import Pool, Queue, Process
> # ── Pool.map() — simplest parallel map ──────────────────────
> def square(n): return n ** 2
> with Pool(processes=4) as pool:
>     # Distributes range(1,11) across 4 worker processes
>     results = pool.map(square, range(1, 11))
> print(results)   # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
> # ── Inter-process communication via Queue ────────────────────
> def producer(q, items):
>     for item in items:
>         q.put(item)        # put items into the shared queue
>     q.put(None)            # sentinel: tell consumer we are done
> def consumer(q):
>     while True:
>         item = q.get()     # blocks until an item is available
>         if item is None:
>             break          # sentinel received — stop
>         print(f"  Consumed: {item}")
> q  = Queue()
> p1 = Process(target=producer, args=(q, ["alpha","beta","gamma"]))
> p2 = Process(target=consumer, args=(q,))
> p1.start(); p2.start()
> p1.join();  p2.join()
> ▶  Expected Output
> [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
>   Consumed: alpha
>   Consumed: beta
>   Consumed: gamma

# 4️⃣  Async / Await — asyncio

asyncio is Python's asynchronous I/O framework. Unlike threads (which use OS-managed context switching), asyncio uses cooperative switching — a task explicitly yields control when it is waiting for I/O. A single event loop manages many coroutines on ONE thread.

# ⚡  asyncio Key Concepts
## Coroutine:   async def function — can be paused and resumed
await:       suspends the current coroutine until the awaited thing completes
Event loop:  one thread that runs many coroutines by switching between them
asyncio.gather(): run multiple coroutines CONCURRENTLY (all start at once)
asyncio.run():    start the event loop and run a coroutine to completion
The event loop is like a waiter: takes orders (starts coroutines), then
switches between tables (coroutines) whenever one is waiting (await).

  Example 7: asyncio.gather — Concurrent I/O

🐍  Example 7 — asyncio.gather for concurrent I/O import asyncio, time   async def greet(name, delay):     """Simulate an I/O operation (API call, DB query, etc.)."""     print(f"  → Starting {name}")     await asyncio.sleep(delay)   # non-blocking wait (releases event loop)     print(f"  ← Done: {name} after {delay}s")     return f"Result from {name}"   async def main():     start = time.perf_counter()       # gather: starts ALL coroutines and runs them CONCURRENTLY     # They all start immediately, and the event loop switches between them     results = await asyncio.gather(         greet("Alice", 1.0),   # waits 1.0s         greet("Bob",   0.5),   # waits 0.5s         greet("Carol", 0.8),   # waits 0.8s     )       elapsed = time.perf_counter() - start     print(f"\\nAll done in {elapsed:.2f}s")     print(f"Sequential would have taken: {1.0+0.5+0.8:.1f}s")     return results   # asyncio.run() starts the event loop and runs main() to completion asyncio.run(main())   # ── When to use asyncio vs threading ───────────────────────── # asyncio:   thousands of connections, no CPU work, libraries support async # threading: fewer connections, legacy libraries, simpler mental model |
▶  Expected Output   → Starting Alice   → Starting Bob   → Starting Carol   ← Done: Bob after 0.5s   ← Done: Carol after 0.8s   ← Done: Alice after 1.0s All done in 1.01s Sequential would have taken: 2.3s |
📝 | Explanation:  All three coroutines START at the same time. Bob finishes first (0.5s), Carol next (0.8s), Alice last (1.0s). Total wall time is just 1.01s instead of 2.3s sequential. The event loop never blocks — when one coroutine hits "await", it switches to another that is ready to run.

# 💡  Lesson Recap — Key Takeaways
## I/O-bound → use threading or asyncio; CPU-bound → use multiprocessing
The GIL prevents true parallel execution of CPU code in CPython threads
The GIL IS released during I/O → threads still help for network/file tasks
ThreadPoolExecutor: high-level, recommended API for thread pools
threading.Lock(): always protect shared mutable state with a lock
ProcessPoolExecutor: high-level parallel processing; each process bypasses GIL
multiprocessing.Pool.map(): distribute a function across CPU cores easily
asyncio: event loop, cooperative scheduling; ideal for massive I/O concurrency
await suspends the current coroutine; asyncio.gather runs many concurrently
Rule: threads for I/O, processes for CPU, asyncio for massive concurrency`,

  23: `# 🌐  ADVANCED  •  LESSON 23
## Working with APIs
HTTP Methods, requests library, JSON, Authentication & Real-World Projects

# 📌  What Is a REST API?

An API (Application Programming Interface) is a defined set of rules that lets two programs talk to each other. A REST API uses HTTP — the same protocol browsers use — to exchange data in JSON format.

When you check the weather on your phone, the app calls a weather API. When you log in with Google, the website calls Google's OAuth API. Understanding APIs lets your Python programs communicate with any web service: weather, payments, AI models, social media, databases, and more.

![Image 35](/pyimages/pimg35.png)

# 🌐  HTTP Methods — CRUD Mapping
## GET    → Read     — Retrieve data. No body. Idempotent (safe to repeat).
POST   → Create   — Send new data to the server. Has a request body.
PUT    → Replace  — Replace an entire resource with new data.
PATCH  → Update   — Partially update a resource (only changed fields).
DELETE → Delete   — Remove a resource.
Status codes: 2xx=success, 4xx=client error (your fault), 5xx=server error
200=OK  201=Created  400=Bad Request  401=Unauthorized  404=Not Found  429=Rate Limited

# 1️⃣  The requests Library

  Example 1: GET Request — Retrieve Data

A GET request fetches data from a URL. You can pass query parameters as a dictionary — requests handles URL encoding automatically.

>   🐍  Example 1 — GET request
> import requests
> # ── Basic GET ────────────────────────────────────────────────
> response = requests.get("https://httpbin.org/json")
> # Response attributes:
> print(f"Status:       {response.status_code}")       # 200
> print(f"Content-Type: {response.headers['Content-Type']}")  # application/json
> print(f"URL:          {response.url}")
> print(f"Time taken:   {response.elapsed}")
> # Automatically parse JSON response into a Python dict:
> data = response.json()
> print(f"Type: {type(data)}")    # <class 'dict'>
> # ── GET with query parameters ────────────────────────────────
> # Passing a dict auto-encodes it: ?q=python&language=Python&...
> params = {"q": "python programming", "language": "Python",
>           "sort": "stars", "per_page": 5}
> resp  = requests.get("https://api.github.com/search/repositories",
>                      params=params)
> repos = resp.json()["items"]
> for r in repos:
>     print(f"{r['full_name']:45} ⭐{r['stargazers_count']:>8,}")
> ▶  Expected Output
> Status:       200
> Content-Type: application/json
> Type: <class 'dict'>
> psf/cpython                                    ⭐ 62,000
> TheAlgorithms/Python                           ⭐215,000

  Example 2: POST Request — Send Data to the Server

🐍  Example 2 — POST, error handling, timeouts # ── POST request: send JSON data ───────────────────────────── payload = {     "name":  "Alice",     "score": 98.5,     "tags":  ["python", "developer"] }   # json=payload: auto-serialises dict to JSON string #               AND sets Content-Type: application/json header resp = requests.post("https://httpbin.org/post", json=payload)   echo = resp.json()["json"]   # server echoes our data back print(f"Server received: {echo}") print(f"Status: {resp.status_code}")   # 200   # ── Error handling — ALWAYS do this ───────────────────────── resp = requests.get("https://httpbin.org/status/404") try:     resp.raise_for_status()   # raises HTTPError for 4xx/5xx except requests.HTTPError as e:     print(f"HTTP Error: {e}")   # ── Timeouts — ALWAYS set them! ────────────────────────────── # Without timeout, your program can hang forever! try:     resp = requests.get("https://httpbin.org/delay/5",                         timeout=2)   # give up after 2 seconds except requests.Timeout:     print("Request timed out!") except requests.ConnectionError:     print("Could not connect!") |
▶  Expected Output Server received: {'name': 'Alice', 'score': 98.5, 'tags': ['python', 'developer']} Status: 200 HTTP Error: 404 Client Error: NOT FOUND Request timed out! |
📝 | Explanation:  Always set timeout=N. Without it, if the server hangs, your program hangs too — potentially forever. Always call raise_for_status() or check response.status_code — don't silently assume success. ConnectionError means the server is unreachable; Timeout means it took too long.

# 2️⃣  JSON Handling — The Universal Format

JSON is the standard data format for APIs. Python's json module converts between Python objects and JSON strings. The requests library handles JSON automatically with .json() and json= parameter — but understanding the raw module is important for file caching and other tasks.

| json function | Direction | Use case |
| --- | --- | --- |
| json.dumps(obj, indent=2) | Python dict/list → JSON string | Display, send over network |
| json.loads(string) | JSON string → Python dict/list | Parse API response string |
| json.dump(obj, file) | Python dict/list → JSON file | Cache to disk |
| json.load(file) | JSON file → Python dict/list | Load from disk cache |
| resp.json() | HTTP response → Python dict | Most common — automatic |

  Example 3: JSON Serialisation and Safe Extraction

>   🐍  Example 3 — JSON handling
> import json
> # ── Python → JSON string ─────────────────────────────────────
> student = {
>     "name":    "Alice",
>     "age":     22,
>     "scores":  [95, 88, 92],
>     "active":  True,
>     "address": {"city": "Hyderabad", "pin": "500001"}
> }
> json_str = json.dumps(student, indent=2)
> print(json_str)
> # ── JSON string → Python ─────────────────────────────────────
> raw    = '{"status":"ok","count":3,"data":[1,2,3]}'
> parsed = json.loads(raw)
> print(parsed["status"])    # ok
> print(parsed["data"])      # [1, 2, 3]
> # ── Safe extraction using .get() — NEVER crash on missing keys
> # Real APIs sometimes omit optional fields
> github_user = {"login":"torvalds","name":"Linus Torvalds",
>                "public_repos":7,"followers":186000}
> name     = github_user.get("name",     "Unknown")       # key exists
> location = github_user.get("location", "Not specified") # key MISSING
> company  = github_user.get("company",  "Not specified") # key MISSING
> print(f"{name} — {location} — {company}")
> # ── Cache API response to file / load from file ──────────────
> with open("user_cache.json", "w") as f:
>     json.dump(github_user, f, indent=2)
> with open("user_cache.json", "r") as f:
>     loaded = json.load(f)
> print(f"Loaded: {loaded['login']}")
> ▶  Expected Output
> {
>   "name": "Alice",
>   "age": 22,
>   "scores": [95, 88, 92],
>  ...
> }
>  ok
> [1, 2, 3]
> Linus Torvalds — Not specified — Not specified
> Loaded: torvalds

# 3️⃣  Authentication — Headers & API Keys

  Example 4: Bearer Token, API Key, Basic Auth, Sessions

# 🐍  Example 4 — Authentication methods
## import requests, os
# ── Method 1: API Key in Authorization header (most common) ──
API_KEY = os.getenv("MY_API_KEY", "your-key-here")  # NEVER hardcode!
headers = {
"Authorization": f"Bearer {API_KEY}",
"Accept":        "application/json",
"Content-Type":  "application/json",
"User-Agent":    "MyApp/1.0",
}
resp = requests.get("https://api.example.com/data", headers=headers)
# ── Method 2: API Key in query parameter ─────────────────────
resp = requests.get("https://api.openweathermap.org/data/2.5/weather",
params={"q": "London", "appid": API_KEY, "units": "metric"})
# ── Method 3: HTTP Basic Authentication ──────────────────────
resp = requests.get("https://api.example.com/protected",
auth=("username", "password"))
# ── requests.Session() — reuse connection and headers ────────
# Session: persists headers, cookies, and TCP connection across requests
# Faster and cleaner than setting headers on every request
with requests.Session() as session:
session.headers.update({"Authorization": f"Bearer {API_KEY}"})
session.headers.update({"Accept": "application/json"})
# All requests in this block share the headers automatically
r1 = session.get("https://api.example.com/users")
r2 = session.get("https://api.example.com/products")
r3 = session.post("https://api.example.com/orders",
json={"item": "Python Book", "qty": 2})
# ── Real example: GitHub API (no auth needed for public data) ─
resp = requests.get("https://api.github.com/users/python",
headers={"Accept": "application/vnd.github.v3+json"})
if resp.status_code == 200:
user = resp.json()
print(f"Org:    {user['name']}")
print(f"Repos:  {user['public_repos']}")

# 4️⃣  Complete REST API CRUD — Full Pattern

  Example 5: CREATE, READ, UPDATE, DELETE with JSONPlaceholder

JSONPlaceholder is a free fake REST API for testing. This example shows all five HTTP operations with proper error handling.

>   🐍  Example 5 — Full CRUD with JSONPlaceholder
> import requests
> BASE = "https://jsonplaceholder.typicode.com"
> # ── CREATE — POST ────────────────────────────────────────────
> new_post = {
>     "title":  "Learning Python APIs",
>     "body":   "Python makes HTTP requests easy with requests library.",
>     "userId": 1
> }
> resp    = requests.post(f"{BASE}/posts", json=new_post)
> created = resp.json()
> print(f"Created post ID: {created['id']}")   # 101
> # ── READ — GET (single item) ─────────────────────────────────
> resp = requests.get(f"{BASE}/posts/1")
> post = resp.json()
> print(f"Post title: {post['title'][:40]}...")
> # ── READ — GET (filtered list) ───────────────────────────────
> resp  = requests.get(f"{BASE}/posts", params={"userId": 1})
> posts = resp.json()
> print(f"User 1 has {len(posts)} posts")
> # ── UPDATE — PUT (replace entire resource) ───────────────────
> updated = {"title": "New Title", "body": "New body", "userId": 1}
> resp = requests.put(f"{BASE}/posts/1", json=updated)
> print(f"PUT status: {resp.status_code}")    # 200
> # ── UPDATE — PATCH (partial update, only changed fields) ─────
> resp = requests.patch(f"{BASE}/posts/1", json={"title": "Patched"})
> print(f"Patched title: {resp.json()['title']}")
> # ── DELETE ───────────────────────────────────────────────────
> resp = requests.delete(f"{BASE}/posts/1")
> print(f"DELETE status: {resp.status_code}")  # 200
> # ── Pagination — fetch all pages ──────────────────────────────
> def get_all_posts(page_size=10):
>     """Fetch all posts page by page until no more results."""
>     all_posts, page = [], 1
>     while True:
>         resp  = requests.get(f"{BASE}/posts",
>                              params={"_page": page, "_limit": page_size})
>         batch = resp.json()
>         if not batch: break         # empty page → we are done
>         all_posts.extend(batch)
>         page += 1
>         if len(batch) < page_size:  # partial page → last page
>             break
>     return all_posts
> posts = get_all_posts()
> print(f"Total posts fetched: {len(posts)}")
> ▶  Expected Output
> Created post ID: 101
> Post title: sunt aut facere repellat provident occaec...
> User 1 has 10 posts
> PUT status: 200
> Patched title: Patched
> DELETE status: 200
> Total posts fetched: 100

# 5️⃣  Real-World Project — Weather CLI

  Example 6: WeatherAPI Class — Production-Grade API Client

A complete, production-quality API client with session reuse, structured methods, proper error handling, and environment variable key storage.

>   🐍  Example 6 — WeatherAPI complete project
> import requests, json, os
> from datetime import datetime
> class WeatherAPI:
>     """Production-grade wrapper around OpenWeatherMap API."""
>     BASE = "https://api.openweathermap.org/data/2.5"
>     def __init__(self, api_key):
>         self.key     = api_key
>         self.session = requests.Session()
>         # Attach common params to ALL requests in this session:
>         self.session.params = {"appid": api_key, "units": "metric"}
>     def current(self, city):
>         """Get current weather for a city."""
>         resp = self.session.get(f"{self.BASE}/weather", params={"q": city})
>         resp.raise_for_status()
>         return resp.json()
>     def forecast(self, city, days=3):
>         """Get N-day forecast (every 3 hours)."""
>         resp = self.session.get(f"{self.BASE}/forecast",
>                                params={"q": city, "cnt": days * 8})
>         resp.raise_for_status()
>         return resp.json()
>     def format_current(self, data):
>         """Format raw API dict into a clean display dict."""
>         return {
>             "City":       f"{data['name']}, {data['sys']['country']}",
>             "Temp":       f"{data['main']['temp']:.1f}°C",
>             "Feels like": f"{data['main']['feels_like']:.1f}°C",
>             "Humidity":   f"{data['main']['humidity']}%",
>             "Condition":  data["weather"][0]["description"].title(),
>             "Wind":       f"{data['wind']['speed']} m/s",
>             "Sunrise":    datetime.fromtimestamp(data["sys"]["sunrise"]).strftime("%H:%M"),
>             "Sunset":     datetime.fromtimestamp(data["sys"]["sunset"]).strftime("%H:%M"),
>         }
> # ── Usage ────────────────────────────────────────────────────
> API_KEY = os.getenv("OPENWEATHER_API_KEY", "demo")
> api     = WeatherAPI(API_KEY)
> try:
>     raw  = api.current("Hyderabad")
>     info = api.format_current(raw)
>     print(f"\\n{'='*40}")
>     for key, val in info.items():
>         print(f"  {key:15}: {val}")
>     print(f"{'='*40}\\n")
> except requests.HTTPError as e:
>     print(f"API Error: {e}")
> except requests.ConnectionError:
>     print("No internet connection!")
> except KeyError as e:
>     print(f"Unexpected API response: missing key {e}")
> ▶  Expected Output
> ========================================
>   City           : Hyderabad, IN
>   Temp           : 32.5°C
>   Feels like     : 36.2°C
>   Humidity       : 52%
>   Condition      : Few Clouds
>   Wind           : 3.2 m/s
>   Sunrise        : 06:14
>   Sunset         : 18:28
> ========================================

Best Practice | Why It Matters
Always set timeout=N | Prevents your program hanging if the server is slow or unreachable
Use resp.raise_for_status() | Immediately raises on 4xx/5xx — don't silently ignore errors
Use requests.Session() | Reuses TCP connections and headers — faster and cleaner
Store API keys in environment variables | Never hardcode secrets — use os.getenv("MY_KEY")
Handle rate limits (429) | Respect Retry-After header; implement exponential backoff
Cache responses where appropriate | Reduces API calls; use json files or functools.lru_cache
Use .get() for dict access | Prevents KeyError when API omits optional fields
Catch ConnectionError and Timeout | Always handle network failures gracefully
Log requests and responses | Essential for debugging production integration issues
💡  Lesson Recap — Key Takeaways REST API: stateless HTTP interface — GET(read), POST(create), PUT(replace), PATCH(update), DELETE Status codes: 2xx=success, 4xx=client error, 5xx=server error, 429=rate limited requests.get(url, params={}, headers={}, timeout=5) — always set timeout! resp.json() → dict | resp.status_code | resp.raise_for_status() Authentication: Bearer token in header, API key in params, Basic auth tuple requests.Session() — reuse connections and default headers across multiple requests JSON: json.dumps(obj) → string | json.loads(str) → dict | json.dump/load for files Store API keys in environment variables: os.getenv("MY_KEY") — never in source code! Always handle: HTTPError, ConnectionError, Timeout, JSONDecodeError, KeyError Use .get(key, default) on response dicts — API responses sometimes omit optional keys |

# 🏆  Advanced Level — Complete!
## You are now Industry & Project Ready
Advanced OOP  •  Iterators & Generators  •  Decorators  •  Threads & Processes  •  REST APIs
🚀  You can now build: web scrapers, API clients, concurrent servers, data pipelines & production Python systems`,

}

export default pythonContent
