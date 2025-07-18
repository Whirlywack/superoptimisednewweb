import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Shield,
  TrendingUp,
  TrendingDown,
  Balance
} from 'lucide-react';

export type ToleranceLevel = 'low' | 'medium' | 'high';

export interface TechDebtScenario {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  tradeoffs: {
    shortTerm: string;
    longTerm: string;
  };
}

export interface ToleranceOption {
  level: ToleranceLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  traits: string[];
}

export interface TechDebtToleranceProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Current tolerance level */
  value?: ToleranceLevel;
  /** Callback when tolerance changes */
  onChange?: (value: ToleranceLevel) => void;
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
  /** Tech debt scenario to evaluate */
  scenario?: TechDebtScenario;
  /** Show detailed trade-off analysis */
  showTradeoffs?: boolean;
  /** Show personality traits for each tolerance level */
  showTraits?: boolean;
  /** Visual style variant */
  variant?: 'scale' | 'cards' | 'scenarios';
  /** Additional CSS classes */
  className?: string;
}

export function TechDebtTolerance({
  question,
  description,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  scenario,
  showTradeoffs = true,
  showTraits = false,
  variant = 'scale',
  className,
}: TechDebtToleranceProps) {
  const [selectedTolerance, setSelectedTolerance] = useState<ToleranceLevel | undefined>(value);

  const handleSelect = (tolerance: ToleranceLevel) => {
    if (disabled) return;
    setSelectedTolerance(tolerance);
    onChange?.(tolerance);
  };

  const toleranceOptions: ToleranceOption[] = [
    {
      level: 'low',
      label: 'Low Tolerance',
      description: 'Prefer to address technical debt immediately, even if it slows down feature development',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-red-500',
      traits: ['Quality-focused', 'Risk-averse', 'Long-term thinking', 'Process-oriented']
    },
    {
      level: 'medium',
      label: 'Balanced Approach',
      description: 'Accept some technical debt for short-term gains, but regularly prioritize cleanup',
      icon: <Balance className="w-5 h-5" />,
      color: 'text-yellow-500',
      traits: ['Pragmatic', 'Context-aware', 'Strategic', 'Balanced perspective']
    },
    {
      level: 'high',
      label: 'High Tolerance',
      description: 'Accept significant technical debt to move fast, address it only when it becomes critical',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-green-500',
      traits: ['Speed-focused', 'Adaptable', 'Result-oriented', 'High-pressure tolerance']
    }
  ];

  const getImpactColor = (level: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-red-600 bg-red-50'
    };
    return colors[level];
  };

  const getImpactIcon = (level: 'low' | 'medium' | 'high') => {
    const icons = {
      low: <CheckCircle className="w-4 h-4" />,
      medium: <AlertTriangle className="w-4 h-4" />,
      high: <XCircle className="w-4 h-4" />
    };
    return icons[level];
  };

  const renderScaleVariant = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-warm-gray mb-4">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Low Tolerance
        </span>
        <span className="flex items-center gap-2">
          <Balance className="w-4 h-4" />
          Balanced
        </span>
        <span className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          High Tolerance
        </span>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min="0"
          max="2"
          step="1"
          value={selectedTolerance ? ['low', 'medium', 'high'].indexOf(selectedTolerance) : 1}
          onChange={(e) => {
            const levels: ToleranceLevel[] = ['low', 'medium', 'high'];
            handleSelect(levels[parseInt(e.target.value)]);
          }}
          disabled={disabled}
          className={cn(
            "w-full h-3 bg-light-gray rounded-lg appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div className="flex justify-between mt-2">
          {toleranceOptions.map((option) => (
            <div
              key={option.level}
              className={cn(
                "text-center px-2",
                selectedTolerance === option.level ? option.color : 'text-warm-gray'
              )}
            >
              <div className="mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedTolerance && (
        <div className="mt-4 p-4 bg-light-gray/30 rounded-lg">
          <div className="font-medium text-off-black dark:text-off-white mb-2">
            {toleranceOptions.find(opt => opt.level === selectedTolerance)?.label}
          </div>
          <p className="text-sm text-warm-gray">
            {toleranceOptions.find(opt => opt.level === selectedTolerance)?.description}
          </p>
        </div>
      )}
    </div>
  );

  const renderCardsVariant = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {toleranceOptions.map((option) => {
        const isSelected = selectedTolerance === option.level;
        
        return (
          <button
            key={option.level}
            type="button"
            className={cn(
              "p-6 rounded-lg border-2 transition-all duration-200 text-left",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-light-gray dark:border-warm-gray/30",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && handleSelect(option.level)}
            disabled={disabled}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={cn("transition-colors", isSelected ? option.color : 'text-warm-gray')}>
                {option.icon}
              </div>
              <h3 className="font-medium text-off-black dark:text-off-white">
                {option.label}
              </h3>
            </div>
            
            <p className="text-sm text-warm-gray mb-4 leading-relaxed">
              {option.description}
            </p>
            
            {showTraits && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-off-black dark:text-off-white">
                  Characteristics:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {option.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-warm-gray/10 text-warm-gray rounded"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderScenariosVariant = () => {
    if (!scenario) return renderCardsVariant();
    
    return (
      <div className="space-y-6">
        {/* Scenario Description */}
        <div className="p-6 bg-light-gray/30 rounded-lg">
          <h3 className="font-medium text-off-black dark:text-off-white mb-3">
            Scenario: {scenario.title}
          </h3>
          <p className="text-sm text-warm-gray mb-4 leading-relaxed">
            {scenario.description}
          </p>
          
          {/* Scenario Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", getImpactColor(scenario.impact))}>
                {getImpactIcon(scenario.impact)}
                Impact: {scenario.impact}
              </div>
            </div>
            <div className="text-center">
              <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", getImpactColor(scenario.urgency))}>
                <Clock className="w-4 h-4" />
                Urgency: {scenario.urgency}
              </div>
            </div>
            <div className="text-center">
              <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", getImpactColor(scenario.effort))}>
                <TrendingUp className="w-4 h-4" />
                Effort: {scenario.effort}
              </div>
            </div>
          </div>
          
          {/* Trade-offs */}
          {showTradeoffs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                  Short-term benefits:
                </h4>
                <p className="text-sm text-warm-gray">{scenario.tradeoffs.shortTerm}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                  Long-term costs:
                </h4>
                <p className="text-sm text-warm-gray">{scenario.tradeoffs.longTerm}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Response Options */}
        <div className="space-y-3">
          <h4 className="font-medium text-off-black dark:text-off-white">
            How would you handle this situation?
          </h4>
          {renderCardsVariant()}
        </div>
      </div>
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 'scale':
        return renderScaleVariant();
      case 'scenarios':
        return renderScenariosVariant();
      default:
        return renderCardsVariant();
    }
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

      {/* Tolerance Interface */}
      {renderVariant()}

      {/* Context Information */}
      <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Consider:</strong> Team experience, project timeline, business priorities, 
          and long-term maintenance when evaluating technical debt tolerance.
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

export default TechDebtTolerance;