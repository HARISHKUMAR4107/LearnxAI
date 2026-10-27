import type { AssessmentTrack, QuizQuestion } from '@/types';
import { QUIZ_QUESTIONS } from '@/data/quizData';

export interface AssessmentConfig {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

const FULLSTACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fs1',
    concept: 'Semantic HTML',
    category: 'Frontend Foundations',
    question: 'Which HTML element is best suited for a page’s main navigation links?',
    options: ['<nav>', '<section>', '<aside>', '<summary>'],
    correctIndex: 0,
    explanation: '<nav> identifies a section containing major navigation links, helping browsers and assistive technologies understand the page structure.',
  },
  {
    id: 'fs2',
    concept: 'CSS Layout',
    category: 'Frontend Foundations',
    question: 'Which CSS layout system is designed to arrange items in both rows and columns?',
    options: ['Float', 'CSS Grid', 'Inline layout', 'Position: absolute'],
    correctIndex: 1,
    explanation: 'CSS Grid is a two-dimensional layout system for arranging content across rows and columns.',
  },
  {
    id: 'fs3',
    concept: 'JavaScript Variables',
    category: 'Frontend Foundations',
    question: 'Which declaration creates a block-scoped variable that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    correctIndex: 2,
    explanation: 'const creates a block-scoped binding that cannot be reassigned. For objects and arrays, their contents can still be mutated.',
  },
  {
    id: 'fs4',
    concept: 'React State',
    category: 'Modern Frontend',
    question: 'What is the recommended way to update React state when the next value depends on the previous value?',
    options: [
      'Assign directly to the state variable',
      'Use the setter with an updater function',
      'Change the DOM manually',
      'Reload the page',
    ],
    correctIndex: 1,
    explanation: 'An updater function such as setCount(previous => previous + 1) uses the latest state value and avoids stale updates.',
  },
  {
    id: 'fs5',
    concept: 'React Effects',
    category: 'Modern Frontend',
    question: 'When should a React effect that fetches data usually run again?',
    options: [
      'Only when the component file changes',
      'When values in its dependency list change',
      'Every time the browser paints, regardless of dependencies',
      'Only after the user reloads the page',
    ],
    correctIndex: 1,
    explanation: 'React reruns an effect when a value listed in its dependency array changes; an empty array means it runs after the initial mount.',
  },
  {
    id: 'fs6',
    concept: 'REST API Methods',
    category: 'Backend & APIs',
    question: 'Which HTTP method is conventionally used to create a new resource?',
    options: ['GET', 'POST', 'DELETE', 'HEAD'],
    correctIndex: 1,
    explanation: 'POST is conventionally used to submit data that creates a resource. GET retrieves data, while DELETE removes a resource.',
  },
  {
    id: 'fs7',
    concept: 'HTTP Status Codes',
    category: 'Backend & APIs',
    question: 'Which status code indicates that a request succeeded and returned a resource?',
    options: ['201 Created', '301 Moved Permanently', '401 Unauthorized', '500 Internal Server Error'],
    correctIndex: 0,
    explanation: '201 Created indicates that the request succeeded and resulted in a new resource.',
  },
  {
    id: 'fs8',
    concept: 'Relational Databases',
    category: 'Backend & Databases',
    question: 'What does a foreign key do in a relational database?',
    options: [
      'Encrypts a table',
      'Links a row to a related row in another table',
      'Sorts every query automatically',
      'Creates a backup of the database',
    ],
    correctIndex: 1,
    explanation: 'A foreign key references a key in another table to represent and enforce a relationship between records.',
  },
  {
    id: 'fs9',
    concept: 'Authentication',
    category: 'Backend & Databases',
    question: 'Where should a server-side application store passwords?',
    options: [
      'As readable text in the users table',
      'Encrypted with a reversible cipher',
      'As salted password hashes using a password-hashing algorithm',
      'In a client-side cookie without hashing',
    ],
    correctIndex: 2,
    explanation: 'Store passwords as salted hashes using a dedicated password-hashing algorithm, such as Argon2id or bcrypt, never as plaintext.',
  },
  {
    id: 'fs10',
    concept: 'Git Branches',
    category: 'Development Workflow',
    question: 'Why do developers use a separate Git branch for a feature?',
    options: [
      'To isolate changes before integrating them',
      'To permanently remove the project history',
      'To avoid saving commits',
      'To replace the remote repository',
    ],
    correctIndex: 0,
    explanation: 'A feature branch isolates work from the main line so it can be reviewed and tested before being merged.',
  },
];

