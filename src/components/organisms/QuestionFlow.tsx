import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { QuestionCard, type QuestionData } from './QuestionCard';
import { MultipleChoice } from '../molecules/MultipleChoice';
import { YesNoQuestion } from '../molecules/YesNoQuestion';
import { RatingScale } from '../molecules/RatingScale';
import { TextFeedback } from '../molecules/TextFeedback';
import { RankingQuestion } from '../molecules/RankingQuestion';
import { CodeApproachComparison } from '../molecules/CodeApproachComparison';
import { ArchitectureChoice } from '../molecules/ArchitectureChoice';
import { TimestampEstimate } from '../molecules/TimestampEstimate';
import { DifficultyRating } from '../molecules/DifficultyRating';
import { TechDebtTolerance } from '../molecules/TechDebtTolerance';

export interface QuestionFlowData extends QuestionData {
  /** Conditional logic for showing/hiding questions */
  conditions?: {
    /** Question ID to check */
    dependsOn: string;
    /** Required value to show this question */
    requiredValue: any;
    /** Operator for comparison */
    operator?: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  }[];
  /** Question-specific configuration */
  config?: Record<string, any>;
}

export interface QuestionFlowState {
  /** Current question index */
  currentIndex: number;
  /** All answers collected so far */
  answers: Record<string, any>;
  /** Questions that have been flagged */
  flaggedQuestions: Set<string>;
  /** Validation errors for each question */
  errors: Record<string, string>;
  /** Flow completion status */
  isComplete: boolean;
  /** Questions that are currently visible based on conditions */
  visibleQuestions: QuestionFlowData[];
}

export interface QuestionFlowProps {
  /** Array of questions to display */
  questions: QuestionFlowData[];
  /** Initial answers (for resuming flows) */
  initialAnswers?: Record<string, any>;
  /** Initial flagged questions */
  initialFlagged?: string[];
  /** Allow skipping optional questions */
  allowSkip?: boolean;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Show question counter */
  showCounter?: boolean;
  /** Auto-advance on answer (for single-choice questions) */
  autoAdvance?: boolean;
  /** Auto-advance delay in ms */
  autoAdvanceDelay?: number;
  /** Save answers automatically */
  autoSave?: boolean;
  /** Auto-save interval in ms */
  autoSaveInterval?: number;
  /** Custom validation function */
  validateAnswer?: (question: QuestionFlowData, answer: any) => string | null;
  /** Callback when answer changes */
  onAnswerChange?: (questionId: string, answer: any, allAnswers: Record<string, any>) => void;
  /** Callback when question is flagged/unflagged */
  onQuestionFlag?: (questionId: string, isFlagged: boolean) => void;
  /** Callback when flow is completed */
  onComplete?: (answers: Record<string, any>, flaggedQuestions: string[]) => void;
  /** Callback for auto-save */
  onAutoSave?: (answers: Record<string, any>) => void;
  /** Callback when navigation changes */
  onNavigationChange?: (currentIndex: number, direction: 'next' | 'previous') => void;
  /** Additional CSS classes */
  className?: string;
}

