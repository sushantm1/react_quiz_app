import Quiz from './models/Quiz.js';

// Mock questions from the React app
const mockQuestionsData = {
  'Data Structures': {
    easy: [
      {
        question: 'Which data structure uses LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'Stack follows LIFO principle where the last element inserted is removed first.',
      },
      {
        question: 'What is an array?',
        options: ['A list of elements', 'A collection of elements of the same type stored in contiguous memory', 'A function', 'A variable'],
        correctAnswer: 1,
        explanation: 'An array is a data structure that stores elements of the same type in contiguous memory locations.',
      },
      {
        question: 'Which data structure uses FIFO (First In First Out) principle?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'Queue follows FIFO principle where the first element inserted is removed first.',
      },
      {
        question: 'What is a linked list?',
        options: ['A list with links', 'A data structure where elements are connected using pointers', 'An array', 'A tree'],
        correctAnswer: 1,
        explanation: 'A linked list is a data structure where each element (node) contains data and a reference to the next node.',
      },
      {
        question: 'What is the main advantage of using a linked list over an array?',
        options: ['Faster access', 'Dynamic size', 'Less memory', 'No sorting needed'],
        correctAnswer: 1,
        explanation: 'Linked lists have dynamic size and can easily insert/delete elements without resizing.',
      },
    ],
    medium: [
      {
        question: 'What is the time complexity of inserting an element at the beginning of a linked list?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Insertion at the beginning of a linked list is O(1) because we only need to update pointers.',
      },
      {
        question: 'What is the space complexity of a balanced binary search tree with n nodes?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'A balanced BST with n nodes requires O(n) space to store all nodes.',
      },
      {
        question: 'Which of the following is NOT a linear data structure?',
        options: ['Array', 'Stack', 'Queue', 'Tree'],
        correctAnswer: 3,
        explanation: 'Tree is a non-linear data structure, while Array, Stack, and Queue are linear.',
      },
      {
        question: 'What is the time complexity of searching in a hash table?',
        options: ['O(n)', 'O(log n)', 'O(1) average case', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Hash table provides O(1) average case time complexity for search operations.',
      },
      {
        question: 'What is a binary tree?',
        options: ['A tree with 2 elements', 'A tree where each node has at most 2 children', 'A tree with 2 levels', 'A sorted tree'],
        correctAnswer: 1,
        explanation: 'A binary tree is a tree structure where each node has at most two children (left and right).',
      },
    ],
    hard: [
      {
        question: 'What is the time complexity of inserting an element in a balanced AVL tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'AVL trees maintain balance, ensuring O(log n) insertion time complexity.',
      },
      {
        question: 'What is the difference between a heap and a binary search tree?',
        options: ['No difference', 'Heap is for searching, BST is for sorting', 'Heap maintains heap property, BST maintains ordering property', 'Heap is faster'],
        correctAnswer: 2,
        explanation: 'Heaps satisfy the heap property (parent-child ordering), while BSTs maintain left < parent < right ordering.',
      },
      {
        question: 'What is the time complexity of finding the k-th smallest element in a BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(k log n)'],
        correctAnswer: 2,
        explanation: 'Finding k-th smallest requires traversal, giving O(n) worst-case time complexity.',
      },
      {
        question: 'What are the advantages of using a skip list?',
        options: ['Simpler than BST', 'Probabilistic balancing with O(log n) operations', 'No memory overhead', 'Cache friendly'],
        correctAnswer: 1,
        explanation: 'Skip lists provide probabilistic balancing and achieve O(log n) search time without complex rotations.',
      },
      {
        question: 'What is a self-balancing BST?',
        options: ['A BST that sorts itself', 'A BST that maintains balance through rotations to ensure O(log n) operations', 'A BST with 2 children', 'A readonly BST'],
        correctAnswer: 1,
        explanation: 'Self-balancing BSTs (like AVL, Red-Black) automatically rebalance to maintain O(log n) complexity.',
      },
    ],
  },
  'Algorithms': {
    easy: [
      {
        question: 'What is a sorting algorithm?',
        options: ['A program', 'A method to arrange elements in order', 'A search function', 'A loop'],
        correctAnswer: 1,
        explanation: 'A sorting algorithm is a step-by-step procedure to arrange elements in a specific order.',
      },
      {
        question: 'Which sorting algorithm compares adjacent elements?',
        options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Heap Sort'],
        correctAnswer: 2,
        explanation: 'Bubble sort compares adjacent elements and swaps them if they are in wrong order.',
      },
      {
        question: 'What is the worst-case time complexity of bubble sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 2,
        explanation: 'Bubble sort has O(n²) worst-case complexity when the array is in reverse order.',
      },
      {
        question: 'What is a search algorithm?',
        options: ['A sorting method', 'A procedure to find an element in a collection', 'A loop', 'A condition'],
        correctAnswer: 1,
        explanation: 'A search algorithm is used to locate a specific element within a data structure.',
      },
      {
        question: 'What is linear search?',
        options: ['Search in a line', 'Searching each element sequentially', 'Dividing and searching', 'Random search'],
        correctAnswer: 1,
        explanation: 'Linear search checks each element one by one until the target is found.',
      },
    ],
    medium: [
      {
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 1,
        explanation: 'Binary search has O(log n) complexity as it divides the search space in half each time.',
      },
      {
        question: 'Which algorithm design paradigm does Merge Sort use?',
        options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Brute Force'],
        correctAnswer: 2,
        explanation: 'Merge Sort uses Divide and Conquer by dividing array in half and merging sorted subarrays.',
      },
      {
        question: 'What is the best case time complexity of quick sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'Quick sort has O(n log n) best case when the pivot divides the array equally.',
      },
      {
        question: 'What is dynamic programming?',
        options: ['Programming that changes', 'Solving problems by breaking into subproblems and storing results', 'Using loops', 'Random algorithm'],
        correctAnswer: 1,
        explanation: 'Dynamic programming solves complex problems by breaking them into simpler subproblems and memoizing results.',
      },
      {
        question: 'What is the time complexity of merge sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 1,
        explanation: 'Merge sort has O(n log n) time complexity in all cases (best, average, worst).',
      },
    ],
    hard: [
      {
        question: 'What is the time complexity of the best implementation of quick sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'With good pivot selection, quick sort achieves O(n log n) average case complexity.',
      },
      {
        question: 'What problem can be solved using the Floyd-Warshall algorithm?',
        options: ['Sorting', 'All-pairs shortest path', 'Searching', 'Hashing'],
        correctAnswer: 1,
        explanation: 'Floyd-Warshall finds shortest paths between all pairs of vertices in a graph.',
      },
      {
        question: 'What is memoization in dynamic programming?',
        options: ['Writing notes', 'Storing results of expensive function calls', 'Sorting data', 'Searching'],
        correctAnswer: 1,
        explanation: 'Memoization stores computed results to avoid redundant calculations, improving efficiency.',
      },
      {
        question: 'What is a greedy algorithm?',
        options: ['An algorithm that sorts', 'An algorithm that makes locally optimal choices', 'An algorithm for searching', 'An algorithm for hashing'],
        correctAnswer: 1,
        explanation: 'A greedy algorithm makes locally optimal choices at each step, hoping to find global optimum.',
      },
      {
        question: 'What is the longest common subsequence (LCS) problem?',
        options: ['Finding longest word', 'Finding the longest sequence common to two sequences', 'Sorting sequences', 'Comparing numbers'],
        correctAnswer: 1,
        explanation: 'LCS finds the longest subsequence present in both sequences in the same order.',
      },
    ],
  },
};

const seedData = async () => {
  try {
    for (const [subject, difficulties] of Object.entries(mockQuestionsData)) {
      for (const [difficulty, questions] of Object.entries(difficulties)) {
        const existingQuiz = await Quiz.findOne({ subject, difficulty });
        if (!existingQuiz) {
          await Quiz.create({
            subject,
            difficulty,
            questions,
            numberOfQuestions: questions.length,
          });
          console.log(`✓ Seeded: ${subject} - ${difficulty}`);
        }
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default seedData;
