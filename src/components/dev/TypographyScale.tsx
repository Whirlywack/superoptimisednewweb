'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TypographySpecification {
  name: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  marginBottom?: string;
  className: string;
  description: string;
  usage: string[];
  example: string;
}

export interface TypographyScaleProps {
  typography: TypographySpecification[];
  showSpecs?: boolean;
  showExamples?: boolean;
  className?: string;
}

export function TypographyScale({
  typography,
  showSpecs = true,
  showExamples = true,
  className,
}: TypographyScaleProps) {
  const [copied, setCopied] = useState('');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('space-y-8', className)}>
      {typography.map((type) => (
        <div key={type.name} className="space-y-4">
          {/* Typography Example */}
          <div className="space-y-2">
            <div className={cn(type.className)}>
              {showExamples ? type.example : type.name}
            </div>
            
            {/* Typography Info */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-off-black">{type.name}</h4>
                <p className="text-small text-warm-gray">{type.description}</p>
                
                {type.usage.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-warm-gray">Used for: </span>
                    <span className="text-xs text-warm-gray">
                      {type.usage.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(type.className, type.name)}
                className="p-2 hover:bg-light-gray rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                title="Copy CSS class"
              >
                {copied === type.name ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-warm-gray" />
                )}
              </button>
            </div>
          </div>

          {/* Specifications */}
          {showSpecs && (
            <div className="bg-light-gray rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-small">
                <div>
                  <span className="font-medium text-warm-gray">Size</span>
                  <div className="font-mono">{type.fontSize}</div>
                </div>
                <div>
                  <span className="font-medium text-warm-gray">Weight</span>
                  <div className="font-mono">{type.fontWeight}</div>
                </div>
                <div>
                  <span className="font-medium text-warm-gray">Line Height</span>
                  <div className="font-mono">{type.lineHeight}</div>
                </div>
                {type.letterSpacing && (
                  <div>
                    <span className="font-medium text-warm-gray">Spacing</span>
                    <div className="font-mono">{type.letterSpacing}</div>
                  </div>
                )}
                {type.marginBottom && (
                  <div>
                    <span className="font-medium text-warm-gray">Margin</span>
                    <div className="font-mono">{type.marginBottom}</div>
                  </div>
                )}
                <div>
                  <span className="font-medium text-warm-gray">Class</span>
                  <div className="font-mono text-primary">{type.className}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export interface FontSpecimenProps {
  fontFamily: string;
  fontName: string;
  description: string;
  weights?: Array<{
    weight: string;
    name: string;
    className: string;
  }>;
  example?: string;
  className?: string;
}

export function FontSpecimen({
  fontFamily,
  fontName,
  description,
  weights = [],
  example = 'The quick brown fox jumps over the lazy dog',
  className,
}: FontSpecimenProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-h3 font-semibold text-off-black mb-2">{fontName}</h3>
        <p className="text-warm-gray mb-4">{description}</p>
        
        <div className="p-4 bg-light-gray rounded-lg">
          <code className="text-small font-mono">font-family: {fontFamily}</code>
        </div>
      </div>

      {/* Example Text */}
      <div 
        className="text-h2"
        style={{ fontFamily }}
      >
        {example}
      </div>

      {/* Font Weights */}
      {weights.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-off-black">Available Weights</h4>
          {weights.map((weight) => (
            <div key={weight.weight} className="flex items-center justify-between p-3 bg-white rounded border border-light-gray">
              <div>
                <span className="font-medium text-off-black">{weight.name}</span>
                <span className="ml-2 text-small text-warm-gray">({weight.weight})</span>
              </div>
              <div 
                className={cn("text-lg", weight.className)}
                style={{ fontFamily }}
              >
                {example.slice(0, 20)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export interface TypographyShowcaseProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function TypographyShowcase({
  title = "Typography Showcase",
  description,
  children,
  className,
}: TypographyShowcaseProps) {
  return (
    <div className={cn('max-w-4xl mx-auto space-y-8', className)}>
      <div className="text-center space-y-4">
        <h1 className="text-h1 font-bold text-off-black">{title}</h1>
        {description && (
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">{description}</p>
        )}
      </div>
      
      <div className="space-y-12">
        {children}
      </div>
    </div>
  );
}

export interface ReadingExampleProps {
  title: string;
  content: string;
  className?: string;
}

export function ReadingExample({
  title,
  content,
  className,
}: ReadingExampleProps) {
  return (
    <article className={cn('max-w-2xl space-y-6', className)}>
      <header>
        <h1 className="text-h1 font-bold text-off-black mb-4">{title}</h1>
        <div className="flex items-center gap-4 text-small text-warm-gray">
          <span>Reading Time: 3 min</span>
          <span>•</span>
          <span>March 15, 2024</span>
        </div>
      </header>

      <div className="prose max-w-none">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-body text-off-black mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <aside className="p-4 bg-light-gray rounded-lg">
        <h3 className="text-h4 font-semibold text-off-black mb-2">Typography Features</h3>
        <ul className="text-small text-warm-gray space-y-1">
          <li>• Optimized line height (1.6) for sustained reading</li>
          <li>• Maximum 65-character line length for readability</li>
          <li>• High contrast ratio (AAA compliant)</li>
          <li>• Inter font family for exceptional readability</li>
        </ul>
      </aside>
    </article>
  );
}

export interface TypographyGuidelinesProps {
  className?: string;
}

export function TypographyGuidelines({ className }: TypographyGuidelinesProps) {
  return (
    <div className={cn('space-y-8', className)}>
      <div>
        <h2 className="text-h2 font-semibold text-off-black mb-4">Typography Guidelines</h2>
        <p className="text-warm-gray">
          Best practices for implementing and using our typography system effectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 bg-white border border-light-gray rounded-lg">
            <h3 className="text-h3 font-semibold text-off-black mb-3">✓ Do</h3>
            <ul className="space-y-3 text-warm-gray">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Use semantic HTML headings (h1, h2, h3) for proper hierarchy</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Maintain consistent line heights for rhythm</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Limit line length to 65 characters for optimal readability</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Use sufficient contrast (4.5:1 minimum) for body text</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">•</span>
                <span>Test typography with real content, not Lorem Ipsum</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-light-gray rounded-lg">
            <h3 className="text-h3 font-semibold text-off-black mb-3">✗ Don't</h3>
            <ul className="space-y-3 text-warm-gray">
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Skip heading levels (h1 → h3 without h2)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Use too many different font sizes in one design</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Set line heights too tight (below 1.4) for body text</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Use light gray text on white backgrounds</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span>Center-align large blocks of text</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="text-h3 font-semibold text-off-black mb-3">Responsive Typography</h3>
        <p className="text-warm-gray mb-4">
          Our typography scales automatically across devices while maintaining optimal readability.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-small">
          <div>
            <span className="font-medium text-off-black">Mobile (&lt; 768px)</span>
            <div className="text-warm-gray">Optimized for thumb navigation and single-column reading</div>
          </div>
          <div>
            <span className="font-medium text-off-black">Tablet (768px+)</span>
            <div className="text-warm-gray">Balanced for both portrait and landscape reading</div>
          </div>
          <div>
            <span className="font-medium text-off-black">Desktop (1024px+)</span>
            <div className="text-warm-gray">Enhanced hierarchy and generous whitespace</div>
          </div>
        </div>
      </div>
    </div>
  );
}