'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchTarget } from './TouchTarget';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
  required?: boolean;
}

export interface MobileFilterProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  triggerClassName?: string;
  overlayClassName?: string;
  drawerClassName?: string;
  showApplyButton?: boolean;
  showClearButton?: boolean;
  'aria-label'?: string;
}

export function MobileFilter({
  groups,
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  triggerClassName,
  overlayClassName,
  drawerClassName,
  showApplyButton = true,
  showClearButton = true,
  'aria-label': ariaLabel = 'Filter options',
  ...props
}: MobileFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExpandedGroups(new Set(groups.map(g => g.id)));
  }, [groups]);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleOptionToggle = (groupId: string, optionValue: string, multiple: boolean = false) => {
    const currentValues = selectedFilters[groupId] || [];
    let newValues: string[];

    if (multiple) {
      if (currentValues.includes(optionValue)) {
        newValues = currentValues.filter(v => v !== optionValue);
      } else {
        newValues = [...currentValues, optionValue];
      }
    } else {
      newValues = currentValues.includes(optionValue) ? [] : [optionValue];
    }

    onFilterChange(groupId, newValues);
  };

  const handleApply = () => {
    onApplyFilters?.();
    setIsOpen(false);
  };

  const handleClear = () => {
    onClearFilters?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const totalSelectedCount = Object.values(selectedFilters).reduce(
    (total, values) => total + values.length,
    0
  );

  const drawer = (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        overlayClassName
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-off-white shadow-xl transition-transform duration-300 ease-in-out',
          'transform',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          drawerClassName
        )}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-light-gray">
            <h2 className="text-h4 font-medium text-off-black">Filters</h2>
            <TouchTarget
              variant="icon"
              size="md"
              onClick={() => setIsOpen(false)}
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </TouchTarget>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {groups.map((group) => (
              <div key={group.id} className="border-b border-light-gray">
                <TouchTarget
                  variant="custom"
                  className="w-full flex items-center justify-between p-4 hover:bg-light-gray"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={expandedGroups.has(group.id)}
                >
                  <span className="font-medium text-off-black">{group.label}</span>
                  <ChevronDown 
                    className={cn(
                      'h-5 w-5 text-warm-gray transition-transform duration-200',
                      expandedGroups.has(group.id) && 'rotate-180'
                    )}
                  />
                </TouchTarget>
                
                {expandedGroups.has(group.id) && (
                  <div className="pb-4">
                    {group.options.map((option) => {
                      const isSelected = (selectedFilters[group.id] || []).includes(option.value);
                      
                      return (
                        <TouchTarget
                          key={option.id}
                          variant="custom"
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-light-gray"
                          onClick={() => handleOptionToggle(group.id, option.value, group.multiple)}
                        >
                          <div className={cn(
                            'flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center',
                            group.multiple ? 'rounded-sm' : 'rounded-full',
                            isSelected 
                              ? 'bg-primary border-primary' 
                              : 'border-warm-gray'
                          )}>
                            {isSelected && (
                              <Check className="h-3 w-3 text-off-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 flex items-center justify-between">
                            <span className={cn(
                              'text-base',
                              isSelected ? 'text-off-black font-medium' : 'text-warm-gray'
                            )}>
                              {option.label}
                            </span>
                            {option.count !== undefined && (
                              <span className="text-small text-warm-gray">
                                ({option.count})
                              </span>
                            )}
                          </div>
                        </TouchTarget>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-light-gray space-y-3">
            {showClearButton && (
              <TouchTarget
                variant="custom"
                className="w-full py-3 text-center border border-warm-gray text-warm-gray hover:bg-light-gray rounded-lg font-medium"
                onClick={handleClear}
              >
                Clear All
              </TouchTarget>
            )}
            
            {showApplyButton && (
              <TouchTarget
                variant="button"
                className="w-full py-3 text-center"
                onClick={handleApply}
              >
                Apply Filters
                {totalSelectedCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-off-white/20 rounded-full text-small">
                    {totalSelectedCount}
                  </span>
                )}
              </TouchTarget>
            )}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-off-black/50 transition-opacity duration-300" />
      )}
    </div>
  );

  return (
    <>
      <TouchTarget
        variant="custom"
        onClick={() => setIsOpen(true)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 border border-warm-gray rounded-lg',
          'text-warm-gray hover:bg-light-gray hover:text-off-black',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'transition-colors duration-200 relative',
          triggerClassName
        )}
        aria-label={`Open filters${totalSelectedCount > 0 ? ` (${totalSelectedCount} active)` : ''}`}
        {...props}
      >
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filter</span>
        {totalSelectedCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-off-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalSelectedCount}
          </span>
        )}
      </TouchTarget>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

export interface QuickFilterProps {
  options: FilterOption[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function QuickFilter({
  options,
  selectedValues,
  onFilterChange,
  multiple = true,
  className,
}: QuickFilterProps) {
  const handleOptionToggle = (value: string) => {
    let newValues: string[];

    if (multiple) {
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter(v => v !== value);
      } else {
        newValues = [...selectedValues, value];
      }
    } else {
      newValues = selectedValues.includes(value) ? [] : [value];
    }

    onFilterChange(newValues);
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        
        return (
          <TouchTarget
            key={option.id}
            variant="custom"
            size="sm"
            onClick={() => handleOptionToggle(option.value)}
            className={cn(
              'px-3 py-2 rounded-full text-small font-medium border transition-colors duration-200',
              isSelected
                ? 'bg-primary text-off-white border-primary'
                : 'bg-off-white text-warm-gray border-warm-gray hover:border-primary hover:text-primary'
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn(
                'ml-1',
                isSelected ? 'text-off-white/80' : 'text-warm-gray'
              )}>
                ({option.count})
              </span>
            )}
          </TouchTarget>
        );
      })}
    </div>
  );
}