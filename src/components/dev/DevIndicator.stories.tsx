import type { Meta, StoryObj } from '@storybook/react';
import { 
  DevIndicator, 
  DevGrid, 
  DevBreakpointIndicator, 
  DevComponentBoundary,
  DevSpacingIndicator 
} from './DevIndicator';

const meta = {
  title: 'Developer Experience/DevIndicator',
  component: DevIndicator,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Development-only visual indicators for debugging layouts, component boundaries, and responsive behavior. Only visible in development mode.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label to display above the component',
    },
    color: {
      control: 'select',
      options: ['red', 'blue', 'green', 'yellow', 'purple', 'pink'],
      description: 'Color theme for the indicator',
    },
    showBorder: {
      control: 'boolean',
      description: 'Whether to show the dashed border',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the component label',
    },
    showInfo: {
      control: 'boolean',
      description: 'Whether to show component dimensions',
    },
  },
} satisfies Meta<typeof DevIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicIndicator: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Development Indicators</h2>
          <p className="text-warm-gray mb-3">
            These indicators help developers visualize component boundaries during development.
          </p>
          <p className="text-red-600 font-medium">
            Note: These indicators only appear in development mode (NODE_ENV=development)
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <h3 className="text-h4 font-semibold text-off-black mb-4">Basic Component Boundaries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DevIndicator label="Header Component" color="blue">
                <header className="p-6 bg-white rounded-lg border border-light-gray">
                  <h1 className="text-h2 font-bold text-off-black">Website Header</h1>
                  <p className="text-warm-gray">Navigation and branding</p>
                </header>
              </DevIndicator>

              <DevIndicator label="Sidebar Component" color="green">
                <aside className="p-6 bg-light-gray rounded-lg">
                  <h2 className="text-h4 font-semibold text-off-black mb-3">Sidebar</h2>
                  <nav>
                    <ul className="space-y-2 text-warm-gray">
                      <li>Navigation Item 1</li>
                      <li>Navigation Item 2</li>
                      <li>Navigation Item 3</li>
                    </ul>
                  </nav>
                </aside>
              </DevIndicator>
            </div>
          </div>

          <div>
            <h3 className="text-h4 font-semibold text-off-black mb-4">Different Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <DevIndicator label="Red" color="red">
                <div className="p-4 bg-white rounded border text-center">Red Border</div>
              </DevIndicator>
              
              <DevIndicator label="Blue" color="blue">
                <div className="p-4 bg-white rounded border text-center">Blue Border</div>
              </DevIndicator>
              
              <DevIndicator label="Green" color="green">
                <div className="p-4 bg-white rounded border text-center">Green Border</div>
              </DevIndicator>
              
              <DevIndicator label="Yellow" color="yellow">
                <div className="p-4 bg-white rounded border text-center">Yellow Border</div>
              </DevIndicator>
              
              <DevIndicator label="Purple" color="purple">
                <div className="p-4 bg-white rounded border text-center">Purple Border</div>
              </DevIndicator>
              
              <DevIndicator label="Pink" color="pink">
                <div className="p-4 bg-white rounded border text-center">Pink Border</div>
              </DevIndicator>
            </div>
          </div>

          <div>
            <h3 className="text-h4 font-semibold text-off-black mb-4">With Component Info</h3>
            <DevIndicator label="Card Component" color="purple" showInfo>
              <div className="p-6 bg-white rounded-lg shadow-sm border border-light-gray max-w-md">
                <h3 className="text-h4 font-semibold text-off-black mb-2">Product Card</h3>
                <p className="text-warm-gray mb-4">
                  This card shows component dimensions below when showInfo is enabled.
                </p>
                <button className="px-4 py-2 bg-primary text-off-white rounded-lg">
                  View Product
                </button>
              </div>
            </DevIndicator>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridOverlay: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Grid Overlay</h2>
          <p className="text-warm-gray">
            Visual grid to help with layout alignment and spacing consistency.
          </p>
        </div>

        <DevGrid showGrid gridSize={8}>
          <div className="min-h-[400px] p-6">
            <DevIndicator label="Grid Container" color="blue">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DevIndicator label="Grid Item 1" color="green">
                  <div className="p-4 bg-white rounded-lg border border-light-gray">
                    <h3 className="font-semibold text-off-black mb-2">Grid Item 1</h3>
                    <p className="text-warm-gray">Content aligned to grid</p>
                  </div>
                </DevIndicator>
                
                <DevIndicator label="Grid Item 2" color="green">
                  <div className="p-4 bg-white rounded-lg border border-light-gray">
                    <h3 className="font-semibold text-off-black mb-2">Grid Item 2</h3>
                    <p className="text-warm-gray">Spacing visible with grid overlay</p>
                  </div>
                </DevIndicator>
                
                <DevIndicator label="Grid Item 3" color="green">
                  <div className="p-4 bg-white rounded-lg border border-light-gray">
                    <h3 className="font-semibold text-off-black mb-2">Grid Item 3</h3>
                    <p className="text-warm-gray">Perfect alignment checking</p>
                  </div>
                </DevIndicator>
              </div>
            </DevIndicator>
          </div>
        </DevGrid>
      </div>
    </div>
  ),
};

