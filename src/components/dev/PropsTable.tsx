'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PropDefinition {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
  options?: string[];
}

export interface PropsTableProps {
  props: PropDefinition[];
  title?: string;
  className?: string;
}

export function PropsTable({ 
  props, 
  title = "Props",
  className 
}: PropsTableProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-light-gray', className)}>
      {title && (
        <div className="bg-light-gray px-6 py-3 border-b border-light-gray">
          <h3 className="text-h4 font-semibold text-off-black">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-off-white border-b border-light-gray">
              <th className="px-6 py-3 text-left text-small font-semibold text-off-black">
                Name
              </th>
              <th className="px-6 py-3 text-left text-small font-semibold text-off-black">
                Type
              </th>
              <th className="px-6 py-3 text-left text-small font-semibold text-off-black">
                Required
              </th>
              <th className="px-6 py-3 text-left text-small font-semibold text-off-black">
                Default
              </th>
              <th className="px-6 py-3 text-left text-small font-semibold text-off-black">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {props.map((prop, index) => (
              <tr 
                key={prop.name}
                className={cn(
                  'border-b border-light-gray',
                  index % 2 === 0 ? 'bg-white' : 'bg-off-white/30'
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-small bg-light-gray px-2 py-1 rounded">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-red-500 text-small font-medium">*</span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <code className="font-mono text-small text-primary">
                    {prop.type}
                  </code>
                  {prop.options && (
                    <div className="mt-1">
                      <details className="text-small">
                        <summary className="cursor-pointer text-warm-gray hover:text-off-black">
                          Options
                        </summary>
                        <div className="mt-1 space-y-1">
                          {prop.options.map((option) => (
                            <div key={option} className="text-warm-gray">
                              <code className="bg-light-gray px-1 rounded">"{option}"</code>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    prop.required 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {prop.required ? 'Yes' : 'No'}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  {prop.defaultValue ? (
                    <code className="font-mono text-small bg-light-gray px-2 py-1 rounded">
                      {prop.defaultValue}
                    </code>
                  ) : (
                    <span className="text-warm-gray text-small">—</span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <p className="text-small text-warm-gray leading-relaxed">
                    {prop.description}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ComponentDocumentationProps {
  componentName: string;
  description: string;
  props: PropDefinition[];
  examples?: Array<{
    title: string;
    description?: string;
    code: string;
    component: React.ReactNode;
  }>;
  className?: string;
}

export function ComponentDocumentation({
  componentName,
  description,
  props,
  examples = [],
  className,
}: ComponentDocumentationProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-h1 font-bold text-off-black">{componentName}</h1>
        <p className="text-lg text-warm-gray leading-relaxed">{description}</p>
      </div>

      {/* Props Table */}
      <section>
        <PropsTable props={props} title="Component Props" />
      </section>

      {/* Examples */}
      {examples.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-h2 font-semibold text-off-black">Examples</h2>
          
          {examples.map((example, index) => (
            <div key={index} className="space-y-4">
              <div>
                <h3 className="text-h3 font-semibold text-off-black">{example.title}</h3>
                {example.description && (
                  <p className="text-warm-gray mt-1">{example.description}</p>
                )}
              </div>
              
              {/* Live Example */}
              <div className="p-6 bg-off-white border border-light-gray rounded-lg">
                {example.component}
              </div>
              
              {/* Code Example */}
              <details className="border border-light-gray rounded-lg">
                <summary className="px-4 py-3 bg-light-gray cursor-pointer hover:bg-warm-gray/10 font-medium">
                  View Code
                </summary>
                <div className="p-4 bg-off-black text-off-white overflow-x-auto">
                  <pre className="font-mono text-small">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </details>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export interface PropTypesBadgeProps {
  type: string;
  className?: string;
}

export function PropTypesBadge({ type, className }: PropTypesBadgeProps) {
  const getTypeColor = (type: string) => {
    if (type.includes('string')) return 'bg-blue-100 text-blue-800';
    if (type.includes('number')) return 'bg-green-100 text-green-800';
    if (type.includes('boolean')) return 'bg-purple-100 text-purple-800';
    if (type.includes('function') || type.includes('=>')) return 'bg-orange-100 text-orange-800';
    if (type.includes('ReactNode') || type.includes('React.')) return 'bg-pink-100 text-pink-800';
    if (type.includes('|')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded text-xs font-mono font-medium',
      getTypeColor(type),
      className
    )}>
      {type}
    </span>
  );
}

export interface QuickReferenceProps {
  components: Array<{
    name: string;
    description: string;
    importPath: string;
    keyProps: string[];
  }>;
  className?: string;
}

export function QuickReference({ components, className }: QuickReferenceProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-h2 font-semibold text-off-black">Quick Reference</h2>
      
      <div className="grid gap-4">
        {components.map((component) => (
          <div key={component.name} className="p-4 border border-light-gray rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-h4 font-semibold text-off-black">{component.name}</h3>
              <code className="text-small bg-light-gray px-2 py-1 rounded">
                {component.importPath}
              </code>
            </div>
            
            <p className="text-warm-gray mb-3">{component.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-small font-medium text-off-black">Key props:</span>
              {component.keyProps.map((prop) => (
                <code key={prop} className="text-small bg-primary/10 text-primary px-2 py-1 rounded">
                  {prop}
                </code>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}