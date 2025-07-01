import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

export interface TimeUnit {
  value: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
}

export interface TimestampEstimateProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Current estimate value */
  value?: TimeUnit;
  /** Callback when estimate changes */
  onChange?: (value: TimeUnit) => void;
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
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Available time units */
  allowedUnits?: Array<'minutes' | 'hours' | 'days' | 'weeks' | 'months'>;
  /** Preset quick select options */
  presets?: Array<{label: string; value: TimeUnit}>;
  /** Show confidence indicator */
  showConfidence?: boolean;
  /** Confidence level (0-100) */
  confidence?: number;
  /** Confidence change callback */
  onConfidenceChange?: (confidence: number) => void;
  /** Additional CSS classes */
  className?: string;
}

export function TimestampEstimate({
  question,
  description,
  value = { value: 1, unit: 'days' },
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  min = 1,
  max = 1000,
  allowedUnits = ['hours', 'days', 'weeks', 'months'],
  presets,
  showConfidence = false,
  confidence = 70,
  onConfidenceChange,
  className,
}: TimestampEstimateProps) {
  const [estimate, setEstimate] = useState<TimeUnit>(value);
  const [currentConfidence, setCurrentConfidence] = useState(confidence);

  const handleValueChange = (newValue: number) => {
    const clampedValue = Math.max(min, Math.min(max, newValue));
    const newEstimate = { ...estimate, value: clampedValue };
    setEstimate(newEstimate);
    onChange?.(newEstimate);
  };

  const handleUnitChange = (newUnit: TimeUnit['unit']) => {
    const newEstimate = { ...estimate, unit: newUnit };
    setEstimate(newEstimate);
    onChange?.(newEstimate);
  };

  const handlePresetSelect = (preset: TimeUnit) => {
    setEstimate(preset);
    onChange?.(preset);
  };

  const handleConfidenceChange = (newConfidence: number) => {
    setCurrentConfidence(newConfidence);
    onConfidenceChange?.(newConfidence);
  };

  const getUnitLabel = (unit: TimeUnit['unit'], value: number) => {
    const labels = {
      minutes: value === 1 ? 'minute' : 'minutes',
      hours: value === 1 ? 'hour' : 'hours',
      days: value === 1 ? 'day' : 'days',
      weeks: value === 1 ? 'week' : 'weeks',
      months: value === 1 ? 'month' : 'months',
    };
    return labels[unit];
  };

  const getEstimateInHours = (timeUnit: TimeUnit): number => {
    const multipliers = {
      minutes: 1 / 60,
      hours: 1,
      days: 8, // Work days
      weeks: 40, // Work weeks
      months: 160, // Work months (4 weeks)
    };
    return timeUnit.value * multipliers[timeUnit.unit];
  };

  const formatEstimate = (timeUnit: TimeUnit): string => {
    return `${timeUnit.value} ${getUnitLabel(timeUnit.unit, timeUnit.value)}`;
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600 bg-green-50';
    if (conf >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 80) return 'High confidence';
    if (conf >= 60) return 'Medium confidence';
    return 'Low confidence';
  };

  const defaultPresets = [
    { label: '30 minutes', value: { value: 30, unit: 'minutes' as const } },
    { label: '2 hours', value: { value: 2, unit: 'hours' as const } },
    { label: '1 day', value: { value: 1, unit: 'days' as const } },
    { label: '1 week', value: { value: 1, unit: 'weeks' as const } },
    { label: '2 weeks', value: { value: 2, unit: 'weeks' as const } },
    { label: '1 month', value: { value: 1, unit: 'months' as const } },
  ];

  const presetsToShow = presets || defaultPresets.filter(preset => 
    allowedUnits.includes(preset.value.unit)
  );

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

      {/* Preset Quick Select */}
      {presetsToShow.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-off-black dark:text-off-white">
            Quick estimates:
          </h4>
          <div className="flex flex-wrap gap-2">
            {presetsToShow.map((preset, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "px-3 py-2 text-sm rounded-lg border transition-colors",
                  "hover:border-primary hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  estimate.value === preset.value.value && estimate.unit === preset.value.unit
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-light-gray text-warm-gray",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && handlePresetSelect(preset.value)}
                disabled={disabled}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Estimate Input */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-off-black dark:text-off-white">
          Custom estimate:
        </h4>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label htmlFor="estimate-value" className="sr-only">
              Estimate value
            </label>
            <input
              id="estimate-value"
              type="number"
              min={min}
              max={max}
              value={estimate.value}
              onChange={(e) => handleValueChange(parseInt(e.target.value) || 1)}
              disabled={disabled}
              className={cn(
                "w-full px-4 py-3 border border-light-gray rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-lg font-semibold text-center",
                "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-red-500"
              )}
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="estimate-unit" className="sr-only">
              Time unit
            </label>
            <select
              id="estimate-unit"
              value={estimate.unit}
              onChange={(e) => handleUnitChange(e.target.value as TimeUnit['unit'])}
              disabled={disabled}
              className={cn(
                "w-full px-4 py-3 border border-light-gray rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "text-lg bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
                disabled && "opacity-50 cursor-not-allowed",
                error && "border-red-500"
              )}
            >
              {allowedUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {getUnitLabel(unit, estimate.value)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estimate Summary */}
        <div className="flex items-center justify-between p-4 bg-light-gray/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium text-off-black dark:text-off-white">
              Estimate: {formatEstimate(estimate)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-warm-gray">
            <Calendar className="w-4 h-4" />
            <span>≈ {getEstimateInHours(estimate)} work hours</span>
          </div>
        </div>
      </div>

      {/* Confidence Level */}
      {showConfidence && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="confidence-slider"
              className="text-sm font-medium text-off-black dark:text-off-white"
            >
              Confidence level:
            </label>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getConfidenceColor(currentConfidence)
            )}>
              {currentConfidence}% - {getConfidenceLabel(currentConfidence)}
            </span>
          </div>
          
          <input
            id="confidence-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={currentConfidence}
            onChange={(e) => handleConfidenceChange(parseInt(e.target.value))}
            disabled={disabled}
            className={cn(
              "w-full h-2 bg-light-gray rounded-lg appearance-none cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          
          <div className="flex justify-between text-xs text-warm-gray">
            <span>0% - Not confident</span>
            <span>100% - Very confident</span>
          </div>
        </div>
      )}

      {/* Estimation Tips */}
      <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Tip:</strong> Consider breaking down complex tasks into smaller parts. 
          Most developers underestimate by 25-50%, so add buffer time for testing and debugging.
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

export default TimestampEstimate;