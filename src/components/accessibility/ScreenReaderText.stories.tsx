import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Heart, Share, Download, Star, ChevronRight, Info } from 'lucide-react';
import { 
  ScreenReaderText, 
  VisuallyHidden, 
  SROnly, 
  AccessibleLabel, 
  IconWithText, 
  ButtonWithSRText,
  StatusAnnouncement 
} from './ScreenReaderText';

const meta = {
  title: 'Accessibility/ScreenReaderText',
  component: ScreenReaderText,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Components for providing screen reader-only content and accessible text alternatives. Hidden from visual users but announced by assistive technologies.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be read by screen readers only',
    },
    asChild: {
      control: 'boolean',
      description: 'Apply sr-only class to child elements instead of wrapper',
    },
  },
} satisfies Meta<typeof ScreenReaderText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicScreenReaderText: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Testing Screen Reader Text</h2>
          <p className="text-warm-gray mb-3">
            The content below includes hidden text for screen readers. To test:
          </p>
          <ul className="list-disc list-inside text-warm-gray space-y-1">
            <li>Use a screen reader (VoiceOver, NVDA, JAWS)</li>
            <li>Or use browser dev tools to inspect the HTML</li>
            <li>Look for elements with <code className="bg-light-gray px-1 rounded">sr-only</code> class</li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Basic Example</h3>
            <p className="text-warm-gray mb-4">
              This button appears to show just an icon, but screen readers will announce additional context:
            </p>
            
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Heart className="h-5 w-5" />
              <ScreenReaderText>Add to favorites</ScreenReaderText>
              Like
            </button>
            
            <p className="mt-4 text-small text-warm-gray">
              Screen readers will announce: "Add to favorites Like button"
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Icon-Only Buttons</h3>
            <p className="text-warm-gray mb-4">
              Icon buttons need accessible labels for screen reader users:
            </p>
            
            <div className="flex gap-3">
              <button className="p-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Share className="h-5 w-5" />
                <ScreenReaderText>Share this content</ScreenReaderText>
              </button>
              
              <button className="p-2 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                <Download className="h-5 w-5" />
                <ScreenReaderText>Download file</ScreenReaderText>
              </button>
              
              <button className="p-2 bg-yellow-600 text-off-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
                <Star className="h-5 w-5" />
                <ScreenReaderText>Add to bookmarks</ScreenReaderText>
              </button>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Navigation with Context</h3>
            <p className="text-warm-gray mb-4">
              Screen reader text can provide additional navigation context:
            </p>
            
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center justify-between p-3 hover:bg-light-gray rounded-lg transition-colors">
                    <span>Home</span>
                    <ChevronRight className="h-4 w-4 text-warm-gray" />
                    <ScreenReaderText>Navigate to home page</ScreenReaderText>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between p-3 hover:bg-light-gray rounded-lg transition-colors">
                    <span>Products</span>
                    <ChevronRight className="h-4 w-4 text-warm-gray" />
                    <ScreenReaderText>Navigate to products page</ScreenReaderText>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between p-3 hover:bg-light-gray rounded-lg transition-colors">
                    <span>Contact</span>
                    <ChevronRight className="h-4 w-4 text-warm-gray" />
                    <ScreenReaderText>Navigate to contact page</ScreenReaderText>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const VisuallyHiddenExample: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Visually Hidden Content</h2>
          <p className="text-warm-gray">
            Alternative to sr-only that uses absolute positioning instead of clip-path.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-light-gray">
          <h3 className="text-h4 font-semibold text-off-black mb-4">Data Table with Hidden Headers</h3>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-light-gray">
                <th className="text-left p-3">
                  Product
                  <VisuallyHidden>Name and description</VisuallyHidden>
                </th>
                <th className="text-left p-3">
                  Price
                  <VisuallyHidden>In US dollars</VisuallyHidden>
                </th>
                <th className="text-left p-3">
                  Stock
                  <VisuallyHidden>Availability status</VisuallyHidden>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-light-gray">
                <td className="p-3">Wireless Headphones</td>
                <td className="p-3">$99.99</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    In Stock
                    <VisuallyHidden>Available for immediate shipping</VisuallyHidden>
                  </span>
                </td>
              </tr>
              <tr className="border-b border-light-gray">
                <td className="p-3">Bluetooth Speaker</td>
                <td className="p-3">$149.99</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Out of Stock
                    <VisuallyHidden>Currently unavailable, expected restock in 2 weeks</VisuallyHidden>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
};

