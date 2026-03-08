// Mock MCQ data — organized to match Python lesson topics.
// Also includes SQL and DSA for completeness.
// practice-mcq/page.tsx uses this as fallback when the API is unavailable.

export interface MockQuestion {
  id: number
  topic: string
  subtopic: string
  question: string
  options: string[]
  correctIndex: number
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  explanation: string
}

export interface MockSubtopic {
  name: string
  total: number
  attempted: number
}

export interface MockTopic {
  topic: string
  subtopics: MockSubtopic[]
}

// ─── Python ──────────────────────────────────────────────────────────────────

const pythonQuestions: MockQuestion[] = [

  // ── Introduction & Variables ──────────────────────────────────────────────
  { id: 1001, topic: "Python", subtopic: "Introduction & Variables", difficulty: "Easy", points: 5,
    question: "Which of the following is the correct way to declare a variable in Python?",
    options: ["int x = 5", "x = 5", "var x = 5", "let x = 5"],
    correctIndex: 1,
    explanation: "Python uses dynamic typing — just write x = 5. No type keyword or declaration needed." },

  { id: 1002, topic: "Python", subtopic: "Introduction & Variables", difficulty: "Easy", points: 5,
    question: "What is the output of: print(type(3.14))?",
    options: ["<class 'float'>", "<class 'double'>", "<class 'number'>", "<class 'decimal'>"],
    correctIndex: 0,
    explanation: "Python uses 'float' for decimal numbers. type() returns the class of the object." },

  { id: 1003, topic: "Python", subtopic: "Introduction & Variables", difficulty: "Easy", points: 5,
    question: "Which of these is a valid f-string in Python?",
    options: ["f'Hello {name}'", "'Hello {name}'", "f'Hello name'", "f(Hello {name})"],
    correctIndex: 0,
    explanation: "F-strings use the f prefix and curly braces {} to embed expressions: f'Hello {name}'." },

  { id: 1004, topic: "Python", subtopic: "Introduction & Variables", difficulty: "Medium", points: 10,
    question: "What does the following print?\n\nx = 10\ny = 3\nprint(x // y)",
    options: ["3.33", "3", "4", "Error"],
    correctIndex: 1,
    explanation: "// is floor division — divides and rounds down. 10 // 3 = 3 (not 3.33)." },

  { id: 1005, topic: "Python", subtopic: "Introduction & Variables", difficulty: "Medium", points: 10,
    question: "Which statement about Python variables is TRUE?",
    options: [
      "Variable names can start with a number",
      "Python variables must be declared before use with a type",
      "A variable can change its type by reassigning a different value",
      "Variable names are case-insensitive",
    ],
    correctIndex: 2,
    explanation: "Python is dynamically typed. x = 5 then x = 'hello' is valid — the type changes with the value." },

  // ── Data Structures ───────────────────────────────────────────────────────
  { id: 1011, topic: "Python", subtopic: "Data Structures", difficulty: "Easy", points: 5,
    question: "Which of the following creates an empty dictionary?",
    options: ["[]", "{}", "()", "set()"],
    correctIndex: 1,
    explanation: "{} creates an empty dict. [] creates an empty list. () is an empty tuple. set() creates an empty set." },

  { id: 1012, topic: "Python", subtopic: "Data Structures", difficulty: "Easy", points: 5,
    question: "How do you access the value for key 'name' in a dictionary d?",
    options: ["d.name", "d[name]", "d['name']", "d->name"],
    correctIndex: 2,
    explanation: "Dictionary values are accessed with d['key'] (string key in quotes) or d.get('key')." },

  { id: 1013, topic: "Python", subtopic: "Data Structures", difficulty: "Medium", points: 10,
    question: "What is the difference between a list and a tuple?",
    options: [
      "Lists use () and tuples use []",
      "Lists are mutable (can be changed); tuples are immutable (cannot be changed)",
      "Lists can only hold numbers; tuples can hold any type",
      "Tuples are faster for indexing; lists are faster for searching",
    ],
    correctIndex: 1,
    explanation: "Lists are mutable ([1,2,3]). Tuples are immutable ((1,2,3)). Use tuples for data that shouldn't change." },

  { id: 1014, topic: "Python", subtopic: "Data Structures", difficulty: "Medium", points: 10,
    question: "What does list.append(x) do?",
    options: [
      "Inserts x at index 0",
      "Adds x to the end of the list",
      "Replaces all occurrences of x",
      "Returns a new list with x added",
    ],
    correctIndex: 1,
    explanation: "append() adds an element to the END of the list, modifying it in-place. Use insert(0, x) to add at the beginning." },

  { id: 1015, topic: "Python", subtopic: "Data Structures", difficulty: "Hard", points: 15,
    question: "What is the output of:\n\nd = {'a': 1, 'b': 2}\nd['c'] = d.get('c', 0) + 1\nprint(d)",
    options: ["{'a': 1, 'b': 2}", "{'a': 1, 'b': 2, 'c': 1}", "Error", "{'c': 1}"],
    correctIndex: 1,
    explanation: "d.get('c', 0) returns 0 (default, since 'c' doesn't exist). 0 + 1 = 1. So d['c'] = 1 is added." },

  // ── Strings & Methods ─────────────────────────────────────────────────────
  { id: 1021, topic: "Python", subtopic: "Strings & Methods", difficulty: "Easy", points: 5,
    question: "Which method converts a string to all uppercase?",
    options: [".upper()", ".toUpper()", ".capitalize()", ".UP()"],
    correctIndex: 0,
    explanation: "str.upper() returns the string in uppercase. str.lower() for lowercase. str.capitalize() only capitalizes the first letter." },

  { id: 1022, topic: "Python", subtopic: "Strings & Methods", difficulty: "Easy", points: 5,
    question: "What does 'hello world'.split() return?",
    options: ["'hello', 'world'", "['hello', 'world']", "['hello world']", "Error"],
    correctIndex: 1,
    explanation: "str.split() splits on whitespace by default and returns a list. 'hello world'.split() → ['hello', 'world']." },

  { id: 1023, topic: "Python", subtopic: "Strings & Methods", difficulty: "Medium", points: 10,
    question: "What is the output of: 'Fynity'[::-1]?",
    options: ["Fynity", "ytiynF", "Fynity", "Error"],
    correctIndex: 1,
    explanation: "[::-1] reverses a string. 'Fynity' reversed is 'ytiynF'." },

  { id: 1024, topic: "Python", subtopic: "Strings & Methods", difficulty: "Medium", points: 10,
    question: "Which method removes whitespace from both ends of a string?",
    options: [".strip()", ".trim()", ".clean()", ".remove()"],
    correctIndex: 0,
    explanation: "str.strip() removes leading and trailing whitespace. lstrip() removes only left, rstrip() only right." },

  { id: 1025, topic: "Python", subtopic: "Strings & Methods", difficulty: "Hard", points: 15,
    question: "What does ', '.join(['a', 'b', 'c']) return?",
    options: ["['a', 'b', 'c']", "'a, b, c'", "'abc'", "'a b c'"],
    correctIndex: 1,
    explanation: "str.join(iterable) joins elements with the string as separator. ', '.join(['a','b','c']) = 'a, b, c'." },

  // ── Control Flow ──────────────────────────────────────────────────────────
  { id: 1031, topic: "Python", subtopic: "Control Flow", difficulty: "Easy", points: 5,
    question: "Which keyword is used for else-if in Python?",
    options: ["else if", "elseif", "elif", "otherwise"],
    correctIndex: 2,
    explanation: "Python uses 'elif' (not 'else if' like JavaScript/Java). It checks additional conditions when if is False." },

  { id: 1032, topic: "Python", subtopic: "Control Flow", difficulty: "Easy", points: 5,
    question: "What is the output of: print(10 > 5 and 3 < 2)?",
    options: ["True", "False", "None", "Error"],
    correctIndex: 1,
    explanation: "10 > 5 is True, but 3 < 2 is False. True AND False = False." },

  { id: 1033, topic: "Python", subtopic: "Control Flow", difficulty: "Medium", points: 10,
    question: "What does the 'not' operator do?",
    options: [
      "Checks if two values are not equal",
      "Inverts a boolean value (not True = False)",
      "Excludes a value from a set",
      "Same as the != operator",
    ],
    correctIndex: 1,
    explanation: "not inverts a boolean: not True = False, not False = True. != checks inequality between values." },

  { id: 1034, topic: "Python", subtopic: "Control Flow", difficulty: "Medium", points: 10,
    question: "What is a ternary expression in Python?",
    options: [
      "An expression with three operators",
      "value_if_true if condition else value_if_false",
      "A 3-way comparison",
      "A try/except/finally block",
    ],
    correctIndex: 1,
    explanation: "Python's ternary: x = 'yes' if condition else 'no'. It's an inline if/else in a single expression." },

  { id: 1035, topic: "Python", subtopic: "Control Flow", difficulty: "Hard", points: 15,
    question: "What is the output of:\n\nx = 15\nif x > 10:\n    print('A')\nelif x > 12:\n    print('B')\nelse:\n    print('C')",
    options: ["A", "B", "A and B", "C"],
    correctIndex: 0,
    explanation: "The first condition (x > 10) is True, so 'A' is printed and the elif/else are skipped. Python stops at the first True branch." },

  // ── Loops ─────────────────────────────────────────────────────────────────
  { id: 1041, topic: "Python", subtopic: "Loops", difficulty: "Easy", points: 5,
    question: "How many times does this loop run?\n\nfor i in range(3):",
    options: ["2", "3", "4", "0"],
    correctIndex: 1,
    explanation: "range(3) produces [0, 1, 2] — 3 values. The loop runs 3 times." },

  { id: 1042, topic: "Python", subtopic: "Loops", difficulty: "Easy", points: 5,
    question: "Which statement skips the current loop iteration and moves to the next?",
    options: ["break", "continue", "pass", "skip"],
    correctIndex: 1,
    explanation: "continue skips the rest of the current iteration. break exits the loop entirely. pass does nothing." },

  { id: 1043, topic: "Python", subtopic: "Loops", difficulty: "Medium", points: 10,
    question: "What is the output of:\n\nfor i in range(1, 6, 2):\n    print(i, end=' ')",
    options: ["1 2 3 4 5", "1 3 5", "2 4 6", "1 3 5 7"],
    correctIndex: 1,
    explanation: "range(1, 6, 2) starts at 1, stops before 6, steps by 2: 1, 3, 5." },

  { id: 1044, topic: "Python", subtopic: "Loops", difficulty: "Medium", points: 10,
    question: "When should you use a while loop instead of a for loop?",
    options: [
      "When iterating over a list",
      "When the number of iterations is unknown and depends on a condition",
      "When you need to use enumerate()",
      "When you need the loop index",
    ],
    correctIndex: 1,
    explanation: "while loops are best when you don't know in advance how many times to loop — e.g., reading until a sentinel value." },

  { id: 1045, topic: "Python", subtopic: "Loops", difficulty: "Hard", points: 15,
    question: "What does the else clause on a for loop do in Python?",
    options: [
      "Runs if the loop encountered an error",
      "Runs if the loop was skipped entirely",
      "Runs after the loop completes without hitting a break",
      "Python doesn't support else on loops",
    ],
    correctIndex: 2,
    explanation: "for...else: the else block runs ONLY if the loop finished normally (no break). Useful for search patterns." },

  // ── Functions ─────────────────────────────────────────────────────────────
  { id: 1051, topic: "Python", subtopic: "Functions", difficulty: "Easy", points: 5,
    question: "What keyword defines a function in Python?",
    options: ["function", "def", "fn", "func"],
    correctIndex: 1,
    explanation: "'def' defines a function in Python: def my_func():. The body must be indented." },

  { id: 1052, topic: "Python", subtopic: "Functions", difficulty: "Easy", points: 5,
    question: "What does a function return if it has no return statement?",
    options: ["0", "''", "None", "Error"],
    correctIndex: 2,
    explanation: "A function without a return statement (or with just 'return') implicitly returns None." },

  { id: 1053, topic: "Python", subtopic: "Functions", difficulty: "Medium", points: 10,
    question: "What are default parameter values?",
    options: [
      "Parameters that are automatically 0",
      "Values used when the caller doesn't provide that argument",
      "Parameters that must always be provided",
      "The first parameter of every function",
    ],
    correctIndex: 1,
    explanation: "Default values: def greet(name='Guest'): — if no name is passed, 'Guest' is used." },

  { id: 1054, topic: "Python", subtopic: "Functions", difficulty: "Medium", points: 10,
    question: "What does **kwargs allow in a function?",
    options: [
      "Any number of positional arguments as a tuple",
      "Any number of keyword arguments as a dictionary",
      "Required keyword-only arguments",
      "Pointer to another function",
    ],
    correctIndex: 1,
    explanation: "**kwargs collects extra keyword arguments into a dict. def f(**kwargs) lets you call f(name='Arjun', age=22)." },

  { id: 1055, topic: "Python", subtopic: "Functions", difficulty: "Hard", points: 15,
    question: "What is a lambda function?",
    options: [
      "A function defined inside a class",
      "A function that calls itself",
      "An anonymous one-expression function: lambda args: expression",
      "A function imported from another module",
    ],
    correctIndex: 2,
    explanation: "lambda creates a small anonymous function: double = lambda x: x * 2. Useful for short one-time functions." },

  // ── Built-in Modules ──────────────────────────────────────────────────────
  { id: 1061, topic: "Python", subtopic: "Built-in Modules", difficulty: "Easy", points: 5,
    question: "How do you import the math module?",
    options: ["include math", "import math", "using math", "require('math')"],
    correctIndex: 1,
    explanation: "Python uses 'import module_name'. After import math, use math.sqrt(), math.pi, etc." },

  { id: 1062, topic: "Python", subtopic: "Built-in Modules", difficulty: "Easy", points: 5,
    question: "Which module generates random numbers in Python?",
    options: ["math", "random", "numbers", "rand"],
    correctIndex: 1,
    explanation: "The 'random' module: random.random() (0-1), random.randint(a,b) (inclusive), random.choice(list)." },

  { id: 1063, topic: "Python", subtopic: "Built-in Modules", difficulty: "Medium", points: 10,
    question: "What does datetime.now() return?",
    options: [
      "The current Unix timestamp as an integer",
      "A datetime object with the current date and time",
      "The current time as a string",
      "The number of seconds since 1970",
    ],
    correctIndex: 1,
    explanation: "from datetime import datetime; datetime.now() returns a datetime object with year, month, day, hour, minute, second." },

  { id: 1064, topic: "Python", subtopic: "Built-in Modules", difficulty: "Medium", points: 10,
    question: "What does json.dumps({'key': 'value'}) do?",
    options: [
      "Reads a JSON file",
      "Converts a Python dict to a JSON string",
      "Parses a JSON string into a dict",
      "Saves JSON to a database",
    ],
    correctIndex: 1,
    explanation: "json.dumps() serializes Python objects to a JSON string. json.loads() does the reverse (string → Python)." },

  { id: 1065, topic: "Python", subtopic: "Built-in Modules", difficulty: "Hard", points: 15,
    question: "Which is the correct way to import only the sqrt function from math?",
    options: ["import sqrt from math", "from math import sqrt", "import math.sqrt", "include math.sqrt"],
    correctIndex: 1,
    explanation: "'from math import sqrt' lets you use sqrt() directly instead of math.sqrt(). You can import multiple: from math import sqrt, pi." },

  // ── File I/O ──────────────────────────────────────────────────────────────
  { id: 1071, topic: "Python", subtopic: "File I/O", difficulty: "Easy", points: 5,
    question: "What file mode opens a file for writing (creates if not exists, overwrites if exists)?",
    options: ["'r'", "'a'", "'w'", "'x'"],
    correctIndex: 2,
    explanation: "'w' mode opens for writing. If the file exists, it's overwritten. 'a' appends. 'r' reads. 'x' creates new." },

  { id: 1072, topic: "Python", subtopic: "File I/O", difficulty: "Easy", points: 5,
    question: "Why should you use 'with open(file) as f:' instead of f = open(file)?",
    options: [
      "with is faster",
      "with automatically closes the file even if an error occurs",
      "with allows reading and writing simultaneously",
      "There is no difference",
    ],
    correctIndex: 1,
    explanation: "The 'with' statement (context manager) guarantees the file is closed when the block exits, even on exceptions." },

  { id: 1073, topic: "Python", subtopic: "File I/O", difficulty: "Medium", points: 10,
    question: "How do you read all lines of a file into a list?",
    options: [
      "f.read()",
      "f.readline()",
      "f.readlines()",
      "f.lines()",
    ],
    correctIndex: 2,
    explanation: "f.readlines() returns a list of strings, one per line. f.read() returns everything as one string. f.readline() reads one line." },

  { id: 1074, topic: "Python", subtopic: "File I/O", difficulty: "Medium", points: 10,
    question: "Which module is used to work with file paths in Python?",
    options: ["fileutils", "path", "os and pathlib", "system"],
    correctIndex: 2,
    explanation: "Both 'os' (os.path.join, os.path.exists) and 'pathlib' (Path objects) handle file paths cross-platform." },

  { id: 1075, topic: "Python", subtopic: "File I/O", difficulty: "Hard", points: 15,
    question: "What does the 'csv' module's DictReader do?",
    options: [
      "Reads a CSV file row-by-row as plain lists",
      "Reads a CSV file and maps each row to a dict using the header row as keys",
      "Writes a dict to a CSV file",
      "Validates CSV file format",
    ],
    correctIndex: 1,
    explanation: "csv.DictReader maps CSV column headers to values for each row, returning OrderedDicts. Much easier than splitting manually." },

  // ── OOP Basics ───────────────────────────────────────────────────────────
  { id: 1081, topic: "Python", subtopic: "OOP Basics", difficulty: "Easy", points: 5,
    question: "What is __init__ in a Python class?",
    options: [
      "A method that destroys an object",
      "A constructor method that initializes a new object",
      "A method that prints the object",
      "A required method for all classes",
    ],
    correctIndex: 1,
    explanation: "__init__ is called automatically when you create an object. It sets initial attribute values: self.name = name." },

  { id: 1082, topic: "Python", subtopic: "OOP Basics", difficulty: "Easy", points: 5,
    question: "What does 'self' refer to in a class method?",
    options: [
      "The class itself",
      "The current object (instance) calling the method",
      "The parent class",
      "A global variable",
    ],
    correctIndex: 1,
    explanation: "'self' is a reference to the current instance. It's how the object accesses its own attributes: self.name." },

  { id: 1083, topic: "Python", subtopic: "OOP Basics", difficulty: "Medium", points: 10,
    question: "What is the difference between a class attribute and an instance attribute?",
    options: [
      "No difference",
      "Class attributes are shared by all instances; instance attributes are unique per object",
      "Instance attributes are faster to access",
      "Class attributes cannot be changed",
    ],
    correctIndex: 1,
    explanation: "Class attributes (defined in class body) are shared. Instance attributes (self.x = ...) belong to each object separately." },

  { id: 1084, topic: "Python", subtopic: "OOP Basics", difficulty: "Medium", points: 10,
    question: "How do you create an object from a class called Student?",
    options: [
      "Student.new('Arjun')",
      "new Student('Arjun')",
      "s = Student('Arjun')",
      "Student.create('Arjun')",
    ],
    correctIndex: 2,
    explanation: "Call the class like a function: s = Student('Arjun'). This calls __init__ and returns the new object." },

  { id: 1085, topic: "Python", subtopic: "OOP Basics", difficulty: "Hard", points: 15,
    question: "What is a @property decorator used for?",
    options: [
      "Making a method static",
      "Allowing a method to be accessed like an attribute (computed property)",
      "Preventing a method from being overridden",
      "Making an attribute private",
    ],
    correctIndex: 1,
    explanation: "@property lets you define a method that is accessed like an attribute. obj.full_name instead of obj.full_name()." },

  // ── Inheritance ───────────────────────────────────────────────────────────
  { id: 1091, topic: "Python", subtopic: "Inheritance", difficulty: "Easy", points: 5,
    question: "How do you define a class Admin that inherits from class User?",
    options: [
      "class Admin extends User:",
      "class Admin inherits User:",
      "class Admin(User):",
      "class Admin <- User:",
    ],
    correctIndex: 2,
    explanation: "Python inheritance: class Child(Parent):. Admin(User) means Admin inherits all methods and attributes of User." },

  { id: 1092, topic: "Python", subtopic: "Inheritance", difficulty: "Easy", points: 5,
    question: "What does super() do in Python?",
    options: [
      "Makes the class a superclass",
      "Calls a method from the parent class",
      "Creates a super user",
      "Skips the parent __init__",
    ],
    correctIndex: 1,
    explanation: "super() gives access to parent class methods. super().__init__() calls the parent's constructor in child classes." },

  { id: 1093, topic: "Python", subtopic: "Inheritance", difficulty: "Medium", points: 10,
    question: "What is method overriding?",
    options: [
      "Calling a method twice",
      "A child class providing its own implementation of a method defined in the parent",
      "Adding more parameters to a parent method",
      "Deleting a parent's method in the child",
    ],
    correctIndex: 1,
    explanation: "Overriding: child defines same method name as parent. When the method is called on a child object, the child's version runs." },

  { id: 1094, topic: "Python", subtopic: "Inheritance", difficulty: "Medium", points: 10,
    question: "What is polymorphism in Python?",
    options: [
      "Having many classes in one file",
      "The ability for different object types to be used interchangeably through a shared interface",
      "Multiple inheritance",
      "Converting between data types",
    ],
    correctIndex: 1,
    explanation: "Polymorphism: different classes implementing the same method name. e.g., both Dog and Cat have speak(), each behaves differently." },

  { id: 1095, topic: "Python", subtopic: "Inheritance", difficulty: "Hard", points: 15,
    question: "What is the MRO (Method Resolution Order) in Python?",
    options: [
      "The order in which modules are imported",
      "The order Python looks up methods in class hierarchies (left to right, depth-first)",
      "The order methods are defined in a class",
      "The order of method parameters",
    ],
    correctIndex: 1,
    explanation: "MRO determines which class's method to call in multiple inheritance. Python uses C3 linearization (check with ClassName.__mro__)." },

  // ── Exception Handling ────────────────────────────────────────────────────
  { id: 1101, topic: "Python", subtopic: "Exception Handling", difficulty: "Easy", points: 5,
    question: "What is the syntax for handling exceptions in Python?",
    options: [
      "try { } catch { }",
      "try: ... except: ...",
      "try: ... error: ...",
      "begin: ... rescue: ...",
    ],
    correctIndex: 1,
    explanation: "Python uses try/except blocks. try: runs code. except ExceptionType: handles the error if it occurs." },

  { id: 1102, topic: "Python", subtopic: "Exception Handling", difficulty: "Easy", points: 5,
    question: "What does the 'finally' block guarantee?",
    options: [
      "The code runs only if no exception occurred",
      "The code runs only if an exception occurred",
      "The code always runs, whether or not an exception occurred",
      "The code runs after returning from a function",
    ],
    correctIndex: 2,
    explanation: "finally always executes — it's used for cleanup like closing files or database connections." },

  { id: 1103, topic: "Python", subtopic: "Exception Handling", difficulty: "Medium", points: 10,
    question: "How do you raise a custom exception in Python?",
    options: [
      "throw ValueError('message')",
      "raise ValueError('message')",
      "error ValueError('message')",
      "except ValueError('message')",
    ],
    correctIndex: 1,
    explanation: "Python uses 'raise' to throw exceptions: raise ValueError('Invalid input'). Can raise any exception class." },

  { id: 1104, topic: "Python", subtopic: "Exception Handling", difficulty: "Medium", points: 10,
    question: "What is the purpose of creating custom exception classes?",
    options: [
      "To make code run faster",
      "To group and identify domain-specific errors clearly",
      "Required to use try/except",
      "To bypass built-in error handling",
    ],
    correctIndex: 1,
    explanation: "Custom exceptions (class InsufficientFundsError(Exception)) give meaningful names to domain errors and allow targeted except blocks." },

  { id: 1105, topic: "Python", subtopic: "Exception Handling", difficulty: "Hard", points: 15,
    question: "What does 'except Exception as e' let you do?",
    options: [
      "Catch only the Exception base class",
      "Catch any exception and access the exception object as variable 'e'",
      "Create a new exception named e",
      "Rethrow the exception",
    ],
    correctIndex: 1,
    explanation: "'as e' binds the exception to a variable. You can then print(e) or str(e) to get the error message." },

  // ── List Comprehensions ───────────────────────────────────────────────────
  { id: 1111, topic: "Python", subtopic: "List Comprehensions", difficulty: "Easy", points: 5,
    question: "Which is a valid list comprehension?",
    options: [
      "[for x in range(5)]",
      "[x for x in range(5)]",
      "{x for x in range(5)}",
      "list(x for x in range(5))",
    ],
    correctIndex: 1,
    explanation: "[expression for item in iterable] is the basic list comprehension syntax. [x for x in range(5)] = [0,1,2,3,4]." },

  { id: 1112, topic: "Python", subtopic: "List Comprehensions", difficulty: "Easy", points: 5,
    question: "What does [x**2 for x in range(4)] produce?",
    options: ["[1, 4, 9, 16]", "[0, 1, 4, 9]", "[0, 2, 4, 6]", "[1, 2, 3, 4]"],
    correctIndex: 1,
    explanation: "range(4) = [0,1,2,3]. x**2 for each: 0²=0, 1²=1, 2²=4, 3²=9 → [0, 1, 4, 9]." },

  { id: 1113, topic: "Python", subtopic: "List Comprehensions", difficulty: "Medium", points: 10,
    question: "How do you add a filter condition to a list comprehension?",
    options: [
      "[x if x > 2 for x in lst]",
      "[x for x in lst if x > 2]",
      "[x for x in lst | x > 2]",
      "[x where x > 2 for x in lst]",
    ],
    correctIndex: 1,
    explanation: "[x for x in lst if condition] filters. Only items where the condition is True are included." },

  { id: 1114, topic: "Python", subtopic: "List Comprehensions", difficulty: "Medium", points: 10,
    question: "What is a generator expression and how does it differ from a list comprehension?",
    options: [
      "No difference — both create lists",
      "Generator expressions use () and lazily produce values one at a time; list comprehensions build the whole list in memory",
      "Generator expressions are faster for all cases",
      "List comprehensions can only use numbers",
    ],
    correctIndex: 1,
    explanation: "(x for x in range(1000000)) is memory-efficient — values computed on demand. [x for x in range(1000000)] builds the full list first." },

  { id: 1115, topic: "Python", subtopic: "List Comprehensions", difficulty: "Hard", points: 15,
    question: "What does the following produce?\n\n{k: v for k, v in [('a', 1), ('b', 2)]}",
    options: [
      "[('a', 1), ('b', 2)]",
      "{'a': 1, 'b': 2}",
      "{('a', 1), ('b', 2)}",
      "Error",
    ],
    correctIndex: 1,
    explanation: "{k: v for k, v in iterable} is a dict comprehension. It unpacks tuples and builds a dictionary." },
]

