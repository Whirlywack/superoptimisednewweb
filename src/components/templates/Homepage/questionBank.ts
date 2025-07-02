// Question Bank System for Dynamic Poll Questions
// Categories: auth, platform, general

export interface Question {
  id: string;
  category: 'auth' | 'platform' | 'general';
  text: string;
  options: [string, string]; // Always exactly 2 options
}

export const QUESTION_BANK: Question[] = [
  // Authentication-specific questions (2-3 questions)
  {
    id: 'auth-1',
    category: 'auth',
    text: 'What\'s your preference for authentication?',
    options: ['Magic links only', 'Traditional login forms']
  },
  {
    id: 'auth-2',
    category: 'auth',
    text: 'Anonymous feedback vs. tracked contributions?',
    options: ['Full anonymity', 'Optional profiles']
  },
  {
    id: 'auth-3',
    category: 'auth',
    text: 'How long should magic links stay valid?',
    options: ['15 minutes', '1 hour']
  },

  // Platform/mobile questions (2-3 questions)
  {
    id: 'platform-1',
    category: 'platform',
    text: 'Primary device for filling surveys?',
    options: ['Mobile phone', 'Desktop computer']
  },
  {
    id: 'platform-2',
    category: 'platform',
    text: 'Preferred interaction method?',
    options: ['Touch/tap', 'Click/keyboard']
  },
  {
    id: 'platform-3',
    category: 'platform',
    text: 'Survey length preference?',
    options: ['Quick 2-3 questions', 'Detailed 10+ questions']
  },

  // Universal questions (4-5 questions)
  {
    id: 'general-1',
    category: 'general',
    text: 'What motivates you to give feedback?',
    options: ['Improving the product', 'Helping the community']
  },
  {
    id: 'general-2',
    category: 'general',
    text: 'Ideal feedback frequency?',
    options: ['Weekly check-ins', 'Only major milestones']
  },
  {
    id: 'general-3',
    category: 'general',
    text: 'Transparency level preference?',
    options: ['See all decisions', 'Just final results']
  },
  {
    id: 'general-4',
    category: 'general',
    text: 'Community involvement style?',
    options: ['Active participant', 'Passive observer']
  },
  {
    id: 'general-5',
    category: 'general',
    text: 'Feature priority preference?',
    options: ['User experience', 'Technical robustness']
  },
];

// Question bank manager class
export class QuestionBankManager {
  private usedQuestions: Set<string> = new Set();
  private categoryQueues: Map<string, Question[]> = new Map();

  constructor() {
    this.initializeQueues();
    this.loadUsedQuestions();
  }

  private initializeQueues() {
    // Group questions by category
    const categories = ['auth', 'platform', 'general'] as const;
    
    categories.forEach(category => {
      const categoryQuestions = QUESTION_BANK.filter(q => q.category === category);
      this.categoryQueues.set(category, [...categoryQuestions]);
    });
  }

  private loadUsedQuestions() {
    try {
      const saved = localStorage.getItem('usedQuestions');
      if (saved) {
        this.usedQuestions = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Could not load used questions from localStorage:', error);
    }
  }

  private saveUsedQuestions() {
    try {
      localStorage.setItem('usedQuestions', JSON.stringify([...this.usedQuestions]));
    } catch (error) {
      console.warn('Could not save used questions to localStorage:', error);
    }
  }

  // Get next question using the specified logic
  public getNextQuestion(preferredCategory?: 'auth' | 'platform' | 'general'): Question | null {
    // Try preferred category first
    if (preferredCategory) {
      const question = this.getQuestionFromCategory(preferredCategory);
      if (question) return question;
    }

    // Try other categories in order: auth -> platform -> general
    const categories: ('auth' | 'platform' | 'general')[] = ['auth', 'platform', 'general'];
    
    for (const category of categories) {
      if (category === preferredCategory) continue; // Skip already tried
      
      const question = this.getQuestionFromCategory(category);
      if (question) return question;
    }

    // If all questions exhausted, reset and start over
    this.resetUsedQuestions();
    return this.getQuestionFromCategory('general');
  }

  private getQuestionFromCategory(category: 'auth' | 'platform' | 'general'): Question | null {
    const categoryQuestions = this.categoryQueues.get(category) || [];
    const availableQuestions = categoryQuestions.filter(q => !this.usedQuestions.has(q.id));
    
    if (availableQuestions.length === 0) {
      return null;
    }

    // Random selection within available questions
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Mark as used
    this.usedQuestions.add(selectedQuestion.id);
    this.saveUsedQuestions();
    
    return selectedQuestion;
  }

  private resetUsedQuestions() {
    this.usedQuestions.clear();
    this.saveUsedQuestions();
  }

  // Get statistics for debugging/analytics
  public getStats() {
    return {
      totalQuestions: QUESTION_BANK.length,
      usedQuestions: this.usedQuestions.size,
      remainingQuestions: QUESTION_BANK.length - this.usedQuestions.size,
      categoryBreakdown: {
        auth: QUESTION_BANK.filter(q => q.category === 'auth').length,
        platform: QUESTION_BANK.filter(q => q.category === 'platform').length,
        general: QUESTION_BANK.filter(q => q.category === 'general').length,
      }
    };
  }
}

// Singleton instance
export const questionBank = new QuestionBankManager();