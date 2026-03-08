// Single source of truth that links Python lessons ↔ Practice MCQ ↔ Assignments

export interface PythonTopicMeta {
  lesson: number
  topic: string          // MCQ topic grouping
  subtopic: string       // MCQ subtopic (matches mcq-data.ts)
  moduleId: string       // Which assignment module covers this lesson
  moduleTitle: string
}

export const PYTHON_TOPIC_META: Record<number, PythonTopicMeta> = {
  1:  { lesson: 1,  topic: "Python", subtopic: "Introduction & Variables",  moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  2:  { lesson: 2,  topic: "Python", subtopic: "Data Structures",           moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  3:  { lesson: 3,  topic: "Python", subtopic: "Strings & Methods",         moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  4:  { lesson: 4,  topic: "Python", subtopic: "Control Flow",              moduleId: "python-basics",        moduleTitle: "Python Basics Assessment"        },
  5:  { lesson: 5,  topic: "Python", subtopic: "Loops",                     moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  6:  { lesson: 6,  topic: "Python", subtopic: "Functions",                 moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  7:  { lesson: 7,  topic: "Python", subtopic: "Built-in Modules",          moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  8:  { lesson: 8,  topic: "Python", subtopic: "File I/O",                  moduleId: "python-intermediate",  moduleTitle: "Python Intermediate Assessment"  },
  9:  { lesson: 9,  topic: "Python", subtopic: "OOP Basics",                moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  10: { lesson: 10, topic: "Python", subtopic: "Inheritance",               moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  11: { lesson: 11, topic: "Python", subtopic: "Exception Handling",        moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
  12: { lesson: 12, topic: "Python", subtopic: "List Comprehensions",       moduleId: "python-advanced",      moduleTitle: "Python Advanced Assessment"      },
}
