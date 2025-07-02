import type { Meta, StoryObj } from '@storybook/react';
import { ColorSwatch, ColorPalette, ColorScale, AccessibilityCheck, ColorInfo } from './ColorSwatch';

const meta = {
  title: 'Developer Experience/ColorSwatch',
  component: ColorSwatch,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Design system color documentation components. Display color palettes, generate accessibility reports, and provide easy copying of color values.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'object',
      description: 'Color information object with name, value, and metadata',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the color swatch',
    },
    showCopy: {
      control: 'boolean',
      description: 'Whether to show copy buttons for color values',
    },
  },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

const designSystemColors: ColorInfo[] = [
  {
    name: 'Off Black',
    value: '#1a1a1a',
    description: 'Headers, emphasis text',
    cssVariable: 'var(--color-off-black)',
    tailwindClass: 'text-off-black',
  },
  {
    name: 'Off White',
    value: '#fafafa',
    description: 'Backgrounds, light text',
    cssVariable: 'var(--color-off-white)',
    tailwindClass: 'bg-off-white',
  },
  {
    name: 'Warm Gray',
    value: '#6b7280',
    description: 'Body text, secondary content',
    cssVariable: 'var(--color-warm-gray)',
    tailwindClass: 'text-warm-gray',
  },
  {
    name: 'Light Gray',
    value: '#f3f4f6',
    description: 'Borders, dividers, subtle backgrounds',
    cssVariable: 'var(--color-light-gray)',
    tailwindClass: 'bg-light-gray',
  },
  {
    name: 'Primary',
    value: '#64748b',
    description: 'Action items, links, interactive elements',
    cssVariable: 'var(--color-primary)',
    tailwindClass: 'bg-primary',
  },
];

const grayScale: ColorInfo[] = [
  { name: 'Gray 50', value: '#f9fafb', cssVariable: 'var(--gray-50)', tailwindClass: 'bg-gray-50' },
  { name: 'Gray 100', value: '#f3f4f6', cssVariable: 'var(--gray-100)', tailwindClass: 'bg-gray-100' },
  { name: 'Gray 200', value: '#e5e7eb', cssVariable: 'var(--gray-200)', tailwindClass: 'bg-gray-200' },
  { name: 'Gray 300', value: '#d1d5db', cssVariable: 'var(--gray-300)', tailwindClass: 'bg-gray-300' },
  { name: 'Gray 400', value: '#9ca3af', cssVariable: 'var(--gray-400)', tailwindClass: 'bg-gray-400' },
  { name: 'Gray 500', value: '#6b7280', cssVariable: 'var(--gray-500)', tailwindClass: 'bg-gray-500' },
  { name: 'Gray 600', value: '#4b5563', cssVariable: 'var(--gray-600)', tailwindClass: 'bg-gray-600' },
  { name: 'Gray 700', value: '#374151', cssVariable: 'var(--gray-700)', tailwindClass: 'bg-gray-700' },
  { name: 'Gray 800', value: '#1f2937', cssVariable: 'var(--gray-800)', tailwindClass: 'bg-gray-800' },
  { name: 'Gray 900', value: '#111827', cssVariable: 'var(--gray-900)', tailwindClass: 'bg-gray-900' },
];

const primaryScale: ColorInfo[] = [
  { name: 'Primary 50', value: '#f8fafc', cssVariable: 'var(--primary-50)', tailwindClass: 'bg-primary-50' },
  { name: 'Primary 100', value: '#f1f5f9', cssVariable: 'var(--primary-100)', tailwindClass: 'bg-primary-100' },
  { name: 'Primary 200', value: '#e2e8f0', cssVariable: 'var(--primary-200)', tailwindClass: 'bg-primary-200' },
  { name: 'Primary 300', value: '#cbd5e1', cssVariable: 'var(--primary-300)', tailwindClass: 'bg-primary-300' },
  { name: 'Primary 400', value: '#94a3b8', cssVariable: 'var(--primary-400)', tailwindClass: 'bg-primary-400' },
  { name: 'Primary 500', value: '#64748b', cssVariable: 'var(--primary-500)', tailwindClass: 'bg-primary-500' },
  { name: 'Primary 600', value: '#475569', cssVariable: 'var(--primary-600)', tailwindClass: 'bg-primary-600' },
  { name: 'Primary 700', value: '#334155', cssVariable: 'var(--primary-700)', tailwindClass: 'bg-primary-700' },
  { name: 'Primary 800', value: '#1e293b', cssVariable: 'var(--primary-800)', tailwindClass: 'bg-primary-800' },
  { name: 'Primary 900', value: '#0f172a', cssVariable: 'var(--primary-900)', tailwindClass: 'bg-primary-900' },
];