export const BreakpointIndicator: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Responsive Breakpoint Indicator</h2>
          <p className="text-warm-gray mb-3">
            Shows current breakpoint and screen width in the top-right corner.
          </p>
          <p className="text-warm-gray">
            Try resizing your browser window to see the indicator update.
          </p>
        </div>

        <DevBreakpointIndicator />

        <div className="space-y-4">
          <h3 className="text-h4 font-semibold text-off-black">Responsive Content</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg border border-light-gray">
              <h4 className="font-semibold text-off-black mb-2">Mobile First</h4>
              <p className="text-warm-gray text-small">1 column on mobile</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-light-gray">
              <h4 className="font-semibold text-off-black mb-2">Tablet</h4>
              <p className="text-warm-gray text-small">2 columns on tablet</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-light-gray">
              <h4 className="font-semibold text-off-black mb-2">Desktop</h4>
              <p className="text-warm-gray text-small">4 columns on desktop</p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-light-gray">
              <h4 className="font-semibold text-off-black mb-2">Large Screen</h4>
              <p className="text-warm-gray text-small">Full layout</p>
            </div>
          </div>

          <div className="text-small text-warm-gray">
            <strong>Breakpoint Reference:</strong>
            <ul className="mt-2 space-y-1">
              <li>• <strong>xs:</strong> &lt; 640px</li>
              <li>• <strong>sm:</strong> 640px - 767px</li>
              <li>• <strong>md:</strong> 768px - 1023px</li>
              <li>• <strong>lg:</strong> 1024px - 1279px</li>
              <li>• <strong>xl:</strong> 1280px - 1535px</li>
              <li>• <strong>2xl:</strong> ≥ 1536px</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ComponentNesting: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Component Nesting Visualization</h2>
          <p className="text-warm-gray">
            Different colors show nesting levels to help understand component hierarchy.
          </p>
        </div>

        <DevComponentBoundary name="Page Layout" showNesting nestingLevel={0}>
          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <DevComponentBoundary name="Header" showNesting nestingLevel={1}>
              <header className="p-4 bg-light-gray rounded mb-4">
                <DevComponentBoundary name="Navigation" showNesting nestingLevel={2}>
                  <nav className="flex gap-4 p-2 bg-white rounded">
                    <DevComponentBoundary name="Nav Item" showNesting nestingLevel={3}>
                      <a href="#" className="px-3 py-1 bg-primary text-white rounded">Home</a>
                    </DevComponentBoundary>
                    <DevComponentBoundary name="Nav Item" showNesting nestingLevel={3}>
                      <a href="#" className="px-3 py-1 bg-primary text-white rounded">About</a>
                    </DevComponentBoundary>
                    <DevComponentBoundary name="Nav Item" showNesting nestingLevel={3}>
                      <a href="#" className="px-3 py-1 bg-primary text-white rounded">Contact</a>
                    </DevComponentBoundary>
                  </nav>
                </DevComponentBoundary>
              </header>
            </DevComponentBoundary>

            <DevComponentBoundary name="Main Content" showNesting nestingLevel={1}>
              <main className="p-4 bg-light-gray rounded">
                <DevComponentBoundary name="Article" showNesting nestingLevel={2}>
                  <article className="p-4 bg-white rounded mb-4">
                    <DevComponentBoundary name="Article Header" showNesting nestingLevel={3}>
                      <h1 className="text-h3 font-bold text-off-black mb-2">Article Title</h1>
                    </DevComponentBoundary>
                    <DevComponentBoundary name="Article Content" showNesting nestingLevel={3}>
                      <p className="text-warm-gray">Article content goes here...</p>
                    </DevComponentBoundary>
                  </article>
                </DevComponentBoundary>

                <DevComponentBoundary name="Sidebar" showNesting nestingLevel={2}>
                  <aside className="p-4 bg-white rounded">
                    <DevComponentBoundary name="Widget" showNesting nestingLevel={3}>
                      <div className="p-3 bg-light-gray rounded mb-3">
                        <h3 className="font-semibold">Widget 1</h3>
                      </div>
                    </DevComponentBoundary>
                    <DevComponentBoundary name="Widget" showNesting nestingLevel={3}>
                      <div className="p-3 bg-light-gray rounded">
                        <h3 className="font-semibold">Widget 2</h3>
                      </div>
                    </DevComponentBoundary>
                  </aside>
                </DevComponentBoundary>
              </main>
            </DevComponentBoundary>
          </div>
        </DevComponentBoundary>

        <div className="text-small text-warm-gray">
          <strong>Nesting Color Guide:</strong>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
              <span>Level 0 (Blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
              <span>Level 1 (Green)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-500 rounded"></div>
              <span>Level 2 (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
              <span>Level 3 (Red)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-purple-500 rounded"></div>
              <span>Level 4 (Purple)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-pink-500 rounded"></div>
              <span>Level 5 (Pink)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingDebug: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Spacing Debug</h2>
          <p className="text-warm-gray">
            Hover over elements to see their boundaries and spacing relationships.
          </p>
        </div>

        <DevSpacingIndicator>
          <div className="space-y-6">
            <section className="p-6 bg-white rounded-lg border border-light-gray">
              <h3 className="text-h4 font-semibold text-off-black mb-4">Card Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-light-gray rounded">
                  <h4 className="font-semibold mb-2">Card 1</h4>
                  <p className="text-warm-gray">Hover to see boundaries</p>
                </div>
                <div className="p-4 bg-light-gray rounded">
                  <h4 className="font-semibold mb-2">Card 2</h4>
                  <p className="text-warm-gray">Spacing visualization</p>
                </div>
              </div>
            </section>

            <section className="p-6 bg-white rounded-lg border border-light-gray">
              <h3 className="text-h4 font-semibold text-off-black mb-4">Form Layout</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
                <button className="px-4 py-2 bg-primary text-off-white rounded-lg">
                  Submit
                </button>
              </form>
            </section>
          </div>
        </DevSpacingIndicator>
      </div>
    </div>
  ),
};