import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

export type ConditionOperator = 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'greater-equal' | 'less-equal' | 'exists' | 'not-exists';

export interface Condition {
  /** The field/question ID to check */
  field: string;
  /** The operator for comparison */
  operator: ConditionOperator;
  /** The value to compare against */
  value?: any;
  /** Optional nested conditions (for complex logic) */
  and?: Condition[];
  /** Optional nested conditions (for complex logic) */
  or?: Condition[];
}

export interface ConditionalRule {
  /** Unique identifier for this rule */
  id: string;
  /** Human-readable name for debugging */
  name?: string;
  /** The condition that must be met */
  condition: Condition;
  /** Action to take when condition is met */
  action: 'show' | 'hide' | 'require' | 'optional' | 'disable' | 'enable';
  /** Optional CSS classes to apply when condition is met */
  className?: string;
  /** Optional styles to apply when condition is met */
  style?: React.CSSProperties;
}

export interface ConditionalLogicProps {
  /** The current form data/answers */
  data: Record<string, any>;
  /** Array of conditional rules to evaluate */
  rules: ConditionalRule[];
  /** Children to render based on conditional logic */
  children: (results: ConditionalResults) => React.ReactNode;
  /** Debug mode to show condition evaluation details */
  debug?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface ConditionalResults {
  /** Rules that are currently active/true */
  activeRules: ConditionalRule[];
  /** Visibility state for each rule */
  visibility: Record<string, boolean>;
  /** Requirement state for each rule */
  requirements: Record<string, boolean>;
  /** Enablement state for each rule */
  enablement: Record<string, boolean>;
  /** Computed CSS classes from active rules */
  computedClasses: string;
  /** Computed styles from active rules */
  computedStyles: React.CSSProperties;
  /** Check if a specific condition is met */
  isConditionMet: (condition: Condition) => boolean;
  /** Get all rules affecting a specific field */
  getRulesForField: (fieldId: string) => ConditionalRule[];
}

export function ConditionalLogic({
  data,
  rules,
  children,
  debug = false,
  className,
}: ConditionalLogicProps) {
  const results = useMemo(() => {
    const activeRules: ConditionalRule[] = [];
    const visibility: Record<string, boolean> = {};
    const requirements: Record<string, boolean> = {};
    const enablement: Record<string, boolean> = {};
    
    // Helper function to evaluate a single condition
    const evaluateCondition = (condition: Condition): boolean => {
      // Handle nested AND conditions
      if (condition.and && condition.and.length > 0) {
        return condition.and.every(evaluateCondition);
      }
      
      // Handle nested OR conditions
      if (condition.or && condition.or.length > 0) {
        return condition.or.some(evaluateCondition);
      }
      
      const fieldValue = data[condition.field];
      const compareValue = condition.value;
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === compareValue;
        
        case 'not-equals':
          return fieldValue !== compareValue;
        
        case 'contains':
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(compareValue);
          }
          return String(fieldValue || '').includes(String(compareValue || ''));
        
        case 'not-contains':
          if (Array.isArray(fieldValue)) {
            return !fieldValue.includes(compareValue);
          }
          return !String(fieldValue || '').includes(String(compareValue || ''));
        
        case 'greater-than':
          return Number(fieldValue) > Number(compareValue);
        
        case 'less-than':
          return Number(fieldValue) < Number(compareValue);
        
        case 'greater-equal':
          return Number(fieldValue) >= Number(compareValue);
        
        case 'less-equal':
          return Number(fieldValue) <= Number(compareValue);
        
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        
        case 'not-exists':
          return fieldValue === undefined || fieldValue === null || fieldValue === '';
        
        default:
          if (debug) {
            console.warn(`Unknown condition operator: ${condition.operator}`);
          }
          return false;
      }
    };
    
    // Evaluate all rules
    rules.forEach(rule => {
      const isConditionMet = evaluateCondition(rule.condition);
      
      if (isConditionMet) {
        activeRules.push(rule);
        
        // Apply action
        switch (rule.action) {
          case 'show':
            visibility[rule.id] = true;
            break;
          case 'hide':
            visibility[rule.id] = false;
            break;
          case 'require':
            requirements[rule.id] = true;
            break;
          case 'optional':
            requirements[rule.id] = false;
            break;
          case 'enable':
            enablement[rule.id] = true;
            break;
          case 'disable':
            enablement[rule.id] = false;
            break;
        }
      }
    });
    
    // Compute aggregated styles and classes
    const computedClasses = activeRules
      .map(rule => rule.className)
      .filter(Boolean)
      .join(' ');
    
    const computedStyles = activeRules
      .map(rule => rule.style)
      .filter(Boolean)
      .reduce((acc, style) => ({ ...acc, ...style }), {});
    
    const getRulesForField = (fieldId: string): ConditionalRule[] => {
      return rules.filter(rule => 
        rule.condition.field === fieldId ||
        (rule.condition.and && rule.condition.and.some(c => c.field === fieldId)) ||
        (rule.condition.or && rule.condition.or.some(c => c.field === fieldId))
      );
    };
    
    return {
      activeRules,
      visibility,
      requirements,
      enablement,
      computedClasses,
      computedStyles,
      isConditionMet: evaluateCondition,
      getRulesForField,
    };
  }, [data, rules, debug]);
  
  if (debug) {
    console.group('ConditionalLogic Debug');
    console.log('Current data:', data);
    console.log('Active rules:', results.activeRules);
    console.log('Visibility state:', results.visibility);
    console.log('Requirements state:', results.requirements);
    console.log('Enablement state:', results.enablement);
    console.groupEnd();
  }
  
  return (
    <div className={cn("conditional-logic", results.computedClasses, className)} style={results.computedStyles}>
      {children(results)}
    </div>
  );
}