const statusColors: ColorInfo[] = [
  {
    name: 'Success',
    value: '#10b981',
    description: 'Success states, confirmations',
    cssVariable: 'var(--color-success)',
    tailwindClass: 'bg-green-500',
  },
  {
    name: 'Warning',
    value: '#f59e0b',
    description: 'Warning states, attention needed',
    cssVariable: 'var(--color-warning)',
    tailwindClass: 'bg-yellow-500',
  },
  {
    name: 'Error',
    value: '#ef4444',
    description: 'Error states, destructive actions',
    cssVariable: 'var(--color-error)',
    tailwindClass: 'bg-red-500',
  },
  {
    name: 'Info',
    value: '#3b82f6',
    description: 'Information, neutral actions',
    cssVariable: 'var(--color-info)',
    tailwindClass: 'bg-blue-500',
  },
];

export const BasicColorSwatch: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Color Swatches</h2>
          <p className="text-warm-gray">
            Interactive color swatches with copy functionality for hex values, CSS variables, and Tailwind classes.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-h3 font-semibold text-off-black">Individual Swatches</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {designSystemColors.map((color) => (
              <ColorSwatch key={color.name} color={color} size="lg" />
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">How to use:</h4>
            <ul className="text-small text-yellow-700 space-y-1">
              <li>• Click any value to copy to clipboard</li>
              <li>• Use hex values for CSS</li>
              <li>• Use CSS variables for theming</li>
              <li>• Use Tailwind classes for utility-first styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ColorPalettes: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Color Palettes</h2>
          <p className="text-warm-gray">
            Organized color collections for different use cases in the design system.
          </p>
        </div>

        <div className="space-y-8">
          <ColorPalette
            title="Design System Core Colors"
            colors={designSystemColors}
            columns={5}
            size="lg"
          />

          <ColorPalette
            title="Status & Feedback Colors"
            colors={statusColors}
            columns={4}
            size="md"
          />

          <div className="grid md:grid-cols-2 gap-8">
            <ColorPalette
              title="Light Theme"
              colors={[
                { name: 'Background', value: '#ffffff', description: 'Main background' },
                { name: 'Surface', value: '#fafafa', description: 'Card backgrounds' },
                { name: 'Border', value: '#e5e7eb', description: 'Dividers' },
                { name: 'Text Primary', value: '#1a1a1a', description: 'Main text' },
                { name: 'Text Secondary', value: '#6b7280', description: 'Supporting text' },
              ]}
              columns={1}
              size="md"
            />

            <ColorPalette
              title="Dark Theme"
              colors={[
                { name: 'Background', value: '#0f172a', description: 'Main background' },
                { name: 'Surface', value: '#1e293b', description: 'Card backgrounds' },
                { name: 'Border', value: '#334155', description: 'Dividers' },
                { name: 'Text Primary', value: '#f8fafc', description: 'Main text' },
                { name: 'Text Secondary', value: '#cbd5e1', description: 'Supporting text' },
              ]}
              columns={1}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ColorScales: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Color Scales</h2>
          <p className="text-warm-gray">
            Progressive color scales showing tonal variations. Hover over colors to see details.
          </p>
        </div>

        <div className="space-y-8">
          <ColorScale
            title="Gray Scale (Horizontal)"
            colors={grayScale}
            direction="horizontal"
            showLabels={true}
          />

          <ColorScale
            title="Primary Scale (Horizontal)"
            colors={primaryScale}
            direction="horizontal"
            showLabels={true}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <ColorScale
              title="Gray (Vertical)"
              colors={grayScale.slice(0, 6)}
              direction="vertical"
              showLabels={true}
            />

            <ColorScale
              title="Primary (Vertical)"
              colors={primaryScale.slice(0, 6)}
              direction="vertical"
              showLabels={true}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Usage Guidelines:</h4>
            <ul className="text-small text-blue-700 space-y-1">
              <li>• Use 50-100 for very light backgrounds and borders</li>
              <li>• Use 200-300 for light backgrounds and disabled states</li>
              <li>• Use 400-600 for main colors and interactive elements</li>
              <li>• Use 700-900 for text and high contrast elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AccessibilityGuide: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Accessibility Checker</h2>
          <p className="text-warm-gray">
            Test color combinations for WCAG compliance and contrast ratios.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-h3 font-semibold text-off-black">Color Contrast Examples</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AccessibilityCheck
              foreground="#1a1a1a"
              background="#ffffff"
            />
            
            <AccessibilityCheck
              foreground="#6b7280"
              background="#ffffff"
            />
            
            <AccessibilityCheck
              foreground="#ffffff"
              background="#64748b"
            />
            
            <AccessibilityCheck
              foreground="#fafafa"
              background="#1a1a1a"
            />
            
            <AccessibilityCheck
              foreground="#64748b"
              background="#f3f4f6"
            />
            
            <AccessibilityCheck
              foreground="#ffffff"
              background="#ef4444"
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">WCAG Guidelines:</h4>
            <div className="text-small text-green-700 space-y-2">
              <div>
                <strong>AA Level (4.5:1 minimum):</strong> Required for normal text, recommended for most use cases
              </div>
              <div>
                <strong>AAA Level (7:1 minimum):</strong> Enhanced contrast, ideal for users with visual impairments
              </div>
              <div>
                <strong>Large Text (3:1 minimum):</strong> Text that is 18pt+ or 14pt+ bold
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-h4 font-semibold text-off-black">Recommended Combinations</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-light-gray">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-off-black rounded"></div>
                  <div className="w-8 h-8 bg-white border border-light-gray rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Primary Text on Light Background</div>
                  <div className="text-small text-warm-gray">Off Black (#1a1a1a) on Off White (#fafafa) - WCAG AAA</div>
                </div>
                <div className="text-green-600 font-medium">✓ AAA</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-light-gray">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white border border-light-gray rounded"></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: '#64748b' }}></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Light Text on Primary Background</div>
                  <div className="text-small text-warm-gray">Off White (#fafafa) on Primary (#64748b) - WCAG AA</div>
                </div>
                <div className="text-green-600 font-medium">✓ AA</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-light-gray">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: '#6b7280' }}></div>
                  <div className="w-8 h-8 bg-white border border-light-gray rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">Secondary Text on Light Background</div>
                  <div className="text-small text-warm-gray">Warm Gray (#6b7280) on Off White (#fafafa) - WCAG AA</div>
                </div>
                <div className="text-green-600 font-medium">✓ AA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CompleteColorSystem: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-h1 font-bold text-off-black">Superoptimised Color System</h1>
          <p className="text-lg text-warm-gray max-w-3xl mx-auto">
            A comprehensive color system built on accessibility, consistency, and authentic transparency. 
            Every color choice supports our mission of radical openness and professional credibility.
          </p>
        </div>

        <div className="space-y-12">
          {/* Core Colors */}
          <section>
            <ColorPalette
              title="Core Design System Colors"
              colors={designSystemColors}
              columns={5}
              size="lg"
            />
            <p className="mt-4 text-warm-gray">
              Our minimal 5-color system maximizes focus on content while ensuring consistent, 
              accessible experiences across all touchpoints.
            </p>
          </section>

          {/* Color Scales */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-off-black">Tonal Scales</h2>
            <ColorScale
              title="Primary Color Scale"
              colors={primaryScale}
              direction="horizontal"
              showLabels={true}
            />
            <ColorScale
              title="Neutral Gray Scale"
              colors={grayScale}
              direction="horizontal"
              showLabels={true}
            />
          </section>

          {/* Status Colors */}
          <section>
            <ColorPalette
              title="Status & Feedback Colors"
              colors={statusColors}
              columns={4}
              size="md"
            />
            <p className="mt-4 text-warm-gray">
              Semantic colors for user feedback, form validation, and status communication.
            </p>
          </section>

          {/* Theme Variations */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-off-black">Theme Applications</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-6 bg-white rounded-lg border border-light-gray">
                <h3 className="text-h3 font-semibold mb-4">Light Theme</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-off-white border rounded">
                    <h4 className="font-semibold text-off-black">Card Header</h4>
                    <p className="text-warm-gray text-small">Supporting text in warm gray</p>
                  </div>
                  <button className="w-full py-2 bg-primary text-off-white rounded hover:bg-primary/90">
                    Primary Action
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                <h3 className="text-h3 font-semibold mb-4" style={{ color: '#f8fafc' }}>Dark Theme</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded border" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                    <h4 className="font-semibold" style={{ color: '#f8fafc' }}>Card Header</h4>
                    <p className="text-small" style={{ color: '#cbd5e1' }}>Supporting text in light gray</p>
                  </div>
                  <button 
                    className="w-full py-2 rounded hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#64748b', color: '#f8fafc' }}
                  >
                    Primary Action
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility Summary */}
          <section className="space-y-6">
            <h2 className="text-h2 font-semibold text-off-black">Accessibility Compliance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <AccessibilityCheck
                foreground="#1a1a1a"
                background="#fafafa"
              />
              <AccessibilityCheck
                foreground="#fafafa"
                background="#64748b"
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">✓ WCAG 2.1 AA Compliant</h3>
              <p className="text-green-700">
                All core color combinations meet or exceed WCAG 2.1 AA standards for contrast ratios. 
                Our primary text combination (Off Black on Off White) achieves AAA compliance for enhanced accessibility.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  ),
};