// ─── SQL (5 questions) ─────────────────────────────────────────────────────

const sqlQuestions: MockQuestion[] = [
  { id: 2001, topic: "SQL", subtopic: "Basic Queries", difficulty: "Easy", points: 5,
    question: "Which SQL statement is used to retrieve data from a table?",
    options: ["GET", "FETCH", "SELECT", "RETRIEVE"],
    correctIndex: 2,
    explanation: "SELECT is the fundamental SQL read operation: SELECT column FROM table WHERE condition." },

  { id: 2002, topic: "SQL", subtopic: "Basic Queries", difficulty: "Easy", points: 5,
    question: "How do you select all columns from a table named 'students'?",
    options: ["SELECT all FROM students", "GET * FROM students", "SELECT * FROM students", "FETCH students.*"],
    correctIndex: 2,
    explanation: "SELECT * FROM table returns all columns. Replace * with column names for specific columns." },

  { id: 2003, topic: "SQL", subtopic: "Joins", difficulty: "Medium", points: 10,
    question: "Which JOIN returns only rows with matching values in BOTH tables?",
    options: ["LEFT JOIN", "FULL OUTER JOIN", "INNER JOIN", "CROSS JOIN"],
    correctIndex: 2,
    explanation: "INNER JOIN (or just JOIN) returns only rows where the join condition is met in both tables." },

  { id: 2004, topic: "SQL", subtopic: "Aggregations", difficulty: "Medium", points: 10,
    question: "Which clause filters groups after a GROUP BY?",
    options: ["WHERE", "FILTER", "HAVING", "WHEN"],
    correctIndex: 2,
    explanation: "HAVING filters after grouping (can use aggregate functions). WHERE filters individual rows before grouping." },

  { id: 2005, topic: "SQL", subtopic: "Aggregations", difficulty: "Hard", points: 15,
    question: "What is the difference between COUNT(*) and COUNT(column)?",
    options: [
      "No difference",
      "COUNT(*) counts all rows including NULLs; COUNT(column) counts only non-NULL values in that column",
      "COUNT(column) is faster",
      "COUNT(*) only counts distinct rows",
    ],
    correctIndex: 1,
    explanation: "COUNT(*) counts every row. COUNT(col) counts only rows where col is NOT NULL. This matters for optional fields." },
]

