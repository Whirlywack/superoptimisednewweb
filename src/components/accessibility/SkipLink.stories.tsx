import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink, SkipNav, SkipToContent, FocusTarget } from './SkipLink';

const meta = {
  title: 'Accessibility/SkipLink',
  component: SkipLink,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Skip links provide keyboard navigation shortcuts for screen reader users and keyboard-only navigation. They are hidden by default and become visible when focused.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'Target anchor or element ID to skip to',
    },
    children: {
      control: 'text',
      description: 'Text content of the skip link',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicSkipLink: Story = {
  render: () => (
    <div className="min-h-screen bg-off-white">
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      <div className="p-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <h2 className="text-h3 font-semibold text-off-black mb-2">How to test:</h2>
          <ol className="list-decimal list-inside text-warm-gray space-y-1">
            <li>Press <kbd className="px-2 py-1 bg-light-gray rounded text-small">Tab</kbd> to focus the skip link</li>
            <li>The skip link will appear at the top-left of the screen</li>
            <li>Press <kbd className="px-2 py-1 bg-light-gray rounded text-small">Enter</kbd> to activate it</li>
            <li>Focus will move to the main content area</li>
          </ol>
        </div>

        <nav className="mb-8 p-4 bg-light-gray rounded-lg" id="navigation">
          <h3 className="text-h4 font-semibold mb-4">Navigation</h3>
          <ul className="flex gap-4">
            <li><a href="#" className="text-primary hover:underline">Home</a></li>
            <li><a href="#" className="text-primary hover:underline">About</a></li>
            <li><a href="#" className="text-primary hover:underline">Services</a></li>
            <li><a href="#" className="text-primary hover:underline">Contact</a></li>
          </ul>
        </nav>

        <FocusTarget id="main-content" label="Main content area" className="p-6 bg-white rounded-lg border border-light-gray">
          <h1 className="text-h2 font-bold text-off-black mb-4">Main Content</h1>
          <p className="text-warm-gray mb-4">
            This is the main content area. When users activate the skip link, 
            their focus will jump directly here, bypassing the navigation.
          </p>
          <p className="text-warm-gray">
            This is especially helpful for screen reader users and those navigating 
            with a keyboard, as they don't need to tab through all navigation items.
          </p>
        </FocusTarget>
      </div>
    </div>
  ),
};

export const SkipNavigation: Story = {
  render: () => (
    <div className="min-h-screen bg-off-white">
      <SkipNav 
        links={[
          { href: '#main-content', label: 'Skip to main content' },
          { href: '#sidebar', label: 'Skip to sidebar' },
          { href: '#footer', label: 'Skip to footer' },
        ]}
      />
      
      <div className="p-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Multiple Skip Links</h2>
          <p className="text-warm-gray">
            This example shows multiple skip links that appear when you tab to them. 
            Each link jumps to a different section of the page.
          </p>
        </div>

        <header className="mb-8 p-4 bg-light-gray rounded-lg">
          <h1 className="text-h2 font-bold text-off-black mb-4">Website Header</h1>
          <nav>
            <ul className="flex gap-4">
              <li><a href="#" className="text-primary hover:underline">Home</a></li>
              <li><a href="#" className="text-primary hover:underline">Products</a></li>
              <li><a href="#" className="text-primary hover:underline">Services</a></li>
              <li><a href="#" className="text-primary hover:underline">About</a></li>
              <li><a href="#" className="text-primary hover:underline">Contact</a></li>
            </ul>
          </nav>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <FocusTarget 
            id="main-content" 
            label="Main content" 
            className="lg:col-span-2 p-6 bg-white rounded-lg border border-light-gray"
          >
            <h2 className="text-h3 font-semibold text-off-black mb-4">Main Content</h2>
            <p className="text-warm-gray mb-4">
              This is the main content area. Users can skip directly here from the navigation.
            </p>
            <p className="text-warm-gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </FocusTarget>

          <FocusTarget 
            id="sidebar" 
            label="Sidebar content"
            className="p-6 bg-white rounded-lg border border-light-gray"
          >
            <h2 className="text-h4 font-semibold text-off-black mb-4">Sidebar</h2>
            <ul className="space-y-2 text-warm-gray">
              <li>Related Link 1</li>
              <li>Related Link 2</li>
              <li>Related Link 3</li>
            </ul>
          </FocusTarget>
        </div>

        <FocusTarget 
          id="footer" 
          label="Footer content"
          className="mt-8 p-6 bg-light-gray rounded-lg"
        >
          <h2 className="text-h4 font-semibold text-off-black mb-4">Footer</h2>
          <p className="text-warm-gray">
            Footer content and links would go here. Users can skip directly to this section.
          </p>
        </FocusTarget>
      </div>
    </div>
  ),
};

export const SkipToContentExample: Story = {
  render: () => (
    <div className="min-h-screen bg-off-white">
      <SkipToContent targetId="article-content" />
      
      <div className="p-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Article Layout</h2>
          <p className="text-warm-gray">
            This demonstrates a typical article layout with a skip link to the main article content.
          </p>
        </div>

        <header className="mb-6">
          <nav className="flex gap-4 mb-4">
            <a href="#" className="text-primary hover:underline">Home</a>
            <a href="#" className="text-primary hover:underline">Articles</a>
            <a href="#" className="text-primary hover:underline">Categories</a>
            <a href="#" className="text-primary hover:underline">Search</a>
          </nav>
          <div className="h-px bg-light-gray"></div>
        </header>

        <div className="mb-6">
          <h1 className="text-h2 font-bold text-off-black mb-2">
            Understanding Web Accessibility
          </h1>
          <div className="flex items-center gap-4 text-small text-warm-gray">
            <span>By Jane Doe</span>
            <span>•</span>
            <span>March 15, 2024</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </div>

        <FocusTarget 
          id="article-content"
          label="Article content"
          className="prose max-w-none"
        >
          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <p className="text-warm-gray mb-4">
              Web accessibility is crucial for creating inclusive digital experiences. 
              When users activate the skip link, they'll jump directly to this article content, 
              bypassing the navigation and metadata above.
            </p>
            
            <h2 className="text-h3 font-semibold text-off-black mb-3 mt-6">
              Why Skip Links Matter
            </h2>
            <p className="text-warm-gray mb-4">
              Skip links are especially important for users who navigate with keyboards or screen readers. 
              They provide a way to bypass repetitive navigation and jump straight to the main content.
            </p>
            
            <h2 className="text-h3 font-semibold text-off-black mb-3 mt-6">
              Implementation Best Practices
            </h2>
            <ul className="list-disc list-inside text-warm-gray space-y-2">
              <li>Place skip links at the very beginning of the page</li>
              <li>Make them visible when focused</li>
              <li>Use descriptive text like "Skip to main content"</li>
              <li>Ensure they work with keyboard navigation</li>
            </ul>
          </div>
        </FocusTarget>
      </div>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SkipLink 
        href="#custom-content"
        className="focus:bg-indigo-600 focus:ring-indigo-200 focus:ring-offset-indigo-600"
      >
        Skip to content (Custom styling)
      </SkipLink>
      
      <div className="p-8">
        <div className="bg-white/80 backdrop-blur border border-indigo-200 rounded-lg p-4 mb-6">
          <h2 className="text-h3 font-semibold text-indigo-900 mb-2">Custom Styled Skip Link</h2>
          <p className="text-indigo-700">
            This skip link uses custom colors that match the page theme. 
            Tab to see the custom indigo styling.
          </p>
        </div>

        <FocusTarget 
          id="custom-content"
          label="Custom styled content"
          className="p-8 bg-white/90 backdrop-blur rounded-xl border border-indigo-200 shadow-lg"
        >
          <h1 className="text-h2 font-bold text-indigo-900 mb-4">
            Custom Themed Content
          </h1>
          <p className="text-indigo-700 mb-4">
            This example shows how skip links can be styled to match your site's design 
            while maintaining accessibility standards.
          </p>
          <p className="text-indigo-700">
            The skip link uses the same color scheme as the rest of the page, 
            ensuring it feels integrated with your design system.
          </p>
        </FocusTarget>
      </div>
    </div>
  ),
};