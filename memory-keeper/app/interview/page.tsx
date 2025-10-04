'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Large pool of diverse interview questions (100+ questions)
const QUESTION_POOL = [
  // Childhood & Early Life (20 questions)
  "What was your childhood home like? Can you describe the sights, sounds, and smells you remember?",
  "What games did you play as a child? Who did you play with?",
  "What was your favorite meal growing up? Who cooked it for you?",
  "Tell me about your best friend from childhood. What adventures did you have together?",
  "What was school like for you? Do you have a favorite teacher or subject?",
  "What was the neighborhood like where you grew up?",
  "What did you want to be when you grew up? Did that change over time?",
  "Tell me about a favorite toy or possession from your childhood.",
  "What was bedtime like when you were young? Any special routines or stories?",
  "Describe your bedroom as a child. What made it special to you?",
  "What chores or responsibilities did you have growing up?",
  "Tell me about a childhood fear and how you overcame it.",
  "What was your favorite season as a child and why?",
  "Describe a memorable birthday party from your childhood.",
  "What were mealtimes like in your family when you were young?",
  "Tell me about a pet you had as a child.",
  "What was your favorite place to play or explore?",
  "Describe the street you grew up on. Who were your neighbors?",
  "What did you do during summer vacations as a child?",
  "Tell me about learning to ride a bike, swim, or another childhood milestone.",

  // Family & Relationships (20 questions)
  "Tell me about your parents. What were they like, and what did you learn from them?",
  "Do you have siblings? What are your favorite memories with them?",
  "Tell me about your grandparents. What do you remember most about them?",
  "Who was the person who influenced you most in your early years?",
  "What family gatherings do you remember most fondly?",
  "Describe a typical Sunday or weekend in your family.",
  "Tell me about a family tradition that was important to you.",
  "What languages were spoken in your home growing up?",
  "Tell me about your extended family - aunts, uncles, cousins.",
  "What was your relationship like with your siblings growing up?",
  "Describe your mother's/father's personality in three words.",
  "What did your parents do for work? What did you think about their jobs?",
  "Tell me about a time your family helped you through something difficult.",
  "What role did religion or spirituality play in your family?",
  "Describe a family recipe or dish that brings back memories.",
  "Tell me about the first time you fell in love.",
  "How did you meet your spouse/partner? What attracted you to them?",
  "What's the best advice your parents ever gave you?",
  "Tell me about a family disagreement and how it was resolved.",
  "What qualities did you inherit from your parents?",

  // Work & Career (15 questions)
  "What was your first job? How did you get it, and what do you remember most about it?",
  "What career path did you choose and why?",
  "Tell me about a challenging moment in your work life and how you handled it.",
  "What achievement in your career are you most proud of?",
  "Describe a typical day at work during your career.",
  "Tell me about a mentor or colleague who influenced your career.",
  "What was the biggest risk you took professionally?",
  "How did you balance work and family life?",
  "Tell me about a time you failed at work and what you learned.",
  "What was the most interesting project you ever worked on?",
  "How did your career evolve over the years?",
  "What skills did you develop through your work?",
  "Tell me about your last day of work before retirement.",
  "If you could do your career over, would you change anything?",
  "What advice would you give someone starting in your field?",

  // Life Events & Milestones (15 questions)
  "Can you share a story about a time that changed the direction of your life?",
  "Tell me about a moment when you felt truly proud of yourself.",
  "What was one of the hardest times you've been through, and what did it teach you?",
  "Describe a moment of unexpected joy or surprise in your life.",
  "Tell me about an important decision you made and what led to it.",
  "What was the day like when you became a parent for the first time?",
  "Tell me about moving to a new home or city. How did it feel?",
  "Describe a moment when you felt completely at peace.",
  "Tell me about graduating from school or completing an important goal.",
  "What was a turning point in your life that others might not know about?",
  "Tell me about overcoming a major obstacle or challenge.",
  "Describe the happiest day of your life.",
  "What's something brave you did that scared you at the time?",
  "Tell me about a time you had to say goodbye to someone important.",
  "What achievement are you most proud of in your personal life?",

  // Values & Wisdom (15 questions)
  "What traditions or values do you hope your family will carry forward?",
  "What's the most important lesson life has taught you?",
  "What does family mean to you?",
  "If you could give one piece of advice to younger generations, what would it be?",
  "What are you most grateful for in your life?",
  "How has your perspective on life changed as you've gotten older?",
  "What do you think is the secret to a happy life?",
  "What values guide your decisions?",
  "Tell me about a belief you once had that changed over time.",
  "What does success mean to you?",
  "What do you wish you had known when you were younger?",
  "What legacy do you hope to leave behind?",
  "What qualities do you admire most in people?",
  "How do you define love?",
  "What gives your life meaning?",

  // Hobbies & Passions (10 questions)
  "What hobbies or activities brought you the most joy?",
  "Tell me about a place that holds special meaning for you.",
  "What's a skill or talent you developed over the years?",
  "What music, books, or art have meant the most to you?",
  "Tell me about a collection you had or still have.",
  "What sports or physical activities did you enjoy?",
  "Describe your favorite way to spend a free afternoon.",
  "Tell me about something you taught yourself to do.",
  "What creative outlets have you explored in your life?",
  "Tell me about a hobby that became a passion.",

  // Special Memories (15 questions)
  "Tell me about your wedding day or a special romantic memory.",
  "What's your favorite holiday memory?",
  "Describe a vacation or trip that left a lasting impression.",
  "Tell me about a time you helped someone or someone helped you in a meaningful way.",
  "What's the funniest thing that ever happened to you?",
  "Tell me about meeting someone famous or important.",
  "Describe a perfect day from your past.",
  "Tell me about attending a concert, show, or event that moved you.",
  "What's a small moment that you'll never forget?",
  "Tell me about a gift you received that meant everything to you.",
  "Describe a reunion with someone you hadn't seen in years.",
  "Tell me about witnessing something beautiful in nature.",
  "What's a conversation you'll always remember?",
  "Tell me about a moment of unexpected kindness.",
  "Describe a celebration that was particularly meaningful.",

  // Historical & Cultural Context (10 questions)
  "What major historical events do you remember living through?",
  "How has the world changed most dramatically in your lifetime?",
  "Tell me about the technology you grew up with versus what we have now.",
  "What was it like during wartime or times of crisis?",
  "How did your community celebrate important events?",
  "Tell me about the music and fashion when you were young.",
  "What did people do for entertainment before modern technology?",
  "How has your hometown or city changed over the years?",
  "Tell me about cultural traditions from your heritage.",
  "What was considered scandalous or shocking when you were young?",

  // Personal Growth (5 questions)
  "Tell me about a time you changed your mind about something important.",
  "What's the hardest thing you ever had to learn?",
  "Describe a friendship that shaped who you are.",
  "Tell me about discovering something new about yourself later in life.",
  "What regret has taught you the most?"
];

