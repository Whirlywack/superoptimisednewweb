import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Settings, Menu, ChevronDown, X } from 'lucide-react';
import { FocusTrap, FocusTrapModal, FocusTrapDropdown, FocusTrapPanel } from './FocusTrap';

const meta = {
  title: 'Accessibility/FocusTrap',
  component: FocusTrap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Focus management components that trap keyboard navigation within a specific area. Essential for modals, dropdowns, and other overlay components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Whether the focus trap is active',
    },
    restoreFocus: {
      control: 'boolean',
      description: 'Whether to restore focus to the previously focused element when deactivated',
    },
    children: {
      control: false,
      description: 'Content to trap focus within',
    },
    onEscape: {
      action: 'escape',
      description: 'Callback when Escape key is pressed',
    },
  },
} satisfies Meta<typeof FocusTrap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicFocusTrap: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(false);

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Basic Focus Trap</h2>
            <p className="text-warm-gray mb-3">
              When activated, keyboard navigation (Tab/Shift+Tab) is trapped within the blue bordered area.
            </p>
            <p className="text-warm-gray">
              Press <kbd className="px-2 py-1 bg-light-gray rounded text-small">Escape</kbd> to deactivate.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {isActive ? 'Deactivate' : 'Activate'} Focus Trap
            </button>

            <p className="text-warm-gray">
              Try tabbing through the form below when the focus trap is {isActive ? 'active' : 'inactive'}:
            </p>

            <FocusTrap
              active={isActive}
              onEscape={() => setIsActive(false)}
              className={`p-6 rounded-lg border-2 transition-colors ${
                isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-light-gray bg-white'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Submit
                  </button>
                  <button className="px-4 py-2 border border-warm-gray text-warm-gray rounded-lg hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Cancel
                  </button>
                </div>
              </div>
            </FocusTrap>

            <div className="p-4 bg-light-gray rounded-lg">
              <p className="text-small text-warm-gray">
                <strong>Outside the trap:</strong> This button is not accessible via Tab when focus trap is active.
              </p>
              <button className="mt-2 px-4 py-2 bg-warm-gray text-off-white rounded-lg hover:bg-off-black focus:outline-none focus:ring-2 focus:ring-warm-gray focus:ring-offset-2">
                External Button
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const ModalExample: Story = {
  render: () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Modal with Focus Trap</h2>
            <p className="text-warm-gray">
              Modal dialogs automatically trap focus and restore it when closed.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium"
            >
              Open Modal
            </button>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Background input 1"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                placeholder="Background input 2"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <p className="text-small text-warm-gray">
              When the modal is open, these background inputs won't be accessible via keyboard navigation.
            </p>
          </div>

          <FocusTrapModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Action"
            description="Are you sure you want to proceed with this action?"
          >
            <div className="space-y-4">
              <p className="text-warm-gray">
                This modal traps focus within its boundaries. Try pressing Tab to navigate 
                between the form elements and buttons.
              </p>
              
              <div>
                <label className="block text-small font-medium text-off-black mb-1">
                  Reason (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Enter your reason..."
                />
              </div>
            </div>
          </FocusTrapModal>
        </div>
      </div>
    );
  },
};

export const DropdownExample: Story = {
  render: () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Dropdown with Focus Trap</h2>
            <p className="text-warm-gray">
              Dropdown menus trap focus within their options for keyboard navigation.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <FocusTrapDropdown
                trigger={
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Settings className="h-4 w-4" />
                    Settings
                    <ChevronDown className="h-4 w-4" />
                  </button>
                }
                isOpen={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <div className="py-1">
                  <button
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-small text-off-black hover:bg-light-gray focus:bg-light-gray focus:outline-none"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Account Settings
                  </button>
                  <button
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-small text-off-black hover:bg-light-gray focus:bg-light-gray focus:outline-none"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Privacy Settings
                  </button>
                  <button
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-small text-off-black hover:bg-light-gray focus:bg-light-gray focus:outline-none"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Notification Settings
                  </button>
                  <div className="border-t border-light-gray my-1"></div>
                  <button
                    role="menuitem"
                    className="w-full text-left px-4 py-2 text-small text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign Out
                  </button>
                </div>
              </FocusTrapDropdown>

              <input
                type="text"
                placeholder="Background input"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <p className="text-small text-warm-gray">
              When the dropdown is open, Tab navigation is trapped within the menu options.
              Press Escape to close the dropdown.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const SlidePanelExample: Story = {
  render: () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');

    return (
      <div className="p-8 bg-off-white min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h2 className="text-h3 font-semibold text-off-black mb-2">Slide Panel with Focus Trap</h2>
            <p className="text-warm-gray">
              Side panels slide in from left or right and trap focus within their content.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPanelSide('left');
                  setIsPanelOpen(true);
                }}
                className="px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Open Left Panel
              </button>
              
              <button
                onClick={() => {
                  setPanelSide('right');
                  setIsPanelOpen(true);
                }}
                className="px-4 py-2 bg-green-600 text-off-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Open Right Panel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Background form field 1"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                placeholder="Background form field 2"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                placeholder="Background form field 3"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="text"
                placeholder="Background form field 4"
                className="px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <p className="text-small text-warm-gray">
              When a panel is open, these background form fields won't be accessible via keyboard.
            </p>
          </div>

          <FocusTrapPanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            side={panelSide}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-light-gray">
                <h3 className="text-h4 font-semibold text-off-black">
                  {panelSide === 'left' ? 'Left' : 'Right'} Panel
                </h3>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-4">
                <p className="text-warm-gray">
                  This panel slides in from the {panelSide} and traps focus within its content.
                  Try pressing Tab to navigate through the form elements.
                </p>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={4}
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-small font-medium text-off-black mb-1">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>Choose category</option>
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Business</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-light-gray flex gap-3">
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="flex-1 px-4 py-2 border border-warm-gray text-warm-gray rounded-lg hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="flex-1 px-4 py-2 bg-primary text-off-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </FocusTrapPanel>
        </div>
      </div>
    );
  },
};