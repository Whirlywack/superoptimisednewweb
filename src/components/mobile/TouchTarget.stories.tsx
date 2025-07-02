import type { Meta, StoryObj } from '@storybook/react';
import { Heart, Share, Settings, ChevronRight, Menu, Search } from 'lucide-react';
import { TouchTarget, TouchTargetWrapper, TouchList, TouchArea } from './TouchTarget';

const meta = {
  title: 'Mobile/TouchTarget',
  component: TouchTarget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ensures minimum 44px touch targets for mobile accessibility. Provides consistent touch-optimized interactions across the app.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the touch target (sm: 44px, md: 48px, lg: 56px)',
    },
    variant: {
      control: 'select',
      options: ['button', 'link', 'icon', 'custom'],
      description: 'Visual style variant',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the target is interactive',
    },
    children: {
      control: false,
      description: 'Content to display within the touch target',
    },
  },
} satisfies Meta<typeof TouchTarget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-off-white">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Button Touch Targets</h3>
      
      <div className="space-y-3">
        <TouchTarget variant="button" size="sm">
          Small Button
        </TouchTarget>
        
        <TouchTarget variant="button" size="md">
          Medium Button
        </TouchTarget>
        
        <TouchTarget variant="button" size="lg">
          Large Button
        </TouchTarget>
      </div>
    </div>
  ),
};

export const IconTargets: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-off-white">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Icon Touch Targets</h3>
      
      <div className="flex gap-3">
        <TouchTarget variant="icon" size="sm">
          <Heart className="h-4 w-4" />
        </TouchTarget>
        
        <TouchTarget variant="icon" size="md">
          <Share className="h-5 w-5" />
        </TouchTarget>
        
        <TouchTarget variant="icon" size="lg">
          <Settings className="h-6 w-6" />
        </TouchTarget>
      </div>
      
      <p className="text-small text-warm-gray mt-4">
        All icons have minimum 44px touch areas for accessibility
      </p>
    </div>
  ),
};

export const LinkTargets: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-off-white">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Link Touch Targets</h3>
      
      <div className="space-y-2">
        <TouchTarget variant="link" size="md">
          Navigation Link
        </TouchTarget>
        
        <TouchTarget variant="link" size="md">
          <span className="flex items-center gap-2">
            External Link
            <ChevronRight className="h-4 w-4" />
          </span>
        </TouchTarget>
      </div>
    </div>
  ),
};

export const TouchList_Story: Story = {
  name: 'Touch Lists',
  render: () => (
    <div className="space-y-6 p-4 bg-off-white max-w-md">
      <div>
        <h3 className="text-h4 font-semibold text-off-black mb-4">Vertical Touch List</h3>
        <TouchList direction="vertical" spacing="sm">
          <TouchTarget variant="custom" className="w-full justify-start p-3 hover:bg-light-gray rounded-lg">
            <span className="flex items-center gap-3">
              <Menu className="h-5 w-5 text-warm-gray" />
              Menu Item 1
            </span>
          </TouchTarget>
          
          <TouchTarget variant="custom" className="w-full justify-start p-3 hover:bg-light-gray rounded-lg">
            <span className="flex items-center gap-3">
              <Search className="h-5 w-5 text-warm-gray" />
              Menu Item 2
            </span>
          </TouchTarget>
          
          <TouchTarget variant="custom" className="w-full justify-start p-3 hover:bg-light-gray rounded-lg">
            <span className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-warm-gray" />
              Menu Item 3
            </span>
          </TouchTarget>
        </TouchList>
      </div>
      
      <div>
        <h3 className="text-h4 font-semibold text-off-black mb-4">Horizontal Touch List</h3>
        <TouchList direction="horizontal" spacing="md">
          <TouchTarget variant="icon" size="md">
            <Heart className="h-5 w-5" />
          </TouchTarget>
          <TouchTarget variant="icon" size="md">
            <Share className="h-5 w-5" />
          </TouchTarget>
          <TouchTarget variant="icon" size="md">
            <Settings className="h-5 w-5" />
          </TouchTarget>
        </TouchList>
      </div>
    </div>
  ),
};

export const TouchAreas: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-off-white max-w-md">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Touch Areas</h3>
      
      <div className="space-y-2">
        <TouchArea interactive className="p-3 border border-light-gray rounded-lg">
          <div className="flex items-center justify-between w-full">
            <div>
              <h4 className="font-medium text-off-black">Touch Area Item</h4>
              <p className="text-small text-warm-gray">With description text</p>
            </div>
            <ChevronRight className="h-5 w-5 text-warm-gray" />
          </div>
        </TouchArea>
        
        <TouchArea interactive className="p-3 border border-light-gray rounded-lg">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-off-black">Another Touch Area</h4>
              <p className="text-small text-warm-gray">With icon and content</p>
            </div>
          </div>
        </TouchArea>
      </div>
    </div>
  ),
};

export const CustomTouchTarget: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-off-white">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Custom Touch Targets</h3>
      
      <div className="flex gap-3">
        <TouchTarget 
          variant="custom" 
          size="lg"
          className="bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200 rounded-xl font-medium"
        >
          Success
        </TouchTarget>
        
        <TouchTarget 
          variant="custom" 
          size="lg"
          className="bg-red-100 text-red-700 border-2 border-red-200 hover:bg-red-200 rounded-xl font-medium"
        >
          Danger
        </TouchTarget>
        
        <TouchTarget 
          variant="custom" 
          size="lg"
          className="bg-yellow-100 text-yellow-700 border-2 border-yellow-200 hover:bg-yellow-200 rounded-xl font-medium"
        >
          Warning
        </TouchTarget>
      </div>
    </div>
  ),
};

export const TouchTargetWrapper_Story: Story = {
  name: 'Touch Target Wrapper',
  render: () => (
    <div className="space-y-4 p-4 bg-off-white">
      <h3 className="text-h4 font-semibold text-off-black mb-4">Touch Target Wrappers</h3>
      
      <div className="space-y-3">
        <div>
          <p className="text-small text-warm-gray mb-2">Small padding wrapper</p>
          <TouchTargetWrapper padding="sm" className="bg-light-gray rounded-lg">
            <TouchTarget variant="icon" size="sm">
              <Heart className="h-4 w-4" />
            </TouchTarget>
          </TouchTargetWrapper>
        </div>
        
        <div>
          <p className="text-small text-warm-gray mb-2">Medium padding wrapper (default)</p>
          <TouchTargetWrapper padding="md" className="bg-light-gray rounded-lg">
            <TouchTarget variant="icon" size="md">
              <Share className="h-5 w-5" />
            </TouchTarget>
          </TouchTargetWrapper>
        </div>
        
        <div>
          <p className="text-small text-warm-gray mb-2">Large padding wrapper</p>
          <TouchTargetWrapper padding="lg" className="bg-light-gray rounded-lg">
            <TouchTarget variant="icon" size="lg">
              <Settings className="h-6 w-6" />
            </TouchTarget>
          </TouchTargetWrapper>
        </div>
      </div>
    </div>
  ),
};