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
        <div className="border-b border-light-gray bg-light-gray px-6 py-3">
          <h3 className="text-h4 font-semibold text-off-black">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-light-gray bg-off-white">
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
                    <code className="rounded bg-light-gray px-2 py-1 font-mono text-small">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="text-small font-medium text-red-500">*</span>
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
                              <code className="rounded bg-light-gray px-1">"{option}"</code>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                    prop.required 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {prop.required ? 'Yes' : 'No'}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  {prop.defaultValue ? (
                    <code className="rounded bg-light-gray px-2 py-1 font-mono text-small">
                      {prop.defaultValue}
                    </code>
                  ) : (
                    <span className="text-small text-warm-gray">—</span>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <p className="text-small leading-relaxed text-warm-gray">
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
        <p className="text-lg leading-relaxed text-warm-gray">{description}</p>
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
                  <p className="mt-1 text-warm-gray">{example.description}</p>
                )}
              </div>
              
              {/* Live Example */}
              <div className="rounded-lg border border-light-gray bg-off-white p-6">
                {example.component}
              </div>
              
              {/* Code Example */}
              <details className="rounded-lg border border-light-gray">
                <summary className="cursor-pointer bg-light-gray px-4 py-3 font-medium hover:bg-warm-gray/10">
                  View Code
                </summary>
                <div className="overflow-x-auto bg-off-black p-4 text-off-white">
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
      'inline-flex items-center rounded px-2 py-1 font-mono text-xs font-medium',
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
          <div key={component.name} className="rounded-lg border border-light-gray p-4">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-h4 font-semibold text-off-black">{component.name}</h3>
              <code className="rounded bg-light-gray px-2 py-1 text-small">
                {component.importPath}
              </code>
            </div>
            
            <p className="mb-3 text-warm-gray">{component.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-small font-medium text-off-black">Key props:</span>
              {component.keyProps.map((prop) => (
                <code key={prop} className="rounded bg-primary/10 px-2 py-1 text-small text-primary">
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