'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorInfo {
  name: string;
  value: string;
  description?: string;
  cssVariable?: string;
  tailwindClass?: string;
}

export interface ColorSwatchProps {
  color: ColorInfo;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
  className?: string;
}

export function ColorSwatch({ 
  color, 
  size = 'md',
  showCopy = true,
  className 
}: ColorSwatchProps) {
  const [copied, setCopied] = useState('');

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {/* Color Circle */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-2 border-light-gray shadow-sm',
            sizes[size]
          )}
          style={{ backgroundColor: color.value }}
        />
        
        {/* Overlay for very light colors */}
        {color.value === '#ffffff' || color.value === '#fafafa' && (
          <div className={cn(
            'absolute inset-0 rounded-full border border-warm-gray/20',
            sizes[size]
          )} />
        )}
      </div>

      {/* Color Info */}
      <div className="space-y-1">
        <h4 className="font-semibold text-off-black text-small">{color.name}</h4>
        
        {color.description && (
          <p className="text-xs text-warm-gray">{color.description}</p>
        )}

        {/* Copy Options */}
        {showCopy && (
          <div className="space-y-1">
            {/* Hex Value */}
            <button
              onClick={() => copyToClipboard(color.value, 'hex')}
              className="flex items-center justify-between w-full p-2 text-xs bg-light-gray rounded hover:bg-warm-gray/10 transition-colors"
            >
              <code className="font-mono">{color.value}</code>
              {copied === 'hex' ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-warm-gray" />
              )}
            </button>

            {/* CSS Variable */}
            {color.cssVariable && (
              <button
                onClick={() => copyToClipboard(color.cssVariable!, 'css')}
                className="flex items-center justify-between w-full p-2 text-xs bg-light-gray rounded hover:bg-warm-gray/10 transition-colors"
              >
                <code className="font-mono">{color.cssVariable}</code>
                {copied === 'css' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-warm-gray" />
                )}
              </button>
            )}

            {/* Tailwind Class */}
            {color.tailwindClass && (
              <button
                onClick={() => copyToClipboard(color.tailwindClass!, 'tailwind')}
                className="flex items-center justify-between w-full p-2 text-xs bg-light-gray rounded hover:bg-warm-gray/10 transition-colors"
              >
                <code className="font-mono">{color.tailwindClass}</code>
                {copied === 'tailwind' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-warm-gray" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export interface ColorPaletteProps {
  title: string;
  colors: ColorInfo[];
  columns?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorPalette({ 
  title, 
  colors, 
  columns = 4,
  size = 'md',
  className 
}: ColorPaletteProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-h3 font-semibold text-off-black">{title}</h3>
      
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${Math.min(columns, colors.length)}, 1fr)` 
        }}
      >
        {colors.map((color) => (
          <ColorSwatch 
            key={color.name} 
            color={color} 
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

export interface ColorScaleProps {
  title: string;
  colors: ColorInfo[];
  direction?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

export function ColorScale({ 
  title, 
  colors, 
  direction = 'horizontal',
  showLabels = true,
  className 
}: ColorScaleProps) {
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-h3 font-semibold text-off-black">{title}</h3>
      
      <div className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col'
      )}>
        {colors.map((color, index) => (
          <div
            key={color.name}
            className="relative group"
          >
            <button
              className={cn(
                'transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                direction === 'horizontal' 
                  ? 'w-16 h-16 first:rounded-l-lg last:rounded-r-lg' 
                  : 'h-16 w-full first:rounded-t-lg last:rounded-b-lg'
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => setSelectedColor(color)}
            />
            
            {showLabels && (
              <div className={cn(
                'absolute z-10 p-2 bg-off-black text-off-white text-xs rounded shadow-lg',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'whitespace-nowrap',
                direction === 'horizontal' 
                  ? 'top-full left-1/2 transform -translate-x-1/2 mt-2'
                  : 'left-full top-1/2 transform -translate-y-1/2 ml-2'
              )}>
                <div className="font-medium">{color.name}</div>
                <div className="font-mono">{color.value}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Color Details */}
      {selectedColor && (
        <div className="p-4 bg-light-gray rounded-lg">
          <h4 className="font-semibold text-off-black mb-2">Selected: {selectedColor.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <span className="text-small font-medium text-warm-gray">Hex</span>
              <code className="block font-mono text-small">{selectedColor.value}</code>
            </div>
            {selectedColor.cssVariable && (
              <div>
                <span className="text-small font-medium text-warm-gray">CSS Variable</span>
                <code className="block font-mono text-small">{selectedColor.cssVariable}</code>
              </div>
            )}
            {selectedColor.tailwindClass && (
              <div>
                <span className="text-small font-medium text-warm-gray">Tailwind</span>
                <code className="block font-mono text-small">{selectedColor.tailwindClass}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export interface AccessibilityCheckProps {
  foreground: string;
  background: string;
  className?: string;
}

export function AccessibilityCheck({ 
  foreground, 
  background, 
  className 
}: AccessibilityCheckProps) {
  // Simple contrast ratio calculation (for demo purposes)
  const calculateContrast = (fg: string, bg: string): number => {
    // This is a simplified calculation for demo
    // In a real implementation, you'd use a proper contrast calculation
    const hex2rgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgRgb = hex2rgb(foreground);
    const bgRgb = hex2rgb(background);
    const fgLum = getLuminance(fgRgb);
    const bgLum = getLuminance(bgRgb);
    
    const brightest = Math.max(fgLum, bgLum);
    const darkest = Math.min(fgLum, bgLum);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const contrast = calculateContrast(foreground, background);
  const passAA = contrast >= 4.5;
  const passAAA = contrast >= 7;

  return (
    <div className={cn('p-4 border border-light-gray rounded-lg', className)}>
      <h4 className="font-semibold text-off-black mb-3">Accessibility Check</h4>
      
      {/* Color Preview */}
      <div 
        className="p-4 rounded mb-3 text-center"
        style={{ 
          backgroundColor: background, 
          color: foreground 
        }}
      >
        <p className="font-medium">Sample Text</p>
        <p className="text-small">Small text example</p>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-small font-medium">Contrast Ratio:</span>
          <code className="font-mono">{contrast.toFixed(2)}:1</code>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-small">WCAG AA (4.5:1):</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            passAA ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            {passAA ? 'Pass' : 'Fail'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-small">WCAG AAA (7:1):</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            passAAA ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            {passAAA ? 'Pass' : 'Fail'}
          </span>
        </div>
      </div>
    </div>
  );
}