// Helper components for common conditional patterns

interface ConditionalFieldProps {
  /** Field identifier */
  fieldId: string;
  /** Conditional logic results */
  results: ConditionalResults;
  /** Content to render */
  children: React.ReactNode;
  /** Fallback content when hidden */
  fallback?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ConditionalField({ 
  fieldId, 
  results, 
  children, 
  fallback = null,
  className 
}: ConditionalFieldProps) {
  const rulesForField = results.getRulesForField(fieldId);
  const isVisible = !rulesForField.some(rule => 
    rule.action === 'hide' && results.activeRules.includes(rule)
  );
  const isRequired = rulesForField.some(rule => 
    rule.action === 'require' && results.activeRules.includes(rule)
  );
  const isEnabled = !rulesForField.some(rule => 
    rule.action === 'disable' && results.activeRules.includes(rule)
  );
  
  if (!isVisible) {
    return <>{fallback}</>;
  }
  
  const fieldClasses = cn(
    className,
    {
      'opacity-50 pointer-events-none': !isEnabled,
      'required': isRequired,
    }
  );
  
  return (
    <div className={fieldClasses} data-field-id={fieldId}>
      {children}
    </div>
  );
}

interface ConditionalSectionProps {
  /** Section identifier */
  sectionId: string;
  /** Conditional logic results */
  results: ConditionalResults;
  /** Content to render */
  children: React.ReactNode;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Additional CSS classes */
  className?: string;
}

export function ConditionalSection({ 
  sectionId, 
  results, 
  children, 
  animationDuration = 300,
  className 
}: ConditionalSectionProps) {
  const isVisible = results.visibility[sectionId] !== false;
  
  return (
    <div 
      className={cn(
        "transition-all duration-300 overflow-hidden",
        {
          'max-h-0 opacity-0': !isVisible,
          'max-h-screen opacity-100': isVisible,
        },
        className
      )}
      style={{
        transitionDuration: `${animationDuration}ms`,
      }}
      data-section-id={sectionId}
    >
      {children}
    </div>
  );
}

// Helper functions for building conditions

export const conditions = {
  equals: (field: string, value: any): Condition => ({
    field,
    operator: 'equals',
    value,
  }),
  
  notEquals: (field: string, value: any): Condition => ({
    field,
    operator: 'not-equals',
    value,
  }),
  
  contains: (field: string, value: any): Condition => ({
    field,
    operator: 'contains',
    value,
  }),
  
  exists: (field: string): Condition => ({
    field,
    operator: 'exists',
  }),
  
  notExists: (field: string): Condition => ({
    field,
    operator: 'not-exists',
  }),
  
  greaterThan: (field: string, value: number): Condition => ({
    field,
    operator: 'greater-than',
    value,
  }),
  
  lessThan: (field: string, value: number): Condition => ({
    field,
    operator: 'less-than',
    value,
  }),
  
  and: (...conditions: Condition[]): Condition => ({
    field: '',
    operator: 'equals',
    and: conditions,
  }),
  
  or: (...conditions: Condition[]): Condition => ({
    field: '',
    operator: 'equals',
    or: conditions,
  }),
};

export default ConditionalLogic;