// Function to randomly select N unique questions from the pool
function selectRandomQuestions(count: number = 6): string[] {
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function InterviewPage() {
  // Generate unique questions for this interview session
  const interviewQuestions = useMemo(() => selectRandomQuestions(6), []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(interviewQuestions.length).fill(''));
  const [isComplete, setIsComplete] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useState(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }

          if (finalTranscript) {
            setCurrentAnswer(prev => prev + finalTranscript);
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  });

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = currentAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(answers[currentQuestion + 1]);
    } else {
      // Save to localStorage
      const stories = JSON.parse(localStorage.getItem('memoryKeeperStories') || '[]');
      stories.push({
        id: Date.now(),
        date: new Date().toISOString(),
        questions: interviewQuestions,
        answers: newAnswers
      });
      localStorage.setItem('memoryKeeperStories', JSON.stringify(stories));
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = currentAnswer;
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[currentQuestion - 1]);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-2xl w-full text-center space-y-6">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-900">Interview Complete!</h1>
          <p className="text-lg text-gray-700">
            Your precious memories have been captured. Now let&apos;s transform them into a beautiful story.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/generate"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Generate Blog Post
            </Link>
            <Link
              href="/stories"
              className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              View All Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
          <Link href="/" className="text-2xl font-bold text-amber-700 hover:text-amber-800 transition-colors">
            Memory Keeper
          </Link>
          <div className="flex gap-4">
            <Link href="/interview" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              New Interview
            </Link>
            <Link href="/stories" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              View Stories
            </Link>
            <Link href="/story-teller" className="text-gray-700 hover:text-amber-700 font-medium transition-colors">
              Story Teller
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Memory Interview</h1>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {interviewQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-4xl flex-shrink-0">💭</div>
              <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
                {interviewQuestions[currentQuestion]}
              </h2>
            </div>

            <div className="relative">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Share your memory here... Take your time and include as many details as you remember."
                className="w-full min-h-[300px] p-6 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none text-lg text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={`absolute bottom-4 right-4 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice recording'}
              >
                {isRecording ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="6" y="4" width="8" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a3 3 0 116 0v2a3 3 0 11-6 0V9z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 font-medium animate-pulse flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                Recording... Speak clearly into your microphone
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-full font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {currentQuestion === interviewQuestions.length - 1 ? 'Complete Interview' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          💡 Tip: The more details you share, the richer your story will be
        </p>
      </div>
    </div>
  );
}
