import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { 
  Zap, 
  Circle, 
  Square, 
  Triangle, 
  Hexagon, 
  Star,
  TrendingUp,
  Brain,
  Clock
} from 'lucide-react';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultyOption {
  level: DifficultyLevel;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  examples?: string[];
}

export interface DifficultyRatingProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Current difficulty rating */
  value?: DifficultyLevel;
  /** Callback when rating changes */
  onChange?: (value: DifficultyLevel) => void;
  /** Whether the question is required */
  required?: boolean;
  /** Validation error message */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show skip option */
  allowSkip?: boolean;
  /** Skip callback */
  onSkip?: () => void;
  /** Visual style for difficulty indicators */
  variant?: 'stars' | 'circles' | 'bars' | 'shapes' | 'custom';
  /** Custom difficulty options (overrides default) */
  customOptions?: DifficultyOption[];
  /** Show detailed descriptions */
  showDescriptions?: boolean;
  /** Show example tasks for each level */
  showExamples?: boolean;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS classes */
  className?: string;
}

export function DifficultyRating({
  question,
  description,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  variant = 'stars',
  customOptions,
  showDescriptions = true,
  showExamples = false,
  orientation = 'horizontal',
  className,
}: DifficultyRatingProps) {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | undefined>(value);

  const handleSelect = (level: DifficultyLevel) => {
    if (disabled) return;
    setSelectedLevel(level);
    onChange?.(level);
  };

  const defaultOptions: Record<string, DifficultyOption[]> = {
    stars: [
      {
        level: 1,
        label: 'Very Easy',
        description: 'Trivial task, can be done quickly with existing knowledge',
        icon: <Star className="w-5 h-5" />,
        color: 'text-green-500',
        examples: ['Fix typo', 'Update documentation', 'Change color values']
      },
      {
        level: 2,
        label: 'Easy',
        description: 'Simple task requiring basic programming skills',
        icon: <Star className="w-5 h-5" />,
        color: 'text-green-400',
        examples: ['Add form validation', 'Create simple component', 'Write unit test']
      },
      {
        level: 3,
        label: 'Medium',
        description: 'Moderate complexity requiring some research or planning',
        icon: <Star className="w-5 h-5" />,
        color: 'text-yellow-500',
        examples: ['Integrate third-party API', 'Optimize database queries', 'Implement caching']
      },
      {
        level: 4,
        label: 'Hard',
        description: 'Complex task requiring significant expertise and careful planning',
        icon: <Star className="w-5 h-5" />,
        color: 'text-orange-500',
        examples: ['Design new architecture', 'Implement real-time features', 'Performance optimization']
      },
      {
        level: 5,
        label: 'Very Hard',
        description: 'Extremely complex, may require research or learning new technologies',
        icon: <Star className="w-5 h-5" />,
        color: 'text-red-500',
        examples: ['Build custom framework', 'Implement ML algorithms', 'Solve scalability issues']
      }
    ],
    circles: [
      { level: 1, label: 'Beginner', icon: <Circle className="w-4 h-4" />, color: 'text-green-500' },
      { level: 2, label: 'Novice', icon: <Circle className="w-5 h-5" />, color: 'text-green-400' },
      { level: 3, label: 'Intermediate', icon: <Circle className="w-6 h-6" />, color: 'text-yellow-500' },
      { level: 4, label: 'Advanced', icon: <Circle className="w-7 h-7" />, color: 'text-orange-500' },
      { level: 5, label: 'Expert', icon: <Circle className="w-8 h-8" />, color: 'text-red-500' }
    ],
    shapes: [
      { level: 1, label: 'Basic', icon: <Circle className="w-5 h-5" />, color: 'text-green-500' },
      { level: 2, label: 'Simple', icon: <Square className="w-5 h-5" />, color: 'text-green-400' },
      { level: 3, label: 'Moderate', icon: <Triangle className="w-5 h-5" />, color: 'text-yellow-500' },
      { level: 4, label: 'Complex', icon: <Hexagon className="w-5 h-5" />, color: 'text-orange-500' },
      { level: 5, label: 'Advanced', icon: <Star className="w-5 h-5" />, color: 'text-red-500' }
    ],
    bars: Array.from({ length: 5 }, (_, i) => ({
      level: (i + 1) as DifficultyLevel,
      label: `Level ${i + 1}`,
      icon: <div className={`w-3 bg-current rounded`} style={{ height: `${(i + 1) * 4 + 8}px` }} />,
      color: `text-${['green', 'green', 'yellow', 'orange', 'red'][i]}-${[500, 400, 500, 500, 500][i]}`
    })),
    custom: []
  };

  const options = customOptions || defaultOptions[variant] || defaultOptions.stars;

  const renderOption = (option: DifficultyOption, index: number) => {
    const isSelected = selectedLevel === option.level;
    const isBeforeSelected = selectedLevel && option.level <= selectedLevel;

    return (
      <div
        key={option.level}
        className={cn(
          orientation === 'vertical' ? 'w-full' : 'flex-1'
        )}
      >
        <button
          type="button"
          className={cn(
            "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left",
            "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isSelected
              ? "border-primary bg-primary/10"
              : "border-light-gray dark:border-warm-gray/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && handleSelect(option.level)}
          disabled={disabled}
          aria-pressed={isSelected}
          aria-describedby={showDescriptions ? `difficulty-${option.level}-desc` : undefined}
        >
          <div className="flex items-center space-x-3">
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 transition-colors",
              variant === 'stars' && isBeforeSelected ? option.color : 
              isSelected ? option.color : 'text-warm-gray'
            )}>
              {option.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-off-black dark:text-off-white">
                {option.label}
              </div>
              
              {showDescriptions && option.description && (
                <p
                  id={`difficulty-${option.level}-desc`}
                  className="text-sm text-warm-gray mt-1 leading-relaxed"
                >
                  {option.description}
                </p>
              )}

              {showExamples && option.examples && option.examples.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-warm-gray mb-1">Examples:</div>
                  <div className="flex flex-wrap gap-1">
                    {option.examples.slice(0, 3).map((example, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-warm-gray/10 text-warm-gray rounded"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Level indicator */}
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors",
              isSelected
                ? "border-primary bg-primary text-off-white"
                : "border-warm-gray text-warm-gray"
            )}>
              {option.level}
            </div>
          </div>
        </button>
      </div>
    );
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        {Array.from({ length: 5 }, (_, i) => {
          const level = (i + 1) as DifficultyLevel;
          const isFilled = selectedLevel && level <= selectedLevel;
          
          return (
            <button
              key={level}
              type="button"
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && handleSelect(level)}
              disabled={disabled}
              aria-label={`${level} star${level > 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  isFilled ? "text-yellow-400 fill-current" : "text-warm-gray"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Header */}
      <div className="space-y-2">
        <QuestionLabel required={required}>
          {question}
        </QuestionLabel>
        {description && (
          <p className="text-warm-gray text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Rating Interface */}
      {variant === 'stars' && !showDescriptions ? (
        renderStarRating()
      ) : (
        <div className={cn(
          "space-y-3",
          orientation === 'horizontal' && "flex space-y-0 space-x-3"
        )}>
          {options.map((option, index) => renderOption(option, index))}
        </div>
      )}

      {/* Selected Level Summary */}
      {selectedLevel && (
        <div className="flex items-center justify-center p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">
                Selected Difficulty: Level {selectedLevel}
              </span>
            </div>
            <span className="text-sm text-warm-gray">
              ({options.find(opt => opt.level === selectedLevel)?.label})
            </span>
          </div>
        </div>
      )}

      {/* Difficulty Guide */}
      <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Rating Guide:</strong> Consider technical complexity, required expertise, 
          time investment, and potential risks when rating difficulty.
        </div>
      </div>

      {/* Validation Error */}
      {error && (
        <ValidationMessage type="error" message={error} />
      )}

      {/* Skip Option */}
      {allowSkip && onSkip && (
        <div className="flex justify-center">
          <SkipControl
            variant="subtle"
            onClick={onSkip}
            disabled={disabled}
          >
            Skip this question
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default DifficultyRating;