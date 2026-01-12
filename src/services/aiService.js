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
export const generateMockQuestions = (subject, difficulty) => {
  const mockQuestions = {
    'Data Structures': [
      {
        question: 'What is the time complexity of inserting an element at the beginning of a linked list?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctAnswer: 2,
        explanation: 'Insertion at the beginning of a linked list is O(1) because we only need to update pointers.',
      },
      {
        question: 'Which data structure uses LIFO (Last In First Out) principle?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'Stack follows LIFO principle where the last element inserted is removed first.',
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
        question: 'What is the best case time complexity of bubble sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 0,
        explanation: 'Bubble sort has O(n) best case when the array is already sorted.',
      },
    ],
    'Algorithms': [
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
        question: 'What is the space complexity of quicksort in-place?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 1,
        explanation: 'In-place quicksort has O(log n) space complexity due to recursive call stack.',
      },
      {
        question: 'Which of the following has the worst time complexity?',
        options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Heap Sort'],
        correctAnswer: 2,
        explanation: 'Bubble Sort has O(n²) worst-case complexity, while others have O(n log n).',
      },
      {
        question: 'Dynamic Programming is useful for problems with which property?',
        options: ['No overlapping subproblems', 'Optimal substructure', 'Random nature', 'Single solution'],
        correctAnswer: 1,
        explanation: 'DP is useful for problems with optimal substructure where optimal solution uses optimal solutions of subproblems.',
      },
    ],
    'Database Management': [
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
        question: 'Which SQL command is used to retrieve data?',
        options: ['INSERT', 'DELETE', 'SELECT', 'UPDATE'],
        correctAnswer: 2,
        explanation: 'SELECT command is used to retrieve data from database tables.',
      },
      {
        question: 'What is a foreign key?',
        options: ['Primary key in another table', 'A key that references primary key in another table', 'Duplicate of primary key', 'Encrypted key'],
        correctAnswer: 1,
        explanation: 'A foreign key is an attribute that references the primary key of another table, maintaining referential integrity.',
      },
    ],
    'Operating Systems': [
      {
        question: 'What is a process in an operating system?',
        options: ['A program', 'A running instance of a program', 'A system call', 'A thread'],
        correctAnswer: 1,
        explanation: 'A process is an executing instance of a program with its own memory space and resources.',
      },
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
        question: 'What is virtual memory?',
        options: ['RAM', 'Extended memory using disk storage', 'Cache memory', 'ROM'],
        correctAnswer: 1,
        explanation: 'Virtual memory uses disk storage to extend available memory, allowing programs larger than physical RAM.',
      },
      {
        question: 'What is the difference between a process and a thread?',
        options: ['No difference', 'Process has independent memory, thread shares memory with process', 'Thread is faster', 'Process is faster'],
        correctAnswer: 1,
        explanation: 'Processes have independent memory spaces, while threads within a process share the same memory space.',
      },
    ],
    'Computer Networks': [
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
        question: 'What is the range of well-known ports?',
        options: ['0-255', '0-1023', '1024-65535', '49152-65535'],
        correctAnswer: 1,
        explanation: 'Well-known ports range from 0 to 1023 and are reserved for specific services.',
      },
      {
        question: 'Which protocol resolves IP addresses to MAC addresses?',
        options: ['DHCP', 'DNS', 'ARP', 'IGMP'],
        correctAnswer: 2,
        explanation: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.',
      },
      {
        question: 'What is the maximum size of an IPv4 datagram?',
        options: ['256 bytes', '512 bytes', '1024 bytes', '65535 bytes'],
        correctAnswer: 3,
        explanation: 'Maximum IPv4 datagram size is 65535 bytes (16-bit length field).',
      },
    ],
    'Web Development': [
      {
        question: 'What does HTML stand for?',
        options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correctAnswer: 0,
        explanation: 'HTML stands for Hypertext Markup Language, used to structure web content.',
      },
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
    ],
    'Cloud Computing': [
      {
        question: 'What does IaaS stand for?',
        options: ['Infrastructure as a Service', 'Integration as a Service', 'Information as a Service', 'Internet as a Service'],
        correctAnswer: 0,
        explanation: 'IaaS provides virtualized computing resources over the internet (e.g., AWS, Azure VMs).',
      },
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
        question: 'Which service automatically scales resources?',
        options: ['Load Balancing', 'Auto Scaling', 'Caching', 'Monitoring'],
        correctAnswer: 1,
        explanation: 'Auto Scaling automatically adjusts computing resources based on demand.',
      },
      {
        question: 'What is multi-tenancy in cloud computing?',
        options: ['Multiple clouds', 'Multiple users sharing same resources', 'Multiple databases', 'Multiple servers'],
        correctAnswer: 1,
        explanation: 'Multi-tenancy allows multiple customers to share the same cloud resources safely.',
      },
    ],
    'DevOps': [
      {
        question: 'What does CI/CD stand for?',
        options: ['Continuous Integration/Continuous Deployment', 'Code Integration/Code Deployment', 'Central Interface/Central Data', 'Continuous Interface/Continuous Data'],
        correctAnswer: 0,
        explanation: 'CI/CD automates integration, testing, and deployment of code changes.',
      },
      {
        question: 'What is Docker used for?',
        options: ['Documentation', 'Containerization of applications', 'Database management', 'Version control'],
        correctAnswer: 1,
        explanation: 'Docker is used for containerizing applications to ensure consistency across environments.',
      },
      {
        question: 'What is Kubernetes?',
        options: ['Container registry', 'Container orchestration platform', 'Monitoring tool', 'CI/CD platform'],
        correctAnswer: 1,
        explanation: 'Kubernetes automates deployment, scaling, and management of containerized applications.',
      },
      {
        question: 'What is Infrastructure as Code (IaC)?',
        options: ['Coding standards', 'Managing infrastructure using code', 'Cloud API', 'Database scripts'],
        correctAnswer: 1,
        explanation: 'IaC manages infrastructure through code (e.g., Terraform, CloudFormation) instead of manual processes.',
      },
      {
        question: 'Which is a popular configuration management tool?',
        options: ['Docker', 'Kubernetes', 'Ansible', 'Git'],
        correctAnswer: 2,
        explanation: 'Ansible is an IaC and configuration management tool for automating infrastructure tasks.',
      },
    ],
  };

  return mockQuestions[subject] || mockQuestions['Data Structures'];
};