export function QuestionFlow({
  questions,
  initialAnswers = {},
  initialFlagged = [],
  allowSkip = false,
  showProgress = true,
  showCounter = true,
  autoAdvance = false,
  autoAdvanceDelay = 1000,
  autoSave = false,
  autoSaveInterval = 10000,
  validateAnswer,
  onAnswerChange,
  onQuestionFlag,
  onComplete,
  onAutoSave,
  onNavigationChange,
  className,
}: QuestionFlowProps) {
  const [state, setState] = useState<QuestionFlowState>(() => {
    const visibleQuestions = getVisibleQuestions(questions, initialAnswers);
    return {
      currentIndex: 0,
      answers: initialAnswers,
      flaggedQuestions: new Set(initialFlagged),
      errors: {},
      isComplete: false,
      visibleQuestions,
    };
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onAutoSave) return;
    
    const interval = setInterval(() => {
      onAutoSave(state.answers);
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, onAutoSave, state.answers]);

  // Function to evaluate question conditions
  function getVisibleQuestions(allQuestions: QuestionFlowData[], answers: Record<string, any>): QuestionFlowData[] {
    return allQuestions.filter(question => {
      if (!question.conditions || question.conditions.length === 0) {
        return true;
      }

      return question.conditions.every(condition => {
        const dependentAnswer = answers[condition.dependsOn];
        if (dependentAnswer === undefined || dependentAnswer === null) {
          return false;
        }

        const operator = condition.operator || 'equals';
        
        switch (operator) {
          case 'equals':
            return dependentAnswer === condition.requiredValue;
          case 'not-equals':
            return dependentAnswer !== condition.requiredValue;
          case 'contains':
            return Array.isArray(dependentAnswer) 
              ? dependentAnswer.includes(condition.requiredValue)
              : String(dependentAnswer).includes(String(condition.requiredValue));
          case 'greater-than':
            return Number(dependentAnswer) > Number(condition.requiredValue);
          case 'less-than':
            return Number(dependentAnswer) < Number(condition.requiredValue);
          default:
            return dependentAnswer === condition.requiredValue;
        }
      });
    });
  }

  const handleAnswerChange = useCallback((answer: any) => {
    const currentQuestion = state.visibleQuestions[state.currentIndex];
    if (!currentQuestion) return;

    const newAnswers = { ...state.answers, [currentQuestion.id]: answer };
    const newVisibleQuestions = getVisibleQuestions(questions, newAnswers);
    
    // Clear error for this question
    const newErrors = { ...state.errors };
    delete newErrors[currentQuestion.id];

    setState(prev => ({
      ...prev,
      answers: newAnswers,
      visibleQuestions: newVisibleQuestions,
      errors: newErrors,
    }));

    onAnswerChange?.(currentQuestion.id, answer, newAnswers);

    // Auto-advance for certain question types
    if (autoAdvance && shouldAutoAdvance(currentQuestion, answer)) {
      setTimeout(() => {
        handleNext();
      }, autoAdvanceDelay);
    }
  }, [state.currentIndex, state.visibleQuestions, state.answers, state.errors, questions, onAnswerChange, autoAdvance, autoAdvanceDelay]);

  const shouldAutoAdvance = (question: QuestionFlowData, answer: any): boolean => {
    if (!answer) return false;
    
    // Auto-advance for yes/no and single-choice questions
    return question.type === 'yes-no' || 
           (question.type === 'multiple-choice' && !question.config?.allowMultiple);
  };

  const validateCurrentAnswer = useCallback((): string | null => {
    const currentQuestion = state.visibleQuestions[state.currentIndex];
    if (!currentQuestion) return null;

    const answer = state.answers[currentQuestion.id];

    // Check required validation
    if (currentQuestion.required && (answer === undefined || answer === null || answer === '')) {
      return 'This question is required.';
    }

    // Custom validation
    if (validateAnswer) {
      const customError = validateAnswer(currentQuestion, answer);
      if (customError) return customError;
    }

    // Type-specific validation
    if (currentQuestion.validation) {
      const { validation } = currentQuestion;
      
      if (validation.minLength && String(answer).length < validation.minLength) {
        return `Answer must be at least ${validation.minLength} characters.`;
      }
      
      if (validation.maxLength && String(answer).length > validation.maxLength) {
        return `Answer must be no more than ${validation.maxLength} characters.`;
      }
      
      if (validation.min && Number(answer) < validation.min) {
        return `Value must be at least ${validation.min}.`;
      }
      
      if (validation.max && Number(answer) > validation.max) {
        return `Value must be no more than ${validation.max}.`;
      }
      
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(String(answer))) {
          return 'Answer format is invalid.';
        }
      }
    }

    return null;
  }, [state.currentIndex, state.visibleQuestions, state.answers, validateAnswer]);

  const handleNext = useCallback(() => {
    const error = validateCurrentAnswer();
    if (error) {
      const currentQuestion = state.visibleQuestions[state.currentIndex];
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [currentQuestion.id]: error }
      }));
      return;
    }

    if (state.currentIndex < state.visibleQuestions.length - 1) {
      const newIndex = state.currentIndex + 1;
      setState(prev => ({ ...prev, currentIndex: newIndex }));
      onNavigationChange?.(newIndex, 'next');
    } else {
      // Flow complete
      setState(prev => ({ ...prev, isComplete: true }));
      onComplete?.(state.answers, Array.from(state.flaggedQuestions));
    }
  }, [state.currentIndex, state.visibleQuestions, state.answers, state.flaggedQuestions, validateCurrentAnswer, onNavigationChange, onComplete]);

  const handlePrevious = useCallback(() => {
    if (state.currentIndex > 0) {
      const newIndex = state.currentIndex - 1;
      setState(prev => ({ ...prev, currentIndex: newIndex }));
      onNavigationChange?.(newIndex, 'previous');
    }
  }, [state.currentIndex, onNavigationChange]);

  const handleSkip = useCallback(() => {
    if (state.currentIndex < state.visibleQuestions.length - 1) {
      const newIndex = state.currentIndex + 1;
      setState(prev => ({ ...prev, currentIndex: newIndex }));
      onNavigationChange?.(newIndex, 'next');
    } else {
      setState(prev => ({ ...prev, isComplete: true }));
      onComplete?.(state.answers, Array.from(state.flaggedQuestions));
    }
  }, [state.currentIndex, state.visibleQuestions, state.answers, state.flaggedQuestions, onNavigationChange, onComplete]);

  const handleFlag = useCallback(() => {
    const currentQuestion = state.visibleQuestions[state.currentIndex];
    if (!currentQuestion) return;

    const newFlagged = new Set(state.flaggedQuestions);
    const isFlagged = newFlagged.has(currentQuestion.id);
    
    if (isFlagged) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }

    setState(prev => ({ ...prev, flaggedQuestions: newFlagged }));
    onQuestionFlag?.(currentQuestion.id, !isFlagged);
  }, [state.currentIndex, state.visibleQuestions, state.flaggedQuestions, onQuestionFlag]);

  const renderQuestionContent = (question: QuestionFlowData) => {
    const value = state.answers[question.id];
    const config = question.config || {};

    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={question.question}
            options={config.options || []}
            value={value}
            layout={config.layout || 'vertical'}
            onChange={handleAnswerChange}
          />
        );

      case 'yes-no':
        return (
          <YesNoQuestion
            questionId={question.id}
            questionText=""
            value={value}
            showUnsure={config.showUnsure || false}
            onChange={handleAnswerChange}
          />
        );

      case 'rating':
        return (
          <RatingScale
            questionId={question.id}
            questionText=""
            min={config.min || 1}
            max={config.max || 10}
            step={config.step || 1}
            value={value}
            showLabels={config.showLabels !== false}
            onChange={handleAnswerChange}
          />
        );

      case 'text':
        return (
          <TextFeedback
            questionId={question.id}
            questionText=""
            value={value}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            showCharacterCount={config.showCharacterCount !== false}
            onChange={handleAnswerChange}
          />
        );

      case 'ranking':
        return (
          <RankingQuestion
            questionId={question.id}
            questionText=""
            items={config.items || []}
            value={value}
            maxSelections={config.maxSelections}
            onChange={handleAnswerChange}
          />
        );

      case 'code-comparison':
        return (
          <CodeApproachComparison
            question=""
            approaches={config.approaches || []}
            value={value}
            layout={config.layout || 'horizontal'}
            showMetadata={config.showMetadata !== false}
            onChange={handleAnswerChange}
          />
        );

      case 'architecture':
        return (
          <ArchitectureChoice
            question=""
            architectures={config.architectures || []}
            value={value}
            layout={config.layout || 'grid'}
            columns={config.columns || 2}
            onChange={handleAnswerChange}
          />
        );

      case 'time-estimate':
        return (
          <TimestampEstimate
            question=""
            value={value}
            allowedUnits={config.allowedUnits}
            presets={config.presets}
            showConfidence={config.showConfidence}
            onChange={handleAnswerChange}
          />
        );

      case 'difficulty':
        return (
          <DifficultyRating
            question=""
            value={value}
            variant={config.variant || 'stars'}
            showDescriptions={config.showDescriptions !== false}
            showExamples={config.showExamples || false}
            onChange={handleAnswerChange}
          />
        );

      case 'tech-debt':
        return (
          <TechDebtTolerance
            question=""
            value={value}
            variant={config.variant || 'cards'}
            scenario={config.scenario}
            showTradeoffs={config.showTradeoffs !== false}
            onChange={handleAnswerChange}
          />
        );

      default:
        return (
          <div className="py-8 text-center text-warm-gray">
            <div>Unsupported question type: {question.type}</div>
            <div className="mt-2 text-sm">Please implement the renderer for this question type</div>
          </div>
        );
    }
  };

  if (state.isComplete) {
    return (
      <div className={cn("mx-auto w-full max-w-4xl py-12 text-center", className)}>
        <div className="space-y-4">
          <div className="text-2xl font-semibold text-off-black dark:text-off-white">
            Questionnaire Complete!
          </div>
          <div className="text-warm-gray">
            Thank you for completing all {state.visibleQuestions.length} questions.
          </div>
          {state.flaggedQuestions.size > 0 && (
            <div className="text-sm text-warm-gray">
              {state.flaggedQuestions.size} question{state.flaggedQuestions.size !== 1 ? 's' : ''} flagged for review
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = state.visibleQuestions[state.currentIndex];
  if (!currentQuestion) {
    return (
      <div className={cn("mx-auto w-full max-w-4xl py-12 text-center", className)}>
        <div className="text-warm-gray">No questions available</div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <QuestionCard
        question={currentQuestion}
        currentIndex={state.currentIndex}
        totalQuestions={state.visibleQuestions.length}
        value={state.answers[currentQuestion.id]}
        error={state.errors[currentQuestion.id]}
        showProgress={showProgress}
        showCounter={showCounter}
        allowSkip={allowSkip && !currentQuestion.required}
        isFlagged={state.flaggedQuestions.has(currentQuestion.id)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onFlag={handleFlag}
        className="focus-within:border-primary hover:border-primary/50"
      >
        {renderQuestionContent(currentQuestion)}
      </QuestionCard>
    </div>
  );
}

export default QuestionFlow;