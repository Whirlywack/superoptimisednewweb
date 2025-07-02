import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveGrid, ResponsiveStack, ResponsiveCardGrid, MasonryGrid, ResponsiveLayout } from './ResponsiveGrid';

const meta = {
  title: 'Mobile/ResponsiveGrid',
  component: ResponsiveGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Responsive grid system that adapts to different screen sizes with mobile-first approach. Provides consistent layouts across devices.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: 'object',
      description: 'Number of columns for different breakpoints',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items',
    },
    children: {
      control: false,
      description: 'Grid items to display',
    },
  },
} satisfies Meta<typeof ResponsiveGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCard = ({ children, height = 'auto' }: { children: React.ReactNode; height?: string }) => (
  <div className="bg-light-gray rounded-lg p-4 flex items-center justify-center text-warm-gray font-medium border border-primary/20" style={{ height }}>
    {children}
  </div>
);

export const BasicGrid: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <h2 className="text-h2 font-bold text-off-black mb-6">Basic Responsive Grid</h2>
      <p className="text-warm-gray mb-4">
        1 column on mobile, 2 on tablet, 3 on desktop
      </p>
      
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
        <SampleCard>Item 1</SampleCard>
        <SampleCard>Item 2</SampleCard>
        <SampleCard>Item 3</SampleCard>
        <SampleCard>Item 4</SampleCard>
        <SampleCard>Item 5</SampleCard>
        <SampleCard>Item 6</SampleCard>
      </ResponsiveGrid>
    </div>
  ),
};

export const DifferentGaps: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen space-y-8">
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Small Gap</h3>
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="sm">
          <SampleCard>Item 1</SampleCard>
          <SampleCard>Item 2</SampleCard>
          <SampleCard>Item 3</SampleCard>
          <SampleCard>Item 4</SampleCard>
        </ResponsiveGrid>
      </div>
      
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Large Gap</h3>
        <ResponsiveGrid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="lg">
          <SampleCard>Item 1</SampleCard>
          <SampleCard>Item 2</SampleCard>
          <SampleCard>Item 3</SampleCard>
          <SampleCard>Item 4</SampleCard>
        </ResponsiveGrid>
      </div>
    </div>
  ),
};

export const ResponsiveStack_Story: Story = {
  name: 'Responsive Stack',
  render: () => (
    <div className="p-4 bg-off-white min-h-screen space-y-8">
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Stack (Column on Mobile, Row on Tablet+)</h3>
        <ResponsiveStack direction="row-tablet" gap="md" align="stretch">
          <SampleCard height="100px">Left Panel</SampleCard>
          <SampleCard height="100px">Main Content</SampleCard>
          <SampleCard height="100px">Right Panel</SampleCard>
        </ResponsiveStack>
      </div>
      
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Centered Stack</h3>
        <ResponsiveStack direction="row-desktop" gap="lg" align="center" justify="center">
          <SampleCard>Center 1</SampleCard>
          <SampleCard>Center 2</SampleCard>
          <SampleCard>Center 3</SampleCard>
        </ResponsiveStack>
      </div>
    </div>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <h2 className="text-h2 font-bold text-off-black mb-6">Auto-Fit Card Grid</h2>
      <p className="text-warm-gray mb-4">
        Cards automatically fit based on minimum width (280px default)
      </p>
      
      <ResponsiveCardGrid minItemWidth="250px" gap="md">
        <div className="bg-light-gray rounded-lg p-6 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Card 1</h3>
          <p className="text-warm-gray">This card adapts to available space automatically.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-6 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Card 2</h3>
          <p className="text-warm-gray">Minimum width ensures readability on all devices.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-6 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Card 3</h3>
          <p className="text-warm-gray">Perfect for responsive card layouts.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-6 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Card 4</h3>
          <p className="text-warm-gray">Works great for product grids, blog posts, etc.</p>
        </div>
      </ResponsiveCardGrid>
    </div>
  ),
};