export const AccessibleForms: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Accessible Form Labels</h2>
          <p className="text-warm-gray">
            Proper labeling and descriptions for form fields.
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-light-gray space-y-6">
          <AccessibleLabel
            label="Email Address"
            description="We'll use this to send you important updates"
            required
          >
            <input
              type="email"
              className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="your@email.com"
            />
          </AccessibleLabel>

          <AccessibleLabel
            label="Password"
            description="Must be at least 8 characters long"
            required
          >
            <input
              type="password"
              className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </AccessibleLabel>

          <AccessibleLabel
            label="Phone Number"
            description="Optional - for account recovery only"
          >
            <input
              type="tel"
              className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="(555) 123-4567"
            />
          </AccessibleLabel>

          <button className="w-full bg-primary text-off-white py-3 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium">
            Create Account
          </button>
        </div>
      </div>
    </div>
  ),
};

export const IconsWithText: Story = {
  render: () => (
    <div className="p-8 bg-off-white min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <h2 className="text-h3 font-semibold text-off-black mb-2">Icons with Accessible Text</h2>
          <p className="text-warm-gray">
            Providing context for decorative icons and status indicators.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Status Indicators</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconWithText
                  icon={<div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                  iconDescription="Success status:"
                >
                  Payment processed successfully
                </IconWithText>
              </div>
              
              <div className="flex items-center gap-3">
                <IconWithText
                  icon={<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>}
                  iconDescription="Warning status:"
                >
                  Account verification pending
                </IconWithText>
              </div>
              
              <div className="flex items-center gap-3">
                <IconWithText
                  icon={<div className="w-3 h-3 bg-red-500 rounded-full"></div>}
                  iconDescription="Error status:"
                >
                  Connection failed - please retry
                </IconWithText>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Action Buttons</h3>
            <div className="flex gap-3">
              <ButtonWithSRText srText="Save current changes">
                <Download className="h-4 w-4" />
                Save
              </ButtonWithSRText>
              
              <ButtonWithSRText 
                srText="Share this content on social media"
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
              >
                <Share className="h-4 w-4" />
                Share
              </ButtonWithSRText>
              
              <ButtonWithSRText 
                srText="Add this item to your favorites list"
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                <Heart className="h-4 w-4" />
                Favorite
              </ButtonWithSRText>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const LiveRegionExample: Story = {
  render: () => {
    const [status, setStatus] = useState('');
    const [count, setCount] = useState(0);

    const handleAction = (action: string) => {
      setCount(prev => prev + 1);
      setStatus(`${action} completed. Total actions: ${count + 1}`);
      
      // Clear status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    };

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Live Status Announcements</h2>
            <p className="text-warm-gray">
              Status updates that are announced to screen readers automatically.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">Interactive Actions</h3>
            <p className="text-warm-gray mb-4">
              Click the buttons below to trigger status announcements that screen readers will detect:
            </p>
            
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => handleAction('File upload')}
                className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Upload File
              </button>
              
              <button
                onClick={() => handleAction('Data save')}
                className="px-4 py-2 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Save Data
              </button>
              
              <button
                onClick={() => handleAction('Email send')}
                className="px-4 py-2 bg-blue-600 text-off-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Send Email
              </button>
            </div>

            {status && (
              <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-green-700" />
                  <span className="text-green-800">{status}</span>
                </div>
              </div>
            )}

            <StatusAnnouncement message={status} type="polite" />
          </div>

          <div className="p-6 bg-white rounded-lg border border-light-gray">
            <h3 className="text-h4 font-semibold text-off-black mb-4">How It Works</h3>
            <div className="space-y-3 text-warm-gray">
              <p>
                <strong>Live regions</strong> use <code className="bg-light-gray px-1 rounded">aria-live</code> to 
                announce dynamic content changes to screen readers.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><code className="bg-light-gray px-1 rounded">aria-live="polite"</code> - Announces when user is idle</li>
                <li><code className="bg-light-gray px-1 rounded">aria-live="assertive"</code> - Announces immediately</li>
                <li><code className="bg-light-gray px-1 rounded">aria-atomic="true"</code> - Reads entire content on change</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
};