// ─── DSA (5 questions) ────────────────────────────────────────────────────

const dsaQuestions: MockQuestion[] = [
  { id: 3001, topic: "Data Structures", subtopic: "Arrays & Lists", difficulty: "Easy", points: 5,
    question: "What is the time complexity of accessing an element by index in an array?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctIndex: 2,
    explanation: "Arrays are stored contiguously in memory. Index access is O(1) — direct memory address calculation." },

  { id: 3002, topic: "Data Structures", subtopic: "Stacks & Queues", difficulty: "Easy", points: 5,
    question: "What is the order of a Stack?",
    options: ["FIFO (First In First Out)", "LIFO (Last In First Out)", "Random", "Sorted"],
    correctIndex: 1,
    explanation: "Stack is LIFO — the last element pushed is the first popped. Like a stack of plates." },

  { id: 3003, topic: "Data Structures", subtopic: "Trees", difficulty: "Medium", points: 10,
    question: "In a Binary Search Tree, where are values smaller than the root stored?",
    options: ["Right subtree", "Left subtree", "Both sides", "Root level"],
    correctIndex: 1,
    explanation: "BST property: left subtree contains values smaller than root, right subtree contains larger values." },

  { id: 3004, topic: "Data Structures", subtopic: "Sorting", difficulty: "Medium", points: 10,
    question: "What is the average time complexity of Merge Sort?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
    correctIndex: 1,
    explanation: "Merge Sort always runs in O(n log n) — it splits the array in half (log n levels) and merges (n work per level)." },

  { id: 3005, topic: "Data Structures", subtopic: "Hashing", difficulty: "Hard", points: 15,
    question: "What is the average time complexity of HashMap get() and put()?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctIndex: 2,
    explanation: "Hash maps give O(1) average for get/put by computing a hash to find the bucket directly. Worst case is O(n) for many collisions." },
]

// ─── All questions flat list ───────────────────────────────────────────────

export const allMockQuestions: MockQuestion[] = [
  ...pythonQuestions,
  ...sqlQuestions,
  ...dsaQuestions,
]

// ─── Topic tree (for the left panel in practice-mcq) ─────────────────────

export function buildMockTopics(): MockTopic[] {
  const topicMap = new Map<string, Map<string, number>>()
  for (const q of allMockQuestions) {
    if (!topicMap.has(q.topic)) topicMap.set(q.topic, new Map())
    const sub = topicMap.get(q.topic)!
    sub.set(q.subtopic, (sub.get(q.subtopic) ?? 0) + 1)
  }
  const result: MockTopic[] = []
  topicMap.forEach((subtopics, topic) => {
    const subs: MockSubtopic[] = []
    subtopics.forEach((total, name) => subs.push({ name, total, attempted: 0 }))
    result.push({ topic, subtopics: subs })
  })
  return result
}

export function getMockQuestions(topic: string, subtopic: string): MockQuestion[] {
  return allMockQuestions.filter(q => q.topic === topic && q.subtopic === subtopic)
}