const AIML_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ml1',
    concept: 'Supervised Learning',
    category: 'Machine Learning Foundations',
    question: 'What kind of data is used to train a supervised learning model?',
    options: [
      'Unlabeled data only',
      'Examples paired with known target labels',
      'Random numbers with no examples',
      'Only data generated by the model',
    ],
    correctIndex: 1,
    explanation: 'Supervised learning uses labeled examples, where each input is paired with the target output the model should learn to predict.',
  },
  {
    id: 'ml2',
    concept: 'Classification and Regression',
    category: 'Machine Learning Foundations',
    question: 'Which task is a regression problem?',
    options: [
      'Predicting whether an email is spam',
      'Assigning an image to a category',
      'Predicting the sale price of a house',
      'Grouping customers without known labels',
    ],
    correctIndex: 2,
    explanation: 'Regression predicts a continuous numeric value, such as a house price. Classification predicts a class or category.',
  },
  {
    id: 'ml3',
    concept: 'Train and Test Sets',
    category: 'Model Evaluation',
    question: 'Why keep a test set separate from the training data?',
    options: [
      'To estimate how well the trained model generalizes to unseen data',
      'To make the training set larger',
      'To guarantee a perfect score',
      'To remove the need for model evaluation',
    ],
    correctIndex: 0,
    explanation: 'A held-out test set provides an estimate of performance on data the model did not use during training.',
  },
  {
    id: 'ml4',
    concept: 'Overfitting',
    category: 'Model Evaluation',
    question: 'What is a common sign that a model is overfitting?',
    options: [
      'It performs poorly on training data and well on test data',
      'It performs very well on training data but much worse on test data',
      'It has no input features',
      'It always predicts the same value',
    ],
    correctIndex: 1,
    explanation: 'An overfit model has learned training-specific details and does not generalize well, so test performance is noticeably worse.',
  },
  {
    id: 'ml5',
    concept: 'Precision and Recall',
    category: 'Model Evaluation',
    question: 'For a medical screening model, when might recall be especially important?',
    options: [
      'When missing a true positive is costly',
      'When false positives are the only concern',
      'When the model has no positive predictions',
      'When measuring training time',
    ],
    correctIndex: 0,
    explanation: 'Recall measures the share of actual positive cases found. High recall is important when missing a positive case has a high cost.',
  },
  {
    id: 'ml6',
    concept: 'Gradient Descent',
    category: 'Model Training',
    question: 'What does gradient descent do during model training?',
    options: [
      'Adjusts model parameters to reduce a loss function',
      'Adds labels to the training data',
      'Splits a dataset into columns',
      'Guarantees that a model has no bias',
    ],
    correctIndex: 0,
    explanation: 'Gradient descent uses the loss gradient to update model parameters in a direction that reduces the loss.',
  },
  {
    id: 'ml7',
    concept: 'Feature Scaling',
    category: 'Data Preparation',
    question: 'Why can feature scaling help algorithms such as k-nearest neighbors?',
    options: [
      'It makes features with large numeric ranges dominate',
      'It puts numeric features on comparable scales',
      'It removes the need for labels',
      'It converts classification into regression',
    ],
    correctIndex: 1,
    explanation: 'Distance-based methods can be dominated by features with larger numeric ranges. Scaling makes feature magnitudes more comparable.',
  },
  {
    id: 'ml8',
    concept: 'Data Leakage',
    category: 'Data Preparation',
    question: 'What is data leakage in machine learning?',
    options: [
      'Accidentally using information during training that would not be available at prediction time',
      'Compressing a dataset before training',
      'Removing duplicate rows',
      'Splitting data into batches',
    ],
    correctIndex: 0,
    explanation: 'Data leakage occurs when training or evaluation uses information unavailable at real prediction time, leading to overly optimistic results.',
  },
  {
    id: 'ml9',
    concept: 'Neural Networks',
    category: 'Deep Learning',
    question: 'What is the purpose of an activation function in a neural network?',
    options: [
      'To introduce non-linearity so the network can learn complex relationships',
      'To store the training dataset',
      'To select the test set',
      'To guarantee that every prediction is correct',
    ],
    correctIndex: 0,
    explanation: 'Non-linear activation functions let stacked neural-network layers model relationships that a purely linear model cannot represent.',
  },
  {
    id: 'ml10',
    concept: 'Attention Mechanism',
    category: 'Deep Learning',
    question: 'In a transformer, what does self-attention help a model do?',
    options: [
      'Relate each token to other tokens in the same input sequence',
      'Sort training files alphabetically',
      'Remove all context from a sequence',
      'Convert every token into a database row',
    ],
    correctIndex: 0,
    explanation: 'Self-attention computes relationships among tokens in a sequence, helping a transformer use context when representing each token.',
  },
];

export const ASSESSMENTS: Record<AssessmentTrack, AssessmentConfig> = {
  'java-dev': {
    title: 'Java Skill Assessment',
    description: 'This assessment covers Java fundamentals, OOP, collections, exceptions, concurrency, modern Java, and JVM internals.',
    questions: QUIZ_QUESTIONS,
  },
  fullstack: {
    title: 'Full-Stack Developer Assessment',
    description: 'This assessment covers frontend foundations, React, APIs, databases, authentication, and development workflows.',
    questions: FULLSTACK_QUESTIONS,
  },
  aiml: {
    title: 'AI/ML Engineer Assessment',
    description: 'This assessment covers machine learning, model evaluation, data preparation, and deep learning.',
    questions: AIML_QUESTIONS,
  },
};

export const ALL_ASSESSMENT_QUESTIONS = Object.values(ASSESSMENTS)
  .flatMap(({ questions }) => questions);
