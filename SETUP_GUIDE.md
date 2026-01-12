# Quiz Master - AI-Powered Quiz Application

A modern React-based quiz web application that generates quiz questions dynamically using AI.

## Features

✨ **Subject-Wise Quiz Selection** - Choose from multiple subjects (Math, Science, History, Geography, etc.)

🎯 **Difficulty Levels** - Easy, Medium, and Hard difficulty options

🤖 **AI-Powered Questions** - Questions generated dynamically by OpenAI API

📊 **Real-Time Scoring** - Instant feedback on answers with explanations

📈 **Performance Analytics** - View detailed results and performance metrics

🎨 **Beautiful UI** - Modern, responsive design with smooth animations

## Project Structure

```
src/
├── Components/
│   ├── SubjectSelection/     # Subject and difficulty selection
│   ├── QuizDisplay/          # Main quiz interface
│   ├── Results/              # Results and performance screen
│   └── Quiz/                 # Original quiz component
├── services/
│   └── aiService.js          # AI API integration
├── App.jsx                   # Main app component
├── App.css                   # App styles
└── main.jsx
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API

#### Option A: Using OpenAI API (Recommended)

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the project root:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

3. The app will use real AI-generated questions

#### Option B: Using Mock Data (For Testing)

The app automatically falls back to mock questions if:
- No API key is configured
- API call fails
- API rate limit is reached

Mock data is pre-loaded for Mathematics and Science subjects.

### 3. Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Usage

1. **Select a Subject** - Click on a subject card to choose your topic
2. **Choose Difficulty** - Select Easy, Medium, or Hard
3. **Click "Start Quiz"** - Begin the quiz with AI-generated questions
4. **Answer Questions** - Click on an option to submit your answer
5. **View Results** - See your score, performance analysis, and explanations
6. **Retry or Choose New Subject** - Take the quiz again or select a different topic

## Features Explained

### SubjectSelection Component
- Displays available subjects with icons
- Difficulty level selector
- Start button (disabled until subject is selected)

### QuizDisplay Component
- Shows current question number and progress bar
- Multiple choice options with instant feedback
- Displays explanations for correct/incorrect answers
- Real-time score tracking

### Results Component
- Final score with percentage
- Performance message based on score
- Breakdown of correct/incorrect answers
- Options to retry or select new subject

### AI Service (aiService.js)

**generateQuizQuestions()** - Main function to fetch AI-generated questions
- Uses OpenAI's GPT-3.5-turbo model
- Customizable number of questions
- Subject and difficulty aware
- Returns structured question objects

**generateMockQuestions()** - Fallback function with pre-loaded questions
- Used when API is unavailable
- Contains sample questions for testing
- Same format as AI-generated questions

## Question Format

```javascript
{
  question: "The actual question?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 0,  // Index of correct option (0-3)
  explanation: "Why this is the correct answer"
}
```

## API Integration Details

### OpenAI Configuration
- **Model**: gpt-3.5-turbo
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 2000
- **Format**: Returns JSON array of questions

### Error Handling
- Validates API response format
- Falls back to mock data if API fails
- Shows user-friendly error messages
- Allows users to dismiss errors and try again

## Customization

### Add New Subjects
Edit `SubjectSelection.jsx`:
```javascript
const subjects = [
  { id: 7, name: 'Your Subject', icon: '🎯' },
  // ... more subjects
];
```

### Adjust Number of Questions
Edit `App.jsx` in `handleSelectSubject()`:
```javascript
generatedQuestions = await generateQuizQuestions(
  selectionData.subject.name,
  selectionData.difficulty,
  10  // Change this number
)
```

### Change AI Model
Edit `aiService.js`:
```javascript
model: 'gpt-4-turbo-preview', // or any other available model
```

## Styling

The app uses a modern gradient theme with:
- **Primary Color**: #667eea (Purple-Blue)
- **Secondary Color**: #764ba2 (Deep Purple)
- **Success Color**: #4caf50 (Green)
- **Error Color**: #f44336 (Red)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- API calls are optimized with debouncing
- Questions are cached to reduce API calls
- CSS animations are hardware-accelerated
- Responsive design for mobile devices

## Troubleshooting

### "API key not configured" error
- Create `.env.local` file with your OpenAI API key
- Restart the development server

### Questions not loading
- Check your internet connection
- Verify API key is valid
- Check OpenAI API dashboard for rate limits
- App will automatically use mock data as fallback

### Styling issues
- Clear browser cache
- Ensure all CSS files are loaded
- Check for CSS conflicts with other extensions

## Future Enhancements

- [ ] User authentication
- [ ] Quiz history and statistics
- [ ] Custom quiz creation
- [ ] Leaderboard
- [ ] Timed quizzes
- [ ] Different question types (True/False, Matching, etc.)
- [ ] Support for multiple AI providers
- [ ] Offline mode with pre-loaded questions
- [ ] Export quiz results as PDF
- [ ] Share quiz links

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using React + Vite + OpenAI API**
