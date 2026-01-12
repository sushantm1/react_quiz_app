// AI Service for generating quiz questions
// Configure your API key in environment variables: VITE_OPENAI_API_KEY

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Subject-specific context for better question generation
const subjectContext = {
  'Data Structures': 'Include concepts like arrays, linked lists, stacks, queues, trees, graphs, heaps, hash tables',
  'Algorithms': 'Include topics like sorting, searching, dynamic programming, recursion, greedy algorithms, complexity analysis',
  'Database Management': 'Include concepts like SQL, normalization, ACID properties, indexing, transactions, relational models',
  'Operating Systems': 'Include topics like processes, threads, synchronization, deadlock, memory management, scheduling',
  'Computer Networks': 'Include concepts like TCP/IP, DNS, HTTP, routing, switching, network layers, protocols',
  'Web Development': 'Include topics like HTML, CSS, JavaScript, frameworks, responsive design, APIs, databases',
  'Cloud Computing': 'Include concepts like AWS, Azure, GCP, virtualization, containers, microservices, scalability',
  'DevOps': 'Include topics like CI/CD, Docker, Kubernetes, Infrastructure as Code, monitoring, deployment',
};

export const generateQuizQuestions = async (subject, difficulty, numberOfQuestions = 5) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file');
  }

  const difficultyLevels = {
    easy: {
      prompt: 'basic and fundamental concepts',
      depth: 'Entry-level knowledge'
    },
    medium: {
      prompt: 'intermediate concepts requiring practical understanding',
      depth: 'Intermediate professional knowledge'
    },
    hard: {
      prompt: 'advanced concepts requiring deep understanding and problem-solving ability',
      depth: 'Advanced professional expertise'
    }
  };

  const selectedLevel = difficultyLevels[difficulty] || difficultyLevels['medium'];
  const subjectDetails = subjectContext[subject] || 'General computer science concepts';

  const prompt = `You are an expert computer science educator. Generate exactly ${numberOfQuestions} high-quality multiple choice quiz questions about "${subject}" at ${difficulty} difficulty level.

Subject Context: ${subjectDetails}
Difficulty Description: ${selectedLevel.prompt}
Expected Knowledge Level: ${selectedLevel.depth}

IMPORTANT REQUIREMENTS:
1. Generate ONLY valid JSON array, no markdown, no code blocks, no extra text
2. Each question must be technically accurate and relevant to CS professionals
3. Include exactly 4 distinct options for each question
4. Vary the position of correct answers (don't always use same index)
5. Add concise but informative explanations

RESPONSE FORMAT (valid JSON only):
[
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(2^n)"],
    "correctAnswer": 1,
    "explanation": "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity O(log n)."
  }
]

Generate questions now:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a computer science expert who generates high-quality technical quiz questions. Always respond with valid JSON only, no markdown formatting or additional text.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.6, // Lower temperature for more consistent, factual questions
        max_tokens: 2500,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate questions');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    // Parse the JSON response - handle potential markdown code blocks
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (content.includes('```')) {
      jsonContent = content.replace(/```\n?/g, '').trim();
    }

    const questions = JSON.parse(jsonContent);

    // Validate the response structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format: expected array of questions');
    }

    if (questions.length !== numberOfQuestions) {
      console.warn(`Expected ${numberOfQuestions} questions, got ${questions.length}`);
    }

    // Validate and clean each question
    const validatedQuestions = questions.map((q, index) => {
      if (!q.question || typeof q.question !== 'string') {
        throw new Error(`Question ${index + 1}: Missing or invalid question text`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1}: Must have exactly 4 options`);
      }
      if (q.options.some(opt => typeof opt !== 'string')) {
        throw new Error(`Question ${index + 1}: All options must be strings`);
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Question ${index + 1}: correctAnswer must be 0-3`);
      }
      if (!q.explanation || typeof q.explanation !== 'string') {
        throw new Error(`Question ${index + 1}: Missing or invalid explanation`);
      }

      // Clean up whitespace
      return {
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation.trim()
      };
    });

    return validatedQuestions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
};

// Alternative: Use this function to get mock data for testing
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateMockQuestions = (subject, difficulty) => {
  const mockQuestions = {
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
    'Database Management': {
      easy: [
        {
          question: 'What is a database?',
          options: ['A file', 'An organized collection of structured data', 'A program', 'A server'],
          correctAnswer: 1,
          explanation: 'A database is an organized collection of structured data stored and managed efficiently.',
        },
        {
          question: 'What does SQL stand for?',
          options: ['Structured Question Language', 'Structured Query Language', 'Simple Query Logic', 'Sequential Query Language'],
          correctAnswer: 1,
          explanation: 'SQL stands for Structured Query Language, used to query and manage databases.',
        },
        {
          question: 'What is a primary key?',
          options: ['A password', 'A unique identifier for each record', 'A type of key', 'A foreign key'],
          correctAnswer: 1,
          explanation: 'A primary key is a unique identifier that uniquely identifies each record in a table.',
        },
        {
          question: 'What is a table?',
          options: ['Furniture', 'A collection of rows and columns', 'A file', 'A database'],
          correctAnswer: 1,
          explanation: 'A table is a structured collection of data organized in rows (records) and columns (attributes).',
        },
        {
          question: 'What is a row in a table?',
          options: ['A line', 'A single record', 'A column', 'A database'],
          correctAnswer: 1,
          explanation: 'A row represents a single record in a table, containing values for each column.',
        },
      ],
      medium: [
        {
          question: 'What does ACID stand for in database transactions?',
          options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Accuracy, Clarity, Index, Data', 'Atomicity, Control, Isolation, Durability'],
          correctAnswer: 0,
          explanation: 'ACID properties ensure reliable database transactions and data integrity.',
        },
        {
          question: 'Which normal form eliminates partial dependencies?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctAnswer: 1,
          explanation: '2NF (Second Normal Form) eliminates partial dependencies from 1NF.',
        },
        {
          question: 'What is the purpose of an index in a database?',
          options: ['Store data', 'Faster data retrieval', 'Ensure uniqueness', 'Backup data'],
          correctAnswer: 1,
          explanation: 'Indexes speed up data retrieval operations by reducing the amount of data to scan.',
        },
        {
          question: 'What is a foreign key?',
          options: ['Primary key in another table', 'A key that references primary key in another table', 'Duplicate of primary key', 'Encrypted key'],
          correctAnswer: 1,
          explanation: 'A foreign key is an attribute that references the primary key of another table, maintaining referential integrity.',
        },
        {
          question: 'What is normalization?',
          options: ['Making data normal', 'Process of organizing data to reduce redundancy', 'Backup process', 'Sorting data'],
          correctAnswer: 1,
          explanation: 'Normalization is the process of organizing database tables to minimize redundancy and improve data integrity.',
        },
      ],
      hard: [
        {
          question: 'What is Boyce-Codd Normal Form (BCNF)?',
          options: ['A relaxation of 3NF', 'A stricter form of 3NF for every determinant to be a candidate key', 'A form of denormalization', 'A backup method'],
          correctAnswer: 1,
          explanation: 'BCNF is a stricter normal form where every determinant must be a candidate key.',
        },
        {
          question: 'What is a transaction?',
          options: ['A transfer', 'A sequence of database operations treated as a single unit', 'A query', 'An index'],
          correctAnswer: 1,
          explanation: 'A transaction is a sequence of operations that must be completed atomically (all or nothing).',
        },
        {
          question: 'What is query optimization?',
          options: ['Making queries faster', 'Process of finding the most efficient way to execute a query', 'Backup optimization', 'Data compression'],
          correctAnswer: 1,
          explanation: 'Query optimization involves selecting the most efficient execution plan for database queries.',
        },
        {
          question: 'What is a stored procedure?',
          options: ['A saved query', 'Precompiled code stored in the database for reuse', 'A backup', 'An index'],
          correctAnswer: 1,
          explanation: 'A stored procedure is precompiled database code that performs specific operations and can be called multiple times.',
        },
        {
          question: 'What is database replication?',
          options: ['Copying data', 'Maintaining copies of database across multiple systems for redundancy and availability', 'Backup', 'Compression'],
          correctAnswer: 1,
          explanation: 'Database replication creates copies of data across multiple systems to ensure redundancy and high availability.',
        },
      ],
    },
    'Operating Systems': {
      easy: [
        {
          question: 'What is an operating system?',
          options: ['Software', 'System software that manages hardware and provides services to applications', 'A program', 'A hardware'],
          correctAnswer: 1,
          explanation: 'An OS is system software that manages computer hardware and provides services to applications.',
        },
        {
          question: 'What is a process?',
          options: ['A program', 'A running instance of a program with its own memory and resources', 'A file', 'A thread'],
          correctAnswer: 1,
          explanation: 'A process is an executing instance of a program with its own memory space and resources.',
        },
        {
          question: 'What is a thread?',
          options: ['A line', 'A lightweight unit of execution within a process', 'A process', 'A program'],
          correctAnswer: 1,
          explanation: 'A thread is a lightweight unit of execution that shares memory with other threads in the same process.',
        },
        {
          question: 'What is CPU scheduling?',
          options: ['Fixing CPU', 'Allocating CPU time to processes', 'Organizing processes', 'Sorting processes'],
          correctAnswer: 1,
          explanation: 'CPU scheduling determines which process gets to use the CPU at any given time.',
        },
        {
          question: 'What is virtual memory?',
          options: ['RAM', 'Extended memory using disk storage', 'Cache memory', 'ROM'],
          correctAnswer: 1,
          explanation: 'Virtual memory uses disk storage to extend available memory, allowing programs larger than physical RAM.',
        },
      ],
      medium: [
        {
          question: 'Which scheduling algorithm is used in most modern OS?',
          options: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'],
          correctAnswer: 2,
          explanation: 'Round Robin is commonly used as it provides fairness and prevents starvation.',
        },
        {
          question: 'What is a deadlock in operating systems?',
          options: ['System crash', 'Situation where two or more processes wait indefinitely for each other', 'Memory full', 'CPU overload'],
          correctAnswer: 1,
          explanation: 'Deadlock occurs when processes hold resources and wait for resources held by others, causing indefinite wait.',
        },
        {
          question: 'What is the difference between a process and a thread?',
          options: ['No difference', 'Process has independent memory, thread shares memory with process', 'Thread is faster', 'Process is faster'],
          correctAnswer: 1,
          explanation: 'Processes have independent memory spaces, while threads within a process share the same memory space.',
        },
        {
          question: 'What is synchronization?',
          options: ['Organizing files', 'Coordinating access to shared resources', 'Backing up data', 'Sorting'],
          correctAnswer: 1,
          explanation: 'Synchronization ensures proper coordination of multiple processes accessing shared resources.',
        },
        {
          question: 'What is a semaphore?',
          options: ['A signal', 'A synchronization primitive used to control access to shared resources', 'A thread', 'A process'],
          correctAnswer: 1,
          explanation: 'A semaphore is a synchronization primitive that uses counters to manage access to shared resources.',
        },
      ],
      hard: [
        {
          question: 'What is the Banker\'s algorithm used for?',
          options: ['Banking', 'Deadlock avoidance', 'Scheduling', 'Memory management'],
          correctAnswer: 1,
          explanation: 'The Banker\'s algorithm is a deadlock avoidance algorithm that checks if resource allocation is safe.',
        },
        {
          question: 'What is cache coherence?',
          options: ['Logical organization', 'Ensuring consistency of data across multiple caches in multiprocessor systems', 'Memory management', 'Disk caching'],
          correctAnswer: 1,
          explanation: 'Cache coherence maintains consistency when multiple processors have copies of the same data.',
        },
        {
          question: 'What is page replacement?',
          options: ['Replacing pages', 'Algorithm to decide which page to evict from memory when new page is needed', 'Sorting', 'Compression'],
          correctAnswer: 1,
          explanation: 'Page replacement algorithms decide which page in memory should be replaced when a new page is needed.',
        },
        {
          question: 'What is context switching?',
          options: ['Changing context', 'Process of saving and restoring state to switch between processes', 'Swapping memory', 'Scheduling'],
          correctAnswer: 1,
          explanation: 'Context switching saves one process state and loads another, allowing CPU to execute different processes.',
        },
        {
          question: 'What is a race condition?',
          options: ['A competition', 'Situation where multiple threads access shared data and result depends on timing', 'A deadlock', 'A starvation'],
          correctAnswer: 1,
          explanation: 'A race condition occurs when multiple threads access shared data and outcome depends on timing of execution.',
        },
      ],
    },
    'Computer Networks': {
      easy: [
        {
          question: 'What is a computer network?',
          options: ['A computer', 'Connected computers sharing data and resources', 'A wire', 'Software'],
          correctAnswer: 1,
          explanation: 'A computer network is a system of connected computers that can share data and resources.',
        },
        {
          question: 'What is the Internet?',
          options: ['A computer', 'Global system of interconnected networks', 'A wire', 'A protocol'],
          correctAnswer: 1,
          explanation: 'The Internet is a global system of interconnected networks using standardized protocols.',
        },
        {
          question: 'What is an IP address?',
          options: ['A password', 'A unique numerical label identifying devices on network', 'A domain name', 'A URL'],
          correctAnswer: 1,
          explanation: 'An IP address is a unique numerical identifier assigned to each device on a network.',
        },
        {
          question: 'What is a protocol?',
          options: ['A procedure', 'A set of rules for communication between devices', 'A software', 'A hardware'],
          correctAnswer: 1,
          explanation: 'A protocol is a set of rules that defines how devices communicate over a network.',
        },
        {
          question: 'What is HTTP?',
          options: ['A server', 'Hypertext Transfer Protocol for web communication', 'A database', 'A programming language'],
          correctAnswer: 1,
          explanation: 'HTTP is the Hypertext Transfer Protocol used for transferring web pages over the Internet.',
        },
      ],
      medium: [
        {
          question: 'Which layer of OSI model handles routing?',
          options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer'],
          correctAnswer: 1,
          explanation: 'The Network Layer (Layer 3) is responsible for routing and logical addressing.',
        },
        {
          question: 'What is the purpose of TCP?',
          options: ['Unreliable data transfer', 'Reliable, connection-oriented data transfer', 'Fast transfer', 'Broadcast'],
          correctAnswer: 1,
          explanation: 'TCP provides reliable, connection-oriented delivery of data with error checking.',
        },
        {
          question: 'What is DNS?',
          options: ['A server', 'Domain Name System that translates domain names to IP addresses', 'A protocol', 'An IP address'],
          correctAnswer: 1,
          explanation: 'DNS (Domain Name System) translates human-readable domain names into IP addresses.',
        },
        {
          question: 'Which protocol resolves IP addresses to MAC addresses?',
          options: ['DHCP', 'DNS', 'ARP', 'IGMP'],
          correctAnswer: 2,
          explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.',
        },
        {
          question: 'What is a firewall?',
          options: ['A wall', 'Security system monitoring and controlling network traffic', 'A router', 'A modem'],
          correctAnswer: 1,
          explanation: 'A firewall is a security system that monitors and controls incoming and outgoing network traffic.',
        },
      ],
      hard: [
        {
          question: 'What is the three-way handshake in TCP?',
          options: ['Three connections', 'SYN, SYN-ACK, ACK sequence to establish connection', 'Three packets', 'Three protocols'],
          correctAnswer: 1,
          explanation: 'Three-way handshake (SYN, SYN-ACK, ACK) establishes a TCP connection between client and server.',
        },
        {
          question: 'What is congestion control in TCP?',
          options: ['Controlling traffic', 'Mechanism to avoid network congestion by adjusting sending rate', 'Router function', 'Firewall function'],
          correctAnswer: 1,
          explanation: 'Congestion control adjusts TCP sending rate to prevent network congestion and packet loss.',
        },
        {
          question: 'What is a subnet?',
          options: ['A network', 'A subdivision of IP network with shared network address', 'A protocol', 'A server'],
          correctAnswer: 1,
          explanation: 'A subnet is a logical subdivision of an IP network, allowing better organization and security.',
        },
        {
          question: 'What is QoS in networking?',
          options: ['Quality control', 'Quality of Service - ensuring performance levels for network traffic', 'A router', 'A protocol'],
          correctAnswer: 1,
          explanation: 'QoS (Quality of Service) ensures acceptable performance levels for critical network traffic.',
        },
        {
          question: 'What is NAT?',
          options: ['A protocol', 'Network Address Translation - translating between private and public IP addresses', 'A server', 'A firewall'],
          correctAnswer: 1,
          explanation: 'NAT (Network Address Translation) allows private IP addresses to communicate with public networks.',
        },
      ],
    },
    'Web Development': {
      easy: [
        {
          question: 'What does HTML stand for?',
          options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
          correctAnswer: 0,
          explanation: 'HTML stands for Hypertext Markup Language, used to structure web content.',
        },
        {
          question: 'What does CSS stand for?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Central Style Script'],
          correctAnswer: 1,
          explanation: 'CSS stands for Cascading Style Sheets, used for styling web pages.',
        },
        {
          question: 'What is JavaScript?',
          options: ['A markup language', 'A programming language for web interactivity', 'A server', 'A database'],
          correctAnswer: 1,
          explanation: 'JavaScript is a programming language that adds interactivity and dynamic behavior to web pages.',
        },
        {
          question: 'What is a web browser?',
          options: ['A search engine', 'Software that displays web pages from the Internet', 'A server', 'A database'],
          correctAnswer: 1,
          explanation: 'A web browser is software that requests, retrieves, and displays web pages from servers.',
        },
        {
          question: 'What is a tag in HTML?',
          options: ['A label', 'Markup element enclosed in angle brackets', 'An attribute', 'A class'],
          correctAnswer: 1,
          explanation: 'An HTML tag is a markup element enclosed in < > that defines content and structure.',
        },
      ],
      medium: [
        {
          question: 'Which is not a valid HTML semantic tag?',
          options: ['<header>', '<article>', '<content>', '<section>'],
          correctAnswer: 2,
          explanation: '<content> is not a valid semantic HTML tag. Use <article>, <section>, <header>, <footer>, etc.',
        },
        {
          question: 'What is the purpose of CSS?',
          options: ['Structure content', 'Style and layout', 'Server-side logic', 'Database management'],
          correctAnswer: 1,
          explanation: 'CSS (Cascading Style Sheets) is used for styling and layout of web pages.',
        },
        {
          question: 'What is an API in web development?',
          options: ['A design pattern', 'Interface for applications to communicate', 'Database query', 'CSS framework'],
          correctAnswer: 1,
          explanation: 'API (Application Programming Interface) allows applications to request and exchange data.',
        },
        {
          question: 'Which HTTP method is used to retrieve data?',
          options: ['POST', 'GET', 'DELETE', 'PUT'],
          correctAnswer: 1,
          explanation: 'GET method is used to retrieve data from a server without modifying it.',
        },
        {
          question: 'What is a responsive design?',
          options: ['Fast design', 'Web design that adapts to different screen sizes', 'Colorful design', 'Interactive design'],
          correctAnswer: 1,
          explanation: 'Responsive design ensures web pages look and function well on all devices and screen sizes.',
        },
      ],
      hard: [
        {
          question: 'What is a progressive web app (PWA)?',
          options: ['A slow app', 'Web app with features like offline support and installability', 'A heavy app', 'A simple website'],
          correctAnswer: 1,
          explanation: 'A PWA is a web application with features like offline functionality, push notifications, and installability.',
        },
        {
          question: 'What is event delegation in JavaScript?',
          options: ['Assigning tasks', 'Technique of handling events on parent instead of target elements', 'Creating events', 'Managing events'],
          correctAnswer: 1,
          explanation: 'Event delegation attaches listeners to parent elements to handle events from child elements efficiently.',
        },
        {
          question: 'What is CORS?',
          options: ['A framework', 'Cross-Origin Resource Sharing - mechanism for accessing resources from different origins', 'A library', 'A tool'],
          correctAnswer: 1,
          explanation: 'CORS (Cross-Origin Resource Sharing) allows restricted resources on different origins to be accessed.',
        },
        {
          question: 'What is a web worker?',
          options: ['A person', 'JavaScript running in background thread without blocking main thread', 'A server', 'A database'],
          correctAnswer: 1,
          explanation: 'Web workers allow running JavaScript in background threads for heavy computations without blocking the UI.',
        },
        {
          question: 'What is webpack?',
          options: ['A framework', 'Module bundler for packaging JavaScript and other assets', 'A library', 'A server'],
          correctAnswer: 1,
          explanation: 'Webpack is a module bundler that bundles JavaScript, CSS, and other assets for production.',
        },
      ],
    },
    'Cloud Computing': {
      easy: [
        {
          question: 'What is cloud computing?',
          options: ['Computing in clouds', 'Computing services delivered over the Internet', 'A server', 'A program'],
          correctAnswer: 1,
          explanation: 'Cloud computing provides computing services (servers, storage, databases) over the Internet.',
        },
        {
          question: 'What does IaaS stand for?',
          options: ['Infrastructure as a Service', 'Integration as a Service', 'Information as a Service', 'Internet as a Service'],
          correctAnswer: 0,
          explanation: 'IaaS provides virtualized computing resources over the internet (e.g., AWS, Azure VMs).',
        },
        {
          question: 'What does PaaS stand for?',
          options: ['Platform as a Service', 'Process as a Service', 'Program as a Service', 'Protocol as a Service'],
          correctAnswer: 0,
          explanation: 'PaaS provides platforms for building and deploying applications over the Internet.',
        },
        {
          question: 'What does SaaS stand for?',
          options: ['Software as a Service', 'Server as a Service', 'Storage as a Service', 'Security as a Service'],
          correctAnswer: 0,
          explanation: 'SaaS delivers software applications over the Internet (e.g., Gmail, Office 365).',
        },
        {
          question: 'What is a cloud provider?',
          options: ['A company', 'Company that offers cloud computing services', 'An Internet provider', 'A server'],
          correctAnswer: 1,
          explanation: 'A cloud provider is a company offering cloud computing services and infrastructure.',
        },
      ],
      medium: [
        {
          question: 'Which cloud service model provides the most control?',
          options: ['SaaS', 'PaaS', 'IaaS', 'All are same'],
          correctAnswer: 2,
          explanation: 'IaaS provides the most control as users manage OS, middleware, and applications.',
        },
        {
          question: 'What is containerization?',
          options: ['Storing data in containers', 'Packaging applications with dependencies', 'Cloud storage', 'Network isolation'],
          correctAnswer: 1,
          explanation: 'Containerization packages applications with their dependencies for consistent deployment.',
        },
        {
          question: 'What is auto-scaling in cloud?',
          options: ['Manual scaling', 'Automatically adjusting resources based on demand', 'Slow scaling', 'Scaling code'],
          correctAnswer: 1,
          explanation: 'Auto-scaling automatically adjusts computing resources to meet demand changes.',
        },
        {
          question: 'What is load balancing?',
          options: ['Balancing loads', 'Distributing traffic across multiple servers', 'Organizing files', 'Sorting servers'],
          correctAnswer: 1,
          explanation: 'Load balancing distributes network traffic across multiple servers for optimal performance.',
        },
        {
          question: 'What is multi-tenancy?',
          options: ['Multiple clouds', 'Multiple users sharing same resources', 'Multiple databases', 'Multiple servers'],
          correctAnswer: 1,
          explanation: 'Multi-tenancy allows multiple customers to share the same cloud resources safely.',
        },
      ],
      hard: [
        {
          question: 'What is serverless computing?',
          options: ['No server needed', 'Cloud computing without managing infrastructure', 'A server', 'No code needed'],
          correctAnswer: 1,
          explanation: 'Serverless computing allows running code without provisioning or managing servers.',
        },
        {
          question: 'What is edge computing?',
          options: ['Computing at edges', 'Processing data closer to source for reduced latency', 'Cloud computing', 'Central computing'],
          correctAnswer: 1,
          explanation: 'Edge computing processes data near the source (edge) rather than centralized data centers.',
        },
        {
          question: 'What is hybrid cloud?',
          options: ['Cloud only', 'Mix of public and private cloud resources', 'Private cloud', 'On-premise only'],
          correctAnswer: 1,
          explanation: 'Hybrid cloud combines public cloud services with private on-premise infrastructure.',
        },
        {
          question: 'What is cloud federation?',
          options: ['Multiple clouds', 'Interconnecting multiple cloud providers for unified service', 'Single cloud', 'Distributed cloud'],
          correctAnswer: 1,
          explanation: 'Cloud federation connects multiple cloud providers to create unified, integrated service.',
        },
        {
          question: 'What is infrastructure as code (IaC)?',
          options: ['Coding infrastructure', 'Managing infrastructure using code and version control', 'Cloud API', 'Manual configuration'],
          correctAnswer: 1,
          explanation: 'IaC manages infrastructure by writing code instead of manual configuration (e.g., Terraform).',
        },
      ],
    },
    'DevOps': {
      easy: [
        {
          question: 'What is DevOps?',
          options: ['Development operation', 'Combining development and operations for continuous improvement', 'A tool', 'A language'],
          correctAnswer: 1,
          explanation: 'DevOps is a practice combining development and operations for faster, reliable software delivery.',
        },
        {
          question: 'What does CI stand for?',
          options: ['Continuous Integration', 'Code Integration', 'Central Interface', 'Computer Integration'],
          correctAnswer: 0,
          explanation: 'CI (Continuous Integration) involves automatically integrating and testing code changes.',
        },
        {
          question: 'What does CD stand for?',
          options: ['Continuous Deployment', 'Code Deployment', 'Central Data', 'Computer Deployment'],
          correctAnswer: 0,
          explanation: 'CD (Continuous Deployment) automatically deploys tested code to production.',
        },
        {
          question: 'What is Docker?',
          options: ['Documentation', 'Platform for containerizing applications', 'Database', 'Version control'],
          correctAnswer: 1,
          explanation: 'Docker is a containerization platform that packages applications with dependencies.',
        },
        {
          question: 'What is a container?',
          options: ['A box', 'Lightweight package containing application and dependencies', 'A VM', 'A server'],
          correctAnswer: 1,
          explanation: 'A container is a lightweight, standalone package that includes application and all dependencies.',
        },
      ],
      medium: [
        {
          question: 'What does CI/CD stand for?',
          options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Central Interface/Central Data', 'Continuous Interface/Continuous Data'],
          correctAnswer: 0,
          explanation: 'CI/CD automates integration, testing, and deployment of code changes.',
        },
        {
          question: 'What is Kubernetes?',
          options: ['Container registry', 'Container orchestration platform', 'Monitoring tool', 'CI/CD platform'],
          correctAnswer: 1,
          explanation: 'Kubernetes automates deployment, scaling, and management of containerized applications.',
        },
        {
          question: 'What is infrastructure as code (IaC)?',
          options: ['Coding standards', 'Managing infrastructure using code', 'Cloud API', 'Database scripts'],
          correctAnswer: 1,
          explanation: 'IaC manages infrastructure through code (e.g., Terraform, CloudFormation) instead of manual processes.',
        },
        {
          question: 'Which is a configuration management tool?',
          options: ['Docker', 'Kubernetes', 'Ansible', 'Git'],
          correctAnswer: 2,
          explanation: 'Ansible is an IaC and configuration management tool for automating infrastructure tasks.',
        },
        {
          question: 'What is monitoring in DevOps?',
          options: ['Watching', 'Continuously observing system health and performance', 'Logging', 'Testing'],
          correctAnswer: 1,
          explanation: 'Monitoring tracks system performance, availability, and alerts to issues in real-time.',
        },
      ],
      hard: [
        {
          question: 'What is blue-green deployment?',
          options: ['Color deployment', 'Running two identical environments for zero-downtime deployment', 'Gradual deployment', 'Rollback mechanism'],
          correctAnswer: 1,
          explanation: 'Blue-green deployment uses two identical environments to switch between versions with zero downtime.',
        },
        {
          question: 'What is canary deployment?',
          options: ['Bird deployment', 'Gradual rollout to small user percentage before full deployment', 'Random deployment', 'Instant deployment'],
          correctAnswer: 1,
          explanation: 'Canary deployment gradually rolls out changes to a small user subset to detect issues early.',
        },
        {
          question: 'What is a microservice architecture?',
          options: ['Small services', 'Building applications as loosely coupled, independently deployable services', 'One big service', 'Monolithic'],
          correctAnswer: 1,
          explanation: 'Microservices break applications into small, independent services that communicate via APIs.',
        },
        {
          question: 'What is service mesh?',
          options: ['Network of services', 'Infrastructure for managing service-to-service communication', 'API gateway', 'Load balancer'],
          correctAnswer: 1,
          explanation: 'Service mesh manages inter-service communication with features like load balancing and security.',
        },
        {
          question: 'What is GitOps?',
          options: ['Git operations', 'Using Git as single source of truth for infrastructure and deployment', 'Version control', 'Git strategy'],
          correctAnswer: 1,
          explanation: 'GitOps treats infrastructure as code in Git, automating deployment through Git workflows.',
        },
      ],
    },
  };

  const questions = mockQuestions[subject]?.[difficulty] || mockQuestions[subject]?.easy || mockQuestions['Data Structures'].easy;
  
  // Shuffle and return 5 random questions
  return shuffleArray(questions).slice(0, 5);
};