export const MasonryLayout: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <h2 className="text-h2 font-bold text-off-black mb-6">Masonry Grid</h2>
      <p className="text-warm-gray mb-4">
        Pinterest-style layout that stacks items efficiently
      </p>
      
      <MasonryGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
        <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Short Card</h3>
          <p className="text-warm-gray">Brief content.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Medium Card</h3>
          <p className="text-warm-gray mb-3">This card has more content than the first one, making it taller and creating an interesting masonry effect.</p>
          <p className="text-warm-gray">Additional paragraph for height variation.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Another Short Card</h3>
          <p className="text-warm-gray">Compact content again.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Tall Card</h3>
          <p className="text-warm-gray mb-3">This card has quite a bit more content, making it significantly taller than the others. This demonstrates how the masonry layout efficiently uses space.</p>
          <p className="text-warm-gray mb-3">The content here is longer to show the varying heights that make masonry layouts so useful for content like blog posts, images, or cards with different amounts of information.</p>
          <p className="text-warm-gray">Perfect for Pinterest-style layouts.</p>
        </div>
        
        <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
          <h3 className="text-h4 font-semibold text-off-black mb-2">Regular Card</h3>
          <p className="text-warm-gray">Standard amount of content for this type of card layout.</p>
        </div>
      </MasonryGrid>
    </div>
  ),
};

export const ResponsiveLayoutVariants: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen space-y-12">
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Grid Layout</h3>
        <ResponsiveLayout variant="grid" breakpoint="tablet">
          <SampleCard>Grid 1</SampleCard>
          <SampleCard>Grid 2</SampleCard>
          <SampleCard>Grid 3</SampleCard>
          <SampleCard>Grid 4</SampleCard>
        </ResponsiveLayout>
      </div>
      
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Stack Layout</h3>
        <ResponsiveLayout variant="stack" breakpoint="tablet">
          <SampleCard height="80px">Stack 1</SampleCard>
          <SampleCard height="80px">Stack 2</SampleCard>
          <SampleCard height="80px">Stack 3</SampleCard>
        </ResponsiveLayout>
      </div>
      
      <div>
        <h3 className="text-h3 font-bold text-off-black mb-4">Card Layout</h3>
        <ResponsiveLayout variant="cards">
          <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-off-black mb-2">Auto Card 1</h4>
            <p className="text-warm-gray">Automatically sized card</p>
          </div>
          <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-off-black mb-2">Auto Card 2</h4>
            <p className="text-warm-gray">Fits available space</p>
          </div>
          <div className="bg-light-gray rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold text-off-black mb-2">Auto Card 3</h4>
            <p className="text-warm-gray">Responsive by default</p>
          </div>
        </ResponsiveLayout>
      </div>
    </div>
  ),
};

export const RealWorldExample: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <h2 className="text-h2 font-bold text-off-black mb-6">Real World Example: Project Portfolio</h2>
      
      <ResponsiveCardGrid minItemWidth="320px" gap="lg">
        <div className="bg-white rounded-xl shadow-sm border border-light-gray overflow-hidden">
          <div className="h-32 bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">Project Image</span>
          </div>
          <div className="p-6">
            <h3 className="text-h4 font-semibold text-off-black mb-2">Superoptimised Platform</h3>
            <p className="text-warm-gray mb-4">Next.js application with TypeScript, tRPC, and Prisma. Building in public with community feedback.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-small rounded">Next.js</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-small rounded">TypeScript</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-small rounded">tRPC</span>
            </div>
            <button className="w-full bg-primary text-off-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
              View Project
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-light-gray overflow-hidden">
          <div className="h-32 bg-green-100 flex items-center justify-center">
            <span className="text-green-700 font-medium">Project Image</span>
          </div>
          <div className="p-6">
            <h3 className="text-h4 font-semibold text-off-black mb-2">AI Code Assistant</h3>
            <p className="text-warm-gray mb-4">Intelligent code completion and review tool powered by machine learning algorithms.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-small rounded">Python</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-small rounded">TensorFlow</span>
            </div>
            <button className="w-full bg-green-600 text-off-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              View Project
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-light-gray overflow-hidden">
          <div className="h-32 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-medium">Project Image</span>
          </div>
          <div className="p-6">
            <h3 className="text-h4 font-semibold text-off-black mb-2">Design System</h3>
            <p className="text-warm-gray mb-4">Comprehensive component library with Storybook documentation and automated testing.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-small rounded">React</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-small rounded">Storybook</span>
            </div>
            <button className="w-full bg-blue-600 text-off-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              View Project
            </button>
          </div>
        </div>
      </ResponsiveCardGrid>
    </div>
  ),
};