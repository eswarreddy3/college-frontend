// DSA — Beginner to Advanced (22 lessons, PDF order)
// Images served from /DSA%20images/dimg*.png

const dsaContent: Record<number, string> = {

// ─────────────────────────────────────────────────────────────────
1: `# Data Structure Introduction

:::scenario
DefinitionA Data Structure is a way to store and organise data in computer memory so that it can be accessed and processed efficiently.It is NOT a programming language like C, C++, or Java — it is a way of organizing and storing data in memory, along with operations that can be performed on it.The name itself says it all: Data Structure = Organising Data in Memory.
:::

## ▶ What is Data?

Data — Data can be defined as an elementary value or a collection of values. Example: A student's name and ID are the data about that student.
Record — A Record is a collection of various data items. Example: A student entity having name, address, course, and marks grouped together forms a record.
File — A File is a collection of various records of one type of entity. Example: If there are 60 employees in a Company, there will be 60 records in a related file where each record contains info of one employee.
Attribute / Entity — An entity represents a class of certain objects. It contains various attributes and each attribute represents a particular property of that entity.

## ▶ Why Do We Need Data Structures?

As applications are getting complex and the amount of data is increasing day by day, there may arise the following three major problems:

- Processor Speed — As data grows to billions of files per entity, Inefficient data handling can slow down processing even if the processor is fast.
- Data Search — Consider an inventory with 100 items in a store. If the application needs to search for a particular item, it needs to traverse all 100 items every time — this slows down the process severely.
- Multiple Requests — If thousands of users are searching data simultaneously on a web server, there are chances that search will fail or be very slow.

:::tip
The SolutionData Structures organise data in a way that the required data can be searched and retrieved efficiently, often reducing the need to traverse all items. This is what makes programs fast.
:::

## ▶ Advantages of Data Structures

- Efficiency — If the right data structure is chosen for implementing a particular ADT, the program becomes very efficient in terms of time and space.
- Reusability — A data structure provides reusability, meaning multiple client programs can use the same data structure.
- Abstraction — The data structure specified by an ADT also provides a level of abstraction. The client cannot see the internal workings of a data structure — it only uses the interface without worrying about implementation.

## ▶ Abstract Data Types (ADT) — What & Why

\`\`\`
ADT (What operations)      ↓Data Structure (How it is implemented)      ↓Algorithms (Steps to perform operations)
\`\`\`

An Abstract Data Type (ADT) defines WHAT operations are allowed, while Data Structures define HOW they are implemented, and Algorithms define the steps to perform those operations.
ADT gives us the blueprint, while the data structure provides the implementation part.

## ▶ Operations on Data Structures

| Operation | Definition | Example |
| --- | --- | --- |
| Traversing | Visit each element at least once to perform an operation like searching or sorting | Calculate average of marks by visiting each element |
| Insertion | Process of adding a new element to the data structure at any location | Adding a new student record to an array |
| Deletion | Process of removing an element from the data structure | Removing an employee from the company record |
| Searching | Finding the location of an element within a data structure (Eg: Linear, Binary search) | Finding a student by roll number |
| Sorting | Arranging elements in a specific order (ascending or descending) | Bubble sort, Insertion sort, Merge sort |
| Merging | Joining two sorted lists A and B of sizes M and N to produce a third list C of size M+N | Merging two sorted employee lists |

## ▶ Real-World Applications

| Application | Data Structure Used |
| --- | --- |
| Google Search Engine | Tries, Graphs, Hash Tables (used in indexing and ranking) |
| GPS & Navigation | Graphs, Dijkstra's Algorithm |
| Social Network (Facebook) | Graphs (friends = edges) |
| Browser History — Back button | Stack (LIFO) |
| Printer Queue | Queue (FIFO) |
| File System (Folders/Files) | Trees |
| Database Indexing | B+ Trees, Hash Tables |
| Undo/Redo in MS Word | Stack |

:::insight

:::`,

// ─────────────────────────────────────────────────────────────────
2: `# Classification of Data Structures

## ▶ Complete Classification Tree

![Data Structures Classification Tree](/DSA%20images/dimg1.png)

## ▶ 1. Primitive Data Structures

These are the basic data types directly supported by the hardware and programming language. They are the building blocks of all other data structures.

| Primitive Type | Size (bytes) | Range / Notes |
| --- | --- | --- |
| int | 4 | −2,147,483,648 to +2,147,483,647 |
| char | 1 | 0 to 255 (ASCII characters) |
| float | 4 | ±3.4 × 10⁻³⁸ to ±3.4 × 10³⁸ (6-7 decimal digits) |
| double | 8 | ±1.7 × 10⁻³⁰⁸ to ±1.7 × 10³⁰⁸ (15-16 decimal digits) |
| pointer | 4 or 8 | Stores memory address of another variable |

## ▶ 2. Non-Primitive Data Structures

These are complex data structures built from primitive types. They are classified as:

### ◆ A) Linear Data Structures

In a linear data structure, the arrangement of data is in a SEQUENTIAL manner — each element is connected to exactly one previous and one next element.
- Static Linear DS — Fixed size allocated at compile time. Example: Arrays (int arr[100])
- Dynamic Linear DS — Memory allocated and freed at runtime. Example: Linked List, Stack, Queue

\`\`\`
LINEAR:  [10] → [20] → [30] → [40] → [50]           Each element connects to exactly ONE next element
\`\`\`

### ◆ B) Non-Linear Data Structures

In a non-linear data structure, one element can be connected to MORE THAN ONE element. Elements are arranged in a hierarchical or mesh fashion.
- Tree — Hierarchical structure (Parent → Children). Example: File system, HTML DOM
- Graph — Network structure where each node can connect to any other node. Example: Social networks, road maps

![Non-Linear Tree — Each node can have multiple children](/DSA%20images/dimg2.png)

## ▶ Linear vs Non-Linear — Detailed Comparison

| Criteria | Linear DS | Non-Linear DS |
| --- | --- | --- |
| Data Arrangement | Sequential — one after another | Hierarchical or network |
| Traversal | Can traverse in single run | May need multiple runs to traverse all |
| Memory Usage | Less efficient — elements stored one by one | More efficient for complex relationships |
| Implementation | Easier to implement | More complex to implement |
| Examples | Array, Stack, Queue, Linked List | Tree, Graph, Heap, Trie |
| Time Complexity | Mostly O(n) for traversal | Varies — O(log n) to O(n²) |

## ▶ Static vs Dynamic — Detailed Comparison

| Criteria | Static DS | Dynamic DS |
| --- | --- | --- |
| Memory Allocation | At compile time (fixed size) | At runtime (flexible size) |
| Memory Wasted? | Yes — if not fully used | No — only allocates what is needed |
| Size change at runtime | Not possible | Easily possible — can grow/shrink |
| Access Speed | Faster — O(1) by index | Slower — O(n) requires traversal |
| Example | Array: int arr[100] | Linked List, Tree, Graph |
| 🎓 Remember ThisPRIMITIVE = basic built-in types (int, char, float, double, pointer)NON-PRIMITIVE = built from primitive typesLINEAR = sequential (Array, Stack, Queue, Linked List)NON-LINEAR = hierarchical/network (Tree, Graph)STATIC = fixed size at compile time (Array)DYNAMIC = flexible size at runtime (Linked List, Tree) |  |  |`,

// ─────────────────────────────────────────────────────────────────
3: `# Introduction to Algorithms

:::scenario
DefinitionAn Algorithm is a process or a set of rules required to perform calculations or some other problem-solving operations especially by a computer.It is NOT a complete program or code — it is just the logic (solution) of a problem which can be represented either as an informal description using a Flowchart or Pseudocode.An algorithm is language-independent — the same algorithm can be coded in C, Java, Python, or any other language.
:::

## ▶ Characteristics of a Good Algorithm

| Characteristic | Definition | Bad Example | Good Example |
| --- | --- | --- | --- |
| Input | Takes 0 or more inputs | No way to pass values | function add(a, b) — takes 2 inputs |
| Output | Produces 1 or more outputs | Function with no return | return sum — produces a result |
| Unambiguity | Every step is clear and simple | Vague step: 'do something' | Step 3: if a > b then print a |
| Finiteness | Terminates after finite steps | Infinite while(true) loop | Loop runs exactly n times then stops |
| Effectiveness | Each step is basic & executable | Step involving impossible math | x = a + b (basic arithmetic) |

## ▶ Algorithm Analysis — Two Levels

- Priori Analysis (Before Implementation) — Theoretical analysis done before implementing the algorithm. We calculate the approximate complexity using mathematical techniques. This is language-independent.
- Posterior Analysis (After Implementation) — Practical analysis after the algorithm is implemented using an actual programming language and run on a machine. Results depend on hardware and compiler.

## ▶ Approaches to Algorithm Design

### ◆ 1. Brute Force Algorithm

The general logic structure is applied to design the algorithm. It is also known as exhaustive search algorithm that searches all possibilities to provide the required solution. It has two types:
- Optimising — Find ALL solutions of a problem, then take out the best one. When best solution is known, it terminates.
- Sacrificing — As soon as the best solution is found, it stops immediately.

### ◆ 2. Divide and Conquer Algorithm

Breaks down the algorithm to solve the problem in different methods. It allows you to break down a problem into different methods. Valid output is produced for the valid input and this valid output is passed to some other function. Examples: Merge Sort, Quick Sort, Binary Search.

### ◆ 3. Greedy Algorithm

It is an algorithm paradigm that makes an optimal choice on each iteration with the hope of getting the best solution. It is easy to implement and has faster execution time. But there are very rare cases in which it provides the optimal solution.

### ◆ 4. Dynamic Programming

Breaks complex problems into simpler subproblems and stores results of subproblems to avoid recomputation. Uses memoisation (top-down) or tabulation (bottom-up). Examples: Fibonacci, Longest Common Subsequence.

## ▶ Algorithm Categories

| Category | Purpose | Example Algorithms |
| --- | --- | --- |
| Sort | Arrange items in a specific order | Bubble Sort, Merge Sort, Quick Sort |
| Search | Find the location of an element | Linear Search, Binary Search |
| Insert | Add a new element into the data structure | Array insert, Linked List insert |
| Delete | Remove an existing element | Array delete, BST delete |
| Update | Modify an existing element | Array update, Hash Table update |
| Graph | Traverse or process graph data | BFS, DFS, Dijkstra's, Kruskal's |

## ▶ Writing an Algorithm — Example

Problem: Find the largest of three numbers a, b, c

\`\`\`
Algorithm LARGEST(a, b, c):    Step 1: START    Step 2: Read values of a, b, c    Step 3: IF a > b AND a > c THEN               PRINT 'a is the largest'    Step 4: ELSE IF b > c THEN               PRINT 'b is the largest'    Step 5: ELSE               PRINT 'c is the largest'    Step 6: STOP
\`\`\`

## ▶ Flowchart vs Pseudocode vs Code

| Method | Description | Best For |
| --- | --- | --- |
| Flowchart | Graphical diagram using shapes (oval=start/end, rectangle=process, diamond=decision, arrow=flow) | Visual thinkers, presentations, documentation |
| Pseudocode | Structured English-like code — not tied to any language syntax | Planning before coding, algorithm design |
| Actual Code | Implementation in a real programming language like C, Python, Java | Execution, deployment, testing |

## ▶ Algorithm vs Program

| Algorithm | Program |
| --- | --- |
| Design phase — plan the logic | Implementation phase — write actual code |
| Written in any language / pseudocode | Written in a specific programming language |
| Hardware independent | Hardware dependent — may vary by machine |
| Cannot be executed directly | Can be compiled and executed on a computer |
| Focuses on WHAT to do and HOW logically | Focuses on EXACT syntax and implementation |`,

// ─────────────────────────────────────────────────────────────────
4: `# Asymptotic Analysis — Big O, Ω, Θ

:::scenario
Why Asymptotic Analysis?The time required by an algorithm comes under three types: Worst Case, Average Case, and Best Case.We need a HARDWARE-INDEPENDENT way to measure algorithm efficiency. Asymptotic analysis describes how running time or space GROWS as input size (n) grows — regardless of machine speed.We generally consider WORST-CASE complexity as it is the maximum time taken for any given input size.
:::

## ▶ Types of Cases

| Case Type | Definition | Example (Linear Search) |
| --- | --- | --- |
| Worst Case | Input for which the algorithm takes the MAXIMUM time — upper bound | Key is at the last position or not present at all |
| Average Case | Algorithm takes AVERAGE time for program execution | Key is somewhere in the middle |
| Best Case | Input for which the algorithm takes the MINIMUM time — lower bound | Key is at the very first position (index 0) |

## ▶ Algorithm Complexity — Two Dimensions

### ◆ 1. Time Complexity

Time complexity of an algorithm is the amount of time required to complete the execution. It is denoted by Big O notation.
Time complexity is mainly calculated by COUNTING THE NUMBER OF STEPS to finish the execution.

\`\`\`
// Example: Calculate sum of n numberssum = 0;              // Step 1  → O(1) — executes oncefor i = 1 to n       // Step 2  → O(n) — executes n times   sum = sum + i;     // Step 3  → O(n) — executes n timesreturn sum;           // Step 4  → O(1) — executes once// Total: O(1) + O(n) + O(n) + O(1) = O(n) — Linear Time
\`\`\`

In the above code, the time complexity of the loop statement is at least n, and if value of n increases, then time complexity also increases.

### ◆ 2. Space Complexity

Space complexity of an algorithm is the amount of space required to solve a problem and produce an output. Similar to time complexity, space complexity is also expressed in Big O notation.
Space Complexity = Auxiliary Space + Input Size
- Auxiliary Space — Extra space used by the algorithm (temp arrays, recursive call stack, etc.)
- Input Space — Memory used to store the input itself

## ▶ The Three Asymptotic Notations

### ◆ 1. Big O Notation — O (Upper Bound / Worst Case)

Big O notation measures the performance of an algorithm by simply providing the ORDER OF GROWTH of the function. This notation provides an upper bound on a function — it ensures that the function never grows faster than the upper bound.
Mathematical Definition: f(n) = O(g(n)) if there exist constants c and n₀ such that:

\`\`\`
f(n) ≤ c · g(n)  for all n ≥ n₀  Graph:
\`\`\`

![Big O — Upper Bound](/DSA%20images/dimg3.png)

### ◆ 2. Omega Notation — Ω (Lower Bound / Best Case)

Omega notation basically describes the best-case scenario, which is opposite to Big O notation. It is the formal way to represent the LOWER BOUND of an algorithm's running time. It measures the best amount of time an algorithm can possibly take to complete — best case time complexity.
Mathematical Definition: f(n) = Ω(g(n)) if there exist constants c and n₀ such that:

\`\`\`
f(n) ≥ c · g(n)  for all n ≥ n₀, where c > 0  Graph:
\`\`\`

![Big Omega — Lower Bound](/DSA%20images/dimg4.png)

### ◆ 3. Theta Notation — Θ (Tight Bound / Average Case)

The Theta notation mainly describes the average-case scenario. It represents the REALISTIC time complexity of an algorithm. Big Theta is mainly used when the value of worst case and best case is the SAME.
Condition: c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for all n ≥ n₀

\`\`\`
Graph:
\`\`\`

![Big Theta — Tight Bound (Upper + Lower)](/DSA%20images/dimg5.png)

## ▶ Common Complexities — Best to Worst

| Notation | Name | n=10 | n=100 | n=1000 | Example |
| --- | --- | --- | --- | --- | --- |
| O(1) | Constant | 1 | 1 | 1 | Array index access arr[i] |
| O(log n) | Logarithmic | 3 | 7 | 10 | Binary Search |
| O(√n) | Square Root | 3 | 10 | 31 | Jump Search |
| O(n) | Linear | 10 | 100 | 1,000 | Linear Search, traversal |
| O(n log n) | Linearithmic | 33 | 664 | 9,966 | Merge Sort, Heap Sort |
| O(n²) | Quadratic | 100 | 10,000 | 1,000,000 | Bubble Sort, nested loops |
| O(n³) | Cubic | 1,000 | 1,000,000 | 10⁹ | Naive Matrix Multiply |
| O(2ⁿ) | Exponential | 1,024 | 1.27×10³⁰ | 10³⁰¹ | Recursive Fibonacci |
| O(n!) | Factorial | 3,628,800 | ≈9.3×10¹⁵⁷ | Astronomical | Permutations |

## ▶ Rules for Calculating Big O

1. Drop constant multipliers — O(2n) simplifies to O(n), O(5n²) simplifies to O(n²)
2. Drop lower-order terms — O(n² + n + 1) simplifies to O(n²) since n² dominates
3. Nested loops MULTIPLY — two nested loops each of size n give O(n × n) = O(n²)
4. Sequential blocks ADD — O(n) followed by O(n²) gives O(n + n²) = O(n²)
5. Logarithms — If loop halves each iteration (i = i*2), it is O(log n)

## ▶ Worked Examples

\`\`\`
// Example 1 — O(1) constant timeint getFirst(int arr[]) {  return arr[0];  // just 1 operation regardless of array size}// Example 2 — O(n) linear timeint sum(int arr[], int n) {  int total = 0;  for(int i=0; i<n; i++)  // runs n times    total += arr[i];  return total;}// Example 3 — O(n²) quadratic (nested loops)void printPairs(int arr[], int n) {  for(int i=0; i<n; i++)       // outer loop: n times    for(int j=0; j<n; j++)     // inner loop: n times per outer      printf('%d %d\\n', arr[i], arr[j]);}  // Total: n × n = n² operations// Example 4 — O(log n) logarithmicint binarySearch(int arr[], int n, int key) {  int low=0, high=n-1;  while(low <= high) {    int mid = (low+high)/2;    if(arr[mid]==key) return mid;    if(arr[mid]<key) low=mid+1;  // HALVES the search space    else high=mid-1;             // each iteration halves → O(log n)  }  return -1;}
\`\`\``,

// ─────────────────────────────────────────────────────────────────
5: `# DS — Pointers

:::scenario
What is a Pointer?A Pointer is a variable that STORES THE MEMORY ADDRESS of another variable. Instead of holding a data value directly, it holds the location (address) where data lives in memory.Every variable in a program is stored at a specific memory address. Pointers let us directly access and manipulate that memory.
:::

## ▶ Memory and Addresses — How It Works

\`\`\`
Variable:    int a = 5;  Memory:  Address | Value           --------|-------           1000    |  5     ← variable a stored here           1004    |  ...   ← next memory location  Pointer:  int *b = &a;  (b stores address 1000)  Memory:  Address | Value           --------|-------           1000    |  5     ← a lives here           2000    |  1000  ← b (pointer) stores address of a
\`\`\`

## ▶ Key Pointer Operators

| Operator | Name | Usage | Example |
| --- | --- | --- | --- |
| & | Address-of | Gets the memory address of a variable | &a — gives address of variable a |
| * | Dereference | Accesses the value at the address stored in pointer | *b — gives value at address stored in b |

## ▶ Pointer Declaration & Usage — Complete Example

\`\`\`
#include <stdio.h>int main() {  int a = 5;          // normal integer variable  int *b = &a;        // pointer b stores address of a  int **c = &b;       // double pointer — stores address of pointer b  printf('Value of a = %d\\n', a);               // 5  printf('Address of a = %u\\n', &a);            // 2831685116 (example)  printf('b = address of a = %u\\n', b);         // 2831685116  printf('*b = value at address in b = %d\\n',*b);// 5  printf('c = address of b = %u\\n', c);         // 2831685120  printf('**c = value via double pointer = %d\\n',**c); // 5  return 0;}OUTPUT:  Value of a = 5  Address of a (stored in b) = 2831685116  Value of b = address of a = 2831685116  *b = value at address = 5  c = address of b = 2831685120  **c = value via double pointer = 5
\`\`\`

## ▶ Types of Pointers

| Pointer Type | Definition | Example |
| --- | --- | --- |
| NULL Pointer | Points to nothing — safer than uninitialized | int *p = NULL; |
| Wild Pointer | Uninitialized — points to random location — DANGEROUS | int *p; (without =NULL) |
| Void Pointer | Generic pointer — can point to any data type | void *p; |
| Double Pointer | Pointer to a pointer — stores address of a pointer | int **p = &ptr; |
| Dangling Pointer | Points to freed/deleted memory — causes crashes | free(p); then use p → undefined |
| Constant Pointer | Pointer address cannot change, but value can | int * const p = &a; |

## ▶ Pointer Arithmetic

\`\`\`
int arr[] = {10, 20, 30, 40, 50};int *ptr = arr;  // ptr points to arr[0] — address say 1000ptr++;           // ptr now points to arr[1] — address 1004 (int=4 bytes)ptr+2;           // points to arr[3] — address 1012*(ptr+1);        // value at arr[1] = 20// Pointer subtraction gives number of elements between themint *p1 = &arr[0];  // address 1000int *p2 = &arr[4];  // address 1016printf('%d', p2-p1); // prints 4 (not 16 — gives element count)
\`\`\`

## ▶ Why Pointers Matter in DSA

- Linked Lists — each node contains a pointer to the next node — fundamental to the structure
- Trees & Graphs — parent/child and vertex/edge relationships implemented via pointers
- Dynamic Memory — malloc() and free() rely entirely on pointers
- Pass by Reference — functions can modify original values using pointers (not just copies)
- Arrays — array name itself is a pointer to the first element
- Function Pointers — store and call functions dynamically`,

// ─────────────────────────────────────────────────────────────────
6: `# DS — Structures

:::scenario
What is a Structure?A Structure (struct) is a user-defined composite data type that defines a GROUPED LIST OF VARIABLES placed under one name in a block of memory.Think of it as a custom 'blueprint' or 'template' — like a form with multiple fields of different types all belonging to one entity.Unlike an array (same type only), a structure can hold variables of DIFFERENT data types.
:::

## ▶ Declaring a Structure — Syntax

\`\`\`
struct structure_name {  data_type member1;  data_type member2;  data_type member3;  ...};// Example — Student structurestruct Student {  int roll_no;         // integer member  char name[50];       // character array member  float marks;         // float member  char address[100];   // another character array};
\`\`\`

## ▶ Using a Structure — Creating and Accessing

\`\`\`
#include <stdio.h>#include <string.h>struct Employee {  int id;  char name[50];  float salary;  int mobile;};int main() {  struct Employee e1;        // create structure variable e1  e1.id = 101;               // access using DOT operator  e1.salary = 55000.0;  strcpy(e1.name, 'Alice');  e1.mobile = 9876543210;  printf('ID     : %d\\n', e1.id);  printf('Name   : %s\\n', e1.name);  printf('Salary : %.2f\\n', e1.salary);  return 0;}OUTPUT:  ID     : 101  Name   : Alice  Salary : 55000.00
\`\`\`

## ▶ Pointer to Structure — Arrow Operator

\`\`\`
struct Employee e1 = {101, 'Bob', 60000.0, 9876543210};struct Employee *ptr = &e1;  // pointer to structure// Two ways to access via pointer:printf('%d', (*ptr).id);    // method 1: dereference then dotprintf('%d', ptr->id);      // method 2: ARROW operator → (preferred)printf('%s', ptr->name);    // arrow operator is cleaner
\`\`\`

## ▶ Nested Structures

A structure can contain another structure as a member — called a nested structure.

\`\`\`
struct Address {  char city[30];  char state[30];  int pincode;};struct Employee {  int id;  char name[50];  float salary;  struct Address addr;   // ← nested structure};// Accessing nested structure members:struct Employee emp;emp.id = 101;strcpy(emp.addr.city, 'Hyderabad');emp.addr.pincode = 500001;
\`\`\`

## ▶ Array of Structures

\`\`\`
struct Student students[3];  // array of 3 Student structures// Storing datastudents[0].roll_no = 1;  strcpy(students[0].name, 'Ravi');students[1].roll_no = 2;  strcpy(students[1].name, 'Priya');students[2].roll_no = 3;  strcpy(students[2].name, 'Arjun');// Displaying all studentsfor(int i=0; i<3; i++)  printf('Roll: %d, Name: %s\\n', students[i].roll_no, students[i].name);
\`\`\`

## ▶ Advantages of Structures

- Can hold variables of DIFFERENT data types (unlike arrays)
- We can create objects containing different types of attributes
- It allows us to re-use the data layout across programs
- It is used to implement other data structures like Linked List, Queues, Trees, and Graphs

## ▶ Structure vs Array — Comparison

| Structure | Array |
| --- | --- |
| Stores DIFFERENT data types (int, char, float together) | Stores SAME data type only |
| Access via member name: s.name, s.marks | Access via index: arr[0], arr[1] |
| struct keyword is required | No special keyword needed |
| Used for records (Student, Employee, Book) | Used for collections of same type |
| Each member has a unique name | Elements identified by index number |
| 💡 Foundation of DSAStructures are the building blocks of complex data structures. A Linked List NODE is a struct with data + pointer. A Tree NODE is a struct with data + left pointer + right pointer. A Graph uses structs for vertices and edges. Master structs before moving to these! |  |`,

// ─────────────────────────────────────────────────────────────────
7: `# DS — Arrays

:::scenario
What is an Array?An Array is a collection of elements of the SAME DATA TYPE stored in CONTIGUOUS (adjacent) memory locations. Elements are accessed using an index number starting from 0.Arrays are the simplest and most widely used data structure. They form the backbone of more complex data structures like stacks, queues, and heaps.
:::

## ▶ Memory Layout of an Array

If int arr[5] = {10, 20, 30, 40, 50} and base address = 1000 (each int = 4 bytes):

\`\`\`
Address Formula: Address of arr[i] = Base + (i × Size_of_element)  Address of arr[3] = 1000 + (3 × 4) = 1012
\`\`\`

![Array Visualization — Contiguous Memory](/Gifs/dv1.gif)

## ▶ Three Types of Array Indexing

| Indexing Type | First Element | Last Element (size=5) | Used In |
| --- | --- | --- | --- |
| 0-Based Indexing | arr[0] | arr[4] | C, C++, Java, Python, JavaScript |
| 1-Based Indexing | arr[1] | arr[5] | Fortran, Lua, R, some math notation |
| -1-Based Indexing | arr[-n+1] | arr[0] | Python negative indexing (arr[-1]=last) |

## ▶ Array Declaration and Initialization

\`\`\`
// Declaration only — garbage valuesint arr[5];// Declaration + initializationint arr[5] = {10, 20, 30, 40, 50};// Partial initialization — rest filled with 0int arr[5] = {10, 20};   // {10, 20, 0, 0, 0}// Size inferred from valuesint arr[] = {10, 20, 30}; // size automatically = 3// 2D Array declarationint matrix[3][4];         // 3 rows, 4 columnsint matrix[2][3] = {{1,2,3},{4,5,6}};
\`\`\`

## ▶ Array Operations with Code

### ◆ Traversal — Visit Each Element

\`\`\`
int arr[5] = {10, 20, 30, 40, 50};int n = 5;for(int i = 0; i < n; i++)  printf('%d ', arr[i]);// Output: 10 20 30 40 50// Time Complexity: O(n)
\`\`\`

### ◆ Insertion — Add Element at Position

\`\`\`
// Insert value 99 at position pos=2 (shift right first)int arr[10] = {10, 20, 30, 40, 50};int n=5, pos=2, val=99;for(int i = n-1; i >= pos; i--)  // shift elements right  arr[i+1] = arr[i];arr[pos] = val;  // place new valuen++;// Before: {10, 20, 30, 40, 50}// After:  {10, 20, 99, 30, 40, 50}// Time: O(n) — worst case shift all elements
\`\`\`

### ◆ Deletion — Remove Element at Position

\`\`\`
// Delete element at position pos=2int arr[5] = {10, 20, 30, 40, 50};int n=5, pos=2;for(int i = pos; i < n-1; i++)  // shift elements left  arr[i] = arr[i+1];n--;// Before: {10, 20, 30, 40, 50}// After:  {10, 20, 40, 50}// Time: O(n) — worst case shift all elements
\`\`\`

### ◆ Search — Find an Element

\`\`\`
// Linear Search — works on any arrayint linearSearch(int arr[], int n, int key) {  for(int i=0; i<n; i++)    if(arr[i] == key) return i;  // found at index i  return -1;  // not found}// Time Complexity: O(n)// Binary Search — requires SORTED arrayint binarySearch(int arr[], int n, int key) {  int low=0, high=n-1;  while(low<=high) {    int mid = low + (high-low)/2;    if(arr[mid]==key) return mid;    else if(arr[mid]<key) low=mid+1;    else high=mid-1;  }  return -1;}// Time Complexity: O(log n)
\`\`\`

## ▶ Array Complexity Summary

| Operation | Best Case | Average Case | Worst Case | Notes |
| --- | --- | --- | --- | --- |
| Access by index | O(1) | O(1) | O(1) | Formula: Base + i×size |
| Search (Linear) | O(1) | O(n) | O(n) | Key at start vs end |
| Search (Binary) | O(1) | O(log n) | O(log n) | Array must be sorted |
| Insert at beginning | O(n) | O(n) | O(n) | Shift all elements right |
| Insert at end | O(1) | O(1) | O(1) | If space available |
| Insert in middle | O(n) | O(n) | O(n) | Shift half elements |
| Delete at beginning | O(n) | O(n) | O(n) | Shift all elements left |
| Delete at end | O(1) | O(1) | O(1) | Just decrease size |
| Delete in middle | O(n) | O(n) | O(n) | Shift half elements |

## ▶ Space Complexity of Array

Space Complexity for worst case is O(n) — where n is the number of elements stored.

## ▶ Advantages vs Disadvantages

| Advantages | Disadvantages |
| --- | --- |
| O(1) random access by index — very fast | Fixed size — cannot grow or shrink at runtime |
| Cache-friendly — contiguous memory layout | Insertion & deletion are O(n) — slow |
| Simple to declare and use | Memory wastage if array is not fully used |
| Good for storing same-type elements together | Size must be declared in advance |

## ▶ Types of Arrays

| Type | Declaration | Description |
| --- | --- | --- |
| 1D Array | int arr[n] | Single row of n elements — most common |
| 2D Array | int mat[r][c] | r rows × c columns — used for matrices |
| 3D Array | int cube[l][r][c] | Three dimensions — used for 3D grids |
| Jagged Array | int *arr[n] | Array of pointers — rows of different lengths |`,

// ─────────────────────────────────────────────────────────────────
8: `# DS — Linked List

:::scenario
Why Do We Need a Linked List?Limitation of Arrays: If we declare an array of size 3, we can only store 3 values (stored contiguously). Total memory used = 3 × 4 = 12 bytes.Drawbacks: (1) Cannot insert more than 3 elements. (2) Memory wastage if array is not full. (3) Fixed size at compile time — no flexibility.SOLUTION: Linked List — elements are NOT stored contiguously. Each node stores its data and a pointer to the next node. Size can grow/shrink dynamically at runtime.
:::

## ▶ What is a Linked List?

A Linked List is a collection of elements (nodes) where:
- Each element is called a NODE
- Each node has TWO parts: (1) DATA part — stores actual value, (2) NEXT part — pointer to next node
- Elements are NOT stored in contiguous memory — they can be anywhere in memory
- The pointer that holds the address of the initial/first node is called the HEAD pointer
- The last node's next pointer points to NULL — indicating end of list

\`\`\`
Linked List: 10 → 15 → 5 → 20 → NULL
\`\`\`

![Linked List — Node Structure and Chain](/Gifs/dv2.mp4)

## ▶ Node Declaration in C

\`\`\`
struct Node {  int data;              // DATA part — stores the value  struct Node *next;     // NEXT part — pointer to next node};// Creating a node dynamicallystruct Node *head, *ptr;ptr = (struct Node*) malloc(sizeof(struct Node));ptr->data = 10;ptr->next = NULL;head = ptr;  // first node becomes head
\`\`\`

## ▶ Types of Linked Lists

| Type | Description | Diagram |
| --- | --- | --- |
| Singly Linked List | Each node has data + ONE pointer (next). Can only traverse FORWARD. | HEAD → [data/next] → [data/next] → NULL |
| Doubly Linked List | Each node has data + TWO pointers (prev + next). Can traverse BOTH directions. | NULL ← [prev/data/next] ↔ [prev/data/next] → NULL |
| Circular Linked List | Last node's next points BACK to HEAD — forms a circle. No NULL at end. | HEAD → [data/next] → [data/next] → HEAD |
| Circular Doubly LL | Combination of Doubly + Circular. Most complex but most flexible. | HEAD ↔ [prev/data/next] ↔ [prev/data/next] ↔ HEAD |

## ▶ Operations on Singly Linked List

### ◆ 1. Node Creation

\`\`\`
struct Node* createNode(int value) {  struct Node* newNode = (struct Node*) malloc(sizeof(struct Node));  newNode->data = value;  newNode->next = NULL;  return newNode;}
\`\`\`

### ◆ 2. Insertion

\`\`\`
// (i) Insertion at BEGINNING — O(1)void insertAtBeginning(struct Node **head, int value) {  struct Node* newNode = createNode(value);  newNode->next = *head;  // new node points to old head  *head = newNode;        // head now points to new node}// (ii) Insertion at END — O(n)void insertAtEnd(struct Node **head, int value) {  struct Node* newNode = createNode(value);  if(*head == NULL) { *head = newNode; return; }  struct Node* temp = *head;  while(temp->next != NULL)  // traverse to last node    temp = temp->next;  temp->next = newNode;  // last node points to new node}// (iii) Insertion after specified node — O(n) to find positionvoid insertAfter(struct Node* prevNode, int value) {  if(prevNode == NULL) return;  struct Node* newNode = createNode(value);  newNode->next = prevNode->next;  // new node → old next  prevNode->next = newNode;        // prev → new node}
\`\`\`

### ◆ 3. Deletion

\`\`\`
// (i) Deletion at BEGINNING — O(1)void deleteAtBeginning(struct Node **head) {  if(*head == NULL) return;  struct Node* temp = *head;  *head = (*head)->next;  // head moves to second node  free(temp);             // free old head memory}// (ii) Deletion at END — O(n)void deleteAtEnd(struct Node **head) {  if(*head == NULL) return;  if((*head)->next == NULL) { free(*head); *head=NULL; return; }  struct Node* temp = *head;  while(temp->next->next != NULL)  // go to second-last    temp = temp->next;  free(temp->next);    // free last node  temp->next = NULL;   // second-last becomes last}
\`\`\`

### ◆ 4. Traversal — Print All Nodes

\`\`\`
void traverse(struct Node* head) {  struct Node* temp = head;  printf('HEAD → ');  while(temp != NULL) {    printf('[%d] → ', temp->data);    temp = temp->next;  }  printf('NULL\\n');}
\`\`\`

### ◆ 5. Searching — Find a Value

\`\`\`
int search(struct Node* head, int key) {  struct Node* temp = head;  int pos = 0;  while(temp != NULL) {    if(temp->data == key) return pos;  // found!    temp = temp->next;    pos++;  }  return -1;  // not found}
\`\`\`

## ▶ Operations on Doubly Linked List

A doubly linked list node has THREE fields: prev pointer, data, next pointer.

\`\`\`
struct Node {  struct Node *prev;   // pointer to previous node  int data;  struct Node *next;   // pointer to next node};// Insertion at Beginning — O(1)void insertAtBeginning(struct Node **head, int value) {  struct Node* newNode = malloc(sizeof(struct Node));  newNode->data = value;  newNode->prev = NULL;  newNode->next = *head;  if(*head != NULL) (*head)->prev = newNode;  *head = newNode;}// Insertion at End — O(n)void insertAtEnd(struct Node **head, int value) {  struct Node* newNode = malloc(sizeof(struct Node));  newNode->data = value;  newNode->next = NULL;  if(*head == NULL) { newNode->prev = NULL; *head = newNode; return; }  struct Node* temp = *head;  while(temp->next != NULL) temp = temp->next;  temp->next = newNode;  newNode->prev = temp;}
\`\`\`

## ▶ Complexity Analysis

| Operation | Singly LL | Doubly LL | Notes |
| --- | --- | --- | --- |
| Access by index | O(n) | O(n) | Must traverse from head |
| Search | O(n) | O(n) | Linear scan required |
| Insert at Head | O(1) | O(1) | Just update head pointer |
| Insert at Tail | O(n) | O(1)* | *O(1) only if tail pointer maintained |
| Delete at Head | O(1) | O(1) | Update head pointer |
| Delete at Tail | O(n) | O(1)* | *O(1) only if tail pointer maintained |
| Delete middle node | O(n) | O(1)* | *O(1) if pointer to node is known |
| Space per node | O(1) extra | O(1) extra (but +4/8 bytes for prev ptr) |  |

## ▶ Array vs Linked List — Which to Choose?

| Criteria | Array | Linked List |
| --- | --- | --- |
| Memory allocation | Contiguous — all together | Non-contiguous — scattered |
| Size flexibility | Fixed at compile time | Dynamic — grows/shrinks at runtime |
| Random access | O(1) — very fast by index | O(n) — must traverse from head |
| Insert at beginning | O(n) — shift all elements | O(1) — just update pointers |
| Insert at end | O(1) if space; O(n) if resize | O(n) singly; O(1) with tail ptr |
| Cache performance | Excellent — contiguous memory | Poor — scattered memory |
| Extra memory | No overhead | +4/8 bytes per node for pointer |
| Best used when | Frequent access by index, fixed data size | Frequent insert/delete, unknown size |`,

// ─────────────────────────────────────────────────────────────────
9: `# DS — Skip List

:::scenario
What is a Skip List?A Skip List is a probabilistic data structure built on top of a SORTED Linked List. It adds multiple levels of 'express lanes' with fewer elements — allowing O(log n) average search instead of O(n).Think of it like a city bus system: a slow bus stops everywhere, an express bus only stops at major stops. You ride the express as far as possible, then transfer to the slow bus.Skip Lists are an alternative to balanced BSTs (AVL, Red-Black Trees) — simpler to implement with similar average performance.
:::

## ▶ Skip List Structure — Visual

\`\`\`
Searching for 35:  L3: Start at -∞ → 30 (30 < 35, go right) → +∞ (too far, drop to L2)  L2: At 30 → 50 (50 > 35, drop to L1)  L1: At 30 → 35 → FOUND! ✓  Only 4 comparisons instead of scanning all 11 elements!
\`\`\`

![Skip List Search — Express Lanes](/DSA%20images/dimg8.png)

## ▶ Key Properties of Skip List

- The BOTTOM LEVEL (Level 1) is a complete sorted linked list containing ALL elements
- HIGHER LEVELS have a subset of elements — each element is included with probability p (usually 0.5)
- Search starts at the TOP level and drops down when it overshoots the target
- Each node can have multiple forward pointers — one for each level it appears in
- The maximum level is usually log(n) — balances space and performance

## ▶ Skip List Node Structure

\`\`\`
#define MAX_LEVEL 6struct SkipNode {  int key;  struct SkipNode *forward[MAX_LEVEL]; // array of forward pointers};struct SkipList {  int level;            // current maximum level  struct SkipNode *header; // header node (−∞)};
\`\`\`

## ▶ Skip List Search Algorithm

\`\`\`
struct SkipNode* search(struct SkipList *list, int key) {  struct SkipNode *curr = list->header;  // Start from highest level, work down  for(int i = list->level-1; i >= 0; i--) {    while(curr->forward[i] && curr->forward[i]->key < key)      curr = curr->forward[i];  // move right at current level    // Drop down to next level when overshoot  }  curr = curr->forward[0];  // move to actual node  if(curr && curr->key == key)    return curr;  // FOUND  return NULL;    // NOT FOUND}
\`\`\`

## ▶ Complexity Analysis

| Operation | Average Case | Worst Case | Space |
| --- | --- | --- | --- |
| Search | O(log n) | O(n) | — |
| Insert | O(log n) | O(n) | O(1) per node |
| Delete | O(log n) | O(n) | — |
| Space Total | — | — | O(n log n) expected |

## ▶ Advantages vs Disadvantages

| Advantages | Disadvantages |
| --- | --- |
| O(log n) average search — fast | Worst case is O(n) — bad luck with randomness |
| Simpler to implement than balanced BSTs | Uses more memory than simple linked list |
| Dynamic — easy insert/delete | Performance not deterministic — probabilistic |
| Good cache performance | Not guaranteed O(log n) like AVL trees |`,

// ─────────────────────────────────────────────────────────────────
10: `# DS — Stack

:::scenario
What is a Stack?A Stack is a linear data structure that follows the LIFO principle — LAST IN, FIRST OUT.The element inserted LAST is the first to be REMOVED. Think of a stack of plates — you always add and remove from the TOP.Real-life example: Undo button (Ctrl+Z) — the last action done is the first to be undone.
:::

## ▶ Stack — Visual Diagram

\`\`\`
Stack (max size=4):
\`\`\`

![Stack Operations — PUSH and POP](/Gifs/dv3.gif)

## ▶ Stack Operations — All 5

| Operation | Description | Time Complexity | Condition to Check |
| --- | --- | --- | --- |
| push(x) | Insert element x at the TOP of stack | O(1) | Check for OVERFLOW (stack full) |
| pop() | Remove and return TOP element | O(1) | Check for UNDERFLOW (stack empty) |
| peek() / top() | View TOP element WITHOUT removing | O(1) | Check stack is not empty |
| isEmpty() | Returns TRUE if stack has no elements | O(1) | top == -1 |
| isFull() | Returns TRUE if stack cannot accept more | O(1) | top == MAX-1 |

## ▶ Push Operation Algorithm

\`\`\`
Algorithm PUSH(stack, top, MAX, item):    BEGIN      if top = MAX then STACK OVERFLOW, EXIT      top = top + 1      stack[top] = item    END  Time Complexity: O(1)
\`\`\`

## ▶ Pop Operation Algorithm

\`\`\`
Algorithm POP(stack, top):    BEGIN      if top = 0 then STACK UNDERFLOW, EXIT      item = stack[top]      top = top - 1    END  Time Complexity: O(1)
\`\`\`

## ▶ Array-Based Stack Implementation in C

\`\`\`
#include <stdio.h>#define MAX 5int stack[MAX];int top = -1;// Push element onto stackvoid push(int item) {  if(top == MAX-1) {    printf('Stack Overflow! Cannot push %d\\n', item);    return;  }  stack[++top] = item;  printf('%d pushed to stack\\n', item);}// Pop element from stackint pop() {  if(top == -1) {    printf('Stack Underflow! Stack is empty\\n');    return -1;  }  return stack[top--];}// Peek at top without removingint peek() {  if(top == -1) { printf('Stack is empty\\n'); return -1; }  return stack[top];}int isEmpty() { return top == -1; }int isFull()  { return top == MAX-1; }int main() {  push(10);  push(20);  push(30);  printf('Top = %d\\n', peek());   // 30  printf('Popped = %d\\n', pop()); // 30  printf('Top = %d\\n', peek());   // 20  return 0;}
\`\`\`

## ▶ Linked List-Based Stack (Dynamic)

\`\`\`
struct StackNode {  int data;  struct StackNode* next;};struct StackNode* top = NULL;void push(int item) {  struct StackNode* newNode = malloc(sizeof(struct StackNode));  newNode->data = item;  newNode->next = top;  // new node points to old top  top = newNode;        // top now points to new node}int pop() {  if(top == NULL) return -1;  int val = top->data;  struct StackNode* temp = top;  top = top->next;  free(temp);  return val;}
\`\`\`

## ▶ Applications of Stack

### ◆ 1. Recursion — Function Call Stack

When a function calls itself (or another function), the compiler creates a SYSTEM STACK. All previous records of the function are maintained in the stack. When recursion unwinds, values are popped from the stack.

\`\`\`
// Factorial using recursion — uses system stackint factorial(int n) {  if(n == 0) return 1;         // base case — stack unwinds here  return n * factorial(n-1);   // each call pushed onto stack}// factorial(4) stack: [4, [3, [2, [1, [0→1]]]]]// Unwinds: 1→1→2→6→24
\`\`\`

### ◆ 2. Expression Evaluation

Stack is used to convert and evaluate arithmetic expressions:

| Expression Type | Example | Stack Role |
| --- | --- | --- |
| Infix (human readable) | (A + B) * C | Needs operator precedence and parentheses |
| Prefix (Polish Notation) | * + A B C | Evaluated right to left by computer |
| Postfix (Reverse Polish) | A B + C * | Evaluated left to right using stack — most efficient for computers |

### ◆ 3. Parenthesis Matching

\`\`\`
// Check if parentheses are balancedint isBalanced(char* expr) {  int stack[100]; int top = -1;  for(int i=0; expr[i]; i++) {    if(expr[i]=='(' || expr[i]=='[' || expr[i]=='{')      stack[++top] = expr[i];  // push opening bracket    else if(expr[i]==')' || expr[i]==']' || expr[i]=='}') {      if(top==-1) return 0;  // no matching opening      top--;                  // pop matching opening    }  }  return top == -1;  // balanced if stack is empty}// '({[]})' → balanced ✓// '({[}])' → NOT balanced ✗
\`\`\`

### ◆ 4. DFS (Depth First Search)

Graph traversal using DFS uses a stack to keep track of nodes to visit. When we can't go deeper, we backtrack by popping from the stack.

### ◆ 5. Backtracking — Maze Solving

If we have to create a path to solve a maze, if we are moving in a particular path and we realise we came the wrong way — we use the stack to come back to the beginning of the path to create a new path.

## ▶ Stack Complexity Summary

| Operation | Time Complexity | Space Complexity |
| --- | --- | --- |
| push(x) | O(1) | O(1) |
| pop() | O(1) | O(1) |
| peek() | O(1) | O(1) |
| isEmpty() | O(1) | O(1) |
| Traversal (print all) | O(n) | O(1) |
| Total Space (n elements) | — | O(n) |`,

// ─────────────────────────────────────────────────────────────────
11: `# DS — Queue

:::scenario
What is a Queue?A Queue is a linear data structure that can be defined as an ORDERED LIST which enables insert operations at one end called REAR and delete operations at another end called FRONT.Queue is referred to as FIRST IN FIRST OUT (FIFO) list — the element inserted first is the first to be removed.Real-life example: People standing in a queue/line — the first person to join the queue gets served first.
:::

## ▶ Queue — Visual Diagram

\`\`\`
After Dequeue(10):  FRONT=[20], REAR=[50]  After Enqueue(60):  FRONT=[20], REAR=[60]
\`\`\`

![Queue Operations — Enqueue and Dequeue](/DSA%20images/dimg10.png)

## ▶ Queue Operations

| Operation | Description | Time | Condition |
| --- | --- | --- | --- |
| enqueue(x) | Insert element x at the REAR of the queue | O(1) | Check OVERFLOW (queue full) |
| dequeue() | Remove and return element from FRONT | O(1) | Check UNDERFLOW (queue empty) |
| peek() / front() | View FRONT element without removing | O(1) | Check queue not empty |
| isEmpty() | TRUE if queue has no elements | O(1) | front == -1 |
| isFull() | TRUE if queue cannot accept more | O(1) | rear == MAX-1 |

## ▶ Queue Implementation — Array-Based

\`\`\`
#include <stdio.h>#define MAX 5int queue[MAX];int front = -1, rear = -1;// Enqueue — insert at rearvoid enqueue(int item) {  if(rear == MAX-1) { printf('Queue Overflow!\\n'); return; }  if(front == -1) front = 0;  // first element — set front  queue[++rear] = item;  printf('%d enqueued\\n', item);}// Dequeue — remove from frontint dequeue() {  if(front == -1 || front > rear) {    printf('Queue Underflow!\\n'); return -1;  }  int item = queue[front++];  if(front > rear) front = rear = -1;  // reset when empty  return item;}int peek() { return (front == -1) ? -1 : queue[front]; }int isEmpty() { return front == -1; }int main() {  enqueue(10); enqueue(20); enqueue(30);  printf('Front = %d\\n', peek());      // 10  printf('Dequeued = %d\\n', dequeue()); // 10  printf('Front = %d\\n', peek());      // 20  return 0;}
\`\`\`

## ▶ Queue Complexity Table

|  | Access | Search | Insertion | Deletion | Space |
| --- | --- | --- | --- | --- | --- |
| Average Case | O(n) | O(n) | O(1) | O(1) | O(n) |
| Worst Case | O(n) | O(n) | O(1) | O(1) | O(n) |

## ▶ Types of Queues

### ◆ 1. Simple Queue (Linear Queue)

The basic FIFO structure described above. Problem: Once rear reaches MAX, no new element can be inserted even if front has moved (wasted space at beginning).

![Linear Queue — False Overflow Problem](/DSA%20images/dimg11.png)

### ◆ 2. Circular Queue — Solves the Wasted Space Problem

In a circular queue, the REAR connects back to the FRONT when it reaches the end — forming a circle. This reuses empty slots.

\`\`\`
// Circular Queue — enqueuevoid enqueue(int item) {  if((rear+1) % MAX == front) { printf('Full!'); return; }  if(front == -1) front = 0;  rear = (rear + 1) % MAX;  // wrap around using modulo  queue[rear] = item;}// Circular Queue — dequeueint dequeue() {  if(front == -1) { printf('Empty!'); return -1; }  int item = queue[front];  if(front == rear) front = rear = -1;  // last element  else front = (front + 1) % MAX;       // wrap around  return item;}
\`\`\`

### ◆ 3. Double-Ended Queue (Deque)

A deque allows insert and delete operations at BOTH ends (front and rear). It is a generalization of both queue and stack.
- Input-restricted Deque — Insertion allowed only at rear, deletion from both ends
- Output-restricted Deque — Deletion allowed only at front, insertion from both ends

### ◆ 4. Priority Queue

Elements are served based on PRIORITY rather than their order of arrival. Higher priority elements are dequeued first regardless of when they arrived.
- Min Priority Queue — element with SMALLEST value has highest priority (like hospital emergency)
- Max Priority Queue — element with LARGEST value has highest priority
- Implemented using a Heap data structure — O(log n) for insert and delete

## ▶ Queue Applications

| Application | How Queue is Used |
| --- | --- |
| CPU Scheduling (FCFS) | Processes wait in queue — first to arrive is first to execute |
| Printer Queue | Print jobs queued — first submitted is first printed |
| Web Server Requests | HTTP requests processed in order of arrival |
| BFS Graph Traversal | Nodes to visit stored in queue — processed level by level |
| Keyboard Buffer | Characters typed stored in queue — displayed in order |
| Customer Service | Customers served in order they arrive (first come first served) |
| Data Streaming | Buffering video/audio data while streaming |

## ▶ Stack vs Queue — Final Comparison

| Criteria | Stack | Queue |
| --- | --- | --- |
| Principle | LIFO — Last In First Out | FIFO — First In First Out |
| Insert operation | push() — at TOP | enqueue() — at REAR |
| Delete operation | pop() — from TOP | dequeue() — from FRONT |
| Pointer needed | One (top) | Two (front and rear) |
| Real-life example | Stack of plates, Undo/Redo | Queue at ticket counter, Printer |
| DS Applications | Recursion, DFS, Expression eval | BFS, CPU scheduling, Printer queue |`,

// ─────────────────────────────────────────────────────────────────
12: `# DS — Trees

:::scenario
What is a Tree?We have read data structures like Array, Linked List, Stack, and Queue — in all of them, elements are arranged in a SEQUENTIAL manner.A Tree is a NON-LINEAR data structure because it does not store data in a sequential manner. It is a HIERARCHICAL structure as elements in a tree are arranged at multiple levels.Definition: A Tree is a collection of objects or entities known as NODES that are linked together to represent or simulate hierarchy.In tree data structure, the topmost node is called the ROOT node. Each node contains some data and links (references) to other nodes that can be called its CHILDREN.
:::

## ▶ Tree Structure — Visual Diagram

![Tree Structure — Levels, Leaf Nodes, Edges](/DSA%20images/dimg12.png)

## ▶ Key Tree Terminology

| Term | Definition | Example from diagram above |
| --- | --- | --- |
| Root | Topmost node — has NO parent | Node 1 |
| Node | Any element in the tree that stores data | All nodes 1–8 |
| Edge | Link/connection between parent and child | The line connecting 1 and 2 |
| Leaf Node | Node with NO children — terminal node | Nodes 5, 6, 7, 8 |
| Parent | Node that has one or more children | Node 2 is parent of 4 and 5 |
| Child | Node that has a parent | Nodes 2 and 3 are children of 1 |
| Sibling | Nodes sharing the same parent | Nodes 4 and 5 are siblings |
| Subtree | A node and all its descendants | Node 2 with 4, 5, 8 is a subtree |
| Height of Node | Longest path from node to a leaf | Height of node 2 = 2 (2→4→8) |
| Height of Tree | Longest path from root to any leaf | Height = 3 (1→2→4→8) |
| Depth of Node | Distance from root to that node | Depth of node 4 = 2 |
| Degree | Number of children of a node | Degree of node 1 = 2; leaf = 0 |
| Level | Root is at Level 0; children at Level 1, etc. | Node 8 is at Level 3 |

## ▶ Binary Tree — The Most Important Tree

\`\`\`
Binary Tree DefinitionA Binary Tree is a tree where EVERY NODE has at most TWO children — called the LEFT child and the RIGHT child. A node can have 0, 1, or 2 children, but not more than 2.
\`\`\`

\`\`\`
// Binary Tree Node Structure in Cstruct TreeNode {  int data;  struct TreeNode *left;   // pointer to left child  struct TreeNode *right;  // pointer to right child};// Creating a nodestruct TreeNode* createNode(int value) {  struct TreeNode* node = malloc(sizeof(struct TreeNode));  node->data = value;  node->left = NULL;  node->right = NULL;  return node;}
\`\`\`

## ▶ Types of Binary Trees

| Type | Definition | Example |
| --- | --- | --- |
| Full Binary Tree | Every node has EITHER 0 OR 2 children (never 1) | Used in Huffman Coding |
| Complete Binary Tree | All levels completely filled EXCEPT possibly last; last level filled left to right | Used in Heap data structure |
| Perfect Binary Tree | ALL internal nodes have exactly 2 children AND all leaves are at same level | Used in symmetry-based algorithms |
| Balanced Binary Tree | Height of left and right subtrees differs by at most 1 for ALL nodes | AVL Tree, Red-Black Tree |
| Degenerate / Skewed Tree | Every node has only ONE child — behaves like a Linked List (worst case for BST) | O(n) search — avoid this! |

## ▶ Tree Traversals — 4 Ways to Visit All Nodes

Traversal means visiting all nodes of a tree exactly once. There are 4 main traversals:

### ◆ 1. Inorder Traversal — Left → Node → Right (LNR)

\`\`\`
✓ For BST: Inorder traversal gives SORTED output!
\`\`\`

![Inorder Traversal — LNR gives sorted output for BST](/DSA%20images/dimg13.png)

\`\`\`
void inorder(struct TreeNode* root) {  if(root == NULL) return;  inorder(root->left);   // 1. Visit LEFT subtree  printf('%d ', root->data);  // 2. Visit NODE  inorder(root->right);  // 3. Visit RIGHT subtree}
\`\`\`

### ◆ 2. Preorder Traversal — Node → Left → Right (NLR)

\`\`\`
Preorder:  4 → 2 → 1 → 3 → 6 → 5 → 7  Use: Copying a tree, prefix expressions, serialize/deserialize tree
\`\`\`

\`\`\`
void preorder(struct TreeNode* root) {  if(root == NULL) return;  printf('%d ', root->data);  // 1. Visit NODE first  preorder(root->left);   // 2. Visit LEFT  preorder(root->right);  // 3. Visit RIGHT}
\`\`\`

### ◆ 3. Postorder Traversal — Left → Right → Node (LRN)

\`\`\`
Postorder:  1 → 3 → 2 → 5 → 7 → 6 → 4  Use: Deleting a tree (delete children before parent), postfix expressions
\`\`\`

\`\`\`
void postorder(struct TreeNode* root) {  if(root == NULL) return;  postorder(root->left);  // 1. Visit LEFT  postorder(root->right); // 2. Visit RIGHT  printf('%d ', root->data); // 3. Visit NODE last}
\`\`\`

### ◆ 4. Level Order Traversal (BFS) — Level by Level

\`\`\`
Level Order:  4 → 2 → 6 → 1 → 3 → 5 → 7  Level 0: [4]  Level 1: [2,6]  Level 2: [1,3,5,7]  Use: Shortest path in unweighted tree, printing tree level-by-level
\`\`\`

\`\`\`
void levelOrder(struct TreeNode* root) {  if(!root) return;  struct TreeNode* queue[100]; int front=0, rear=0;  queue[rear++] = root;  while(front < rear) {    struct TreeNode* node = queue[front++];    printf('%d ', node->data);    if(node->left)  queue[rear++] = node->left;    if(node->right) queue[rear++] = node->right;  }}
\`\`\`

## ▶ Binary Tree Properties & Formulas

| Property | Formula | Example (height=3) |
| --- | --- | --- |
| Maximum nodes at level i | 2^i | Level 3: 2³ = 8 nodes |
| Maximum nodes in height-h tree | 2^(h+1) - 1 | Height 3: 2⁴-1 = 15 nodes |
| Minimum height for n nodes | ⌊log₂(n)⌋ | n=7 nodes: ⌊log₂7⌋ = 2 |
| Minimum nodes at height h | h + 1 | Height 3: minimum 4 nodes |
| Number of edges for n nodes | n - 1 | 8 nodes → 7 edges |
| Leaf nodes in full binary tree | (n+1)/2 | 11 nodes → 6 leaf nodes |`,

// ─────────────────────────────────────────────────────────────────
13: `# Types of Trees

## ▶ 1. Binary Search Tree (BST)

\`\`\`
BST PropertyFor EVERY node in the tree:• All values in the LEFT subtree < Node value• All values in the RIGHT subtree > Node value• Both left and right subtrees must also be BSTsThis property allows O(log n) search on a balanced BST!
\`\`\`

\`\`\`
BST Example:  Search 40: 50→left(30<50)→right(40>30)→FOUND ✓ (3 comparisons)  Search 45: 50→30→40→right→NULL (not found) ✗
\`\`\`

![Binary Search Tree — Search Example](/DSA%20images/dimg14.png)

\`\`\`
// BST Insert — O(log n) averagestruct TreeNode* insert(struct TreeNode* root, int key) {  if(root == NULL) return createNode(key);  if(key < root->data)    root->left = insert(root->left, key);   // go left  else if(key > root->data)    root->right = insert(root->right, key); // go right  return root;  // equal keys ignored (no duplicates)}// BST Search — O(log n) averagestruct TreeNode* search(struct TreeNode* root, int key) {  if(root==NULL || root->data==key) return root;  if(key < root->data) return search(root->left, key);  return search(root->right, key);}
\`\`\`

| BST Operation | Average Case | Worst Case (Skewed) | Note |
| --- | --- | --- | --- |
| Search | O(log n) | O(n) | Balanced tree needed for O(log n) |
| Insert | O(log n) | O(n) | May make tree skewed |
| Delete | O(log n) | O(n) | 3 cases: leaf, 1 child, 2 children |
| Inorder Traversal | O(n) | O(n) | Always gives sorted output! |

## ▶ 2. AVL Tree — Self-Balancing BST

An AVL tree is a self-balancing BST where the BALANCE FACTOR of every node is at most 1.
Balance Factor = Height(left subtree) - Height(right subtree). Must be -1, 0, or +1.
When balance factor goes outside this range after insert/delete, ROTATIONS are performed to rebalance.

\`\`\`
4 Types of Rotations in AVL Tree:  RR (Right-Right): Left Rotation (mirror of LL)  LR (Left-Right):  Left then Right Rotation  RL (Right-Left):  Right then Left Rotation
\`\`\`

![AVL Right Rotation — LL Case](/DSA%20images/dimg15.png)

![AVL — All 4 Rotation Types](/DSA%20images/dimg16.png)

## ▶ 3. Heap — Min-Heap & Max-Heap

\`\`\`
Heap DefinitionA Heap is a COMPLETE BINARY TREE that satisfies the HEAP PROPERTY:• Max-Heap: Parent ≥ Children for every node (root is the MAXIMUM element)• Min-Heap: Parent ≤ Children for every node (root is the MINIMUM element)Heaps are usually implemented using ARRAYS (not pointers) because it's a complete binary tree.
\`\`\`

![Max-Heap and Min-Heap with Array Representation](/DSA%20images/dimg17.png)

\`\`\`
// Max-Heap — Heapify Up (after insert)void heapifyUp(int heap[], int i) {  while(i > 1 && heap[i/2] < heap[i]) {    int temp = heap[i]; heap[i] = heap[i/2]; heap[i/2] = temp;    i = i/2;  // move up to parent  }}// Max-Heap — Heapify Down (after extract max)void heapifyDown(int heap[], int n, int i) {  int largest = i, left = 2*i, right = 2*i+1;  if(left<=n && heap[left]>heap[largest]) largest=left;  if(right<=n && heap[right]>heap[largest]) largest=right;  if(largest != i) {    int temp=heap[i]; heap[i]=heap[largest]; heap[largest]=temp;    heapifyDown(heap, n, largest);  }}
\`\`\`

| Heap Operation | Time Complexity | Notes |
| --- | --- | --- |
| Insert (heapify up) | O(log n) | Bubble up the new element |
| Extract Max/Min | O(log n) | Remove root, put last element at root, heapify down |
| Get Max/Min (peek) | O(1) | Just return root element |
| Build Heap from array | O(n) | Faster than n insertions |
| Heap Sort | O(n log n) | Extract max n times |

## ▶ 4. B-Tree — For Database Storage

A B-Tree is a self-balancing MULTI-WAY search tree where a node can have MORE THAN 2 children. Designed for disk storage — minimises disk I/O operations.
- Each node can have between t-1 and 2t-1 keys (where t is the minimum degree)
- All leaves are at the SAME level — perfectly balanced
- Used in databases and file systems — MySQL uses B+ Trees for indexing

## ▶ 5. B+ Tree — Extension of B-Tree

B+ Tree is an extension of B-Tree which allows efficient insertion, deletion, and search operations.
- LEAF NODES contain all the data — internal nodes only store keys for routing
- All leaf nodes are LINKED TOGETHER in a singly linked list — making range queries efficient
- Advantages: Records can be fetched in equal number of disk accesses; height remains balanced

## ▶ 6. Trie (Prefix Tree) — For String Searching

\`\`\`
Search 'can': root→c→a→n→END ✓ (3 comparisons, not O(n) string compare!)
\`\`\`

![Trie — Prefix Tree for String Searching](/DSA%20images/dimg18.png)

Time complexity for search: O(L) where L = length of the word. Space: O(ALPHABET_SIZE × L × N)

## ▶ All Tree Types — Summary Table

| Tree Type | Order | Balance | Key Property | Used In |
| --- | --- | --- | --- | --- |
| Binary Tree | At most 2 children | May be unbalanced | General hierarchy | File system, DOM |
| BST | Left<Root<Right | May be unbalanced | O(log n) average search | Sorted data |
| AVL Tree | BST property | Always balanced (BF≤1) | Guaranteed O(log n) | Databases |
| Red-Black Tree | BST property | Approximately balanced | Fewer rotations than AVL | Java TreeMap |
| Heap | Heap property | Always complete | O(1) min/max access | Priority Queue |
| B-Tree | Multi-way | Always balanced | Minimise disk I/O | Databases |
| B+ Tree | Multi-way | Always balanced | Range queries efficient | MySQL InnoDB |
| Trie | Character-based | N/A | O(L) string operations | Autocomplete |`,

// ─────────────────────────────────────────────────────────────────
14: `# DS — Graphs

:::scenario
What is a Graph?A Graph G can be defined as an ordered set G(V, E) where V(G) represents the SET OF VERTICES and E(G) represents the SET OF EDGES connecting those vertices.Unlike Trees, Graphs can have CYCLES and a vertex can connect to ANY other vertex — there is no parent-child hierarchy. Trees are actually a special case of graphs (connected, acyclic).
:::

## ▶ Graph — Visual Example

\`\`\`
V = {A, B, C, D, E}                V = {A, B, C, D, E}  E = {A-B, A-C, B-D, C-D, D-E}      E = {A→B, D→A, D→B, D→C, D→E}
\`\`\`

![Undirected Graph — Bidirectional Edges](/DSA%20images/dimg19.png)

![Directed Graph — One-Way Edges](/DSA%20images/dimg20.png)

## ▶ Graph Terminology

| Term | Definition | Example |
| --- | --- | --- |
| Vertex (V) | A node or point in the graph | A, B, C, D, E in the graph above |
| Edge (E) | A connection/link between two vertices | A-B is an edge connecting A and B |
| Degree | Number of edges connected to a vertex | Degree of D = 3 (B-D, C-D, D-E) |
| In-Degree | Number of edges COMING IN to a vertex (directed) | A's in-degree = 1 (D→A) |
| Out-Degree | Number of edges GOING OUT from a vertex (directed) | D's out-degree = 4 |
| Path | Sequence of vertices connected by edges | A→B→D→E is a path |
| Cycle | A path that starts and ends at the same vertex | A→B→D→C→A is a cycle |
| Adjacent | Two vertices directly connected by an edge | A and B are adjacent |
| Connected | There is a path between every pair of vertices | The graph above is connected |
| Weight | Numerical value assigned to an edge (distance, cost) | A-B weight = 5 (road distance) |

## ▶ Types of Graphs

| Type | Description | Use Case |
| --- | --- | --- |
| Undirected Graph | Edges have NO direction — A-B and B-A are same | Social networks, road maps |
| Directed Graph (Digraph) | Edges have direction — A→B ≠ B→A | Web pages, Twitter follows |
| Weighted Graph | Each edge has a numerical weight/cost | GPS navigation (road distances) |
| Unweighted Graph | Edges have no cost — all same | Social connections |
| Cyclic Graph | Contains at least one cycle | General networks |
| Acyclic Graph | Contains NO cycles | DAG — task scheduling |
| DAG (Directed Acyclic) | Directed + no cycles | Course prerequisites, build systems |
| Complete Graph | Every vertex connected to every other | K₅ has 5×4/2 = 10 edges |
| Bipartite Graph | Vertices split into 2 groups — edges only between groups | Job matching, recommendation |

## ▶ Graph Representations

### ◆ 1. Adjacency Matrix

A 2D matrix of size V×V where matrix[i][j] = 1 if edge exists from i to j, else 0. For weighted graphs, store the weight instead of 1.

\`\`\`
Graph: A-B, A-C, B-D, C-D, D-E  Vertices: A=0, B=1, C=2, D=3, E=4  Space: O(V²)  |  Edge lookup: O(1)  |  Wastes space for sparse graphs
\`\`\`

![Adjacency Matrix — V×V grid](/DSA%20images/dimg21.png)

\`\`\`
// Adjacency Matrix in Cint graph[5][5] = {  {0,1,1,0,0},  // A: connects to B,C  {1,0,0,1,0},  // B: connects to A,D  {1,0,0,1,0},  // C: connects to A,D  {0,1,1,0,1},  // D: connects to B,C,E  {0,0,0,1,0},  // E: connects to D};
\`\`\`

### ◆ 2. Adjacency List

Each vertex stores a list of its adjacent vertices. More memory efficient for sparse graphs.

\`\`\`
Adjacency List:  A → [B, C]  B → [A, D]  C → [A, D]  D → [B, C, E]  E → [D]  Space: O(V + E)  |  Efficient for sparse graphs  Edge lookup: O(degree(v)) — must scan the list
\`\`\`

\`\`\`
// Adjacency List using array of linked lists#include <stdio.h>#include <stdlib.h>#define V 5struct AdjNode { int dest; struct AdjNode* next; };struct AdjList  { struct AdjNode* head; };struct Graph    { struct AdjList array[V]; };void addEdge(struct Graph* g, int src, int dest) {  // Add dest to src's list  struct AdjNode* n = malloc(sizeof(struct AdjNode));  n->dest = dest; n->next = g->array[src].head;  g->array[src].head = n;  // For undirected: also add src to dest's list  n = malloc(sizeof(struct AdjNode));  n->dest = src; n->next = g->array[dest].head;  g->array[dest].head = n;}
\`\`\`

## ▶ Adjacency Matrix vs Adjacency List

| Criteria | Adjacency Matrix | Adjacency List |
| --- | --- | --- |
| Space | O(V²) — always | O(V + E) — depends on edges |
| Check edge(u,v) | O(1) — direct lookup | O(degree(u)) — scan list |
| Add edge | O(1) | O(1) |
| Find all neighbors | O(V) — scan entire row | O(degree(v)) — just the list |
| Best for | Dense graphs (many edges) | Sparse graphs (few edges) |
| Memory | Wastes space for sparse graphs | Efficient for sparse graphs |`,

// ─────────────────────────────────────────────────────────────────
15: `# Graph Traversal — BFS & DFS

:::scenario
What is Graph Traversal?Graph traversal means visiting all vertices of a graph. Unlike trees (which have one root), graphs may have cycles and disconnected components — so we need to track visited nodes.Two fundamental strategies: BFS (Breadth First Search) explores layer by layer using a QUEUE, while DFS (Depth First Search) goes as deep as possible using a STACK.
:::

## ▶ Breadth First Search (BFS)

\`\`\`
BFS ConceptBFS starts from a source vertex and explores ALL NEIGHBOURS at the current level before moving to the next level.It uses a QUEUE (FIFO) to keep track of nodes to visit.BFS finds the SHORTEST PATH in an unweighted graph.
\`\`\`

\`\`\`
Graph:    BFS from A:  Queue: [A]  → Visit A, add neighbours B,C  Queue: [B,C]→ Visit B, add D,E; Visit C (no new unvisited)  Queue: [D,E]→ Visit D; Visit E  BFS Order: A → B → C → D → E  Level 0: A  |  Level 1: B,C  |  Level 2: D,E
\`\`\`

![Graph — Adjacency List Example](/DSA%20images/dimg22.png)

![BFS — Level-by-Level Traversal](/DSA%20images/dimg23.png)

\`\`\`
#include <stdio.h>#include <stdbool.h>#define V 6int graph[V][V] = {  // Adjacency Matrix  {0,1,1,0,0,0},  // A(0): B,C  {1,0,0,1,1,0},  // B(1): A,D,E  {1,0,0,0,1,0},  // C(2): A,E  {0,1,0,0,0,1},  // D(3): B,F  {0,1,1,0,0,1},  // E(4): B,C,F  {0,0,0,1,1,0},  // F(5): D,E};void BFS(int start) {  bool visited[V] = {false};  int queue[V]; int front=0, rear=0;  visited[start] = true;  queue[rear++] = start;  while(front < rear) {    int v = queue[front++];    printf('%d ', v);    for(int u=0; u<V; u++) {      if(graph[v][u]==1 && !visited[u]) {        visited[u] = true;        queue[rear++] = u;  // enqueue neighbour      }    }  }}
\`\`\`

## ▶ Depth First Search (DFS)

\`\`\`
DFS ConceptDFS starts from a source vertex and goes as DEEP as possible along each branch before BACKTRACKING.It uses a STACK (or recursion, which uses the call stack) to keep track.DFS does NOT guarantee shortest path but is excellent for detecting cycles, topological sort, and exploring all paths.
\`\`\`

\`\`\`
Same Graph:   DFS from A (alphabetical neighbour order):  Visit A → go to B (unvisited)  Visit B → go to D (unvisited)  Visit D → backtrack (all neighbours visited)  Back at B → go to E  Visit E → go to C  Visit C → backtrack all the way  DFS Order: A → B → D → E → C
\`\`\`

![DFS — Graph Example](/DSA%20images/dimg24.png)

![DFS — Full Traversal Order](/DSA%20images/dimg25.png)

\`\`\`
// DFS — Recursive (uses system call stack)bool visited[V] = {false};void DFS_recursive(int v) {  visited[v] = true;  printf('%d ', v);  for(int u=0; u<V; u++) {    if(graph[v][u]==1 && !visited[u])      DFS_recursive(u);  // recurse into neighbour  }}// DFS — Iterative (explicit stack)void DFS_iterative(int start) {  bool visited[V] = {false};  int stack[V]; int top = -1;  stack[++top] = start;  while(top >= 0) {    int v = stack[top--];    if(!visited[v]) {      visited[v] = true;      printf('%d ', v);      for(int u=V-1; u>=0; u--)  // push in reverse for correct order        if(graph[v][u]==1 && !visited[u])          stack[++top] = u;    }  }}
\`\`\`

## ▶ BFS vs DFS — Complete Comparison

| Criteria | BFS | DFS |
| --- | --- | --- |
| Data Structure Used | Queue (FIFO) | Stack (LIFO) / Recursion |
| Exploration Strategy | Level by level — breadth first | Branch by branch — depth first |
| Shortest Path | GUARANTEES shortest path (unweighted) | Does NOT guarantee shortest path |
| Memory Usage | O(V) — can be large for wide graphs | O(V) — can be large for deep graphs |
| Time Complexity | O(V + E) | O(V + E) |
| Space Complexity | O(V) — queue can hold entire level | O(V) — stack depth = tree height |
| Cycle Detection | Possible | More natural — well-suited |
| Topological Sort | Not suitable | Perfect for this |
| Finding connected components | Yes | Yes |
| Applications | Shortest path, level-order, GPS | DFS, maze solving, cycle detect, topo sort |

## ▶ Famous Graph Algorithms

| Algorithm | Purpose | Complexity | Key Idea |
| --- | --- | --- | --- |
| Dijkstra's | Shortest path (non-negative weights) | O((V+E) log V) | Greedy — always pick min-cost unvisited vertex |
| Bellman-Ford | Shortest path (handles negative weights) | O(V × E) | Relax all edges V-1 times |
| Floyd-Warshall | All-pairs shortest path | O(V³) | DP — consider each vertex as intermediate |
| Prim's | Minimum Spanning Tree | O(E log V) | Greedy — always add minimum edge to MST |
| Kruskal's | Minimum Spanning Tree | O(E log E) | Sort edges, add if no cycle (Union-Find) |
| Topological Sort | Linear ordering of DAG | O(V + E) | DFS-based — add to front after finishing |`,

// ─────────────────────────────────────────────────────────────────
16: `# Searching

:::scenario
What is Searching?Searching is the process of finding a specific element (the 'key') within a data structure. On each day, we search for something in our daily life. Similarly, in computer science, huge data is stored in a computer that whenever user asks for any data, the computer searches for that data in memory and provides it to the user.There are mainly two techniques available to search data in an array: Linear Search and Binary Search.
:::

## ▶ 1. Linear Search

Linear Search is the simplest search algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched.

\`\`\`
Array: [64, 25, 12, 22, 11]   Search key: 22  Step 1: Compare 64 with 22 → No  Step 2: Compare 25 with 22 → No  Step 3: Compare 12 with 22 → No  Step 4: Compare 22 with 22 → YES! Found at index 3 ✓
\`\`\`

![Linear Search — Step-by-Step Example](/DSA%20images/dimg26.png)

\`\`\`
// Linear Search — works on any array (sorted or unsorted)int linearSearch(int arr[], int n, int key) {  for(int i = 0; i < n; i++) {    if(arr[i] == key)      return i;   // found at index i  }  return -1;  // not found}// Usage:// int arr[] = {64, 25, 12, 22, 11};// int result = linearSearch(arr, 5, 22);// result = 3 (index of element 22)
\`\`\`(/Gifs/dv3.gif)

| Case | Complexity | Example Scenario |
| --- | --- | --- |
| Best Case | O(1) | Key is the FIRST element in array |
| Average Case | O(n/2) ≈ O(n) | Key is somewhere in the middle |
| Worst Case | O(n) | Key is the LAST element OR not present at all |
| Space Complexity | O(1) | No extra space needed |

## ▶ 2. Binary Search

\`\`\`
Key RequirementBinary Search ONLY works on a SORTED array. If the array is unsorted, sort it first (or use Linear Search).Idea: Compare key with middle element. If equal → found. If key < mid → search left half. If key > mid → search right half. Each comparison HALVES the search space → O(log n)!
\`\`\`

Step-by-Step Example: Array = [2, 5, 8, 12, 16, 23, 38, 42, 56, 72]  Search key = 23

\`\`\`
low=0, high=9  Iteration 1: mid = (0+9)/2 = 4  → arr[4]=16 < 23 → low = 5  Iteration 2: mid = (5+9)/2 = 7  → arr[7]=42 > 23 → high = 6  Iteration 3: mid = (5+6)/2 = 5  → arr[5]=23 = 23 → FOUND at index 5! ✓  Only 3 comparisons for 10 elements! (Linear would need 6)
\`\`\`

![Binary Search — 3-Iteration Example](/DSA%20images/dimg27.png)

\`\`\`
// Binary Search — Iterative (preferred)int binarySearch(int arr[], int n, int key) {  int low = 0, high = n - 1;  while(low <= high) {    int mid = low + (high - low) / 2;  // avoids integer overflow    if(arr[mid] == key)  return mid;   // FOUND    else if(arr[mid] < key) low = mid + 1;  // search RIGHT half    else high = mid - 1;                    // search LEFT half  }  return -1;  // not found}// Binary Search — Recursiveint binarySearchRecursive(int arr[], int low, int high, int key) {  if(low > high) return -1;  // base case: not found  int mid = low + (high - low) / 2;  if(arr[mid] == key) return mid;  if(arr[mid] < key) return binarySearchRecursive(arr, mid+1, high, key);  return binarySearchRecursive(arr, low, mid-1, key);}
\`\`\`

| Case | Complexity | Example Scenario |
| --- | --- | --- |
| Best Case | O(1) | Key is the MIDDLE element |
| Average Case | O(log n) | Key is in some other position |
| Worst Case | O(log n) | Key is at boundary or not present |
| Space (Iterative) | O(1) | No extra space |
| Space (Recursive) | O(log n) | Recursive call stack depth |

## ▶ 3. Jump Search

Jump Search divides the sorted array into blocks of size √n. It jumps forward by √n steps until it overshoots the target, then performs linear search in the previous block.

\`\`\`
Array (n=16): [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31]  Block size: √16 = 4  Search key: 19  Jump 1: arr[0]=1 < 19  → jump  Jump 2: arr[4]=9 < 19  → jump  Jump 3: arr[8]=17 < 19 → jump  Jump 4: arr[12]=25 > 19 → overshot! Go back to arr[8]  Linear from index 8: arr[8]=17, arr[9]=19 → FOUND at index 9 ✓
\`\`\`

![Jump Search — Block Jumping then Linear Phase](/DSA%20images/dimg28.png)

\`\`\`
#include <math.h>int jumpSearch(int arr[], int n, int key) {  int step = (int)sqrt(n);  // block size = √n  int prev = 0;  // Jump forward in blocks  while(arr[step < n ? step : n-1] < key) {    prev = step;    step += (int)sqrt(n);    if(prev >= n) return -1;  // gone past end  }  // Linear search in the block [prev...step]  while(arr[prev] < key) {    prev++;    if(prev == (step<n?step:n)) return -1;  }  if(arr[prev] == key) return prev;  return -1;}
\`\`\`

## ▶ 4. Interpolation Search

Interpolation Search is an improved version of Binary Search. Instead of going to the middle, it estimates the position of the key using a formula — like searching a phone book (you know 'S' names are near the end).

\`\`\`
Position Formula:  pos = low + [ (key - arr[low]) × (high - low) ]                [ ──────────────────────────────── ]                [      (arr[high] - arr[low])      ]  If data is uniformly distributed:  • Average case: O(log log n)  ← much faster than O(log n)!  • Worst case: O(n)            ← when data is not uniform
\`\`\`

## ▶ All Searching Algorithms — Comparison

| Algorithm | Best | Average | Worst | Requirement | Space |
| --- | --- | --- | --- | --- | --- |
| Linear Search | O(1) | O(n) | O(n) | None — any array | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | Sorted array | O(1) / O(log n) |
| Jump Search | O(1) | O(√n) | O(√n) | Sorted array | O(1) |
| Interpolation | O(1) | O(log log n) | O(n) | Sorted + uniform | O(1) |
| Exponential | O(1) | O(log n) | O(log n) | Sorted array | O(log n) |
| Fibonacci Search | O(1) | O(log n) | O(log n) | Sorted array | O(1) |
| 💡 When to Use Which?• Unsorted / small array → Linear Search• Large sorted array → Binary Search• Large sorted array with uniform distribution → Interpolation Search• Very large sorted data (disk-based) → Exponential or Jump Search• Searching strings / words → Trie + Linear or Hashing |  |  |  |  |  |`,

// ─────────────────────────────────────────────────────────────────
17: `# Searching Algorithms with Examples

See **Searching** (Lesson 16) — Topics 16 & 17 are covered together in a single lesson.

:::tip
All four searching algorithms (Linear, Binary, Jump, Interpolation) with complexity analysis and worked examples are in Lesson 16.
:::`,

// ─────────────────────────────────────────────────────────────────
18: `# Sorting Algorithms

:::scenario
What is Sorting?Sorting is the process of arranging elements in a specific order — ascending or descending. Sorting algorithms are used to rearrange elements in an array or a given data structure either in an ascending or descending order. The comparison operator decides the new order of elements.Sorting is fundamental because: (1) Binary Search requires sorted data. (2) Many algorithms work faster on sorted data. (3) Data presentation is clearer when sorted.
:::

## ▶ All Sorting Algorithms — Complexity Overview

| Algorithm | Best | Average | Worst | Space | Stable? | When to Use |
| --- | --- | --- | --- | --- | --- | --- |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Teaching only — too slow in practice |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No | Small arrays, minimise swaps |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Nearly sorted data, small n |
| Merge Sort | O(n logn) | O(n logn) | O(n logn) | O(n) | Yes | Large data, need guaranteed O(n logn) |
| Quick Sort | O(n logn) | O(n logn) | O(n²) | O(log n) | No | General purpose — fastest in practice |
| Heap Sort | O(n logn) | O(n logn) | O(n logn) | O(1) | No | Memory-constrained, need O(1) space |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Integers in small range k |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes | Multi-digit numbers, strings |

## ▶ 1. Bubble Sort

Bubble Sort repeatedly compares adjacent elements and SWAPS them if they are in the wrong order. The largest element 'bubbles up' to the end in each pass.

\`\`\`
Array: [64, 34, 25, 12, 22, 11, 90]  Pass 1: Compare pairs and swap if needed  [64,34] → swap → [34,64,25,12,22,11,90]  [64,25] → swap → [34,25,64,12,22,11,90]  [64,12] → swap → [34,25,12,64,22,11,90]  [64,22] → swap → [34,25,12,22,64,11,90]  [64,11] → swap → [34,25,12,22,11,64,90]  [64,90] → ok   → [34,25,12,22,11,64,90] ← 90 at correct position  After pass 1: largest element 90 is at correct position  Need n-1 passes to sort n elements
\`\`\`

![Bubble Sort — Full Step-by-Step on 7 Elements](/DSA%20images/dimg29.png)

\`\`\`
void bubbleSort(int arr[], int n) {  for(int i=0; i<n-1; i++) {    int swapped = 0;  // optimisation flag    for(int j=0; j<n-i-1; j++) {      if(arr[j] > arr[j+1]) {        // swap arr[j] and arr[j+1]        int temp = arr[j];        arr[j] = arr[j+1];        arr[j+1] = temp;        swapped = 1;      }    }    if(!swapped) break;  // already sorted — stop early  }}// Time: O(n²) worst/avg | O(n) best (already sorted with flag)
\`\`\`

## ▶ 2. Selection Sort

Selection Sort finds the MINIMUM element in the unsorted portion and places it at the beginning. It repeatedly selects the minimum and puts it in its correct position.

\`\`\`
Array: [64, 25, 12, 22, 11]  Pass 1: Min of [64,25,12,22,11] = 11 at index 4 → swap with index 0          [11, 25, 12, 22, 64]  Pass 2: Min of [25,12,22,64] = 12 at index 2 → swap with index 1          [11, 12, 25, 22, 64]  Pass 3: Min of [25,22,64] = 22 at index 3 → swap with index 2          [11, 12, 22, 25, 64]  Pass 4: Min of [25,64] = 25 → already in place          [11, 12, 22, 25, 64] ← SORTED! ✓
\`\`\`

![Selection Sort — Find Minimum, Swap to Front](/DSA%20images/dimg30.png)

\`\`\`
void selectionSort(int arr[], int n) {  for(int i=0; i<n-1; i++) {    int minIdx = i;    for(int j=i+1; j<n; j++)      if(arr[j] < arr[minIdx]) minIdx = j;    // Swap minimum with first element of unsorted part    int temp = arr[minIdx]; arr[minIdx] = arr[i]; arr[i] = temp;  }}// Time: O(n²) always | Space: O(1) | Not stable// Advantage: Makes minimum number of swaps — n-1 swaps maximum
\`\`\`

## ▶ 3. Insertion Sort

Insertion Sort builds a sorted array ONE element at a time by picking the next element and inserting it into its correct position — like sorting playing cards in your hand.

\`\`\`
Array: [12, 11, 13, 5, 6]  i=1: key=11 → compare with 12, shift 12 right → insert 11 → [11,12,13,5,6]  i=2: key=13 → 13>12, no shift needed         → insert 13 → [11,12,13,5,6]  i=3: key=5  → shift 13,12,11 right            → insert 5  → [5,11,12,13,6]  i=4: key=6  → shift 13,12,11 right            → insert 6  → [5,6,11,12,13]  SORTED! ✓
\`\`\`

![Insertion Sort — Pick and Insert into Sorted Portion](/DSA%20images/dimg31.png)

\`\`\`
void insertionSort(int arr[], int n) {  for(int i=1; i<n; i++) {    int key = arr[i];  // element to insert    int j = i - 1;    // Shift elements > key one position right    while(j >= 0 && arr[j] > key) {      arr[j+1] = arr[j];      j--;    }    arr[j+1] = key;  // insert key at correct position  }}// Time: O(n) best | O(n²) avg/worst | Stable | Best for nearly sorted
\`\`\`

## ▶ 4. Merge Sort — Divide and Conquer

Merge Sort uses DIVIDE AND CONQUER: recursively split array into halves, sort each half, then MERGE the two sorted halves. Guaranteed O(n log n) always.

\`\`\`
Array: [38, 27, 43, 3, 9, 82, 10]  DIVIDE:  [38,27,43,3]       [9,82,10]  [38,27]  [43,3]    [9,82]  [10]  [38][27] [43][3]   [9][82] [10]  MERGE (conquer):  [27,38]  [3,43]    [9,82]  [10]  [3,27,38,43]       [9,10,82]  [3,9,10,27,38,43,82]  ← SORTED! ✓
\`\`\`

![Merge Sort — Divide and Conquer Visualization](/DSA%20images/dimg32.png)

\`\`\`
// Merge two sorted halvesvoid merge(int arr[], int l, int m, int r) {  int n1=m-l+1, n2=r-m;  int L[n1], R[n2];  for(int i=0;i<n1;i++) L[i]=arr[l+i];  for(int j=0;j<n2;j++) R[j]=arr[m+1+j];  int i=0, j=0, k=l;  while(i<n1 && j<n2)    arr[k++] = (L[i]<=R[j]) ? L[i++] : R[j++];  while(i<n1) arr[k++]=L[i++];  while(j<n2) arr[k++]=R[j++];}// Recursive divide and mergevoid mergeSort(int arr[], int l, int r) {  if(l < r) {    int m = l + (r-l)/2;    mergeSort(arr, l, m);      // sort left half    mergeSort(arr, m+1, r);    // sort right half    merge(arr, l, m, r);       // merge both halves  }}// Call: mergeSort(arr, 0, n-1);// Time: O(n log n) ALWAYS | Space: O(n) | Stable
\`\`\`

## ▶ 5. Quick Sort — Fastest in Practice

Quick Sort picks a PIVOT element and partitions the array so all elements less than pivot go to its left and greater go to its right. Then recursively sorts both sides.

\`\`\`
Array: [10, 80, 30, 90, 40, 50, 70]  Pivot = last element = 70  Partition step: place all <70 left of 70, all >70 right  [10, 30, 40, 50, 70, 90, 80]  ← 70 is now at correct position!  left: [10,30,40,50]  right: [90,80]  Recursively sort left and right parts  Final: [10, 30, 40, 50, 70, 80, 90] ✓
\`\`\`

![Quick Sort — Partition Step and Recursive Sorting](/DSA%20images/dimg33.png)

\`\`\`
// Partition — returns index of pivot in correct positionint partition(int arr[], int low, int high) {  int pivot = arr[high];  // choose last element as pivot  int i = low - 1;        // i tracks boundary of < pivot region  for(int j=low; j<high; j++) {    if(arr[j] <= pivot) {      i++;      int temp=arr[i]; arr[i]=arr[j]; arr[j]=temp;  // swap    }  }  // Place pivot in correct position  int temp=arr[i+1]; arr[i+1]=arr[high]; arr[high]=temp;  return i+1;  // pivot index}void quickSort(int arr[], int low, int high) {  if(low < high) {    int pi = partition(arr, low, high);    quickSort(arr, low, pi-1);   // sort left of pivot    quickSort(arr, pi+1, high);  // sort right of pivot  }}// Time: O(n logn) avg | O(n²) worst (sorted array + bad pivot)// Space: O(log n) | Not stable | Fastest in practice (good cache)
\`\`\`

## ▶ 6. Heap Sort

Heap Sort uses a MAX-HEAP to sort. First builds a max-heap, then repeatedly extracts the maximum and places it at the end.

\`\`\`
void heapify(int arr[], int n, int i) {  int largest=i, left=2*i+1, right=2*i+2;  if(left<n && arr[left]>arr[largest]) largest=left;  if(right<n && arr[right]>arr[largest]) largest=right;  if(largest!=i) {    int t=arr[i];arr[i]=arr[largest];arr[largest]=t;    heapify(arr, n, largest);  }}void heapSort(int arr[], int n) {  // Build max-heap  for(int i=n/2-1; i>=0; i--) heapify(arr,n,i);  // Extract elements one by one  for(int i=n-1; i>0; i--) {    int t=arr[0]; arr[0]=arr[i]; arr[i]=t;  // move max to end    heapify(arr, i, 0);  // restore heap property  }}// Time: O(n log n) ALWAYS | Space: O(1) | Not stable
\`\`\`

## ▶ Sorting Algorithm Selection Guide

| Situation / Constraint | Best Sorting Algorithm |
| --- | --- |
| Small dataset (n < 20) | Insertion Sort — low overhead, simple |
| Nearly sorted data | Insertion Sort — O(n) best case |
| General purpose, large dataset | Quick Sort (avg fastest) or Merge Sort (stable) |
| Need guaranteed O(n log n) always | Merge Sort or Heap Sort (Quick Sort worst case O(n²)) |
| Memory is extremely limited (in-place) | Heap Sort (O(1) space) or Quick Sort (O(log n)) |
| Integers with small known range k | Counting Sort — O(n + k) very fast |
| Multi-digit numbers or fixed-length strings | Radix Sort — O(nk) where k = digits |
| Stability required (equal elements maintain order) | Merge Sort or Insertion Sort |`,

// ─────────────────────────────────────────────────────────────────
19: `# Sorting Algorithm Implementations

See **Sorting Algorithms** (Lesson 18) — Topics 18 & 19 are covered together in a single lesson.

:::tip
All six sorting algorithm implementations (Bubble, Selection, Insertion, Merge, Quick, Heap) with step-by-step examples and code are in Lesson 18.
:::`,

// ─────────────────────────────────────────────────────────────────
20: `# DS Interview Questions — 50 Q&A

:::scenario
Interview PreparationThese 50 questions cover the most frequently asked DSA interview questions at top tech companies like Google, Amazon, Microsoft, Meta, Flipkart, and others. Study these carefully — understanding the WHY behind each answer is more important than memorising them.
:::

## ▶ 🟢 Beginner Level — Q1 to Q15

| Q# | Question | Answer |
| --- | --- | --- |
| Q1 | What is a Data Structure? | A way to organise and store data in memory so it can be accessed and modified efficiently. It is a set of algorithms, not a programming language. |
| Q2 | What is an Array? | A collection of elements of the same data type stored in contiguous memory locations. Accessed by index in O(1) time. Fixed size. |
| Q3 | What is a Linked List? | A sequence of nodes where each node has DATA + POINTER to next node. Elements stored at scattered memory locations. Dynamic size. |
| Q4 | What is a Stack? | LIFO (Last In First Out) linear data structure. Operations: push (insert at top), pop (remove from top), peek (view top). Time: O(1) for all. |
| Q5 | What is a Queue? | FIFO (First In First Out) linear data structure. Insert at REAR (enqueue), remove from FRONT (dequeue). Time: O(1) for both. |
| Q6 | What is Big-O notation? | Mathematical notation describing the UPPER BOUND (worst case) of an algorithm's time or space growth as input size n grows. |
| Q7 | What is O(1) complexity? | Constant time — execution time does NOT change with input size. Example: Array index access arr[i] is always one operation. |
| Q8 | Array vs Linked List? | Array: O(1) access, fixed size, contiguous memory. Linked List: O(n) access, dynamic size, scattered memory. Choose based on operations needed. |
| Q9 | What is recursion? | A function calling itself with a smaller subproblem. Requires a base case to stop. Uses the system call stack (LIFO). Example: factorial(n) = n * factorial(n-1). |
| Q10 | What is a Binary Tree? | A tree where every node has AT MOST 2 children — left child and right child. Topmost node = root. Nodes with no children = leaf nodes. |
| Q11 | What is a BST? | Binary Search Tree: for every node, all values in LEFT subtree < node value < all values in RIGHT subtree. Allows O(log n) average search. |
| Q12 | What is hashing? | Converting a key to an index using a hash function for O(1) average lookup. Example: h(key) = key % tableSize. Used in hash maps and sets. |
| Q13 | What is Stack Overflow? | Error when recursion goes too deep and exhausts the call stack memory. Example: missing base case in recursive function causes infinite recursion. |
| Q14 | What is a Graph? | Non-linear DS with vertices (nodes) and edges (connections). Unlike trees, graphs can have cycles and multiple connections per node. |
| Q15 | BFS vs DFS? | BFS: level-by-level using Queue — guarantees shortest path. DFS: depth-first using Stack/recursion — good for cycle detection, topological sort. |

## ▶ 🟡 Intermediate Level — Q16 to Q35

| Q# | Question | Answer |
| --- | --- | --- |
| Q16 | Inorder traversal of BST? | Gives SORTED output (ascending order). Order: Left → Root → Right. Most important BST property. |
| Q17 | What is a Heap? | Complete binary tree satisfying Heap Property: Max-Heap — parent ≥ children (root = max). Min-Heap — parent ≤ children (root = min). Implemented with array. |
| Q18 | What is Merge Sort? | Divide & Conquer sorting. Split array in half, sort each, merge. Time: O(n log n) ALWAYS. Space: O(n). Stable. Best for large datasets or linked lists. |
| Q19 | Quick Sort worst case? | O(n²) when pivot is always the smallest or largest element (e.g., sorted array + pick last as pivot). Avoided using random pivot or median-of-3. |
| Q20 | What is a hash collision? | Two different keys map to the same hash index. Resolved by: (1) Chaining — linked list at each bucket. (2) Open Addressing — probe for next empty slot. |
| Q21 | Circular queue advantage? | Reuses empty slots at the front (wasted in simple queue). When rear reaches end, it wraps around to front using modulo: rear = (rear+1) % MAX. |
| Q22 | Doubly Linked List advantage? | Can traverse BOTH forward and backward. O(1) deletion if pointer to node is known (vs O(n) for singly). Used in: browser history, undo/redo. |
| Q23 | What is an AVL tree? | Self-balancing BST where Balance Factor (height_left - height_right) must be -1, 0, or +1 for ALL nodes. Rotations performed to maintain balance after insert/delete. |
| Q24 | Dijkstra's algorithm? | Finds shortest path from source to all vertices in weighted graph (non-negative edges only). Uses min-heap. Time: O((V+E) log V). Greedy approach. |
| Q25 | What is a Trie? | Tree for strings — each EDGE represents one character. Used for autocomplete, spell check, dictionary. Search time: O(L) where L = string length. |
| Q26 | What is Dynamic Programming? | Breaks complex problems into overlapping subproblems, stores results (memoization or tabulation) to avoid recomputation. Example: Fibonacci, Knapsack, LCS. |
| Q27 | Topological Sort? | Linear ordering of vertices in a DAG such that for every directed edge u→v, vertex u comes before v. Uses DFS or Kahn's algorithm (BFS). O(V+E). |
| Q28 | Minimum Spanning Tree? | A tree connecting all V vertices of a weighted graph with minimum total edge weight. Algorithms: Prim's (greedy, vertex-based), Kruskal's (greedy, edge-based). |
| Q29 | Detect cycle in Linked List? | Floyd's Cycle Detection — slow pointer moves 1 step, fast pointer moves 2 steps. If they ever MEET, cycle exists. If fast reaches NULL, no cycle. O(n) time, O(1) space. |
| Q30 | Reverse a Linked List? | Iterative: keep prev=NULL, curr=head. While curr!=NULL: save next, curr.next=prev, prev=curr, curr=next. Final: head=prev. O(n) time, O(1) space. |
| Q31 | Find loop start in LL? | After Floyd's detects meeting point: reset one pointer to head. Advance BOTH one step at a time. They meet at the LOOP START. O(n) time. |
| Q32 | Height of binary tree? | Recursive: height(node) = 1 + max(height(left), height(right)). Base case: height(NULL) = 0. Time: O(n). |
| Q33 | Level order traversal? | BFS using queue: enqueue root, while queue not empty: dequeue node, print it, enqueue its children. Time: O(n), Space: O(n) for queue. |
| Q34 | Check if BST is valid? | Inorder traversal should give strictly increasing sequence. OR: for each node, ensure it lies within (min, max) bounds — pass bounds through recursion. |
| Q35 | Two Sum problem? | Use Hash Map: for each element, check if (target - element) is in map. If yes → found! If no → add element to map. O(n) time, O(n) space. |

## ▶ 🔴 Advanced Level — Q36 to Q50

| Q# | Question | Answer |
| --- | --- | --- |
| Q36 | Red-Black Tree? | Self-balancing BST with colour rules: each node is RED or BLACK. Root is Black. Red node's children must be Black. All paths from root to NULL have same Black-height. O(log n) all ops. |
| Q37 | B-Tree vs B+ Tree? | B-Tree: data in ALL nodes. B+ Tree: data ONLY in leaf nodes (internal nodes are index only), all leaves linked in a sorted linked list — efficient range queries. Used in MySQL. |
| Q38 | LRU Cache design? | Doubly Linked List + Hash Map. Map: key → node. List ordered by recency (MRU at front, LRU at back). Get: O(1) via map + move to front. Put: O(1) insert at front, remove LRU if full. |
| Q39 | Median of data stream? | Two heaps: MAX-HEAP for lower half, MIN-HEAP for upper half. Keep sizes equal (or max-heap 1 larger). Median = top of max-heap (odd) or avg of both tops (even). O(log n) insert. |
| Q40 | Kth largest element? | Use MIN-HEAP of size k: iterate all elements, push to heap, if heap size > k pop the min. After all elements, top of heap IS the Kth largest. O(n log k). |
| Q41 | Count inversions in array? | Modified Merge Sort: during merge step, if element from right array is placed before element from left array, count inversions += (elements remaining in left). O(n log n). |
| Q42 | Word Ladder problem? | BFS on word graph: each word is a node, edges connect words differing by exactly one letter. BFS gives minimum number of transformations. O(N × L²) where N=words, L=word length. |
| Q43 | Union-Find / DSU? | Disjoint Set Union tracks connected components. Operations: find(x) — get root of x's component. union(x,y) — merge components. Used in Kruskal's MST, cycle detection. |
| Q44 | Floyd-Warshall? | All-pairs shortest path using DP. For each intermediate vertex k: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). Time: O(V³). Handles negative weights (not cycles). |
| Q45 | KMP String Matching? | Knuth-Morris-Pratt finds pattern P in text T. Builds failure function (LPS array) from pattern in O(M). Then searches in O(N). Total O(N+M) vs naive O(N×M). |
| Q46 | Largest rectangle histogram? | Use stack: for each bar, pop bars that are taller than current. Area = popped height × (current_index - stack_top - 1). Track max area. O(n) time, O(n) space. |
| Q47 | Serialize/Deserialize Tree? | Preorder traversal with NULL markers. Serialize: DFS, write values and 'null' for empty nodes. Deserialize: read values in order, build tree recursively. |
| Q48 | Sliding Window Maximum? | Monotonic Deque (decreasing): maintain indices of potentially useful elements. Add new index to rear (remove smaller elements first). Front = max in current window. O(n). |
| Q49 | Course Schedule (detect cycle)? | Model as directed graph. Use DFS with 3 states: WHITE(unvisited), GRAY(in-progress), BLACK(done). If DFS reaches GRAY node → cycle exists → schedule impossible. |
| Q50 | Number of Islands? | 2D grid BFS/DFS: when a '1' is found, do BFS/DFS to mark all connected '1's as visited (flood fill). Count how many times BFS/DFS is initiated = number of islands. O(m×n). |`,

// ─────────────────────────────────────────────────────────────────
21: `# Data Structure Coding Questions

\`\`\`
🎯 Top Coding Patterns to MasterThese patterns solve 80% of DSA interview problems. Learn the pattern, not just individual problems. Each pattern is a template you can apply to many variations.
\`\`\`

## ▶ Pattern 1 — Two Pointers

Use when: Array/string problems involving pairs, triplets, or palindromes. Array should usually be sorted.

\`\`\`
// Problem: Two Sum in SORTED array// Find two numbers that add up to targetint* twoSum(int arr[], int n, int target) {  int left=0, right=n-1;  while(left < right) {    int sum = arr[left] + arr[right];    if(sum == target) return (two pointers);    else if(sum < target) left++;   // need bigger sum    else right--;                   // need smaller sum  }  return NULL;}// O(n) time, O(1) space// Problem: Check Palindromeint isPalindrome(char str[], int n) {  int left=0, right=n-1;  while(left < right) {    if(str[left] != str[right]) return 0;    left++; right--;  }  return 1;  // is palindrome}
\`\`\`

## ▶ Pattern 2 — Sliding Window

Use when: Subarray or substring problems with a size constraint (max/min sum of k elements, longest substring without repeat, etc.).

\`\`\`
// Problem: Maximum sum of subarray of size kint maxSumSubarray(int arr[], int n, int k) {  int windowSum=0, maxSum=0;  // Calculate sum of first window  for(int i=0;i<k;i++) windowSum += arr[i];  maxSum = windowSum;  // Slide window: add next, remove first  for(int i=k; i<n; i++) {    windowSum += arr[i] - arr[i-k];  // slide    if(windowSum > maxSum) maxSum = windowSum;  }  return maxSum;}// O(n) time, O(1) space// Problem: Longest Substring Without Repeating Charactersint lengthOfLongestSubstring(char* s) {  int freq[256]={0}, left=0, maxLen=0;  for(int right=0; s[right]; right++) {    freq[(int)s[right]]++;    while(freq[(int)s[right]] > 1) {      freq[(int)s[left]]--;  // shrink window      left++;    }    maxLen = maxLen>(right-left+1)?maxLen:(right-left+1);  }  return maxLen;}
\`\`\`

## ▶ Pattern 3 — Fast & Slow Pointers

\`\`\`
// Detect Cycle in Linked List — Floyd's Algorithmint hasCycle(struct Node* head) {  struct Node *slow=head, *fast=head;  while(fast && fast->next) {    slow = slow->next;        // 1 step    fast = fast->next->next;  // 2 steps    if(slow == fast) return 1; // cycle detected!  }  return 0;  // no cycle}// Find Middle of Linked Liststruct Node* findMiddle(struct Node* head) {  struct Node *slow=head, *fast=head;  while(fast && fast->next) {    slow = slow->next;    fast = fast->next->next;  }  return slow;  // slow is at middle when fast reaches end}
\`\`\`

## ▶ Pattern 4 — Binary Search Variations

\`\`\`
// Find First and Last Position of element in sorted arrayint findFirst(int arr[], int n, int target) {  int low=0, high=n-1, result=-1;  while(low<=high) {    int mid=(low+high)/2;    if(arr[mid]==target) { result=mid; high=mid-1; } // keep searching LEFT    else if(arr[mid]<target) low=mid+1;    else high=mid-1;  }  return result;}// Search in Rotated Sorted Arrayint searchRotated(int arr[], int n, int target) {  int low=0, high=n-1;  while(low<=high) {    int mid=(low+high)/2;    if(arr[mid]==target) return mid;    // Check which half is sorted    if(arr[low]<=arr[mid]) {  // left half is sorted      if(target>=arr[low] && target<arr[mid]) high=mid-1;      else low=mid+1;    } else {  // right half is sorted      if(target>arr[mid] && target<=arr[high]) low=mid+1;      else high=mid-1;    }  }  return -1;}
\`\`\`

## ▶ Pattern 5 — Stacks for Monotonic Problems

\`\`\`
// Next Greater Element for each array elementvoid nextGreater(int arr[], int n) {  int stack[n], top=-1;  int result[n];  for(int i=0;i<n;i++) result[i]=-1;  for(int i=0;i<n;i++) {    // Pop elements smaller than arr[i]    while(top>=0 && arr[stack[top]] < arr[i]) {      result[stack[top--]] = arr[i]; // arr[i] is next greater    }    stack[++top] = i;  // push current index  }}// Input:  [4, 5, 2, 10, 8]// Output: [5, 10, 10, -1, -1]
\`\`\`

## ▶ Problem Set — Must-Solve List

| Problem | Pattern | Difficulty | Key Insight |
| --- | --- | --- | --- |
| Reverse Linked List | Iteration / Two pointers | Easy | Track prev, curr, next pointers |
| Valid Parentheses | Stack | Easy | Push open, pop and match close brackets |
| Maximum Subarray (Kadane's) | DP / Greedy | Easy | maxEnding = max(arr[i], maxEnding+arr[i]) |
| Merge Two Sorted Lists | Two pointers | Easy | Compare heads, append smaller each time |
| Binary Search | Binary Search | Easy | O(log n) — halve search space each time |
| Climb Stairs | DP (Fibonacci) | Easy | dp[i] = dp[i-1] + dp[i-2] |
| Lowest Common Ancestor | Tree DFS | Medium | LCA in BST: if both < root, go left; both > root, go right |
| Merge k Sorted Lists | Min-Heap | Medium | Maintain heap of k heads, extract min each step |
| Trapping Rain Water | Two pointers / Stack | Medium | Water at i = min(maxL, maxR) - height[i] |
| Longest Common Subsequence | 2D DP | Medium | dp[i][j] = dp[i-1][j-1]+1 if match, else max(above, left) |
| Word Search | DFS + Backtracking | Medium | DFS on grid with visited marking + restore |
| Number of Islands | BFS / DFS | Medium | Flood fill each unvisited '1' island |
| Course Schedule | Topological Sort | Medium | DFS cycle detection in directed graph |
| Serialize/Deserialize Tree | DFS / BFS | Hard | Preorder with NULL markers |
| Median from Data Stream | Two Heaps | Hard | MaxHeap lower half + MinHeap upper half |`,

// ─────────────────────────────────────────────────────────────────
22: `# Quick Reference Cheat Sheet

## ▶ Data Structures — Complete Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Sorted Array | O(1) | O(log n)* | O(n) | O(n) | O(n) |
| Singly Linked List | O(n) | O(n) | O(1) head | O(1) head | O(n) |
| Doubly Linked List | O(n) | O(n) | O(1) head | O(1) known node | O(n) |
| Stack | O(n) | O(n) | O(1) top | O(1) top | O(n) |
| Queue | O(n) | O(n) | O(1) rear | O(1) front | O(n) |
| Hash Table | N/A | O(1) avg | O(1) avg | O(1) avg | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| BST (skewed) | O(n) | O(n) | O(n) | O(n) | O(n) |
| AVL Tree | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Min/Max Heap | N/A | O(n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(V+E) | O(V+E) | O(1) | O(V+E) | O(V+E) |
| Graph (adj matrix) | O(1) | O(1) | O(1) | O(1) | O(V²) |
| Trie | O(L) | O(L) | O(L) | O(L) | O(A×L×N) |

## ▶ Sorting Algorithms — Final Reference

| Algorithm | Best | Average | Worst | Space | Stable? |
| --- | --- | --- | --- | --- | --- |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n logn) | O(n logn) | O(n logn) | O(n) | Yes |
| Quick Sort | O(n logn) | O(n logn) | O(n²) | O(log n) | No |
| Heap Sort | O(n logn) | O(n logn) | O(n logn) | O(1) | No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes |

## ▶ Graph Algorithms — Reference

| Algorithm | Purpose | Time | Space | Key Condition |
| --- | --- | --- | --- | --- |
| BFS | Shortest path (unweighted), level-order | O(V+E) | O(V) | Uses Queue |
| DFS | Cycle detection, topo sort, path finding | O(V+E) | O(V) | Uses Stack/Recursion |
| Dijkstra's | Shortest path (weighted, no neg) | O((V+E)logV) | O(V) | Uses Min-Heap |
| Bellman-Ford | Shortest path (handles neg edges) | O(V×E) | O(V) | Relaxes V-1 times |
| Floyd-Warshall | All-pairs shortest path | O(V³) | O(V²) | DP, handles neg weights |
| Prim's | Minimum Spanning Tree | O(E logV) | O(V) | Greedy vertex-based |
| Kruskal's | Minimum Spanning Tree | O(E logE) | O(V) | Sort edges + Union-Find |
| Topological Sort | Linear ordering of DAG | O(V+E) | O(V) | DFS or Kahn's (BFS) |

## ▶ DSA Learning Roadmap

| Phase | Topics to Master | Time Estimate |
| --- | --- | --- |
| Phase 1 — Basics | Arrays, Strings, Big-O notation, Recursion basics | 2–3 weeks |
| Phase 2 — Core DS | Linked List (singly, doubly), Stack, Queue | 2–3 weeks |
| Phase 3 — Trees | Binary Tree, BST, Heap, AVL Tree, Traversals | 3–4 weeks |
| Phase 4 — Hashing | Hash Tables, collision resolution, HashMap usage | 1–2 weeks |
| Phase 5 — Graphs | BFS, DFS, Shortest Path, MST, Topological Sort | 3–4 weeks |
| Phase 6 — Searching | Linear, Binary, Jump, Interpolation Search | 1 week |
| Phase 7 — Sorting | All 8 algorithms with full implementation | 2 weeks |
| Phase 8 — DP | Memoization, Tabulation, classic DP problems | 4–6 weeks |
| Phase 9 — Advanced | Tries, Segment Trees, Union-Find, Monotonic Stack | 3–4 weeks |
| Phase 10 — Practice | LeetCode 150+ problems, Mock interviews daily | Ongoing |

## ▶ Common Mistake Checklist

- Off-by-one errors in loops — always verify i<n vs i<=n
- Not handling NULL/empty cases — always check before accessing pointers
- Integer overflow — use long long for large sums
- Using wrong data type for Big-O — O(n log n) ≠ O(n²)
- Modifying array while iterating — use a copy or proper index management
- Forgetting to free() memory in C — causes memory leaks
- Stack overflow in recursion — always define the base case
- Binary Search on unsorted array — sort first!
- BST with duplicates — define policy (left or right) and stick to it
- Graph cycles — always mark visited nodes before processing

\`\`\`
🎉 Course Complete!You have now covered all 22 topics of Data Structures & Algorithms — from the very basics of what a data structure is, through arrays, linked lists, stacks, queues, trees, graphs, sorting, and searching, all the way to advanced interview patterns and a complete cheat sheet.Remember: DSA is a skill built through PRACTICE. Read once, understand deeply, then code from scratch. Aim for at least 150+ problems across all topics.The best time to start was yesterday. The second best time is NOW. 🚀
\`\`\``,

};

export default dsaContent;