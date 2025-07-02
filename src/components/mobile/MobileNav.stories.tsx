import type { Meta, StoryObj } from '@storybook/react';
import { MobileNav, MobileNavItem, MobileNavGroup } from './MobileNav';

const meta = {
  title: 'Mobile/MobileNav',
  component: MobileNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A mobile-first navigation component with hamburger menu and slide-out drawer. Automatically hidden on desktop screens.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Navigation content to display in the drawer',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the trigger button',
    },
    triggerClassName: {
      control: 'text',
      description: 'Additional CSS classes for the hamburger button',
    },
    overlayClassName: {
      control: 'text',
      description: 'Additional CSS classes for the overlay container',
    },
    drawerClassName: {
      control: 'text',
      description: 'Additional CSS classes for the drawer panel',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the navigation menu',
    },
  },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleNavItems = () => (
  <>
    <MobileNavGroup title="Main">
      <MobileNavItem href="/" active>
        Home
      </MobileNavItem>
      <MobileNavItem href="/journey">
        Journey
      </MobileNavItem>
      <MobileNavItem href="/projects">
        Projects
      </MobileNavItem>
      <MobileNavItem href="/about">
        About
      </MobileNavItem>
    </MobileNavGroup>
    
    <MobileNavGroup title="Community">
      <MobileNavItem href="/feedback">
        Feedback
      </MobileNavItem>
      <MobileNavItem href="/newsletter">
        Newsletter
      </MobileNavItem>
      <MobileNavItem href="/contact">
        Contact
      </MobileNavItem>
    </MobileNavGroup>
  </>
);

export const Default: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-off-black">Superoptimised</h1>
        <MobileNav>
          <SampleNavItems />
        </MobileNav>
      </div>
      <p className="mt-4 text-warm-gray">
        Try tapping the hamburger menu button to open the navigation drawer.
      </p>
    </div>
  ),
};

export const SimpleNavigation: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <div className="flex items-center justify-between">
        <span className="text-h3 font-semibold">Simple Nav</span>
        <MobileNav>
          <MobileNavItem href="/" active>Home</MobileNavItem>
          <MobileNavItem href="/about">About</MobileNavItem>
          <MobileNavItem href="/projects">Projects</MobileNavItem>
          <MobileNavItem href="/contact">Contact</MobileNavItem>
        </MobileNav>
      </div>
    </div>
  ),
};

export const WithCustomStyling: Story = {
  render: () => (
    <div className="p-4 bg-primary min-h-screen">
      <div className="flex items-center justify-between">
        <span className="text-h3 font-semibold text-off-white">Custom Style</span>
        <MobileNav 
          triggerClassName="text-off-white hover:bg-off-white/10"
          drawerClassName="bg-primary text-off-white"
        >
          <div className="space-y-2">
            <MobileNavItem 
              href="/" 
              active 
              className="text-off-white hover:bg-off-white/10 focus:ring-off-white"
            >
              Home
            </MobileNavItem>
            <MobileNavItem 
              href="/features" 
              className="text-off-white/80 hover:bg-off-white/10 hover:text-off-white focus:ring-off-white"
            >
              Features
            </MobileNavItem>
            <MobileNavItem 
              href="/pricing" 
              className="text-off-white/80 hover:bg-off-white/10 hover:text-off-white focus:ring-off-white"
            >
              Pricing
            </MobileNavItem>
          </div>
        </MobileNav>
      </div>
    </div>
  ),
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div className="p-4 bg-off-white min-h-screen">
      <div className="flex items-center justify-between">
        <span className="text-h3 font-semibold">A11y Demo</span>
        <MobileNav aria-label="Main navigation menu">
          <div role="navigation" aria-label="Site navigation">
            <MobileNavGroup title="Pages">
              <MobileNavItem href="/" active>
                <span className="flex items-center gap-2">
                  🏠 Home
                </span>
              </MobileNavItem>
              <MobileNavItem href="/blog">
                <span className="flex items-center gap-2">
                  📝 Blog
                </span>
              </MobileNavItem>
              <MobileNavItem href="/docs">
                <span className="flex items-center gap-2">
                  📚 Documentation
                </span>
              </MobileNavItem>
            </MobileNavGroup>
          </div>
        </MobileNav>
      </div>
      <div className="mt-4 p-4 bg-light-gray rounded-lg">
        <h2 className="text-h4 font-semibold mb-2">Accessibility Features:</h2>
        <ul className="text-small text-warm-gray space-y-1">
          <li>• Keyboard navigation support (Tab, Escape)</li>
          <li>• Screen reader announcements</li>
          <li>• Focus management and trapping</li>
          <li>• ARIA labels and roles</li>
          <li>• 44px minimum touch targets</li>
        </ul>
      </div>
    </div>
  ),
};