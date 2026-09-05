import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Zap, Sparkles, 
  HelpCircle, Timer, BookOpen, ChevronRight, Check
} from 'lucide-react';
import db from '../services/db';

export default function Quiz() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};
  const currentCourse = currentUser.dreamJob || 'Full-Stack Web Engineering';

  // 15 Comprehensive Questions based on modern software engineering and CS fundamentals
  const quizQuestions = [
    {
      id: 1,
      topic: 'Data Structures',
      question: 'What is the average time complexity of lookup, insertion, and deletion in a Hash Table with good hash distribution?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Hash tables offer O(1) average time complexity because an effective hash function maps keys directly to bucket indices in constant time.'
    },
    {
      id: 2,
      topic: 'Algorithms',
      question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n) and is stable?',
      options: ['QuickSort', 'MergeSort', 'HeapSort', 'BubbleSort'],
      correctIndex: 1,
      explanation: 'MergeSort divides the array recursively and merges sorted halves with guaranteed O(n log n) worst-case time and preserves the relative order of equal elements (stable).'
    },
    {
      id: 3,
      topic: 'React Core',
      question: 'What is the primary purpose of the dependency array in React useEffect hook?',
      options: [
        'To define component prop types',
        'To tell React when to re-run the effect based on value changes between renders',
        'To bind methods to the class instance',
        'To force synchronous DOM repaints'
      ],
      correctIndex: 1,
      explanation: 'React compares each value in the dependency array with its previous render value using Object.is. If any value changed, the effect re-runs.'
    },
    {
      id: 4,
      topic: 'JavaScript Engine',
      question: 'In the JavaScript Event Loop, which queue has priority execution before the macrotask (Task) queue?',
      options: ['Web Workers queue', 'Microtask queue (Promises & queueMicrotask)', 'Rendering repaint queue', 'I/O Polling queue'],
      correctIndex: 1,
      explanation: 'Microtasks (resolved Promise callbacks, MutationObserver) are drained completely at the end of each macrotask before the next macrotask is picked up.'
    },
    {
      id: 5,
      topic: 'Database Architecture',
      question: 'What does the "I" in ACID database transactions stand for, and what does it guarantee?',
      options: [
        'Indexing: queries always use B-Trees',
        'Idempotence: duplicate requests produce identical outputs',
        'Isolation: concurrent transactions execute without interfering with one another',
        'Integrity: foreign key constraints cannot be null'
      ],
      correctIndex: 2,
      explanation: 'Isolation ensures that concurrently running transactions appear to have executed serially, preventing dirty reads and non-repeatable reads.'
    },
    {
      id: 6,
      topic: 'Web APIs & HTTP',
      question: 'Which HTTP status code signifies that a resource has been successfully created on the server?',
      options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
      correctIndex: 1,
      explanation: '201 Created indicates the request succeeded and resulted in the creation of a new resource, commonly accompanied by a Location header.'
    },
    {
      id: 7,
      topic: 'System Design',
      question: 'What fundamental trade-off does the CAP Theorem describe in distributed data stores?',
      options: [
        'Cost, Architecture, Performance',
        'Consistency, Availability, Partition Tolerance (choose at most two)',
        'Concurrency, Asynchrony, Parallelism',
        'Compression, Authentication, Persistence'
      ],
      correctIndex: 1,
      explanation: 'In a distributed system experiencing network partitioning (P), the system can only guarantee either high Consistency (C) or high Availability (A), but not both.'
    },
    {
      id: 8,
      topic: 'Frontend Performance',
      question: 'What metric does Core Web Vitals use to quantify visual stability and unexpected layout shifts?',
      options: ['LCP (Largest Contentful Paint)', 'INP (Interaction to Next Paint)', 'CLS (Cumulative Layout Shift)', 'TTFB (Time to First Byte)'],
      correctIndex: 2,
      explanation: 'CLS measures unexpected layout shifts that happen during the lifespan of a page. A score below 0.1 is recommended for good user experience.'
    },
    {
      id: 9,
      topic: 'Security & Auth',
      question: 'Why should sensitive authentication JWT tokens typically NOT be stored in browser localStorage?',
      options: [
        'LocalStorage is capped at 500 bytes',
        'Any client-side JavaScript can access localStorage, exposing the token to Cross-Site Scripting (XSS)',
        'Browsers delete localStorage every 24 hours',
        'LocalStorage cannot store string data'
      ],
      correctIndex: 1,
      explanation: 'XSS attacks can execute arbitrary scripts that read localStorage. Secure httpOnly, SameSite cookies protect tokens from JavaScript access.'
    },
    {
      id: 10,
      topic: 'Cloud & Containers',
      question: 'In Docker, what is the primary benefit of multi-stage builds in a Dockerfile?',
      options: [
        'Allows running multiple operating systems simultaneously in one container',
        'Separates build tools from runtime assets to create drastically smaller and more secure production images',
        'Eliminates the need for a host kernel',
        'Automatically provisions AWS EC2 instances'
      ],
      correctIndex: 1,
      explanation: 'Multi-stage builds allow compiling binaries or building bundles in an initial stage, then copying only the production artifacts into a slim final image.'
    },
    {
      id: 11,
      topic: 'Data Structures',
      question: 'Which tree data structure guarantees self-balancing by requiring every path from root to leaf to have the same number of black nodes?',
      options: ['Binary Heap', 'Red-Black Tree', 'Trie', 'Segment Tree'],
      correctIndex: 1,
      explanation: 'Red-Black trees maintain logarithmic height balance by enforcing node coloring rules, including equal black-height on all paths.'
    },
    {
      id: 12,
      topic: 'Backend Concurrency',
      question: 'What is the key difference between CPU-bound tasks and I/O-bound tasks in Node.js?',
      options: [
        'CPU-bound tasks benefit from non-blocking events, while I/O tasks block the main thread',
        'I/O-bound tasks leverage non-blocking libuv worker threads, while heavy CPU tasks block the single JavaScript event loop',
        'Node.js cannot perform I/O operations',
        'CPU-bound tasks require GPU hardware acceleration'
      ],
      correctIndex: 1,
      explanation: 'Because Node.js runs JavaScript on a single thread, compute-heavy loops block incoming event processing. Worker threads or clustering must be used for CPU tasks.'
    },
    {
      id: 13,
      topic: 'CSS & Modern Layouts',
      question: 'In CSS Flexbox, what does the shorthand "flex: 1 1 auto" represent?',
      options: [
        'flex-direction, flex-wrap, flex-flow',
        'flex-grow: 1, flex-shrink: 1, flex-basis: auto',
        'flex-start, flex-end, center',
        'grid-column, grid-row, gap'
      ],
      correctIndex: 1,
      explanation: 'The flex property is shorthand for flex-grow (can expand), flex-shrink (can contract), and flex-basis (initial main size).'
    },
    {
      id: 14,
      topic: 'Caching Strategies',
      question: 'In a "Cache-Aside" (Lazy Loading) caching strategy, what happens when an application requests data that is not in the cache (cache miss)?',
      options: [
        'The cache server crashes immediately',
        'The application reads from the database, writes the result into the cache, and returns it to the client',
        'The database automatically notifies Redis via webhooks',
        'The request returns HTTP 404'
      ],
      correctIndex: 1,
      explanation: 'With Cache-Aside, the application first checks the cache. On a miss, it queries the primary database, populates the cache for future requests, and returns data.'
    },
    {
      id: 15,
      topic: 'Git & Version Control',
      question: 'What is the primary difference between "git merge" and "git rebase"?',
      options: [
        'Git rebase creates a new merge commit, whereas git merge rewrites commit hashes',
        'Git merge preserves complete commit history with a merge commit, while rebase replays your branch commits on top of the target branch for a linear history',
        'Git rebase deletes remote branches automatically',
        'There is no functional difference'
      ],
      correctIndex: 1,
      explanation: 'Rebase rewrites project history by moving the entire feature branch to begin on the tip of the target branch, producing a clean, linear commit log.'
    }
  ];

  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(45);

  const currentQ = quizQuestions[currentIndex];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Timer per question
  useEffect(() => {
    if (!quizFinished && !isAnswerSubmitted) {
      setSecondsLeft(45);
      const timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto submit as skipped/unanswered
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, isAnswerSubmitted, quizFinished]);

  const handleAutoSubmit = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selected: selectedOption,
        isCorrect: false,
        timeout: true
      }
    }));
    triggerToast('Time expired for this question.');
  };

  const handleOptionClick = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    
    const isCorrect = selectedOption === currentQ.correctIndex;
    setIsAnswerSubmitted(true);

    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selected: selectedOption,
        isCorrect,
        timeout: false
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      finalizeQuiz();
    }
  };

  const finalizeQuiz = () => {
    setQuizFinished(true);
    const finalScore = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const earnedXp = finalScore * 15;

    // Dispatch XP update to user profile in db
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + earnedXp,
      streak: (currentUser.streak || 3) + 1
    });

    triggerToast(`Quiz Complete! Scored ${finalScore}/15 (+${earnedXp} XP Awarded)`);
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="glass-panel animate-slide-up"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <Sparkles size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <Zap size={15} /> DAILY TECHNICAL MASTERY CHALLENGE
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            15-Question Skill Assessment
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Calibrated to your active curriculum: <strong>{currentCourse}</strong>.
          </p>
        </div>

        {!quizFinished && (
          <div className="flex items-center gap-md glass-panel" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
            <div className="flex items-center gap-xs text-warning font-600" style={{ fontSize: '0.88rem' }}>
              <Timer size={16} /> {secondsLeft}s
            </div>
            <span className="text-muted">|</span>
            <div className="flex items-center gap-xs text-primary font-600" style={{ fontSize: '0.88rem' }}>
              Score: {score}
            </div>
          </div>
        )}
      </header>

      {/* Active Sequential Question Box */}
      {!quizFinished && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Progress Tracker */}
          <div className="glass-panel flex flex-col gap-xs" style={{ padding: '1rem 1.5rem' }}>
            <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.82rem' }}>
              <span>Question <strong>{currentIndex + 1}</strong> of 15</span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 10px', borderRadius: 4 }}>
                {currentQ.topic}
              </span>
            </div>

            <div style={{ width: '100%', height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div 
                style={{
                  width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel p-xl flex flex-col gap-lg" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.28rem', fontWeight: 700, lineHeight: 1.45 }}>
              {currentQ.question}
            </h2>

            {/* Answer Options */}
            <div className="flex flex-col gap-md">
              {currentQ.options.map((option, idx) => {
                let optionStyle = {
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isAnswerSubmitted ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: selectedOption === idx ? 600 : 400
                };

                if (!isAnswerSubmitted) {
                  if (selectedOption === idx) {
                    optionStyle.borderColor = 'var(--primary)';
                    optionStyle.background = 'rgba(99, 102, 241, 0.12)';
                  }
                } else {
                  // After submission styling
                  if (idx === currentQ.correctIndex) {
                    optionStyle.borderColor = 'var(--success)';
                    optionStyle.background = 'rgba(16, 185, 129, 0.15)';
                    optionStyle.fontWeight = 700;
                  } else if (selectedOption === idx && idx !== currentQ.correctIndex) {
                    optionStyle.borderColor = 'var(--secondary)';
                    optionStyle.background = 'rgba(244, 63, 94, 0.15)';
                  } else {
                    optionStyle.opacity = 0.5;
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    style={optionStyle}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswerSubmitted}
                    className={!isAnswerSubmitted ? 'interactive' : ''}
                  >
                    <div className="flex items-center gap-md">
                      <span 
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: selectedOption === idx ? 'var(--primary)' : 'var(--input-bg)',
                          color: selectedOption === idx ? '#fff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={20} className="text-success shrink-0" />
                    )}
                    {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                      <XCircle size={20} className="text-secondary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Note (Shown Immediately After Submission) */}
            {isAnswerSubmitted && (
              <div 
                className="glass-panel animate-fade-in flex flex-col gap-xs"
                style={{
                  padding: '1.25rem',
                  background: selectedOption === currentQ.correctIndex 
                    ? 'rgba(16, 185, 129, 0.08)' 
                    : 'rgba(244, 63, 94, 0.08)',
                  border: `1px solid ${selectedOption === currentQ.correctIndex ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div className="flex items-center gap-xs font-700" style={{ fontSize: '0.9rem' }}>
                  {selectedOption === currentQ.correctIndex ? (
                    <>
                      <CheckCircle2 size={18} className="text-success" />
                      <span className="text-success">Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="text-secondary" />
                      <span className="text-secondary">
                        Incorrect. The correct answer is Option {String.fromCharCode(65 + currentQ.correctIndex)}.
                      </span>
                    </>
                  )}
                </div>
                <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.5, marginTop: '4px' }}>
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-xs">
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Earn +15 XP for every correct answer
              </span>

              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  {currentIndex === quizQuestions.length - 1 ? 'View Final Results' : 'Next Question'}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Results & Full Answer Review Screen */}
      {quizFinished && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Top Scorecard Header */}
          <div 
            className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg"
            style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <div>
              <div className="flex items-center gap-xs text-success font-600 mb-xs" style={{ fontSize: '0.84rem' }}>
                <Award size={18} /> ASSESSMENT COMPLETE
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                You scored {score} out of 15 ({Math.round((score / 15) * 100)}% Accuracy)
              </h2>
              <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '560px' }}>
                Awesome performance! <strong>+{score * 15} XP</strong> has been credited to your learner profile. Review the detailed solutions below to reinforce key concepts.
              </p>
            </div>

            {/* Score Dial */}
            <div 
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--success))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
              }}
            >
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: 600 }}>/ 15 CORRECT</div>
            </div>
          </div>

          {/* Full Question-by-Question Review List */}
          <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Comprehensive Solution & Answer Breakdown</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>Review all 15 questions, your submitted choices, and official technical explanations</p>
              </div>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.8rem' }}>
                15 Questions Audited
              </span>
            </div>

            <div className="flex flex-col gap-lg mt-md">
              {quizQuestions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns?.isCorrect;
                const userChoice = userAns?.selected !== null && userAns?.selected !== undefined 
                  ? q.options[userAns.selected] 
                  : 'Time Expired / Skipped';

                return (
                  <div 
                    key={q.id}
                    className="glass-panel flex flex-col gap-sm"
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--secondary)'}`,
                      background: 'var(--card-bg)'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-sm">
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Q{idx + 1}. {q.topic}</span>
                        <span 
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                            color: isCorrect ? 'var(--success)' : 'var(--secondary)'
                          }}
                        >
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      {q.question}
                    </p>

                    {/* Answers Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm mt-xs">
                      <div 
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                          fontSize: '0.82rem'
                        }}
                      >
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>YOUR ANSWER:</div>
                        <div style={{ fontWeight: 600, color: isCorrect ? 'var(--success)' : 'var(--secondary)', marginTop: '2px' }}>
                          {userChoice}
                        </div>
                      </div>

                      <div 
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>CORRECT ANSWER:</div>
                        <div style={{ fontWeight: 600, color: 'var(--success)', marginTop: '2px' }}>
                          Option {String.fromCharCode(65 + q.correctIndex)}: {q.options[q.correctIndex]}
                        </div>
                      </div>
                    </div>

                    {/* Technical Explanation */}
                    <div 
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--input-bg)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: 'var(--text-muted)'
                      }}
                    >
                      <strong style={{ color: 'var(--text-main)' }}>Engineering Concept:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap justify-between items-center gap-md pt-md">
            <button 
              className="btn btn-secondary"
              onClick={handleRetakeQuiz}
              style={{ width: 'auto', padding: '10px 22px' }}
            >
              <RotateCcw size={16} /> Retake 15-Question Quiz
            </button>

            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
